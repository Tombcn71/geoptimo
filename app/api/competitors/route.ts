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

    // Get brand's latest metrics
    const brandMetricsResult = await query(
      `SELECT * FROM "Metric" WHERE "brandId" = $1 ORDER BY date DESC LIMIT 1`,
      [brand.id]
    )

    const brandMetrics = brandMetricsResult.rows[0]

    // Get competitors with their latest metrics
    const competitorsResult = await query(
      `SELECT c.*, cm."visibilityScore", cm.sentiment, cm."topThreeVis", 
              cm.mentions, cm."avgPosition", cm."detectionRate", cm."domainCitations"
       FROM "Competitor" c
       LEFT JOIN LATERAL (
         SELECT * FROM "CompetitorMetric" 
         WHERE "competitorId" = c.id 
         ORDER BY date DESC LIMIT 1
       ) cm ON true
       WHERE c."brandId" = $1`,
      [brand.id]
    )

    // Format data for frontend
    const competitorsData = competitorsResult.rows.map(comp => ({
      name: comp.name,
      domain: comp.domain,
      visibilityScore: comp.visibilityScore || 0,
      sentiment: comp.sentiment || 0,
      topThreeVis: comp.topThreeVis || 0,
      mentions: comp.mentions || 0,
      avgPosition: comp.avgPosition ? parseFloat(comp.avgPosition) : 0,
      detectionRate: comp.detectionRate || 0,
      domainCitations: comp.domainCitations || 0,
      trend: 'up' as const
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
