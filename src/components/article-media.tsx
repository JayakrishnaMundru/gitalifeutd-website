import Image from 'next/image'
import { isExternalUrl, resolveImageUrl } from '@/lib/images'
import { cn } from '@/lib/utils'

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('')
}

/** Author photo with a graceful initials fallback. Handles local paths and proxied external URLs. */
export function AuthorAvatar({
  name,
  picture,
  className,
}: {
  name: string
  picture?: string
  className?: string
}) {
  if (!picture) {
    return (
      <span
        className={cn(
          'inline-flex items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-cyan-600 text-sm font-semibold text-black',
          className,
        )}
        aria-hidden
      >
        {initials(name)}
      </span>
    )
  }

  const src = isExternalUrl(picture) ? resolveImageUrl(picture) : picture
  return (
    <span className={cn('relative inline-block overflow-hidden rounded-full ring-2 ring-background', className)}>
      {/* Plain img: supports local SVG/raster and proxied external URLs alike. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={name} className="h-full w-full rounded-full object-cover" loading="lazy" />
    </span>
  )
}

/** Cover image with a branded gradient fallback. */
export function CoverImage({
  src,
  alt,
  className,
  imgClassName,
}: {
  src?: string
  alt: string
  className?: string
  imgClassName?: string
}) {
  return (
    <div className={cn('relative overflow-hidden bg-muted', className)}>
      {src ? (
        isExternalUrl(src) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={resolveImageUrl(src)}
            alt={alt}
            className={cn('h-full w-full object-cover', imgClassName)}
            loading="lazy"
          />
        ) : (
          <Image src={src} alt={alt} fill className={cn('object-cover', imgClassName)} sizes="(max-width: 768px) 100vw, 800px" />
        )
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-amber-200/60 via-background to-cyan-300/40 dark:from-amber-900/30 dark:to-cyan-900/30" />
      )}
    </div>
  )
}
