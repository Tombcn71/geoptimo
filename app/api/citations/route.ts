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

    const citations = await prisma.citation.findMany({
      where: { brandId: brand.id },
      orderBy: { citationCount: 'desc' }
    })

    return NextResponse.json(citations)
  } catch (error) {
    console.error('Error fetching citations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch citations' },
      { status: 500 }
    )
  }
}

