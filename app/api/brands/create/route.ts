import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      domain,
      favicon,
      name,
      category,
      description,
      aliases,
      selectedPrompts,
      plan
    } = body

    console.log('Creating brand:', { name, domain, category })

    // Create the brand
    const brand = await prisma.brand.create({
      data: {
        userId: 'demo-user-id', // TODO: Replace with actual user ID from auth
        companyName: name,
        domain,
        industry: category,
        description,
        targetAudience: '',
        uniqueValue: '',
        keywords: [],
      },
    })

    console.log('Brand created:', brand.id)

    // Create aliases if any
    if (aliases && aliases.length > 0) {
      // Store aliases in the brand's keywords for now
      await prisma.brand.update({
        where: { id: brand.id },
        data: {
          keywords: aliases,
        },
      })
    }

    // Create prompts
    if (selectedPrompts && selectedPrompts.length > 0) {
      await Promise.all(
        selectedPrompts.map((promptText: string) =>
          prisma.prompt.create({
            data: {
              brandId: brand.id,
              text: promptText,
              category: category,
              frequency: 'weekly',
              isActive: true,
            },
          })
        )
      )
    }

    console.log('Created', selectedPrompts?.length || 0, 'prompts')

    // TODO: Create subscription record based on plan

    return NextResponse.json({ 
      success: true, 
      brandId: brand.id,
      message: 'Brand created successfully'
    })
  } catch (error) {
    console.error('Error creating brand:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create brand',
        details: (error as Error).message
      },
      { status: 500 }
    )
  }
}

