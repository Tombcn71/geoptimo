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
            content: `You are a GEO (Generative Engine Optimization) expert. 

STEP 1: First determine the CONTENT TYPE:
- Product/Service page (e-commerce, SaaS, services, apps)
- Informative content (blog, guide, tutorial, article)
- Business page (about us, contact, team)

STEP 2: Give scores (0-100) adapted to the content type:

For PRODUCT/SERVICE pages:
- citationLikelihood: Focus on brand authority, USP clarity, customer proof
- readability: Clarity of product description and benefits
- structure: Logical product flow (problem → solution → action)
- entityCoverage: Product features, use cases, target audience
- factualDensity: Concrete specs, prices, results
- sourceQuality: Reviews, testimonials, case studies

For INFORMATIVE content:
- citationLikelihood: Expert authority, source citation
- readability: Text complexity for broad audience
- structure: Hierarchy and content organization
- entityCoverage: Concepts, definitions, terminology
- factualDensity: Facts, data, statistics
- sourceQuality: External sources and references

STEP 3: Give 3-5 UNIQUE, DIFFERENT suggestions specific to the content type. ALL IN ENGLISH!

Return ONLY valid JSON:
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
    {"type": "medium", "category": "Trust", "message": "Unique tip 2 in English", "impact": "+5"}
  ]
}`
          },
          {
            role: "user",
            content: `Analyze this content:\n\n${content.substring(0, 4000)}`
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
  throw new Error('No API keys configured. Add OPENAI_API_KEY or GOOGLE_AI_API_KEY.')
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

