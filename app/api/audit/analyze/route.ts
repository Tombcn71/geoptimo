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
        name: 'Probabilidad de Citación',
        score: analysis.citationLikelihood,
        status: analysis.citationLikelihood >= 85 ? 'excellent' : analysis.citationLikelihood >= 70 ? 'good' : 'fair',
        description: 'Probabilidad de que los modelos de IA citen este contenido',
        issues: [],
        strengths: analysis.citationLikelihood >= 70 ? ['Buena probabilidad de citación', 'Contenido amigable para IA'] : []
      },
      {
        name: 'Legibilidad',
        score: analysis.readability,
        status: analysis.readability >= 85 ? 'excellent' : analysis.readability >= 70 ? 'good' : 'fair',
        description: 'Qué tan fácil es para la IA entender tu contenido',
        issues: [],
        strengths: analysis.readability >= 70 ? ['Texto claro y comprensible', 'Buena estructura de oraciones'] : []
      },
      {
        name: 'Estructura',
        score: analysis.structure,
        status: analysis.structure >= 85 ? 'excellent' : analysis.structure >= 70 ? 'good' : 'fair',
        description: 'Organización y jerarquía del contenido',
        issues: [],
        strengths: analysis.structure >= 70 ? ['Contenido bien organizado', 'Flujo lógico'] : []
      },
      {
        name: 'Cobertura de Entidades',
        score: analysis.entityCoverage,
        status: analysis.entityCoverage >= 85 ? 'excellent' : analysis.entityCoverage >= 70 ? 'good' : 'fair',
        description: 'Cobertura de conceptos y términos clave',
        issues: [],
        strengths: analysis.entityCoverage >= 70 ? ['Buena cobertura de palabras clave', 'Terminología relevante'] : []
      },
      {
        name: 'Densidad Factual',
        score: analysis.factualDensity,
        status: analysis.factualDensity >= 85 ? 'excellent' : analysis.factualDensity >= 70 ? 'good' : 'fair',
        description: 'Cantidad de hechos y datos verificables',
        issues: [],
        strengths: analysis.factualDensity >= 70 ? ['Buen uso de datos y hechos', 'Contenido basado en evidencia'] : []
      },
      {
        name: 'Calidad de Fuentes',
        score: analysis.sourceQuality,
        status: analysis.sourceQuality >= 85 ? 'excellent' : analysis.sourceQuality >= 70 ? 'good' : 'fair',
        description: 'Calidad de las fuentes externas citadas',
        issues: [],
        strengths: analysis.sourceQuality >= 70 ? ['Enlaces a fuentes reputables', 'Buena diversidad de fuentes'] : []
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
      title: title || 'Tu Contenido',
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

