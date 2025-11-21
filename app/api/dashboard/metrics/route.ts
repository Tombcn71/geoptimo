import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get the demo brand (in production, get from auth session)
    const brand = await prisma.brand.findFirst({
      where: { companyName: 'Geoptimo' }
    })

    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
    }

    // Get latest metrics
    const latestMetrics = await prisma.metric.findFirst({
      where: { brandId: brand.id },
      orderBy: { date: 'desc' }
    })

    if (!latestMetrics) {
      return NextResponse.json({ error: 'No metrics found' }, { status: 404 })
    }

    // Get metrics for the last 7 days for trend chart
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const mentionsTrend = await prisma.metric.findMany({
      where: { 
        brandId: brand.id,
        date: { gte: sevenDaysAgo }
      },
      orderBy: { date: 'asc' },
      select: {
        date: true,
        mentions: true
      }
    })

    // Get top prompts with most mentions
    const topPrompts = await prisma.prompt.findMany({
      where: { brandId: brand.id },
      orderBy: { 
        runs: {
          _count: 'desc'
        }
      },
      take: 5,
      include: {
        runs: {
          select: {
            details: {
              where: { mentioned: true }
            }
          }
        }
      }
    })

    // Format mentions trend data
    const mentionsData = mentionsTrend.map(m => ({
      date: new Date(m.date).toLocaleDateString('en-US', { weekday: 'short' }),
      mentions: m.mentions
    }))

    // Format top queries with mention counts
    const topQueries = topPrompts.map(prompt => {
      const mentionCount = prompt.runs.reduce((sum, run) => sum + run.details.length, 0)
      return {
        query: prompt.text,
        mentions: mentionCount,
        trend: 'up' // TODO: Calculate actual trend
      }
    }).filter(q => q.mentions > 0)

    return NextResponse.json({
      ...latestMetrics,
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

