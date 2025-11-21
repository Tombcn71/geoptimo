import { NextResponse } from 'next/server'
import { analyzeContentForGEO } from '@/lib/ai/openai'

export async function POST(request: Request) {
  try {
    console.log('🔵 Content analyze API called');
    console.log('🔑 OpenAI Key:', process.env.OPENAI_API_KEY ? 'SET ✓' : 'NOT SET ✗');
    console.log('🔑 Google AI Key:', process.env.GOOGLE_AI_API_KEY ? 'SET ✓' : 'NOT SET ✗');
    
    // Check if API keys are configured
    if (!process.env.OPENAI_API_KEY && !process.env.GOOGLE_AI_API_KEY) {
      console.log('❌ No API keys configured');
      return NextResponse.json(
        { 
          error: 'Geen API keys gevonden',
          message: 'Maak een .env.local file aan met GOOGLE_AI_API_KEY=jouw_key',
          details: 'Haal je key op van: https://aistudio.google.com/apikey'
        },
        { status: 503 }
      )
    }
    
    const body = await request.json()
    console.log('📝 Request body:', { contentLength: body.content?.length });
    
    const { content } = body

    if (!content || content.trim().length === 0) {
      console.log('⚠️ No content provided');
      return NextResponse.json(
        { error: 'Geen content gevonden. Plak eerst jouw tekst in het tekstveld.' },
        { status: 400 }
      )
    }

    if (content.length < 100) {
      console.log('⚠️ Content too short:', content.length);
      return NextResponse.json(
        { error: 'Content te kort. Gebruik minimaal 100 karakters voor een betrouwbare analyse.' },
        { status: 400 }
      )
    }

    console.log('🤖 Analyzing content with AI...');
    
    // Analyze content with AI (real API call)
    const analysis = await analyzeContentForGEO(content)
    
    if (!analysis) {
      console.error('❌ AI analysis returned null');
      throw new Error('AI analysis failed - no response from AI provider')
    }
    
    console.log('✅ Analysis result:', JSON.stringify(analysis, null, 2));

    // Validate all scores are present
    if (!analysis.citationLikelihood || !analysis.readability || !analysis.structure ||
        !analysis.entityCoverage || !analysis.factualDensity || !analysis.sourceQuality) {
      console.error('❌ Incomplete analysis:', analysis);
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

    console.log('✅ Returning result:', JSON.stringify(result, null, 2));

    return NextResponse.json(result)
  } catch (error) {
    console.error('❌ Error analyzing content:', error)
    const errorMessage = (error as Error).message || 'Unknown error'
    const errorStack = (error as Error).stack || 'No stack trace'
    
    console.error('Error details:', {
      message: errorMessage,
      stack: errorStack
    })
    
    return NextResponse.json(
      { 
        error: 'Analyse mislukt',
        message: errorMessage,
        details: 'Check of je .env.local file bestaat met GOOGLE_AI_API_KEY',
        stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
      },
      { status: 500 }
    )
  }
}

