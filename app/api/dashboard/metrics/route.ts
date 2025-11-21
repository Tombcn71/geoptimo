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
    const metrics = await prisma.metric.findFirst({
      where: { brandId: brand.id },
      orderBy: { date: 'desc' }
    })

    if (!metrics) {
      return NextResponse.json({ error: 'No metrics found' }, { status: 404 })
    }

    return NextResponse.json(metrics)
  } catch (error) {
    console.error('Error fetching metrics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    )
  }
}

