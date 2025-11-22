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
      return NextResponse.json({ error: 'No brand found' }, { status: 404 })
    }

    const brand = brandResult.rows[0]

    // Get brand's latest metrics
    const brandMetricsResult = await query(
      `SELECT * FROM "Metric" WHERE "brandId" = $1 ORDER BY date DESC LIMIT 1`,
      [brand.id]
    )

    const brandMetrics = brandMetricsResult.rows[0]

    // Get competitors with aggregated metrics from all their detections
    // Note: We'll calculate metrics from the raw data we have
    const competitorsResult = await query(
      `SELECT 
         c.id,
         c.name,
         c.domain,
         COUNT(cm.id) as mentions
       FROM "Competitor" c
       LEFT JOIN "CompetitorMetric" cm ON cm."competitorId" = c.id
       WHERE c."brandId" = $1
       GROUP BY c.id, c.name, c.domain`,
      [brand.id]
    )

    // Format data for frontend with calculated metrics
    const competitorsData = await Promise.all(competitorsResult.rows.map(async (comp) => {
      const mentions = parseInt(comp.mentions) || 0
      
      // Get detailed metrics from CompetitorMetric joined with PromptResult
      const detailsResult = await query(
        `SELECT 
           cm.position,
           cm.sentiment,
           pr.mentioned,
           pr.position as prompt_position
         FROM "CompetitorMetric" cm
         LEFT JOIN "PromptResult" pr ON cm."promptResultId" = pr.id
         WHERE cm."competitorId" = $1`,
        [comp.id]
      )
      
      const details = detailsResult.rows
      
      // Calculate average position (from CompetitorMetric.position)
      const positions = details
        .map(d => d.position)
        .filter(p => p !== null && p !== undefined && p > 0)
      const avgPosition = positions.length > 0
        ? positions.reduce((a, b) => a + b, 0) / positions.length
        : 0
      
      // Calculate sentiment score
      const sentiments = details.map(d => {
        if (d.sentiment === 'positive') return 85
        if (d.sentiment === 'negative') return 25
        return 50
      })
      const avgSentiment = sentiments.length > 0
        ? sentiments.reduce((a, b) => a + b, 0) / sentiments.length
        : 50
      
      // Calculate top 3 percentage
      const topThreeCount = positions.filter(p => p <= 3).length
      const topThreeVis = mentions > 0 
        ? (topThreeCount / mentions) * 100
        : 0
      
      // Calculate visibility score (based on mentions, position, top 3)
      const visibilityScore = mentions > 0
        ? Math.min(100, 
            (mentions * 10) + // 10 points per mention
            (topThreeVis > 0 ? 30 : 0) + // 30 bonus for top 3 appearances
            (avgPosition > 0 && avgPosition <= 5 ? 20 : 0) // 20 bonus for avg top 5
          )
        : 0
      
      return {
        name: comp.name,
        domain: comp.domain || '',
        visibilityScore: Math.round(visibilityScore),
        sentiment: Math.round(avgSentiment),
        topThreeVis: Math.round(topThreeVis),
        mentions: mentions,
        avgPosition: avgPosition > 0 ? parseFloat(avgPosition.toFixed(1)) : 0,
        detectionRate: mentions > 0 ? Math.min(100, mentions * 25) : 0,
        domainCitations: 0,
        trend: 'up' as const
      }
    }))

    // Add your brand to comparison
    const yourBrand = {
      name: `Your Brand (${brand.companyName})`,
      domain: brand.website,
      visibilityScore: brandMetrics?.visibilityScore || 0,
      sentiment: brandMetrics?.sentiment || 0,
      topThreeVis: brandMetrics?.topThreeVis || 0,
      mentions: brandMetrics?.mentions || 0,
      avgPosition: brandMetrics?.avgPosition ? parseFloat(brandMetrics.avgPosition) : 0,
      detectionRate: brandMetrics?.detectionRate || 0,
      domainCitations: brandMetrics?.domainCitations || 0,
      trend: 'up' as const,
      isYou: true
    }

    // Sort by visibility score
    const allCompetitors = [...competitorsData, yourBrand].sort(
      (a, b) => b.visibilityScore - a.visibilityScore
    )

    return NextResponse.json(allCompetitors)
  } catch (error) {
    console.error('Error fetching competitors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch competitors' },
      { status: 500 }
    )
  }
}
