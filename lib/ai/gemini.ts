import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '')

export async function runPromptOnGemini(prompt: string) {
  if (!process.env.GOOGLE_AI_API_KEY) {
    console.warn('Google AI API key not configured')
    return null
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })
    const result = await model.generateContent(prompt)
    const response = result.response.text()

    return {
      response,
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
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })
    
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

    const result = await model.generateContent(prompt)
    const analysisText = result.response.text()
    
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
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })
    
    const prompt = `Je bent een GEO (Generative Engine Optimization) expert. Analyseer deze content en geef scores (0-100) voor:
- citationLikelihood: Hoe waarschijnlijk AI modellen deze content zullen citeren
- readability: Hoe makkelijk het is voor AI om te begrijpen
- structure: Organisatie en hiërarchie van de content
- entityCoverage: Dekking van belangrijke concepten en termen
- factualDensity: Hoeveelheid verifieerbare feiten
- sourceQuality: Kwaliteit van externe bronnen

Geef ook 2-4 concrete verbetersuggestions in het Nederlands met type (high/medium/low), category, message, en impact.

Return ALLEEN valid JSON met deze exacte structuur (geen extra tekst):
{
  "citationLikelihood": 85,
  "readability": 80,
  "structure": 90,
  "entityCoverage": 75,
  "factualDensity": 80,
  "sourceQuality": 85,
  "suggestions": [
    {"type": "high", "category": "Structuur", "message": "Concrete tip in Nederlands", "impact": "+8 punten"}
  ]
}

Content om te analyseren:
${content.substring(0, 4000)}`

    const result = await model.generateContent(prompt)
    const analysisText = result.response.text()
    
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

