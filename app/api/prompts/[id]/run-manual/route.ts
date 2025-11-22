import { NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { runPromptOnChatGPT } from '@/lib/ai/openai'
import { runPromptOnGemini, analyzeBrandMention } from '@/lib/ai/gemini'

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    
    // Get prompt with brand info
    const promptResult = await query(
      `SELECT p.id, p.text, p.providers, b."companyName" as brand_name 
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

    // Run on each subscribed provider
    for (const provider of prompt.providers) {
      try {
        let aiResult = null

        if (provider === 'ChatGPT') {
          aiResult = await runPromptOnChatGPT(prompt.text)
        } else if (provider === 'Gemini') {
          aiResult = await runPromptOnGemini(prompt.text)
        } else if (provider === 'Claude') {
          aiResult = await runPromptOnGemini(prompt.text) // Use Gemini as fallback
        } else if (provider === 'Perplexity') {
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

        // Ensure PromptResult sequence exists
        await query(`
          CREATE SEQUENCE IF NOT EXISTS "PromptResult_id_seq"
        `)

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
            aiResult.response.substring(0, 5000),
            []
          ]
        )

        results.push({
          provider,
          mentioned: analysis.mentioned,
          position: analysis.position,
          sentiment: analysis.sentiment,
          resultId: insertResult.rows[0].id
        })

        console.log(`✅ ${provider}: mentioned=${analysis.mentioned}, position=${analysis.position}`)

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

