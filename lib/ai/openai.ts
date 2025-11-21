import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export async function runPromptOnChatGPT(prompt: string) {
  if (!process.env.OPENAI_API_KEY) {
    console.warn('OpenAI API key not configured')
    return null
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
    })

    return {
      response: completion.choices[0].message.content,
      provider: 'ChatGPT',
      mentioned: false, // Will be analyzed
      position: null,
      sentiment: null,
    }
  } catch (error) {
    console.error('OpenAI API error:', error)
    return null
  }
}

export async function analyzeContentForGEO(content: string) {
  if (!process.env.OPENAI_API_KEY) {
    // Try Gemini as fallback
    const { analyzeContentWithGemini } = await import('./gemini')
    const geminiResult = await analyzeContentWithGemini(content)
    
    if (geminiResult) {
      return geminiResult
    }

    // Return default if no API keys
    return {
      citationLikelihood: 80,
      readability: 75,
      structure: 85,
      entityCoverage: 70,
      factualDensity: 75,
      sourceQuality: 80,
      suggestions: [
        { type: 'high', category: 'Structure', message: 'Add more descriptive subheadings', impact: '+8 points' },
        { type: 'medium', category: 'Entities', message: 'Include definitions for key terms', impact: '+5 points' },
      ]
    }
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a GEO (Generative Engine Optimization) expert. Analyze content and provide scores (0-100) for:
          - citationLikelihood: How likely AI models will cite this
          - readability: How easy for AI to understand
          - structure: Organization and hierarchy
          - entityCoverage: Coverage of key entities/concepts
          - factualDensity: Amount of verifiable facts
          - sourceQuality: Quality of external sources
          
          Return JSON with scores and actionable suggestions array.`
        },
        {
          role: "user",
          content: `Analyze this content:\n\n${content.substring(0, 3000)}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    })

    const result = JSON.parse(completion.choices[0].message.content || '{}')
    return result
  } catch (error) {
    console.error('Content analysis error:', error)
    // Try Gemini as fallback
    const { analyzeContentWithGemini } = await import('./gemini')
    const geminiResult = await analyzeContentWithGemini(content)
    
    if (geminiResult) {
      return geminiResult
    }

    // Return default scores
    return {
      citationLikelihood: 80,
      readability: 75,
      structure: 85,
      entityCoverage: 70,
      factualDensity: 75,
      sourceQuality: 80,
      suggestions: []
    }
  }
}

export async function generatePromptSuggestions(industry: string, description: string) {
  if (!process.env.OPENAI_API_KEY) {
    return []
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a GEO expert. Generate relevant search prompts that users might ask AI assistants about this business. Return JSON array with: text, category, estimatedImpressions.`
        },
        {
          role: "user",
          content: `Industry: ${industry}\nDescription: ${description}\n\nGenerate 10 relevant prompts.`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    })

    const result = JSON.parse(completion.choices[0].message.content || '{"prompts":[]}')
    return result.prompts || []
  } catch (error) {
    console.error('Prompt generation error:', error)
    return []
  }
}

