import { NextResponse } from 'next/server'
import { analyzeContentForGEO } from '@/lib/ai/openai'

export async function POST(request: Request) {
  try {
    console.log('Content analyze API called');
    
    const body = await request.json()
    console.log('Request body:', { contentLength: body.content?.length });
    
    const { content } = body

    if (!content || content.trim().length === 0) {
      console.log('No content provided');
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      )
    }

    console.log('Analyzing content with AI...');
    
    // Analyze content with AI
    const analysis = await analyzeContentForGEO(content)
    
    console.log('Analysis result:', analysis);

    // Calculate overall GEO score
    const geoScore = Math.round(
      ((analysis.citationLikelihood || 0) +
        (analysis.readability || 0) +
        (analysis.structure || 0) +
        (analysis.entityCoverage || 0) +
        (analysis.factualDensity || 0) +
        (analysis.sourceQuality || 0)) / 6
    )

    const result = {
      geoScore,
      citationLikelihood: analysis.citationLikelihood || 75,
      readability: analysis.readability || 75,
      structure: analysis.structure || 85,
      entityCoverage: analysis.entityCoverage || 70,
      factualDensity: analysis.factualDensity || 75,
      sourceQuality: analysis.sourceQuality || 80,
      suggestions: analysis.suggestions || []
    }

    console.log('Returning result:', result);

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error analyzing content:', error)
    return NextResponse.json(
      { error: 'Failed to analyze content', details: (error as Error).message },
      { status: 500 }
    )
  }
}

