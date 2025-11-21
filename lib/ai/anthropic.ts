import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

export async function runPromptOnClaude(prompt: string) {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('Anthropic API key not configured')
    return null
  }

  try {
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
    })

    const content = message.content[0]
    const response = content.type === 'text' ? content.text : ''

    return {
      response,
      provider: 'Claude',
      mentioned: false, // Will be analyzed
      position: null,
      sentiment: null,
    }
  } catch (error) {
    console.error('Anthropic API error:', error)
    return null
  }
}

export async function analyzeBrandMention(response: string, brandName: string) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      mentioned: response.toLowerCase().includes(brandName.toLowerCase()),
      position: null,
      sentiment: 'neutral'
    }
  }

  try {
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: `Analyze this AI response for mentions of "${brandName}":

${response}

Return JSON with:
- mentioned (boolean)
- position (number, 1-10, or null if not mentioned)
- sentiment (positive/neutral/negative)
- snippet (the part mentioning the brand, or null)`
        }
      ],
    })

    const content = message.content[0]
    const analysisText = content.type === 'text' ? content.text : '{}'
    
    // Try to parse JSON from the response
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }

    return {
      mentioned: false,
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

