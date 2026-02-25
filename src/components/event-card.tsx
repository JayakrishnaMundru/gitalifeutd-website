import Link from 'next/link'
import Image from 'next/image'
import { isExternalUrl, resolveImageUrl } from '@/lib/images'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

type Props = {
  title: string
  slug: string
  startDateTime: Date
  location: string
  tags: string[]
  description: string
  coverImage?: string | null
}

export function EventCard(props: Props) {
  return (
    <Card className="group overflow-hidden transition hover:shadow-md">
      <Link href={`/events/${props.slug}`} className="block">
        <div className="relative aspect-[16/9] w-full bg-muted">
          {props.coverImage ? (
            isExternalUrl(props.coverImage) ? (
              // Use <img> for external sources (e.g., Google Drive) to avoid Next Image domain config issues.
              // Admin can paste a Drive "share" URL; we convert to a direct-view URL.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={resolveImageUrl(props.coverImage)}
                alt=""
                className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            ) : (
              <Image
                src={props.coverImage}
                alt=""
                fill
                className="object-cover transition duration-300 group-hover:scale-[1.02]"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-amber-200/40 to-cyan-300/30 dark:from-amber-900/20 dark:to-cyan-900/20" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <div className="line-clamp-2 text-lg font-semibold text-white">
              {props.title}
            </div>
            <div className="mt-1 text-xs text-white/80">
              {new Date(props.startDateTime).toLocaleString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              })}{' '}
              · {props.location}
            </div>
          </div>
        </div>

        <div className="space-y-3 p-4">
          <p className="text-sm text-muted-foreground line-clamp-2">{props.description}</p>
          <div className="flex flex-wrap gap-2">
            {props.tags.slice(0, 4).map((t) => (
              <Badge key={t} variant="secondary" className="rounded-full">
                {t}
              </Badge>
            ))}
          </div>
        </div>
      </Link>
    </Card>
  )
}
