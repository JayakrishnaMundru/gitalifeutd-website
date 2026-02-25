export function isExternalUrl(url: string) {
  return /^https?:\/\//i.test(url)
}

export function resolveGoogleDriveImageUrl(url: string): string {
  // Accept formats like:
  // - https://drive.google.com/file/d/<ID>/view?usp=sharing
  // - https://drive.google.com/open?id=<ID>
  // - https://drive.google.com/uc?id=<ID>&export=download
  // Return a direct-view URL that works as an <img src>.
  try {
    const u = new URL(url)
    if (!u.hostname.includes('drive.google.com')) return url

    // /file/d/<id>/...
    const match = u.pathname.match(/\/file\/d\/([^/]+)/)
    const id = match?.[1] ?? u.searchParams.get('id')
    if (!id) return url

    // Use export=view (better for images)
    return `https://drive.google.com/uc?export=view&id=${encodeURIComponent(id)}`
  } catch {
    return url
  }
}

export function resolveImageUrl(url: string): string {
  if (!url) return url
  if (isExternalUrl(url)) {
    return resolveGoogleDriveImageUrl(url)
  }
  return url
}
