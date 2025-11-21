import { NextResponse } from 'next/server'
import { analyzeContentForGEO } from '@/lib/ai/openai'

export async function POST(request: Request) {
  try {
    console.log('Content analyze API called');
    
    // Check if API keys are configured
    if (!process.env.OPENAI_API_KEY && !process.env.GOOGLE_AI_API_KEY) {
      console.log('No API keys configured');
      return NextResponse.json(
        { 
          error: 'API keys not configured',
          message: 'Voeg je OPENAI_API_KEY of GOOGLE_AI_API_KEY toe aan de environment variables om AI analyse te gebruiken.'
        },
        { status: 503 }
      )
    }
    
    const body = await request.json()
    console.log('Request body:', { contentLength: body.content?.length });
    
    const { content } = body

    if (!content || content.trim().length === 0) {
      console.log('No content provided');
      return NextResponse.json(
        { error: 'Geen content gevonden. Plak eerst jouw tekst in het tekstveld.' },
        { status: 400 }
      )
    }

    if (content.length < 100) {
      return NextResponse.json(
        { error: 'Content te kort. Gebruik minimaal 100 karakters voor een betrouwbare analyse.' },
        { status: 400 }
      )
    }

    console.log('Analyzing content with AI...');
    
    // Analyze content with AI (real API call)
    const analysis = await analyzeContentForGEO(content)
    
    if (!analysis) {
      throw new Error('AI analysis failed - no response from AI provider')
    }
    
    console.log('Analysis result:', analysis);

    // Validate all scores are present
    if (!analysis.citationLikelihood || !analysis.readability || !analysis.structure ||
        !analysis.entityCoverage || !analysis.factualDensity || !analysis.sourceQuality) {
      throw new Error('Incomplete analysis result from AI')
    }

    // Calculate overall GEO score
    const geoScore = Math.round(
      (analysis.citationLikelihood +
        analysis.readability +
        analysis.structure +
        analysis.entityCoverage +
        analysis.factualDensity +
        analysis.sourceQuality) / 6
    )

    const result = {
      geoScore,
      citationLikelihood: analysis.citationLikelihood,
      readability: analysis.readability,
      structure: analysis.structure,
      entityCoverage: analysis.entityCoverage,
      factualDensity: analysis.factualDensity,
      sourceQuality: analysis.sourceQuality,
      suggestions: analysis.suggestions || []
    }

    console.log('Returning result:', result);

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error analyzing content:', error)
    return NextResponse.json(
      { 
        error: 'Analyse mislukt',
        message: (error as Error).message,
        details: 'Check of je API key correct is ingesteld.'
      },
      { status: 500 }
    )
  }
}

