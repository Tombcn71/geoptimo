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
      `SELECT p.*, b."companyName" as brand_name 
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

        // Save result to database
        const insertResult = await query(
          `INSERT INTO "PromptResult" ("promptId", provider, mentioned, position, sentiment, response, citations, "runAt")
           VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
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
