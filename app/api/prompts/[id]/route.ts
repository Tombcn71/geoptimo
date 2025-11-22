import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    // Get prompt
    const promptResult = await query(
      `SELECT * FROM "Prompt" WHERE id = $1`,
      [id]
    )

    if (promptResult.rows.length === 0) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 })
    }

    const prompt = promptResult.rows[0]

    // Get all results for this prompt
    const resultsResult = await query(
      `SELECT * FROM "PromptResult" WHERE "promptId" = $1 ORDER BY "runAt" DESC`,
      [id]
    )

    const results = resultsResult.rows

    // Calculate stats
    const totalRuns = results.length
    const mentionedResults = results.filter(r => r.mentioned)
    const totalMentions = mentionedResults.length
    
    const positions = mentionedResults
      .filter(r => r.position !== null)
      .map(r => r.position)
    const avgPosition = positions.length > 0
      ? positions.reduce((sum, p) => sum + p, 0) / positions.length
      : 0

    const detectionRate = totalRuns > 0
      ? (mentionedResults.length / totalRuns) * 100
      : 0

    // Format runs for frontend (group by date and provider)
    const runsWithDetails = results.map(result => ({
      id: result.id,
      date: new Date(result.runAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date(result.runAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      provider: result.provider,
      details: [{
        mentioned: result.mentioned,
        position: result.position,
        response: result.response,
        brandName: 'Geoptimo'
      }]
    }))

    return NextResponse.json({
      id: prompt.id,
      text: prompt.text,
      category: prompt.category,
      isSubscribed: prompt.isSubscribed,
      isCustom: prompt.isCustom,
      providers: prompt.providers,
      totalRuns,
      avgPosition: Math.round(avgPosition * 10) / 10,
      detectionRate: Math.round(detectionRate * 10) / 10,
      totalMentions,
      runs: runsWithDetails
    })
  } catch (error) {
    console.error('Error fetching prompt details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch prompt details' },
      { status: 500 }
    )
  }
}
