import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { query } from '@/lib/db'

export async function GET() {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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
      return NextResponse.json({ activities: [] })
    }

    const brandId = brandResult.rows[0].id

    // Get recent prompt results
    const activitiesResult = await query(
      `SELECT 
        pr.id,
        pr."runAt",
        pr.provider,
        pr.mentioned,
        pr.position,
        pr.sentiment,
        p.id as "promptId",
        p.text as "promptText"
       FROM "PromptResult" pr
       JOIN "Prompt" p ON pr."promptId" = p.id
       WHERE p."brandId" = $1
       ORDER BY pr."runAt" DESC
       LIMIT 10`,
      [brandId]
    )

    const activities = activitiesResult.rows.map(row => ({
      id: row.id,
      runAt: row.runAt,
      provider: row.provider,
      mentioned: row.mentioned,
      position: row.position,
      sentiment: row.sentiment,
      promptId: row.promptId,
      promptText: row.promptText
    }))

    return NextResponse.json({ activities })

  } catch (error) {
    console.error('Error fetching activities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    )
  }
}

