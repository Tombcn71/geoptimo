import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { query } from '@/lib/db'

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const params = await context.params
    const promptId = params.id

    // First check if the prompt belongs to the user's brand
    const checkResult = await query(
      `SELECT p.id FROM "Prompt" p
       JOIN "Brand" b ON p."brandId" = b.id
       JOIN "User" u ON b."userId" = u.id
       WHERE p.id = $1 AND u.email = $2`,
      [promptId, session.user.email]
    )

    if (checkResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Prompt not found or unauthorized' },
        { status: 404 }
      )
    }

    // Delete all related prompt results first
    await query(
      `DELETE FROM "PromptResult" WHERE "promptId" = $1`,
      [promptId]
    )

    // Delete the prompt
    await query(
      `DELETE FROM "Prompt" WHERE id = $1`,
      [promptId]
    )

    return NextResponse.json({ 
      success: true,
      message: 'Prompt deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting prompt:', error)
    return NextResponse.json(
      { error: 'Failed to delete prompt' },
      { status: 500 }
    )
  }
}

