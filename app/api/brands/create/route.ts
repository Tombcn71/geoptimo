import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { query } from '@/lib/db'

export async function POST(request: Request) {
  try {
    // Get the authenticated user
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized. Please log in first.' },
        { status: 401 }
      )
    }

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

    // Get the user ID from session
    const userResult = await query(
      `SELECT id FROM "User" WHERE email = $1`,
      [session.user.email]
    )

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const userId = userResult.rows[0].id

    // Ensure sequence exists
    await query(`
      CREATE SEQUENCE IF NOT EXISTS "Brand_id_seq"
    `)

    // Create the brand
    const brandResult = await query(
      `INSERT INTO "Brand" (id, "userId", "companyName", website, industry, description, "targetAudience", "uniqueValue", keywords, "createdAt", "updatedAt")
       VALUES (nextval('"Brand_id_seq"'), $1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
       RETURNING *`,
      [
        userId,
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
      // Ensure Prompt sequence exists
      await query(`
        CREATE SEQUENCE IF NOT EXISTS "Prompt_id_seq"
      `)

      for (const promptText of selectedPrompts) {
        await query(
          `INSERT INTO "Prompt" (id, "brandId", text, category, "isSubscribed", "isCustom", impressions, "createdAt", "updatedAt")
           VALUES (nextval('"Prompt_id_seq"'), $1, $2, $3, $4, $5, $6, NOW(), NOW())`,
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
