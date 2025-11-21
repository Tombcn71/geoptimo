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
    throw new Error('GOOGLE_AI_API_KEY niet geconfigureerd')
  }

  try {
    const model = 'gemini-flash-lite-latest'
    
    const prompt = `Je bent een GEO (Generative Engine Optimization) expert.

STAP 1: Bepaal eerst het CONTENT TYPE:
- Product/Service pagina (e-commerce, SaaS, diensten, apps)
- Informatieve content (blog, gids, tutorial, artikel)
- Bedrijfspagina (over ons, contact, team)

STAP 2: Geef scores (0-100) aangepast aan het content type:

Voor PRODUCT/SERVICE pagina's (zoals apps, diensten):
- citationLikelihood: Focus op merk autoriteit, USP duidelijkheid, sociale bewijzen (70-90 verwacht)
- readability: Helderheid van product beschrijving en voordelen (70-95 verwacht)
- structure: Logische product flow - probleem → oplossing → actie (65-90 verwacht)
- entityCoverage: Product features, use cases, doelgroep beschrijving (60-85 verwacht)
- factualDensity: Concrete specs, prijzen, resultaten, voorbeelden (50-80 verwacht)
- sourceQuality: Reviews, testimonials, case studies, social proof (40-75 verwacht)

Voor INFORMATIEVE content:
- citationLikelihood: Expert autoriteit, bronvermelding, diepgang (60-95 verwacht)
- readability: Tekst complexiteit voor breed publiek (70-95 verwacht)
- structure: Hiërarchie en content organisatie (70-95 verwacht)
- entityCoverage: Concepten, definities, terminologie (65-90 verwacht)
- factualDensity: Feiten, data, statistieken (60-90 verwacht)
- sourceQuality: Externe bronnen en referenties (50-85 verwacht)

STAP 3: Geef 3-5 UNIEKE, VERSCHILLENDE suggestions specifiek voor het content type. GEEN DUPLICATEN!

Return ALLEEN valid JSON (geen markdown, geen extra tekst):
{
  "contentType": "product|informative|business",
  "citationLikelihood": 85,
  "readability": 80,
  "structure": 90,
  "entityCoverage": 75,
  "factualDensity": 80,
  "sourceQuality": 85,
  "suggestions": [
    {"type": "high", "category": "USP", "message": "Unieke tip 1", "impact": "+10"},
    {"type": "medium", "category": "Trust", "message": "Unieke tip 2", "impact": "+5"},
    {"type": "low", "category": "SEO", "message": "Unieke tip 3", "impact": "+3"}
  ]
}

Content om te analyseren:
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
