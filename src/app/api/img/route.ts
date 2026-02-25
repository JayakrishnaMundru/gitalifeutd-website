import { NextResponse } from 'next/server'
import { resolveGoogleDriveImageUrl, isExternalUrl } from '@/lib/images'

export const runtime = 'nodejs'

function isAllowedExternal(url: string) {
  try {
    const u = new URL(url)
    // Allow only Google Drive and Googleusercontent thumbnails.
    return (
      u.hostname === 'drive.google.com' ||
      u.hostname.endsWith('.googleusercontent.com') ||
      u.hostname === 'lh3.googleusercontent.com'
    )
  } catch {
    return false
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const url = searchParams.get('url')
  if (!url || !isExternalUrl(url) || !isAllowedExternal(url)) {
    return NextResponse.json({ error: 'Bad url' }, { status: 400 })
  }

  // Convert Drive share links to a direct/thumbnail link.
  const resolved = resolveGoogleDriveImageUrl(url)

  const upstream = await fetch(resolved, {
    redirect: 'follow',
    headers: {
      // Some Google endpoints behave better with an accept header.
      accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
      'user-agent': 'Mozilla/5.0 (compatible; GitaLifeBot/1.0; +https://gitalifeutd.org)',
    },
  })

  if (!upstream.ok) {
    return NextResponse.json({ error: 'Upstream failed' }, { status: 502 })
  }

  const contentType = upstream.headers.get('content-type') || 'image/jpeg'
  const buf = Buffer.from(await upstream.arrayBuffer())

  return new NextResponse(buf, {
    status: 200,
    headers: {
      'content-type': contentType,
      // Cache at the edge for a bit; Drive images rarely change.
      'cache-control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400',
    },
  })
}
