import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    // Validate URL
    let targetUrl: URL
    try {
      targetUrl = new URL(url)
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
    }

    // Fetch the URL server-side (no CORS issues)
    const response = await fetch(targetUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Geoptimo/1.0; +https://geoptimo.com)'
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(10000) // 10 second timeout
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Could not fetch URL (HTTP ${response.status})` },
        { status: 400 }
      )
    }

    const html = await response.text()
    
    // Extract text content (simple HTML stripping)
    const textContent = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    const title = titleMatch ? titleMatch[1].trim() : targetUrl.hostname

    if (textContent.length < 100) {
      return NextResponse.json(
        { error: 'Not enough text content found on the page' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      content: textContent.substring(0, 10000), // Limit to 10k chars
      title,
      url: targetUrl.toString()
    })

  } catch (error) {
    console.error('Fetch URL error:', error)
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Request timed out. The URL might be slow or unreachable.' },
          { status: 408 }
        )
      }
      return NextResponse.json(
        { error: `Failed to fetch URL: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch URL. Please check if the URL is accessible.' },
      { status: 500 }
    )
  }
}

