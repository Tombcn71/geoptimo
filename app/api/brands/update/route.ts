import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { query } from '@/lib/db'

export async function PUT(request: Request) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      companyName,
      website,
      industry,
      description,
      targetAudience,
      uniqueValue,
      keywords
    } = body

    // Get user's brand
    const brandResult = await query(
      `SELECT b.id FROM "Brand" b
       JOIN "User" u ON b."userId" = u.id
       WHERE u.email = $1
       ORDER BY b."createdAt" DESC
       LIMIT 1`,
      [session.user.email]
    )

    if (brandResult.rows.length === 0) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
    }

    const brandId = brandResult.rows[0].id

    // Update brand
    const updateResult = await query(
      `UPDATE "Brand" 
       SET "companyName" = $1,
           website = $2,
           industry = $3,
           description = $4,
           "targetAudience" = $5,
           "uniqueValue" = $6,
           keywords = $7,
           "updatedAt" = NOW()
       WHERE id = $8
       RETURNING *`,
      [
        companyName,
        website,
        industry,
        description,
        targetAudience || '',
        uniqueValue || '',
        keywords || [],
        brandId
      ]
    )

    return NextResponse.json({
      success: true,
      brand: updateResult.rows[0]
    })

  } catch (error) {
    console.error('Error updating brand:', error)
    return NextResponse.json(
      { error: 'Failed to update brand' },
      { status: 500 }
    )
  }
}

