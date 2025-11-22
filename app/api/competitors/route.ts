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
    
    console.log(`🔍 Fetching competitors for brand: ${brand.companyName} (ID: ${brand.id})`)

    // Get brand's latest metrics
    const brandMetricsResult = await query(
      `SELECT * FROM "Metric" WHERE "brandId" = $1 ORDER BY date DESC LIMIT 1`,
      [brand.id]
    )

    const brandMetrics = brandMetricsResult.rows[0]

    // Get ALL competitor data in ONE efficient query
    const competitorsResult = await query(
      `SELECT 
         c.id,
         c.name,
         c.domain,
         COUNT(DISTINCT cm.id) as mentions,
         AVG(CASE WHEN cm.position > 0 THEN cm.position ELSE NULL END) as avg_position,
         COUNT(CASE WHEN cm.position <= 3 AND cm.position > 0 THEN 1 END) as top_three_count,
         AVG(CASE 
           WHEN cm.sentiment = 'positive' THEN 85
           WHEN cm.sentiment = 'negative' THEN 25
           ELSE 50
         END) as avg_sentiment
       FROM "Competitor" c
       LEFT JOIN "CompetitorMetric" cm ON cm."competitorId" = c.id
       WHERE c."brandId" = $1
       GROUP BY c.id, c.name, c.domain
       ORDER BY mentions DESC`,
      [brand.id]
    )

    console.log(`🔍 Found ${competitorsResult.rows.length} competitors for brand ${brand.id}`)
    
    if (competitorsResult.rows.length === 0) {
      console.log(`⚠️  No competitors found in database for brand ${brand.id}`)
      console.log(`   Check if:`)
      console.log(`   1. You've run any prompts yet?`)
      console.log(`   2. CompetitorMetric table has data?`)
      
      // Check if Competitor table has ANY entries for this brand
      const checkResult = await query(
        `SELECT id, name FROM "Competitor" WHERE "brandId" = $1 LIMIT 5`,
        [brand.id]
      )
      console.log(`   Found ${checkResult.rows.length} raw competitors:`, checkResult.rows)
    }

    // Format data for frontend
    const competitorsData = competitorsResult.rows.map(comp => {
      const mentions = parseInt(comp.mentions) || 0
      const avgPosition = comp.avg_position ? parseFloat(comp.avg_position) : 0
      const topThreeCount = parseInt(comp.top_three_count) || 0
      const avgSentiment = comp.avg_sentiment ? parseFloat(comp.avg_sentiment) : 50
      
      // Calculate top 3 percentage
      const topThreeVis = mentions > 0 ? (topThreeCount / mentions) * 100 : 0
      
      // Calculate visibility score
      const visibilityScore = mentions > 0
        ? Math.min(100, 
            (mentions * 10) + // 10 points per mention
            (topThreeVis > 0 ? 30 : 0) + // 30 bonus for top 3 appearances
            (avgPosition > 0 && avgPosition <= 5 ? 20 : 0) // 20 bonus for avg top 5
          )
        : 0
      
      console.log(`   ✅ ${comp.name}: ${mentions} mentions, avg pos: ${avgPosition}, sentiment: ${avgSentiment}`)
      
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
