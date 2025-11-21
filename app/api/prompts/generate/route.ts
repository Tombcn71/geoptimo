import { NextResponse } from 'next/server'
import { generatePromptSuggestions } from '@/lib/ai/openai'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { category, description } = body

    console.log('🤖 Generating prompt suggestions for:', { category, description: description.substring(0, 50) })

    if (!category || !description) {
      return NextResponse.json(
        { error: 'Category and description are required' },
        { status: 400 }
      )
    }

    // Check if AI key is configured
    if (!process.env.OPENAI_API_KEY && !process.env.GOOGLE_AI_API_KEY) {
      console.log('⚠️ No AI keys configured, using fallback prompts')
      return NextResponse.json(getFallbackPrompts(category))
    }

    // Generate prompts using AI
    try {
      const prompts = await generatePromptSuggestions(category, description)
      
      if (prompts && prompts.length > 0) {
        console.log('✅ Generated', prompts.length, 'AI prompts')
        return NextResponse.json(prompts)
      }
    } catch (aiError) {
      console.error('AI generation failed, using fallback:', aiError)
    }

    // Fallback if AI fails
    return NextResponse.json(getFallbackPrompts(category))
  } catch (error) {
    console.error('Error generating prompts:', error)
    return NextResponse.json(
      { error: 'Failed to generate prompts' },
      { status: 500 }
    )
  }
}

function getFallbackPrompts(category: string) {
  const templates: Record<string, any[]> = {
    SaaS: [
      {
        text: "What are some simple SaaS tools I can try to see if they fit my workflow?",
        category,
        estimatedImpressions: 4200
      },
      {
        text: "Can you suggest easy-to-use apps for experimenting with new software features?",
        category,
        estimatedImpressions: 3800
      },
      {
        text: "I want to test out SaaS platforms before committing long term. Which ones have good trial options?",
        category,
        estimatedImpressions: 3500
      },
      {
        text: "Looking for SaaS tools that help me evaluate if they're helpful for my work without heavy setup.",
        category,
        estimatedImpressions: 3200
      },
      {
        text: "Are there any SaaS apps designed to help users assess their usefulness quickly?",
        category,
        estimatedImpressions: 2900
      },
      {
        text: "What SaaS solutions offer a straightforward way to test if they fit my needs?",
        category,
        estimatedImpressions: 2700
      },
      {
        text: "Can you recommend software tools that let me experiment with their features before buying?",
        category,
        estimatedImpressions: 2500
      },
      {
        text: "I want to try a SaaS app that helps me decide if it's worth using regularly. Any suggestions?",
        category,
        estimatedImpressions: 2200
      },
      {
        text: "Which SaaS platforms provide a sandbox or test environment for users to explore features?",
        category,
        estimatedImpressions: 2000
      },
      {
        text: "Help me find SaaS apps that make it easy to check if they're helpful without a big commitment.",
        category,
        estimatedImpressions: 1800
      },
    ],
    "E-commerce": [
      {
        text: "What are the best e-commerce platforms for small businesses?",
        category,
        estimatedImpressions: 5200
      },
      {
        text: "Can you recommend online stores with fast shipping?",
        category,
        estimatedImpressions: 4800
      },
      {
        text: "Which e-commerce sites have the best return policies?",
        category,
        estimatedImpressions: 4200
      },
      {
        text: "I'm looking for affordable e-commerce solutions for startups",
        category,
        estimatedImpressions: 3900
      },
      {
        text: "What are some user-friendly e-commerce platforms?",
        category,
        estimatedImpressions: 3600
      },
      {
        text: "Which online shopping platforms offer the best customer service?",
        category,
        estimatedImpressions: 3300
      },
      {
        text: "Can you suggest e-commerce tools for inventory management?",
        category,
        estimatedImpressions: 3000
      },
      {
        text: "What are the most secure e-commerce payment processors?",
        category,
        estimatedImpressions: 2800
      },
      {
        text: "Which e-commerce platforms integrate well with social media?",
        category,
        estimatedImpressions: 2500
      },
      {
        text: "I need an e-commerce solution with good analytics features",
        category,
        estimatedImpressions: 2200
      },
    ],
    "Food Delivery": [
      {
        text: "What are the fastest food delivery services in my area?",
        category,
        estimatedImpressions: 6200
      },
      {
        text: "Which food delivery app has the best restaurant selection?",
        category,
        estimatedImpressions: 5500
      },
      {
        text: "Can you recommend healthy meal delivery options?",
        category,
        estimatedImpressions: 4900
      },
      {
        text: "What food delivery services offer the best deals and discounts?",
        category,
        estimatedImpressions: 4500
      },
      {
        text: "Which delivery platform has the most reliable service?",
        category,
        estimatedImpressions: 4100
      },
      {
        text: "Are there any food delivery apps with low delivery fees?",
        category,
        estimatedImpressions: 3800
      },
      {
        text: "What are the best grocery delivery services?",
        category,
        estimatedImpressions: 3500
      },
      {
        text: "Which food delivery service has the best customer support?",
        category,
        estimatedImpressions: 3200
      },
      {
        text: "Can you suggest meal kit delivery options?",
        category,
        estimatedImpressions: 2900
      },
      {
        text: "What are the top-rated food delivery apps?",
        category,
        estimatedImpressions: 2600
      },
    ],
  }

  // Default to SaaS prompts if category not found
  const prompts = templates[category] || templates["SaaS"]
  return prompts.slice(0, 10)
}

