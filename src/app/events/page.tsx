export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { EventCard } from '@/components/event-card'
import { PageHero } from '@/components/page-hero'
import { siteConfig } from '@/content/site'

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
      published: true,
      ...(tag ? { tags: { has: tag } } : {}),
    },
    orderBy: { startDateTime: when === 'past' ? 'desc' : 'asc' },
  })

  const tagRows = (await prisma.event.findMany({
    select: { tags: true },
  })) as Array<{ tags: string[] }>

  const allTags = Array.from(new Set(tagRows.flatMap((e) => e.tags))).sort()

  return (
    <div className="space-y-8">
      <PageHero
        title="Events"
        subtitle="Join a discussion, a mantra meditation night, a workshop, or a service event. Beginner-friendly—bring a friend."
        ctaLabel="Follow @gitalifeutd"
        ctaHref={siteConfig.socials.instagram}
      />

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
        {events.map((e: (typeof events)[number]) => (
          <EventCard
            key={e.id}
            title={e.title}
            slug={e.slug}
            startDateTime={e.startDateTime}
            location={e.location}
            tags={e.tags}
            description={e.description}
            coverImage={e.coverImage}
          />
        ))}
      </div>

      {events.length === 0 && (
        <p className="text-sm text-muted-foreground">No events found for this filter.</p>
      )}
    </div>
  )
}
