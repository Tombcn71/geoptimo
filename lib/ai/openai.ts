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
            content: `Je bent een GEO (Generative Engine Optimization) expert. 

STAP 1: Bepaal eerst het CONTENT TYPE:
- Product/Service pagina (e-commerce, SaaS, diensten)
- Informatieve content (blog, gids, tutorial)
- Bedrijfspagina (over ons, contact)

STAP 2: Geef scores (0-100) aangepast aan het content type:

Voor PRODUCT/SERVICE pagina's:
- citationLikelihood: Focus op merk autoriteit, USP duidelijkheid, klantbewijzen
- readability: Helderheid van product beschrijving en voordelen
- structure: Logische product flow (probleem → oplossing → actie)
- entityCoverage: Product features, use cases, doelgroep
- factualDensity: Concrete specs, prijzen, resultaten
- sourceQuality: Reviews, testimonials, case studies

Voor INFORMATIEVE content:
- citationLikelihood: Expert autoriteit, bronvermelding
- readability: Tekst complexiteit voor breed publiek
- structure: Hiërarchie en content organisatie
- entityCoverage: Concepten, definities, terminologie
- factualDensity: Feiten, data, statistieken
- sourceQuality: Externe bronnen en referenties

STAP 3: Geef 3-5 UNIEKE, VERSCHILLENDE suggestions specifiek voor het content type.

Return ALLEEN valid JSON:
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
    {"type": "medium", "category": "Trust", "message": "Unieke tip 2", "impact": "+5"}
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

