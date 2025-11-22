import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { query } from '@/lib/db'

export async function PUT(request: Request) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name } = await request.json()

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    // Update user name
    await query(
      `UPDATE "User" SET name = $1, "updatedAt" = NOW() WHERE email = $2`,
      [name.trim(), session.user.email]
    )

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    )
  }
}

