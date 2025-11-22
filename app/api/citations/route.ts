import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { query } from '@/lib/db'

export async function GET() {
  try {
    // Get authenticated user
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's brand
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

    const citationsResult = await query(
      `SELECT * FROM "Citation" WHERE "brandId" = $1 ORDER BY "citationCount" DESC`,
      [brand.id]
    )

    return NextResponse.json(citationsResult.rows)
  } catch (error) {
    console.error('Error fetching citations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch citations' },
      { status: 500 }
    )
  }
}
