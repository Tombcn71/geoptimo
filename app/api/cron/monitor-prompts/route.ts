import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { runPromptOnChatGPT } from '@/lib/ai/openai'
import { runPromptOnGemini, detectAllBrands } from '@/lib/ai/gemini'

export const maxDuration = 300; // 5 minutes max execution
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🚀 Starting prompt monitoring cron job...')

    // Get all subscribed prompts with their brand info
    const promptsResult = await query(`
      SELECT p.id, p.text, p.providers, b."companyName" as brand_name, b.id as brand_id
      FROM "Prompt" p
      JOIN "Brand" b ON p."brandId" = b.id
      WHERE p."isSubscribed" = true
      ORDER BY p."updatedAt" ASC
      LIMIT 50
    `)

    const prompts = promptsResult.rows
    console.log(`📊 Found ${prompts.length} subscribed prompts to monitor`)

    let successCount = 0
    let errorCount = 0

    // Process each prompt
    for (const prompt of prompts) {
      try {
        console.log(`\n🔍 Running prompt: "${prompt.text.substring(0, 50)}..."`)
        
        // Run on each provider (currently only Gemini is supported)
        for (const provider of prompt.providers) {
          try {
            let aiResult = null

            // Only Gemini is implemented for now
            if (provider === 'Gemini') {
              aiResult = await runPromptOnGemini(prompt.text)
            } else {
              // Skip other providers until they're properly implemented
              console.log(`⏭️  Skipping ${provider} (not yet implemented)`)
              continue
            }

            if (!aiResult || !aiResult.response) {
              console.log(`⚠️  No response from ${provider}`)
              continue
            }

            // Detect YOUR brand + ALL competitors in response
            const brandAnalysis = await detectAllBrands(
              aiResult.response,
              prompt.brand_name
            )

            // Ensure sequences exist (only on first iteration)
            if (successCount === 0 && errorCount === 0 && provider === prompt.providers[0]) {
              await query(`CREATE SEQUENCE IF NOT EXISTS "PromptResult_id_seq"`)
              await query(`CREATE SEQUENCE IF NOT EXISTS "Competitor_id_seq"`)
              await query(`CREATE SEQUENCE IF NOT EXISTS "CompetitorMetric_id_seq"`)
            }

            // Save YOUR brand's result
            await query(`
              INSERT INTO "PromptResult" 
                (id, "promptId", provider, mentioned, position, sentiment, response, citations, "runAt")
              VALUES (nextval('"PromptResult_id_seq"'), $1, $2, $3, $4, $5, $6, $7, NOW())
            `, [
              prompt.id,
              provider,
              brandAnalysis.yourBrand.mentioned,
              brandAnalysis.yourBrand.position,
              brandAnalysis.yourBrand.sentiment || 'neutral',
              aiResult.response.substring(0, 5000),
              []
            ])

            console.log(`✅ ${provider}: Your brand mentioned=${brandAnalysis.yourBrand.mentioned}, position=${brandAnalysis.yourBrand.position}`)

            // AUTO-DETECT & STORE COMPETITORS
            if (brandAnalysis.competitors && brandAnalysis.competitors.length > 0) {
              console.log(`🔍 Found ${brandAnalysis.competitors.length} competitors`)
              
              for (const comp of brandAnalysis.competitors) {
                try {
                  // Check if competitor already exists
                  const existingComp = await query(`
                    SELECT id FROM "Competitor" 
                    WHERE "brandId" = $1 AND LOWER(name) = LOWER($2)
                  `, [prompt.brand_id, comp.name])

                  let competitorId

                  if (existingComp.rows.length > 0) {
                    // Competitor exists
                    competitorId = existingComp.rows[0].id
                    console.log(`   ↻ ${comp.name} (existing)`)
                  } else {
                    // New competitor - insert
                    const newComp = await query(`
                      INSERT INTO "Competitor" 
                        (id, "brandId", name, domain, "createdAt", "updatedAt")
                      VALUES (nextval('"Competitor_id_seq"'), $1, $2, $3, NOW(), NOW())
                      RETURNING id
                    `, [prompt.brand_id, comp.name, '']) // domain can be empty for now
                    
                    competitorId = newComp.rows[0].id
                    console.log(`   ✨ ${comp.name} (NEW competitor detected!)`)
                  }

                  // Store competitor metrics
                  await query(`
                    INSERT INTO "CompetitorMetric"
                      (id, "competitorId", date, "visibilityScore", sentiment, "topThreeVis", 
                       mentions, "avgPosition", "detectionRate", "domainCitations")
                    VALUES (nextval('"CompetitorMetric_id_seq"'), $1, NOW(), $2, $3, $4, 1, $5, 0, 0)
                    ON CONFLICT ("competitorId", date) 
                    DO UPDATE SET 
                      mentions = "CompetitorMetric".mentions + 1,
                      "avgPosition" = CASE 
                        WHEN $5 IS NOT NULL THEN ($5 + COALESCE("CompetitorMetric"."avgPosition", 0)) / 2.0
                        ELSE "CompetitorMetric"."avgPosition"
                      END,
                      sentiment = $3
                  `, [
                    competitorId,
                    comp.position ? (comp.position <= 3 ? 80 : 50) : 40, // Basic visibility score
                    comp.sentiment === 'positive' ? 80 : (comp.sentiment === 'negative' ? 30 : 50),
                    comp.position && comp.position <= 3 ? 100 : 0, // topThreeVis
                    comp.position
                  ])

                } catch (compError) {
                  console.error(`   ❌ Error storing competitor ${comp.name}:`, compError)
                }
              }
            }

            successCount++

          } catch (providerError) {
            console.error(`❌ Error running ${provider}:`, providerError)
            errorCount++
          }
        }

        // Update prompt's last run timestamp
        await query(`
          UPDATE "Prompt" SET "updatedAt" = NOW() WHERE id = $1
        `, [prompt.id])

        // Small delay between prompts to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 1000))

      } catch (promptError) {
        console.error(`❌ Error processing prompt ${prompt.id}:`, promptError)
        errorCount++
      }
    }

    console.log(`\n🎉 Monitoring complete! Success: ${successCount}, Errors: ${errorCount}`)

    return NextResponse.json({
      success: true,
      promptsProcessed: prompts.length,
      successfulRuns: successCount,
      errors: errorCount,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('💥 Cron job failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to run monitoring job',
        details: (error as Error).message 
      },
      { status: 500 }
    )
  }
}

