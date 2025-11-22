import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { runPromptOnChatGPT } from '@/lib/ai/openai'
import { runPromptOnGemini, analyzeBrandMention } from '@/lib/ai/gemini'

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
        
        // Run on each provider
        for (const provider of prompt.providers) {
          try {
            let aiResult = null

            // Run prompt on AI platform
            if (provider === 'ChatGPT') {
              aiResult = await runPromptOnChatGPT(prompt.text)
            } else if (provider === 'Gemini') {
              aiResult = await runPromptOnGemini(prompt.text)
            } else if (provider === 'Claude') {
              // Use Gemini as fallback for Claude
              aiResult = await runPromptOnGemini(prompt.text)
            } else if (provider === 'Perplexity') {
              // TODO: Add Perplexity when API available
              console.log(`⏭️  Skipping ${provider} (not implemented yet)`)
              continue
            }

            if (!aiResult || !aiResult.response) {
              console.log(`⚠️  No response from ${provider}`)
              continue
            }

            // Analyze if brand is mentioned
            const analysis = await analyzeBrandMention(
              aiResult.response,
              prompt.brand_name
            )

            // Ensure PromptResult sequence exists (only on first iteration)
            if (successCount === 0 && errorCount === 0 && provider === prompt.providers[0]) {
              await query(`
                CREATE SEQUENCE IF NOT EXISTS "PromptResult_id_seq"
              `)
            }

            // Save result to database
            await query(`
              INSERT INTO "PromptResult" 
                (id, "promptId", provider, mentioned, position, sentiment, response, citations, "runAt")
              VALUES (nextval('"PromptResult_id_seq"'), $1, $2, $3, $4, $5, $6, $7, NOW())
            `, [
              prompt.id,
              provider,
              analysis.mentioned,
              analysis.position,
              analysis.sentiment || 'neutral',
              aiResult.response.substring(0, 5000), // Limit response length
              [] // Citations can be extracted later
            ])

            console.log(`✅ ${provider}: mentioned=${analysis.mentioned}, position=${analysis.position}, sentiment=${analysis.sentiment}`)
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

