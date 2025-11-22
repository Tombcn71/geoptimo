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
    const competitorsResult = await query(
      `SELECT 
         c.id,
         c.name,
         c.domain,
         COUNT(cm.id) as mentions,
         AVG(CASE WHEN cm.position IS NOT NULL THEN cm.position ELSE NULL END) as "avgPosition",
         COUNT(CASE WHEN cm.position <= 3 THEN 1 END)::float / NULLIF(COUNT(cm.id), 0) * 100 as "topThreeVis",
         AVG(CASE 
           WHEN cm.sentiment = 'positive' THEN 80
           WHEN cm.sentiment = 'negative' THEN 30
           ELSE 50
         END) as sentiment
       FROM "Competitor" c
       LEFT JOIN "CompetitorMetric" cm ON cm."competitorId" = c.id
       WHERE c."brandId" = $1
       GROUP BY c.id, c.name, c.domain`,
      [brand.id]
    )

    // Format data for frontend
    const competitorsData = competitorsResult.rows.map(comp => {
      const mentions = parseInt(comp.mentions) || 0
      const avgPos = comp.avgPosition ? parseFloat(comp.avgPosition) : null
      const topThreeVis = parseFloat(comp.topThreeVis) || 0
      
      // Calculate visibility score based on mentions and position
      const visibilityScore = mentions > 0 
        ? Math.min(100, (mentions * 20) + (avgPos && avgPos <= 3 ? 30 : 0))
        : 0
      
      return {
        name: comp.name,
        domain: comp.domain || '',
        visibilityScore: Math.round(visibilityScore),
        sentiment: Math.round(parseFloat(comp.sentiment) || 50),
        topThreeVis: Math.round(topThreeVis),
        mentions: mentions,
        avgPosition: avgPos ? parseFloat(avgPos.toFixed(1)) : 0,
        detectionRate: mentions > 0 ? Math.min(100, mentions * 10) : 0,
        domainCitations: 0,
        trend: 'up' as const
      }
    })

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
