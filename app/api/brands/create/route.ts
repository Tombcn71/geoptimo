import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      domain,
      favicon,
      name,
      category,
      description,
      aliases,
      selectedPrompts,
      plan
    } = body

    console.log('Creating brand:', { name, domain, category })

    // Create the brand
    const brandResult = await query(
      `INSERT INTO "Brand" ("userId", "companyName", website, industry, description, "targetAudience", "uniqueValue", keywords, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
       RETURNING *`,
      [
        'demo-user-id',
        name,
        domain,
        category,
        description,
        '',
        '',
        aliases || []
      ]
    )

    const brand = brandResult.rows[0]
    console.log('Brand created:', brand.id)

    // Create prompts
    if (selectedPrompts && selectedPrompts.length > 0) {
      for (const promptText of selectedPrompts) {
        await query(
          `INSERT INTO "Prompt" ("brandId", text, category, "isSubscribed", "isCustom", impressions, "createdAt", "updatedAt")
           VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
          [brand.id, promptText, category, true, false, 0]
        )
      }
      console.log('Created', selectedPrompts.length, 'prompts')
    }

    return NextResponse.json({ 
      success: true, 
      brandId: brand.id,
      message: 'Brand created successfully'
    })
  } catch (error) {
    console.error('Error creating brand:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create brand',
        details: (error as Error).message
      },
      { status: 500 }
    )
  }
}
