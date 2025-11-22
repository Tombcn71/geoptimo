import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { runPromptOnChatGPT } from '@/lib/ai/openai'
import { runPromptOnGemini, analyzeBrandMention, detectAllBrands } from '@/lib/ai/gemini'

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    
    // Get prompt with brand info
    const promptResult = await query(
      `SELECT p.*, b.id as brand_id, b."companyName" as brand_name 
       FROM "Prompt" p
       JOIN "Brand" b ON p."brandId" = b.id
       WHERE p.id = $1`,
      [params.id]
    )

    if (promptResult.rows.length === 0) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 })
    }

    const prompt = promptResult.rows[0]
    const results = []

    // Run on each subscribed provider
    for (const provider of prompt.providers) {
      let result = null

      if (provider === 'ChatGPT') {
        result = await runPromptOnChatGPT(prompt.text)
      } else if (provider === 'Gemini') {
        result = await runPromptOnGemini(prompt.text)
      } else if (provider === 'Claude') {
        result = await runPromptOnGemini(prompt.text) // Use Gemini for Claude too
      }
      // Add Perplexity when API available

      if (result && result.response) {
        // Analyze if brand is mentioned
        const analysis = await analyzeBrandMention(
          result.response,
          prompt.brand_name
        )

        // Ensure PromptResult sequence exists (on first provider)
        if (provider === prompt.providers[0]) {
          await query(`
            CREATE SEQUENCE IF NOT EXISTS "PromptResult_id_seq"
          `)
        }

        // Save result to database
        const insertResult = await query(
          `INSERT INTO "PromptResult" (id, "promptId", provider, mentioned, position, sentiment, response, citations, "runAt")
           VALUES (nextval('"PromptResult_id_seq"'), $1, $2, $3, $4, $5, $6, $7, NOW())
           RETURNING *`,
          [
            prompt.id,
            provider,
            analysis.mentioned,
            analysis.position,
            analysis.sentiment || 'neutral',
            result.response,
            [] // Extract citations if available
          ]
        )

        const promptResultRow = insertResult.rows[0]

        results.push({
          provider,
          ...analysis,
          resultId: promptResultRow.id
        })

        // 🔍 AUTO-DETECT & STORE COMPETITORS
        console.log(`\n========================================`)
        console.log(`🔍 COMPETITOR DETECTION START`)
        console.log(`   Provider: ${provider}`)
        console.log(`   Brand ID: ${prompt.brand_id}`)
        console.log(`   Brand Name: ${prompt.brand_name}`)
        console.log(`   Response Length: ${result.response?.length || 0} chars`)
        console.log(`   Response Preview: ${result.response?.substring(0, 200)}...`)
        console.log(`========================================\n`)
        
        const brandAnalysis = await detectAllBrands(result.response, prompt.brand_name)
        
        console.log(`\n🔍 DETECTION RESULTS:`)
        console.log(`   Your Brand mentioned: ${brandAnalysis.yourBrand?.mentioned}`)
        console.log(`   Competitors found: ${brandAnalysis.competitors?.length || 0}`)
        
        if (brandAnalysis.competitors && brandAnalysis.competitors.length > 0) {
          console.log(`\n   📋 Competitor List:`)
          brandAnalysis.competitors.forEach((c, i) => {
            console.log(`      ${i+1}. ${c.name} (pos: ${c.position || 'N/A'}, sentiment: ${c.sentiment})`)
          })
          
          // Ensure Competitor sequence exists
          await query(`CREATE SEQUENCE IF NOT EXISTS "Competitor_id_seq"`)
          await query(`CREATE SEQUENCE IF NOT EXISTS "CompetitorMetric_id_seq"`)
          
          console.log(`\n   💾 STORING TO DATABASE...`)
          
          for (const comp of brandAnalysis.competitors) {
            try {
              // Check if competitor already exists BY NAME (case-insensitive)
              const existingComp = await query(`
                SELECT id FROM "Competitor" 
                WHERE "brandId" = $1 AND LOWER(name) = LOWER($2)
              `, [prompt.brand_id, comp.name])

              let competitorId

              if (existingComp.rows.length > 0) {
                // Competitor exists
                competitorId = existingComp.rows[0].id
                console.log(`      ↻ ${comp.name} - Already exists (ID: ${competitorId})`)
              } else {
                // New competitor - insert with unique domain derived from name
                // Use slugified name as domain to avoid constraint issues
                const uniqueDomain = comp.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                
                const newComp = await query(`
                  INSERT INTO "Competitor" 
                    (id, "brandId", name, domain, "createdAt", "updatedAt")
                  VALUES (nextval('"Competitor_id_seq"'), $1, $2, $3, NOW(), NOW())
                  RETURNING id
                `, [prompt.brand_id, comp.name, uniqueDomain])
                
                competitorId = newComp.rows[0].id
                console.log(`      ✨ ${comp.name} - NEW! Stored with ID: ${competitorId}, domain: ${uniqueDomain}`)
              }

              // Store metric for this run
              const metricResult = await query(`
                INSERT INTO "CompetitorMetric"
                  (id, "competitorId", "promptResultId", position, sentiment, "detectedAt")
                VALUES (nextval('"CompetitorMetric_id_seq"'), $1, $2, $3, $4, NOW())
                RETURNING id
              `, [competitorId, promptResultRow.id, comp.position, comp.sentiment])

              console.log(`      ✅ Metric saved (ID: ${metricResult.rows[0].id})`)

            } catch (compError) {
              console.error(`      ❌ ERROR storing ${comp.name}:`, compError)
            }
          }
          console.log(`\n   ✅ DATABASE STORAGE COMPLETE`)
        } else {
          console.log(`   ⚠️  NO COMPETITORS FOUND IN RESPONSE`)
        }
        
        console.log(`========================================\n`)
      }
    }

    // Update prompt last run time
    await query(
      `UPDATE "Prompt" SET "updatedAt" = NOW() WHERE id = $1`,
      [prompt.id]
    )

    return NextResponse.json({
      promptId: prompt.id,
      results,
      totalRuns: results.length
    })
  } catch (error) {
    console.error('Error running prompt:', error)
    return NextResponse.json(
      { error: 'Failed to run prompt' },
      { status: 500 }
    )
  }
}
