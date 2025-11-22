import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { runPromptOnChatGPT } from '@/lib/ai/openai'
import { runPromptOnGemini, detectAllBrands } from '@/lib/ai/gemini'

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    
    // Get prompt with brand info
    const promptResult = await query(
      `SELECT p.id, p.text, p.providers, p."brandId", b."companyName" as brand_name 
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

    console.log(`🚀 Running prompt manually: "${prompt.text.substring(0, 50)}..."`)

    // Run on each subscribed provider (currently only Gemini is supported)
    for (const provider of prompt.providers) {
      try {
        let aiResult = null

        // Only Gemini is implemented for now
        if (provider === 'Gemini') {
          aiResult = await runPromptOnGemini(prompt.text)
        } else {
          // Skip other providers until properly implemented
          console.log(`⏭️  Skipping ${provider} (not yet implemented)`)
          results.push({
            provider,
            error: 'Provider not yet implemented. Currently only Gemini is supported.'
          })
          continue
        }

        if (!aiResult || !aiResult.response) {
          console.log(`⚠️  No response from ${provider}`)
          results.push({
            provider,
            error: 'No response received from AI provider'
          })
          continue
        }

        // Detect YOUR brand + ALL competitors
        const brandAnalysis = await detectAllBrands(
          aiResult.response,
          prompt.brand_name
        )

        // Ensure sequences exist
        await query(`CREATE SEQUENCE IF NOT EXISTS "PromptResult_id_seq"`)
        await query(`CREATE SEQUENCE IF NOT EXISTS "Competitor_id_seq"`)
        await query(`CREATE SEQUENCE IF NOT EXISTS "CompetitorMetric_id_seq"`)

        // Save YOUR brand's result
        const insertResult = await query(
          `INSERT INTO "PromptResult" (id, "promptId", provider, mentioned, position, sentiment, response, citations, "runAt")
           VALUES (nextval('"PromptResult_id_seq"'), $1, $2, $3, $4, $5, $6, $7, NOW())
           RETURNING *`,
          [
            prompt.id,
            provider,
            brandAnalysis.yourBrand.mentioned,
            brandAnalysis.yourBrand.position,
            brandAnalysis.yourBrand.sentiment || 'neutral',
            aiResult.response.substring(0, 5000),
            []
          ]
        )

        console.log(`✅ ${provider}: Your brand mentioned=${brandAnalysis.yourBrand.mentioned}, position=${brandAnalysis.yourBrand.position}`)

        // AUTO-DETECT & STORE COMPETITORS
        let competitorsFound = 0
        if (brandAnalysis.competitors && brandAnalysis.competitors.length > 0) {
          console.log(`🔍 Found ${brandAnalysis.competitors.length} competitors`)
          
          for (const comp of brandAnalysis.competitors) {
            try {
              // Check if competitor exists
              const existingComp = await query(`
                SELECT id FROM "Competitor" 
                WHERE "brandId" = $1 AND LOWER(name) = LOWER($2)
              `, [prompt.brandId, comp.name])

              let competitorId

              if (existingComp.rows.length > 0) {
                competitorId = existingComp.rows[0].id
              } else {
                // New competitor - generate unique domain from name
                const uniqueDomain = comp.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                
                const newComp = await query(`
                  INSERT INTO "Competitor" 
                    (id, "brandId", name, domain, "createdAt", "updatedAt")
                  VALUES (nextval('"Competitor_id_seq"'), $1, $2, $3, NOW(), NOW())
                  RETURNING id
                `, [prompt.brandId, comp.name, uniqueDomain])
                
                competitorId = newComp.rows[0].id
                console.log(`   ✨ ${comp.name} (NEW competitor! domain: ${uniqueDomain})`)
              }

              // Store metrics (link to promptResultId instead of date-based aggregation)
              await query(`
                INSERT INTO "CompetitorMetric"
                  (id, "competitorId", "promptResultId", position, sentiment, "detectedAt")
                VALUES (nextval('"CompetitorMetric_id_seq"'), $1, $2, $3, $4, NOW())
              `, [
                competitorId,
                insertResult.rows[0].id,
                comp.position,
                comp.sentiment
              ])

              competitorsFound++
            } catch (compError) {
              console.error(`   ❌ Error storing competitor ${comp.name}:`, compError)
            }
          }
        }

        results.push({
          provider,
          mentioned: brandAnalysis.yourBrand.mentioned,
          position: brandAnalysis.yourBrand.position,
          sentiment: brandAnalysis.yourBrand.sentiment,
          competitorsFound,
          resultId: insertResult.rows[0].id
        })

        console.log(`✅ ${provider}: mentioned=${brandAnalysis.yourBrand.mentioned}, ${competitorsFound} competitors detected`)

      } catch (providerError) {
        console.error(`❌ Error with ${provider}:`, providerError)
        results.push({
          provider,
          error: (providerError as Error).message
        })
      }
    }

    // Update prompt last run time
    await query(
      `UPDATE "Prompt" SET "updatedAt" = NOW() WHERE id = $1`,
      [prompt.id]
    )

    return NextResponse.json({
      success: true,
      promptId: prompt.id,
      results,
      totalRuns: results.length,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error running prompt manually:', error)
    return NextResponse.json(
      { error: 'Failed to run prompt', details: (error as Error).message },
      { status: 500 }
    )
  }
}

