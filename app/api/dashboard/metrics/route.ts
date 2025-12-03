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
      return NextResponse.json({ error: 'No brand found. Please complete onboarding.' }, { status: 404 })
    }

    const brand = brandResult.rows[0]

    // Calculate metrics from PromptResults
    const statsResult = await query(
      `SELECT 
        COUNT(DISTINCT pr.id) as total_runs,
        COUNT(DISTINCT CASE WHEN pr.mentioned = true THEN pr.id END) as total_mentions,
        COUNT(DISTINCT CASE WHEN pr.mentioned = true AND pr.position <= 3 THEN pr.id END) as top_three_mentions,
        AVG(CASE WHEN pr.mentioned = true THEN pr.position END) as avg_position,
        AVG(CASE WHEN pr.sentiment = 'positive' THEN 100 
                 WHEN pr.sentiment = 'neutral' THEN 50 
                 WHEN pr.sentiment = 'negative' THEN 0 
                 END) as avg_sentiment
       FROM "PromptResult" pr
       JOIN "Prompt" p ON pr."promptId" = p.id
       WHERE p."brandId" = $1`,
      [brand.id]
    )

    const stats = statsResult.rows[0]
    const totalRuns = parseInt(stats.total_runs) || 0
    const totalMentions = parseInt(stats.total_mentions) || 0
    const topThreeMentions = parseInt(stats.top_three_mentions) || 0

    // Calculate percentages
    const visibilityScore = totalRuns > 0 ? Math.round((totalMentions / totalRuns) * 100) : 0
    const topThreeVis = totalMentions > 0 ? Math.round((topThreeMentions / totalMentions) * 100) : 0
    const detectionRate = totalRuns > 0 ? Math.round((totalMentions / totalRuns) * 100) : 0
    const avgPosition = stats.avg_position ? parseFloat(parseFloat(stats.avg_position).toFixed(1)) : 0
    const sentiment = stats.avg_sentiment ? Math.round(parseFloat(stats.avg_sentiment)) : 0

    // Get mentions trend for last 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const trendResult = await query(
      `SELECT 
        DATE(pr."runAt") as date,
        COUNT(CASE WHEN pr.mentioned = true THEN 1 END) as mentions
       FROM "PromptResult" pr
       JOIN "Prompt" p ON pr."promptId" = p.id
       WHERE p."brandId" = $1 AND pr."runAt" >= $2
       GROUP BY DATE(pr."runAt")
       ORDER BY date ASC`,
      [brand.id, sevenDaysAgo]
    )

    const mentionsData = trendResult.rows.map(m => ({
      date: new Date(m.date).toLocaleDateString('nl-NL', { weekday: 'short' }),
      mentions: parseInt(m.mentions)
    }))

    // Get top prompts with most mentions
    const topPromptsResult = await query(
      `SELECT p.id, p.text, COUNT(pr.id) as mention_count 
       FROM "Prompt" p
       LEFT JOIN "PromptResult" pr ON p.id = pr."promptId" AND pr.mentioned = true
       WHERE p."brandId" = $1
       GROUP BY p.id, p.text
       ORDER BY mention_count DESC
       LIMIT 5`,
      [brand.id]
    )

    const topQueries = topPromptsResult.rows
      .filter(p => parseInt(p.mention_count) > 0)
      .map(p => ({
        query: p.text,
        mentions: parseInt(p.mention_count),
        trend: 'up'
      }))

    return NextResponse.json({
      visibilityScore,
      sentiment,
      topThreeVis,
      mentions: totalMentions,
      avgPosition,
      detectionRate,
      domainCitations: 0, // TODO: Calculate from actual citations
      mentionsData,
      topQueries
    })
  } catch (error) {
    console.error('Error fetching metrics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    )
  }
}
