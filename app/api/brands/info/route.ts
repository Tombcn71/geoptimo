import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { query } from '@/lib/db'

export async function GET() {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's brand info
    const brandResult = await query(
      `SELECT b.* FROM "Brand" b
       JOIN "User" u ON b."userId" = u.id
       WHERE u.email = $1
       ORDER BY b."createdAt" DESC
       LIMIT 1`,
      [session.user.email]
    )

    if (brandResult.rows.length === 0) {
      return NextResponse.json({ error: 'No brand found' }, { status: 404 })
    }

    const brand = brandResult.rows[0]

    return NextResponse.json({
      companyName: brand.companyName,
      website: brand.website,
      industry: brand.industry,
      description: brand.description,
      targetAudience: brand.targetAudience,
      keywords: brand.keywords
    })
  } catch (error) {
    console.error('Error fetching brand info:', error)
    return NextResponse.json(
      { error: 'Failed to fetch brand info' },
      { status: 500 }
    )
  }
}

