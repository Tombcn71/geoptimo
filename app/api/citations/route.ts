import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    const brandResult = await query(
      `SELECT * FROM "Brand" WHERE "companyName" = $1 LIMIT 1`,
      ['Geoptimo']
    )

    if (brandResult.rows.length === 0) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
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
