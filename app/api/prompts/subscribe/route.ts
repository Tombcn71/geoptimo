import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { promptId, isSubscribed } = body

    // Update the subscription status
    const result = await query(
      `UPDATE "Prompt" 
       SET "isSubscribed" = $1, "updatedAt" = NOW()
       WHERE id = $2
       RETURNING *`,
      [isSubscribed, promptId]
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error updating subscription:', error)
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    )
  }
}

