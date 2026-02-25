export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'
import { RSVPForm } from '@/components/rsvp-form'
import { siteConfig } from '@/content/site'

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const event = await prisma.event.findUnique({ where: { slug } })
  if (!event || !event.published) return notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    startDate: event.startDateTime.toISOString(),
    endDate: event.endDateTime.toISOString(),
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: event.location,
    },
    organizer: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    description: event.description,
    url: `${siteConfig.url}/events/${event.slug}`,
  }

  return (
    <div className="space-y-10">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: json-ld
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="space-y-3">
        <Link href="/events" className="text-sm text-muted-foreground hover:text-foreground">
          ← Back to events
        </Link>
        <h1 className="text-3xl font-bold">{event.title}</h1>
        <div className="text-muted-foreground">
          {new Date(event.startDateTime).toLocaleString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
          })}
          {' – '}
          {new Date(event.endDateTime).toLocaleTimeString(undefined, {
            hour: 'numeric',
            minute: '2-digit',
          })}
          {' · '}
          {event.location}
        </div>
        <div className="flex flex-wrap gap-2">
          {event.tags.map((t: string) => (
            <Badge key={t} variant="secondary">
              {t}
            </Badge>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 pt-2">
          <Button asChild variant="outline" className="rounded-full">
            <a href={`/api/events/${event.slug}/ics`}>Add to calendar (ICS)</a>
          </Button>
          <Button asChild className="rounded-full bg-gradient-to-r from-amber-400 to-cyan-600 text-black hover:opacity-90">
            <a href="#rsvp">RSVP</a>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About this event</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{event.description}</p>
          {event.speakerName && (
            <div>
              <div className="font-semibold">Speaker: {event.speakerName}</div>
              {event.speakerBio && <p className="mt-1 text-sm text-muted-foreground">{event.speakerBio}</p>}
            </div>
          )}
          {event.agenda && (
            <div>
              <div className="font-semibold">Agenda</div>
              <pre className="mt-2 whitespace-pre-wrap rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground">
                {event.agenda}
              </pre>
            </div>
          )}
          {event.faq && (
            <div>
              <div className="font-semibold">FAQ</div>
              <pre className="mt-2 whitespace-pre-wrap rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground">
                {event.faq}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      <div id="rsvp" className="scroll-mt-24">
        <Card>
          <CardHeader>
            <CardTitle>RSVP</CardTitle>
          </CardHeader>
          <CardContent>
            <RSVPForm eventId={event.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
