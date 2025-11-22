import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { query } from '@/lib/db'
import bcrypt from 'bcrypt'

export async function PUT(request: Request) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Current and new password are required' }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
    }

    // Get current user
    const userResult = await query(
      `SELECT id, password FROM "User" WHERE email = $1`,
      [session.user.email]
    )

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const user = userResult.rows[0]

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password)
    if (!isValid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update password
    await query(
      `UPDATE "User" SET password = $1, "updatedAt" = NOW() WHERE email = $2`,
      [hashedPassword, session.user.email]
    )

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error changing password:', error)
    return NextResponse.json(
      { error: 'Failed to change password' },
      { status: 500 }
    )
  }
}

