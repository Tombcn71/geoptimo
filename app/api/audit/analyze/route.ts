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

    // Format dimensions with UNIQUE suggestions per dimension
    const usedSuggestions = new Set<string>();
    
    const dimensions: Array<{
      name: string;
      score: number;
      status: string;
      description: string;
      issues: Array<{ text: string; priority: string }>;
      strengths: string[];
    }> = [
      {
        name: 'Citation Likelihood',
        score: analysis.citationLikelihood,
        status: analysis.citationLikelihood >= 85 ? 'excellent' : analysis.citationLikelihood >= 70 ? 'good' : 'fair',
        description: 'Probability that AI models will cite this content',
        issues: [],
        strengths: analysis.citationLikelihood >= 70 ? ['Good citation potential', 'Content is AI-friendly'] : []
      },
      {
        name: 'Readability',
        score: analysis.readability,
        status: analysis.readability >= 85 ? 'excellent' : analysis.readability >= 70 ? 'good' : 'fair',
        description: 'How easy it is for AI to understand your content',
        issues: [],
        strengths: analysis.readability >= 70 ? ['Clear and understandable text', 'Good sentence structure'] : []
      },
      {
        name: 'Structure',
        score: analysis.structure,
        status: analysis.structure >= 85 ? 'excellent' : analysis.structure >= 70 ? 'good' : 'fair',
        description: 'Content organization and hierarchy',
        issues: [],
        strengths: analysis.structure >= 70 ? ['Well-organized content', 'Logical flow'] : []
      },
      {
        name: 'Entity Coverage',
        score: analysis.entityCoverage,
        status: analysis.entityCoverage >= 85 ? 'excellent' : analysis.entityCoverage >= 70 ? 'good' : 'fair',
        description: 'Coverage of key concepts and terms',
        issues: [],
        strengths: analysis.entityCoverage >= 70 ? ['Good keyword coverage', 'Relevant terminology'] : []
      },
      {
        name: 'Factual Density',
        score: analysis.factualDensity,
        status: analysis.factualDensity >= 85 ? 'excellent' : analysis.factualDensity >= 70 ? 'good' : 'fair',
        description: 'Amount of verifiable facts and data',
        issues: [],
        strengths: analysis.factualDensity >= 70 ? ['Good use of data and facts', 'Evidence-based content'] : []
      },
      {
        name: 'Source Quality',
        score: analysis.sourceQuality,
        status: analysis.sourceQuality >= 85 ? 'excellent' : analysis.sourceQuality >= 70 ? 'good' : 'fair',
        description: 'Quality of external sources cited',
        issues: [],
        strengths: analysis.sourceQuality >= 70 ? ['Links to reputable sources', 'Good source diversity'] : []
      }
    ]

    // Distribute suggestions UNIQUELY across dimensions (max 2 per dimension)
    let suggestionIndex = 0;
    for (let i = 0; i < dimensions.length && suggestionIndex < analysis.suggestions.length; i++) {
      const dim = dimensions[i];
      let added = 0;
      
      while (added < 2 && suggestionIndex < analysis.suggestions.length) {
        const suggestion = analysis.suggestions[suggestionIndex];
        if (!usedSuggestions.has(suggestion.message)) {
          dim.issues.push({
            text: suggestion.message,
            priority: suggestion.type
          });
          usedSuggestions.add(suggestion.message);
          added++;
        }
        suggestionIndex++;
      }
    }

    return NextResponse.json({
      score: overallScore,
      title: title || 'Your Content',
      contentType: analysis.contentType || 'unknown',
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

