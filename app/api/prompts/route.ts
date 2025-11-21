import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const brand = await prisma.brand.findFirst({
      where: { companyName: 'Geoptimo' }
    })

    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
    }

    const prompts = await prisma.prompt.findMany({
      where: { brandId: brand.id },
      orderBy: { impressions: 'desc' },
      include: {
        runs: {
          orderBy: { runDate: 'desc' },
          take: 1,
          include: {
            details: {
              where: { mentioned: true }
            }
          }
        }
      }
    })

    // Add computed stats
    const promptsWithStats = prompts.map(prompt => {
      const latestRun = prompt.runs[0];
      const mentionCount = latestRun ? latestRun.details.length : 0;
      const avgPosition = latestRun && latestRun.details.length > 0
        ? latestRun.details.reduce((sum, d) => sum + (d.position || 0), 0) / latestRun.details.length
        : 0;

      return {
        ...prompt,
        lastRun: latestRun ? new Date(latestRun.runDate).toLocaleString() : 'Never',
        mentions: mentionCount,
        position: Math.round(avgPosition * 10) / 10,
        runs: undefined // Don't send full runs data to frontend
      };
    });

    return NextResponse.json(promptsWithStats)
  } catch (error) {
    console.error('Error fetching prompts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch prompts' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { text, category, providers, isCustom } = body

    const brand = await prisma.brand.findFirst({
      where: { companyName: 'Geoptimo' }
    })

    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 })
    }

    const prompt = await prisma.prompt.create({
      data: {
        brandId: brand.id,
        text,
        category: category || 'Custom',
        providers: providers || ['ChatGPT', 'Claude', 'Perplexity', 'Gemini'],
        isCustom: isCustom !== undefined ? isCustom : true,
        isSubscribed: true,
        impressions: 0,
      }
    })

    return NextResponse.json(prompt, { status: 201 })
  } catch (error) {
    console.error('Error creating prompt:', error)
    return NextResponse.json(
      { error: 'Failed to create prompt' },
      { status: 500 }
    )
  }
}

