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

    // Ensure sequence exists and get next ID
    await query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'Brand_id_seq') THEN
          CREATE SEQUENCE "Brand_id_seq";
          -- Set sequence to start after existing max id
          PERFORM setval('"Brand_id_seq"', COALESCE((SELECT MAX(id) FROM "Brand"), 0) + 1, false);
        END IF;
      END $$;
    `)

    // Create the brand
    const brandResult = await query(
      `INSERT INTO "Brand" (id, "userId", "companyName", website, industry, description, "targetAudience", "uniqueValue", keywords, "createdAt", "updatedAt")
       VALUES (nextval('"Brand_id_seq"'), $1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
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
      // Ensure Prompt sequence exists
      await query(`
        DO $$
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'Prompt_id_seq') THEN
            CREATE SEQUENCE "Prompt_id_seq";
            PERFORM setval('"Prompt_id_seq"', COALESCE((SELECT MAX(id) FROM "Prompt"), 0) + 1, false);
          END IF;
        END $$;
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
