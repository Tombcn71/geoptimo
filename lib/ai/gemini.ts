import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_AI_API_KEY || '',
})

export async function runPromptOnGemini(prompt: string) {
  if (!process.env.GOOGLE_AI_API_KEY) {
    console.warn('Google AI API key not configured')
    return null
  }

  try {
    const model = 'gemini-flash-lite-latest'
    const contents = [
      {
        role: 'user' as const,
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ]

    const response = await ai.models.generateContent({
      model,
      contents,
    })

    return {
      response: response.text,
      provider: 'Gemini',
      mentioned: false, // Will be analyzed
      position: null,
      sentiment: null,
    }
  } catch (error) {
    console.error('Google AI API error:', error)
    return null
  }
}

export async function analyzeBrandMention(response: string, brandName: string) {
  if (!process.env.GOOGLE_AI_API_KEY) {
    return {
      mentioned: response.toLowerCase().includes(brandName.toLowerCase()),
      position: null,
      sentiment: 'neutral'
    }
  }

  try {
    const model = 'gemini-flash-lite-latest'
    
    const prompt = `Analyze this AI response for mentions of "${brandName}":

${response}

Return ONLY valid JSON with this exact structure:
{
  "mentioned": true or false,
  "position": number from 1-10 or null,
  "sentiment": "positive" or "neutral" or "negative",
  "snippet": "quote from text" or null
}

Do not include any other text, only the JSON.`

    const contents = [
      {
        role: 'user' as const,
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ]

    const result = await ai.models.generateContent({
      model,
      contents,
    })
    
    const analysisText = result.text
    
    // Clean up the response to extract JSON
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        mentioned: parsed.mentioned || false,
        position: parsed.position || null,
        sentiment: parsed.sentiment || 'neutral',
        snippet: parsed.snippet || null
      }
    }

    return {
      mentioned: response.toLowerCase().includes(brandName.toLowerCase()),
      position: null,
      sentiment: 'neutral'
    }
  } catch (error) {
    console.error('Brand mention analysis error:', error)
    return {
      mentioned: response.toLowerCase().includes(brandName.toLowerCase()),
      position: null,
      sentiment: 'neutral'
    }
  }
}

export async function analyzeContentWithGemini(content: string) {
  if (!process.env.GOOGLE_AI_API_KEY) {
    throw new Error('GOOGLE_AI_API_KEY not configured')
  }

  try {
    const model = 'gemini-flash-lite-latest'
    
    const prompt = `You are a GEO (Generative Engine Optimization) expert.

STEP 1: First determine the CONTENT TYPE:
- Product/Service page (e-commerce, SaaS, services, apps)
- Informative content (blog, guide, tutorial, article)
- Business page (about us, contact, team)

STEP 2: Give scores (0-100) adapted to the content type:

For PRODUCT/SERVICE pages (like apps, services):
- citationLikelihood: Focus on brand authority, USP clarity, social proof (70-90 expected)
- readability: Clarity of product description and benefits (70-95 expected)
- structure: Logical product flow - problem → solution → action (65-90 expected)
- entityCoverage: Product features, use cases, target audience description (60-85 expected)
- factualDensity: Concrete specs, prices, results, examples (50-80 expected)
- sourceQuality: Reviews, testimonials, case studies, social proof (40-75 expected)

For INFORMATIVE content:
- citationLikelihood: Expert authority, source citation, depth (60-95 expected)
- readability: Text complexity for broad audience (70-95 expected)
- structure: Hierarchy and content organization (70-95 expected)
- entityCoverage: Concepts, definitions, terminology (65-90 expected)
- factualDensity: Facts, data, statistics (60-90 expected)
- sourceQuality: External sources and references (50-85 expected)

STEP 3: Give 3-5 UNIQUE, DIFFERENT suggestions specific to the content type. NO DUPLICATES! ALL IN ENGLISH!

Return ONLY valid JSON (no markdown, no extra text):
{
  "contentType": "product|informative|business",
  "citationLikelihood": 85,
  "readability": 80,
  "structure": 90,
  "entityCoverage": 75,
  "factualDensity": 80,
  "sourceQuality": 85,
  "suggestions": [
    {"type": "high", "category": "USP", "message": "Unique tip 1 in English", "impact": "+10"},
    {"type": "medium", "category": "Trust", "message": "Unique tip 2 in English", "impact": "+5"},
    {"type": "low", "category": "SEO", "message": "Unique tip 3 in English", "impact": "+3"}
  ]
}

Content to analyze:
${content.substring(0, 4000)}`

    const contents = [
      {
        role: 'user' as const,
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ]

    const config = {
      responseModalities: ['TEXT' as const],
    }

    const result = await ai.models.generateContent({
      model,
      contents,
      config,
    })
    
    const analysisText = result.text
    
    console.log('Gemini raw response:', analysisText)
    
    // Extract JSON from response
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      
      // Validate required fields
      if (!parsed.citationLikelihood || !parsed.readability || !parsed.structure) {
        throw new Error('Gemini returned incomplete data')
      }
      
      return parsed
    }

    throw new Error('Gemini returned invalid JSON format')
  } catch (error) {
    console.error('Gemini content analysis error:', error)
    throw error
  }
}
