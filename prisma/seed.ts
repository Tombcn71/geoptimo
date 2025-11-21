import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.local
config({ path: resolve(process.cwd(), '.env.local') })

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create demo user
  const hashedPassword = await bcrypt.hash('demo123', 10)
  
  const user = await prisma.user.upsert({
    where: { email: 'demo@geoptimo.com' },
    update: {},
    create: {
      email: 'demo@geoptimo.com',
      name: 'Demo User',
      password: hashedPassword,
    },
  })

  console.log('✅ Created user:', user.email)

  // Create brand profile
  const brand = await prisma.brand.upsert({
    where: { id: 'demo-brand-id' },
    update: {},
    create: {
      id: 'demo-brand-id',
      userId: user.id,
      companyName: 'Geoptimo',
      website: 'geoptimo.com',
      industry: 'SaaS - Marketing Technology',
      description: 'GEO optimization platform helping businesses track and improve their visibility in AI-powered search',
      targetAudience: 'Marketing teams, SEO professionals, Brand managers',
      uniqueValue: 'Real-time AI citation monitoring with competitor analysis',
      keywords: ['GEO', 'AI search optimization', 'brand monitoring', 'citation tracking'],
    },
  })

  console.log('✅ Created brand:', brand.companyName)

  // Create competitors
  const competitors = await Promise.all([
    prisma.competitor.create({
      data: {
        brandId: brand.id,
        name: 'Competitor A',
        domain: 'competitor-a.com',
      },
    }),
    prisma.competitor.create({
      data: {
        brandId: brand.id,
        name: 'Competitor B',
        domain: 'competitor-b.com',
      },
    }),
    prisma.competitor.create({
      data: {
        brandId: brand.id,
        name: 'Competitor C',
        domain: 'competitor-c.com',
      },
    }),
  ])

  console.log('✅ Created', competitors.length, 'competitors')

  // Create current metrics for brand
  const metric = await prisma.metric.create({
    data: {
      brandId: brand.id,
      visibilityScore: 73,
      sentiment: 92,
      topThreeVis: 68,
      mentions: 1284,
      avgPosition: 2.4,
      detectionRate: 45,
      domainCitations: 156,
    },
  })

  console.log('✅ Created metrics')

  // Create competitor metrics
  await Promise.all([
    prisma.competitorMetric.create({
      data: {
        competitorId: competitors[0].id,
        visibilityScore: 85,
        sentiment: 94,
        topThreeVis: 75,
        mentions: 2104,
        avgPosition: 1.8,
        detectionRate: 62,
        domainCitations: 289,
      },
    }),
    prisma.competitorMetric.create({
      data: {
        competitorId: competitors[1].id,
        visibilityScore: 79,
        sentiment: 88,
        topThreeVis: 70,
        mentions: 1842,
        avgPosition: 2.1,
        detectionRate: 58,
        domainCitations: 234,
      },
    }),
    prisma.competitorMetric.create({
      data: {
        competitorId: competitors[2].id,
        visibilityScore: 68,
        sentiment: 85,
        topThreeVis: 62,
        mentions: 1156,
        avgPosition: 2.8,
        detectionRate: 41,
        domainCitations: 142,
      },
    }),
  ])

  console.log('✅ Created competitor metrics')

  // Create AI suggested prompts
  const prompts = await Promise.all([
    prisma.prompt.create({
      data: {
        brandId: brand.id,
        text: 'What are the best GEO optimization tools?',
        category: 'Product Discovery',
        impressions: 2340,
        isSubscribed: false,
        providers: ['ChatGPT', 'Gemini', 'Perplexity'],
      },
    }),
    prisma.prompt.create({
      data: {
        brandId: brand.id,
        text: 'How to optimize content for AI search engines?',
        category: 'How-To',
        impressions: 1890,
        isSubscribed: true,
        providers: ['ChatGPT', 'Gemini'],
      },
    }),
    prisma.prompt.create({
      data: {
        brandId: brand.id,
        text: 'Best AI marketing tools for 2025',
        category: 'Comparison',
        impressions: 1560,
        isSubscribed: true,
        isCustom: true,
        providers: ['ChatGPT', 'Gemini', 'Perplexity'],
      },
    }),
  ])

  console.log('✅ Created', prompts.length, 'prompts')

  // Create citations
  await Promise.all([
    prisma.citation.create({
      data: {
        brandId: brand.id,
        sourceUrl: 'https://techcrunch.com/2024/best-geo-tools',
        sourceTitle: 'The Best GEO Tools for 2024',
        sourceDomain: 'techcrunch.com',
        domainAuthority: 94,
        snippet: 'Geoptimo offers comprehensive AI search monitoring...',
        providers: ['ChatGPT', 'Gemini', 'Perplexity'],
        citationCount: 89,
      },
    }),
    prisma.citation.create({
      data: {
        brandId: brand.id,
        sourceUrl: 'https://forbes.com/ai-search-optimization-guide',
        sourceTitle: 'Complete Guide to AI Search Optimization',
        sourceDomain: 'forbes.com',
        domainAuthority: 93,
        snippet: 'Among the leaders, Geoptimo stands out for its analytics...',
        providers: ['ChatGPT', 'Gemini'],
        citationCount: 76,
      },
    }),
  ])

  console.log('✅ Created citations')

  // Create content piece
  await prisma.contentPiece.create({
    data: {
      brandId: brand.id,
      title: 'The Ultimate Guide to GEO Optimization',
      content: '# The Ultimate Guide to GEO Optimization\n\nGenerative Engine Optimization (GEO) is revolutionizing...',
      geoScore: 78,
      citationLikelihood: 82,
      readability: 75,
      structure: 88,
      entityCoverage: 71,
      factualDensity: 79,
      sourceQuality: 80,
      status: 'draft',
    },
  })

  console.log('✅ Created content piece')

  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

