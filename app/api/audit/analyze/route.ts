import { NextResponse } from 'next/server'
import { analyzeContentForGEO } from '@/lib/ai/openai'

export async function POST(request: Request) {
  try {
    const { content, title } = await request.json()

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    if (content.length < 100) {
      return NextResponse.json(
        { error: 'Content is too short. Please provide at least 100 characters.' },
        { status: 400 }
      )
    }

    const pageContent = content.substring(0, 8000) // Limit to 8000 chars for API

    // Analyze with AI
    const analysis = await analyzeContentForGEO(pageContent)

    if (!analysis) {
      throw new Error('AI analysis failed')
    }

    // Calculate overall score
    const overallScore = Math.round(
      (analysis.citationLikelihood +
        analysis.readability +
        analysis.structure +
        analysis.entityCoverage +
        analysis.factualDensity +
        analysis.sourceQuality) / 6
    )

    // Format dimensions
    const dimensions = [
      {
        name: 'Citation Likelihood',
        score: analysis.citationLikelihood,
        status: analysis.citationLikelihood >= 85 ? 'excellent' : analysis.citationLikelihood >= 70 ? 'good' : 'fair',
        description: 'Probability that AI models will cite this content',
        issues: analysis.suggestions
          .filter(s => s.category.toLowerCase().includes('citation') || s.category.toLowerCase().includes('bronnen'))
          .map(s => ({ text: s.message, priority: s.type })),
        strengths: analysis.citationLikelihood >= 70 ? ['Good citation potential'] : []
      },
      {
        name: 'Readability',
        score: analysis.readability,
        status: analysis.readability >= 85 ? 'excellent' : analysis.readability >= 70 ? 'good' : 'fair',
        description: 'How easy it is for AI to understand your content',
        issues: analysis.suggestions
          .filter(s => s.category.toLowerCase().includes('leesbaarheid') || s.category.toLowerCase().includes('tekst'))
          .map(s => ({ text: s.message, priority: s.type })),
        strengths: analysis.readability >= 70 ? ['Clear and understandable text'] : []
      },
      {
        name: 'Structure',
        score: analysis.structure,
        status: analysis.structure >= 85 ? 'excellent' : analysis.structure >= 70 ? 'good' : 'fair',
        description: 'Content organization and hierarchy',
        issues: analysis.suggestions
          .filter(s => s.category.toLowerCase().includes('structuur'))
          .map(s => ({ text: s.message, priority: s.type })),
        strengths: analysis.structure >= 70 ? ['Well-organized content'] : []
      },
      {
        name: 'Entity Coverage',
        score: analysis.entityCoverage,
        status: analysis.entityCoverage >= 85 ? 'excellent' : analysis.entityCoverage >= 70 ? 'good' : 'fair',
        description: 'Coverage of key concepts and terms',
        issues: analysis.suggestions
          .filter(s => s.category.toLowerCase().includes('entiteit') || s.category.toLowerCase().includes('termen'))
          .map(s => ({ text: s.message, priority: s.type })),
        strengths: analysis.entityCoverage >= 70 ? ['Good keyword coverage'] : []
      },
      {
        name: 'Factual Density',
        score: analysis.factualDensity,
        status: analysis.factualDensity >= 85 ? 'excellent' : analysis.factualDensity >= 70 ? 'good' : 'fair',
        description: 'Amount of verifiable facts and data',
        issues: analysis.suggestions
          .filter(s => s.category.toLowerCase().includes('feiten') || s.category.toLowerCase().includes('data'))
          .map(s => ({ text: s.message, priority: s.type })),
        strengths: analysis.factualDensity >= 70 ? ['Good use of data and facts'] : []
      },
      {
        name: 'Source Quality',
        score: analysis.sourceQuality,
        status: analysis.sourceQuality >= 85 ? 'excellent' : analysis.sourceQuality >= 70 ? 'good' : 'fair',
        description: 'Quality of external sources cited',
        issues: analysis.suggestions
          .filter(s => s.category.toLowerCase().includes('bron'))
          .map(s => ({ text: s.message, priority: s.type })),
        strengths: analysis.sourceQuality >= 70 ? ['Links to reputable sources'] : []
      }
    ]

    // Add any remaining suggestions as general issues
    const categorizedSuggestions = new Set(
      dimensions.flatMap(d => d.issues.map(i => i.text))
    )
    
    dimensions.forEach(dim => {
      const remainingSuggestions = analysis.suggestions.filter(
        s => !categorizedSuggestions.has(s.message)
      )
      if (remainingSuggestions.length > 0 && dim.issues.length === 0) {
        dim.issues.push({
          text: remainingSuggestions[0].message,
          priority: remainingSuggestions[0].type
        })
      }
    })

    return NextResponse.json({
      score: overallScore,
      title: title || 'Your Content',
      dimensions
    })

  } catch (error) {
    console.error('Error analyzing page:', error)
    return NextResponse.json(
      { error: 'Failed to analyze page', details: (error as Error).message },
      { status: 500 }
    )
  }
}

