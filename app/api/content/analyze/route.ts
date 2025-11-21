import { NextResponse } from 'next/server'
import { analyzeContentForGEO } from '@/lib/ai/openai'

export async function POST(request: Request) {
  try {
    const { content } = await request.json()

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    // Analyze content with AI
    const analysis = await analyzeContentForGEO(content)

    // Calculate overall GEO score
    const geoScore = Math.round(
      (analysis.citationLikelihood +
        analysis.readability +
        analysis.structure +
        analysis.entityCoverage +
        analysis.factualDensity +
        analysis.sourceQuality) / 6
    )

    return NextResponse.json({
      geoScore,
      ...analysis
    })
  } catch (error) {
    console.error('Error analyzing content:', error)
    return NextResponse.json(
      { error: 'Failed to analyze content' },
      { status: 500 }
    )
  }
}

