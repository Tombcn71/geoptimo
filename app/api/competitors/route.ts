import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const brand = await prisma.brand.findFirst({
      where: { companyName: 'Geoptimo' },
      include: {
        metrics: {
          orderBy: { date: 'desc' },
          take: 1
        }
      }
    })

    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
    }

    const competitors = await prisma.competitor.findMany({
      where: { brandId: brand.id },
      include: {
        metrics: {
          orderBy: { date: 'desc' },
          take: 1
        }
      }
    })

    // Format data for frontend
    const competitorsData = competitors.map(comp => ({
      name: comp.name,
      domain: comp.domain,
      visibilityScore: comp.metrics[0]?.visibilityScore || 0,
      sentiment: comp.metrics[0]?.sentiment || 0,
      topThreeVis: comp.metrics[0]?.topThreeVis || 0,
      mentions: comp.metrics[0]?.mentions || 0,
      avgPosition: comp.metrics[0]?.avgPosition || 0,
      detectionRate: comp.metrics[0]?.detectionRate || 0,
      domainCitations: comp.metrics[0]?.domainCitations || 0,
      trend: 'up' as const
    }))

    // Add your brand to comparison
    const yourBrand = {
      name: `Your Brand (${brand.companyName})`,
      domain: brand.website,
      visibilityScore: brand.metrics[0]?.visibilityScore || 0,
      sentiment: brand.metrics[0]?.sentiment || 0,
      topThreeVis: brand.metrics[0]?.topThreeVis || 0,
      mentions: brand.metrics[0]?.mentions || 0,
      avgPosition: brand.metrics[0]?.avgPosition || 0,
      detectionRate: brand.metrics[0]?.detectionRate || 0,
      domainCitations: brand.metrics[0]?.domainCitations || 0,
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

