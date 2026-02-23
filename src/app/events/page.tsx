import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; when?: 'upcoming' | 'past' }>
}) {
  const sp = await searchParams
  const when = sp.when ?? 'upcoming'
  const tag = sp.tag

  const now = new Date()
  const where =
    when === 'past'
      ? { startDateTime: { lt: now } }
      : { startDateTime: { gte: now } }

  const events = await prisma.event.findMany({
    where: {
      ...where,
      ...(tag ? { tags: { has: tag } } : {}),
    },
    orderBy: { startDateTime: when === 'past' ? 'desc' : 'asc' },
  })

  const allTags = Array.from(
    new Set(
      (
        await prisma.event.findMany({
          select: { tags: true },
        })
      ).flatMap((e) => e.tags)
    )
  ).sort()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Events</h1>
        <p className="mt-2 text-muted-foreground">
          Join a discussion, a mantra meditation night, a workshop, or a service event.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href={`/events?when=upcoming${tag ? `&tag=${encodeURIComponent(tag)}` : ''}`}
          className={`rounded-full border px-3 py-1 text-sm ${when === 'upcoming' ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Upcoming
        </Link>
        <Link
          href={`/events?when=past${tag ? `&tag=${encodeURIComponent(tag)}` : ''}`}
          className={`rounded-full border px-3 py-1 text-sm ${when === 'past' ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Past
        </Link>
        <span className="mx-2 h-6 w-px bg-border" />
        <Link
          href={`/events?when=${when}`}
          className={`rounded-full border px-3 py-1 text-sm ${!tag ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'}`}
        >
          All tags
        </Link>
        {allTags.map((t) => (
          <Link
            key={t}
            href={`/events?when=${when}&tag=${encodeURIComponent(t)}`}
            className={`rounded-full border px-3 py-1 text-sm ${tag === t ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {t}
          </Link>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {events.map((e) => (
          <Card key={e.id} className="transition hover:shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">
                <Link href={`/events/${e.slug}`} className="hover:underline">
                  {e.title}
                </Link>
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                {new Date(e.startDateTime).toLocaleString(undefined, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
                {' · '}
                {e.location}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-3">{e.description}</p>
              <div className="flex flex-wrap gap-2">
                {e.tags.map((t) => (
                  <Badge key={t} variant="secondary">
                    {t}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {events.length === 0 && (
        <p className="text-sm text-muted-foreground">No events found for this filter.</p>
      )}
    </div>
  )
}
