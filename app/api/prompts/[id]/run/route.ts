import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { runPromptOnChatGPT } from '@/lib/ai/openai'
import { runPromptOnGemini, analyzeBrandMention } from '@/lib/ai/gemini'

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const prompt = await prisma.prompt.findUnique({
      where: { id: params.id },
      include: {
        brand: true
      }
    })

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 })
    }

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
          prompt.brand.companyName
        )

        // Save result to database
        const promptResult = await prisma.promptResult.create({
          data: {
            promptId: prompt.id,
            provider: provider,
            mentioned: analysis.mentioned,
            position: analysis.position,
            sentiment: analysis.sentiment || 'neutral',
            response: result.response,
            citations: [], // Extract citations if available
          }
        })

        results.push({
          provider,
          ...analysis,
          resultId: promptResult.id
        })
      }
    }

    // Update prompt last run time
    await prisma.prompt.update({
      where: { id: prompt.id },
      data: { updatedAt: new Date() }
    })

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

