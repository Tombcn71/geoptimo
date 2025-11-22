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

    const promptsResult = await query(
      `SELECT * FROM "Prompt" WHERE "brandId" = $1 ORDER BY impressions DESC`,
      [brand.id]
    )

    // Add computed stats for each prompt
    const promptsWithStats = await Promise.all(
      promptsResult.rows.map(async (prompt) => {
        // Get latest run
        const latestRunResult = await query(
          `SELECT * FROM "PromptResult" 
           WHERE "promptId" = $1 
           ORDER BY "runAt" DESC 
           LIMIT 1`,
          [prompt.id]
        )

        // Get mention count
        const mentionCountResult = await query(
          `SELECT COUNT(*) as count FROM "PromptResult" 
           WHERE "promptId" = $1 AND mentioned = true`,
          [prompt.id]
        )

        // Get average position
        const avgPosResult = await query(
          `SELECT AVG(position) as avg_pos FROM "PromptResult" 
           WHERE "promptId" = $1 AND mentioned = true AND position IS NOT NULL`,
          [prompt.id]
        )

        const latestRun = latestRunResult.rows[0]
        const mentionCount = parseInt(mentionCountResult.rows[0].count)
        const avgPosition = avgPosResult.rows[0].avg_pos ? parseFloat(avgPosResult.rows[0].avg_pos) : 0

        return {
          id: prompt.id,
          text: prompt.text,
          category: prompt.category,
          isSubscribed: prompt.isSubscribed,
          isCustom: prompt.isCustom,
          providers: prompt.providers,
          impressions: prompt.impressions,
          lastRun: latestRun ? new Date(latestRun.runAt).toLocaleString() : 'Never',
          mentions: mentionCount,
          position: Math.round(avgPosition * 10) / 10
        }
      })
    )

    return NextResponse.json(promptsWithStats)
  } catch (error) {
    console.error('Error fetching prompts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch prompts' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { text, category, providers, isCustom } = body

    const brandResult = await query(
      `SELECT * FROM "Brand" WHERE "companyName" = $1 LIMIT 1`,
      ['Geoptimo']
    )

    if (brandResult.rows.length === 0) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
    }

    const brand = brandResult.rows[0]

    const promptResult = await query(
      `INSERT INTO "Prompt" ("brandId", text, category, providers, "isCustom", "isSubscribed", impressions, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
       RETURNING *`,
      [
        brand.id,
        text,
        category || 'Custom',
        providers || ['ChatGPT', 'Claude', 'Perplexity', 'Gemini'],
        isCustom !== undefined ? isCustom : true,
        true,
        0
      ]
    )

    return NextResponse.json(promptResult.rows[0], { status: 201 })
  } catch (error) {
    console.error('Error creating prompt:', error)
    return NextResponse.json(
      { error: 'Failed to create prompt' },
      { status: 500 }
    )
  }
}
