import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

const genAI = new GoogleGenAI({
  apiKey: process.env.GOOGLE_AI_API_KEY || '',
})

interface Prompt {
  text: string
  category: string
  estimatedImpressions: number
}

export async function POST(request: Request) {
  try {
    const { category, description } = await request.json()

    if (!category || !description) {
      return NextResponse.json(
        { error: 'Category and description are required' },
        { status: 400 }
      )
    }

    console.log('🤖 Generating AI prompt suggestions for:', { category, description: description.substring(0, 50) })

    // Generate prompts using AI
    const prompt = `Eres un experto en GEO (Optimización de Motores Generativos). Genera 10 prompts de búsqueda altamente relevantes que los clientes potenciales harían a chatbots de IA (ChatGPT, Claude, Gemini, Perplexity) cuando buscan un servicio/producto como este:

Categoría: ${category}
Descripción: ${description}

Genera 10 prompts naturales y conversacionales que:
1. Coincidan con cómo los usuarios reales hablan con asistentes de IA
2. Sean lo suficientemente específicos para ser accionables
3. Varíen en intención (comparación, cómo hacer, descubrimiento de productos, resolución de problemas)
4. Naturalmente desencadenarían menciones de este tipo de negocio
5. Tengan entre 10-25 palabras

Devuelve SOLO un array JSON válido de objetos con este formato exacto:
[
  {
    "text": "el texto completo del prompt",
    "category": "${category}",
    "estimatedImpressions": un número entre 500 y 8000
  }
]

Sin markdown, sin explicaciones, solo el array JSON.`

    const model = 'gemini-flash-lite-latest'
    const contents = [
      {
        role: 'user' as const,
        parts: [{ text: prompt }],
      },
    ]

    const result = await genAI.models.generateContent({
      model,
      contents,
    })
    const responseText = result.text

    console.log('📝 Raw AI response:', responseText.substring(0, 200))

    // Extract JSON from response
    let prompts: Prompt[] = []
    try {
      // Try to parse directly
      prompts = JSON.parse(responseText)
    } catch (e) {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = responseText.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/)
      if (jsonMatch) {
        prompts = JSON.parse(jsonMatch[1])
      } else {
        // Try to find any JSON array in the text
        const arrayMatch = responseText.match(/\[[\s\S]*?\]/)
        if (arrayMatch) {
          prompts = JSON.parse(arrayMatch[0])
        }
      }
    }

    // Validate and sanitize
    if (!Array.isArray(prompts) || prompts.length === 0) {
      console.error('❌ Failed to parse AI response, using fallback')
      return NextResponse.json(getFallbackPrompts(category, description))
    }

    // Ensure correct format
    const validatedPrompts = prompts.slice(0, 10).map((p, idx) => ({
      text: p.text || `What are the best ${category.toLowerCase()} solutions?`,
      category: p.category || category,
      estimatedImpressions: p.estimatedImpressions || Math.floor(Math.random() * 5000) + 1000
    }))

    console.log(`✅ Generated ${validatedPrompts.length} AI-powered prompts`)

    return NextResponse.json(validatedPrompts)

  } catch (error) {
    console.error('❌ Error generating prompts:', error)
    
    // Return fallback prompts
    const { category, description } = await request.json()
    return NextResponse.json(getFallbackPrompts(category, description))
  }
}

// Fallback prompts if AI fails
function getFallbackPrompts(category: string, description: string): Prompt[] {
  const templates: Record<string, string[]> = {
    SaaS: [
      `What are the best ${category} tools for my business?`,
      `Can you recommend ${category.toLowerCase()} platforms for small teams?`,
      `I'm looking for affordable ${category.toLowerCase()} solutions`,
      `Which ${category} tools have the best reviews?`,
      `Compare top ${category.toLowerCase()} software options`,
      `What are some ${category.toLowerCase()} alternatives to expensive platforms?`,
      `Best ${category} tools with free trials?`,
      `How do I choose the right ${category.toLowerCase()} solution?`,
      `What ${category.toLowerCase()} tools integrate well with other apps?`,
      `Looking for ${category.toLowerCase()} software with good customer support`,
    ],
    'E-commerce': [
      'What are the best e-commerce platforms for small businesses?',
      'Can you recommend online stores with fast shipping?',
      'Which e-commerce sites have the best return policies?',
      'I\'m looking for affordable e-commerce solutions',
      'What are some user-friendly e-commerce platforms?',
      'Which online shopping platforms offer the best customer service?',
      'Can you suggest e-commerce tools for inventory management?',
      'What are the most secure e-commerce payment processors?',
      'Which e-commerce platforms integrate well with social media?',
      'I need an e-commerce solution with good analytics features',
    ],
    'Food Delivery': [
      'What are the fastest food delivery services?',
      'Which food delivery app has the best restaurant selection?',
      'Can you recommend healthy meal delivery options?',
      'What food delivery services offer the best deals?',
      'Which delivery platform has the most reliable service?',
      'Are there any food delivery apps with low fees?',
      'What are the best grocery delivery services?',
      'Which food delivery service has the best customer support?',
      'Can you suggest meal kit delivery options?',
      'What are the top-rated food delivery apps?',
    ],
  }

  // Get category-specific templates or use generic ones
  let promptTexts = templates[category] || [
    `What are the best ${category.toLowerCase()} services available?`,
    `Can you recommend ${category.toLowerCase()} providers?`,
    `I'm looking for ${category.toLowerCase()} solutions`,
    `Which ${category.toLowerCase()} companies have the best reviews?`,
    `Compare top ${category.toLowerCase()} options`,
    `What are some affordable ${category.toLowerCase()} alternatives?`,
    `Best ${category.toLowerCase()} with good customer service?`,
    `How do I choose a ${category.toLowerCase()} provider?`,
    `What ${category.toLowerCase()} options are most reliable?`,
    `Looking for ${category.toLowerCase()} recommendations`,
  ]

  return promptTexts.slice(0, 10).map((text, index) => ({
    text,
    category,
    estimatedImpressions: Math.floor(Math.random() * 5000) + 1000,
  }))
}
