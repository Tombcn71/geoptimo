import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const promptId = parseInt(id)

    // Get prompt with runs and details
    const prompt = await prisma.prompt.findUnique({
      where: { id: promptId },
      include: {
        runs: {
          orderBy: { runDate: 'desc' },
          include: {
            details: true
          }
        }
      }
    })

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 })
    }

    // Calculate stats
    const totalRuns = prompt.runs.length
    const mentionedRuns = prompt.runs.filter(run => 
      run.details.some(d => d.mentioned)
    )
    const totalMentions = mentionedRuns.reduce((sum, run) => 
      sum + run.details.filter(d => d.mentioned).length, 0
    )
    
    const positions = mentionedRuns.flatMap(run =>
      run.details.filter(d => d.mentioned && d.position).map(d => d.position!)
    )
    const avgPosition = positions.length > 0
      ? positions.reduce((sum, p) => sum + p, 0) / positions.length
      : 0

    const detectionRate = totalRuns > 0
      ? (mentionedRuns.length / totalRuns) * 100
      : 0

    // Format runs for frontend
    const runsWithDetails = prompt.runs.map(run => ({
      id: run.id,
      date: new Date(run.runDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date(run.runDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      provider: run.provider,
      details: run.details.map(detail => ({
        mentioned: detail.mentioned,
        position: detail.position,
        response: detail.responseText,
        brandName: detail.brandName || 'Geoptimo'
      }))
    }))

    return NextResponse.json({
      ...prompt,
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

