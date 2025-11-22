import { NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function GET() {
  try {
    // Get the demo brand
    const brandResult = await query(
      `SELECT * FROM "Brand" WHERE "companyName" = $1 LIMIT 1`,
      ['Geoptimo']
    )

    if (brandResult.rows.length === 0) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
    }

    const brand = brandResult.rows[0]

    // Get latest metrics
    const metricsResult = await query(
      `SELECT * FROM "Metric" WHERE "brandId" = $1 ORDER BY date DESC LIMIT 1`,
      [brand.id]
    )

    if (metricsResult.rows.length === 0) {
      return NextResponse.json({ error: 'No metrics found' }, { status: 404 })
    }

    const latestMetrics = metricsResult.rows[0]

    // Get metrics for the last 7 days for trend chart
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const trendResult = await query(
      `SELECT date, mentions FROM "Metric" 
       WHERE "brandId" = $1 AND date >= $2 
       ORDER BY date ASC`,
      [brand.id, sevenDaysAgo]
    )

    const mentionsData = trendResult.rows.map(m => ({
      date: new Date(m.date).toLocaleDateString('en-US', { weekday: 'short' }),
      mentions: m.mentions
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
      visibilityScore: latestMetrics.visibilityScore,
      sentiment: latestMetrics.sentiment,
      topThreeVis: latestMetrics.topThreeVis,
      mentions: latestMetrics.mentions,
      avgPosition: parseFloat(latestMetrics.avgPosition),
      detectionRate: latestMetrics.detectionRate,
      domainCitations: latestMetrics.domainCitations,
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
