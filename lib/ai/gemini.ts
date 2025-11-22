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
    
    // System instruction to make responses realistic and concise
    const systemInstruction = `You are a helpful AI assistant. Respond naturally and conversationally, like ChatGPT would.

IMPORTANT RULES:
- Keep responses SHORT and CONCISE (200-400 words maximum)
- Be direct and to-the-point
- Use natural, conversational language
- If listing items, keep it to 3-5 top recommendations
- Don't over-explain - give practical, useful answers
- Match the tone users expect from AI chatbots

Example good response length:
"Here are the top project management tools:

1. Asana - Great for team collaboration with visual boards
2. Trello - Simple kanban-style organization
3. Monday.com - Highly customizable workflows

Each has a free tier to get started. Asana is best for larger teams, while Trello works well for individuals and small groups."

(That's about right! Don't write essays.)`

    const contents = [
      {
        role: 'user' as const,
        parts: [
          {
            text: `${systemInstruction}\n\nUser question: ${prompt}`,
          },
        ],
      },
    ]

    const config = {
      maxOutputTokens: 500, // Limit to ~400 words
      temperature: 0.7,
    }

    const response = await ai.models.generateContent({
      model,
      contents,
      config,
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

// NEW: Detect ALL brands/competitors in AI response
export async function detectAllBrands(response: string, yourBrandName: string) {
  if (!process.env.GOOGLE_AI_API_KEY) {
    return {
      yourBrand: { mentioned: false, position: null, sentiment: 'neutral' },
      competitors: []
    }
  }

  try {
    const model = 'gemini-flash-lite-latest'
    
    const prompt = `You are a brand detection expert. Extract ALL company and product names from this AI response.

Your Brand (for reference): "${yourBrandName}"

AI Response to analyze:
"""
${response}
"""

CRITICAL INSTRUCTIONS:
1. Find EVERY brand/company/product name mentioned ANYWHERE in the text
2. Look for:
   - Company names (Asana, Trello, Monday.com, HeadshotPro)
   - Product names (Photoshop, Lightroom, Aragon AI)
   - Software/service names (even with spaces: "Aragon AI", "Topaz Photo AI")
   - Both in numbered lists AND in running text
3. EXCLUDE generic terms: "software", "tool", "photographer", "camera", "app" (without brand)
4. INCLUDE specific branded tools: "Adobe Photoshop", "Canva Pro", "Remove.bg"
5. Extract position from context (if mentioned as #1, #2, first, second, etc.)
6. Determine sentiment from surrounding text (pros/recommended = positive, cons/issues = negative)

Examples of what TO extract:
✅ "Aragon AI" (brand name)
✅ "HeadshotPro" (service name)  
✅ "Monday.com" (company)
✅ "Adobe Lightroom" (product)
✅ "Topaz Gigapixel AI" (software)

Examples of what NOT to extract:
❌ "software" (generic)
❌ "photographer" (profession)
❌ "AI" (technology)
❌ "headshot" (generic term)

Return ONLY this JSON structure (no markdown, no explanation):
{
  "yourBrand": {
    "mentioned": true/false,
    "position": number or null,
    "sentiment": "positive"/"neutral"/"negative"
  },
  "competitors": [
    {
      "name": "Exact Brand Name",
      "position": number or null,
      "sentiment": "positive"/"neutral"/"negative"
    }
  ]
}

IMPORTANT: Do NOT include "${yourBrandName}" in competitors array. Extract ALL other brands exhaustively.`

    const contents = [
      {
        role: 'user' as const,
        parts: [{ text: prompt }]
      }
    ]

    const result = await ai.models.generateContent({
      model,
      contents,
    })
    
    const analysisText = result.text?.trim()
    
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        yourBrand: parsed.yourBrand || { mentioned: false, position: null, sentiment: 'neutral' },
        competitors: Array.isArray(parsed.competitors) ? parsed.competitors.filter((c: any) => 
          c.name && c.name.toLowerCase() !== yourBrandName.toLowerCase()
        ) : []
      }
    }

    // Fallback
    return {
      yourBrand: { 
        mentioned: response.toLowerCase().includes(yourBrandName.toLowerCase()),
        position: null, 
        sentiment: 'neutral' 
      },
      competitors: []
    }
  } catch (error) {
    console.error('Error detecting brands:', error)
    
    // Fallback
    return {
      yourBrand: { 
        mentioned: response.toLowerCase().includes(yourBrandName.toLowerCase()),
        position: null, 
        sentiment: 'neutral' 
      },
      competitors: []
    }
  }
}
