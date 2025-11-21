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
  // Try OpenAI first
  if (process.env.OPENAI_API_KEY) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `Je bent een GEO (Generative Engine Optimization) expert. Analyseer content en geef scores (0-100) voor:
            - citationLikelihood: Hoe waarschijnlijk AI modellen deze content zullen citeren
            - readability: Hoe makkelijk het is voor AI om te begrijpen
            - structure: Organisatie en hiërarchie van de content
            - entityCoverage: Dekking van belangrijke concepten en termen
            - factualDensity: Hoeveelheid verifieerbare feiten
            - sourceQuality: Kwaliteit van externe bronnen
            
            Geef ook 2-4 concrete verbetersuggestions in het Nederlands.
            Return ALLEEN valid JSON met deze exacte structuur:
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
            }`
          },
          {
            role: "user",
            content: `Analyseer deze content:\n\n${content.substring(0, 4000)}`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      })

      const result = JSON.parse(completion.choices[0].message.content || '{}')
      console.log('OpenAI analysis successful:', result)
      return result
    } catch (error) {
      console.error('OpenAI error, trying Gemini:', error)
    }
  }

  // Try Gemini as second option
  if (process.env.GOOGLE_AI_API_KEY) {
    const { analyzeContentWithGemini } = await import('./gemini')
    const geminiResult = await analyzeContentWithGemini(content)
    
    if (geminiResult) {
      console.log('Gemini analysis successful')
      return geminiResult
    }
  }

  // No API keys configured
  throw new Error('Geen API keys geconfigureerd. Voeg OPENAI_API_KEY of GOOGLE_AI_API_KEY toe.')
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

