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
    return null
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })
    
    const prompt = `You are a GEO (Generative Engine Optimization) expert. Analyze this content and provide scores (0-100) for:
- citationLikelihood: How likely AI models will cite this
- readability: How easy for AI to understand
- structure: Organization and hierarchy
- entityCoverage: Coverage of key entities/concepts
- factualDensity: Amount of verifiable facts
- sourceQuality: Quality of external sources

Also provide 2-3 actionable suggestions with: type (high/medium/low), category, message, impact.

Return ONLY valid JSON with this structure:
{
  "citationLikelihood": 80,
  "readability": 75,
  "structure": 85,
  "entityCoverage": 70,
  "factualDensity": 75,
  "sourceQuality": 80,
  "suggestions": [
    {"type": "high", "category": "Structure", "message": "Add more headings", "impact": "+8 points"}
  ]
}

Content to analyze:
${content.substring(0, 3000)}`

    const result = await model.generateContent(prompt)
    const analysisText = result.response.text()
    
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }

    return null
  } catch (error) {
    console.error('Gemini content analysis error:', error)
    return null
  }
}

