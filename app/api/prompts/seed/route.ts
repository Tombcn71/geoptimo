import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

// AI-generated prompts for GEO tool
const seedPrompts = [
  { 
    text: "What are the best GEO optimization tools for 2025?", 
    category: "Product Discovery",
    impressions: 2340,
  },
  { 
    text: "How to optimize content for AI search engines?", 
    category: "How-To",
    impressions: 1890,
  },
  { 
    text: "GEO vs traditional SEO: What's the difference?", 
    category: "Comparison",
    impressions: 1560,
  },
  { 
    text: "Best AI citation tracking platforms", 
    category: "Product Discovery",
    impressions: 1420,
  },
  { 
    text: "How do AI models choose which sources to cite?", 
    category: "Technical",
    impressions: 1200,
  },
  { 
    text: "GEO tools for enterprise marketing teams", 
    category: "Product Discovery",
    impressions: 980,
  },
  { 
    text: "Latest trends in generative engine optimization", 
    category: "Industry News",
    impressions: 890,
  },
  { 
    text: "How to track brand mentions in AI responses", 
    category: "How-To",
    impressions: 1650,
  },
  { 
    text: "Top GEO agencies and consultants", 
    category: "Product Discovery",
    impressions: 780,
  },
  { 
    text: "ChatGPT vs Gemini vs Perplexity: Which is best for research?", 
    category: "Comparison",
    impressions: 2100,
  }
];

export async function POST() {
  try {
    // Get any brand (first one in database)
    const brandResult = await query(
      `SELECT * FROM "Brand" ORDER BY "createdAt" ASC LIMIT 1`
    )

    if (brandResult.rows.length === 0) {
      return NextResponse.json({ 
        error: 'No brand found. Please complete onboarding first.',
        needsOnboarding: true 
      }, { status: 404 })
    }

    const brand = brandResult.rows[0]

    // Check if prompts already exist
    const existingPrompts = await query(
      `SELECT COUNT(*) as count FROM "Prompt" WHERE "brandId" = $1`,
      [brand.id]
    )

    if (parseInt(existingPrompts.rows[0].count) > 0) {
      return NextResponse.json({ 
        message: 'Prompts already seeded',
        count: existingPrompts.rows[0].count
      })
    }

    // Insert all seed prompts
    const insertedPrompts = []
    for (const prompt of seedPrompts) {
      const result = await query(
        `INSERT INTO "Prompt" 
         ("brandId", text, category, providers, "isCustom", "isSubscribed", impressions, "createdAt", "updatedAt")
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
         RETURNING *`,
        [
          brand.id,
          prompt.text,
          prompt.category,
          ['ChatGPT', 'Claude', 'Perplexity', 'Gemini'],
          false, // Not custom
          false, // Not subscribed by default
          prompt.impressions
        ]
      )
      insertedPrompts.push(result.rows[0])
    }

    return NextResponse.json({ 
      message: 'Successfully seeded prompts',
      count: insertedPrompts.length,
      prompts: insertedPrompts
    }, { status: 201 })

  } catch (error) {
    console.error('Error seeding prompts:', error)
    return NextResponse.json(
      { error: 'Failed to seed prompts' },
      { status: 500 }
    )
  }
}

