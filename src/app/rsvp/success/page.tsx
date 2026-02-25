import Link from 'next/link'
import { Sparkles, CalendarDays, MapPin, ArrowRight } from 'lucide-react'
import { PageHero } from '@/components/page-hero'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

export default async function RsvpSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{
    name?: string
    id?: string
    slug?: string
    title?: string
    when?: string
    where?: string
  }>
}) {
  const sp = await searchParams
  const name = sp.name || 'friend'
  const title = sp.title || 'the event'
  const when = sp.when ? new Date(sp.when) : null
  const where = sp.where || ''
  const slug = sp.slug || ''

  return (
    <div className="space-y-8">
      <PageHero
        title="You’re in!"
        subtitle={`We’re excited to see you there, ${name} ✨`}
        ctaLabel={slug ? 'Back to event' : 'See events'}
        ctaHref={slug ? `/events/${slug}` : '/events'}
      />

      <Celebration />

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg">Your RSVP</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="font-semibold text-foreground">{title}</div>
            {when ? (
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                {when.toLocaleString(undefined, {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </div>
            ) : null}
            {where ? (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {where}
              </div>
            ) : null}
            <div className="text-xs">Confirmation ID: {sp.id || '—'}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Make it memorable</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Bring a friend, come a few minutes early, and say hi to the organizers. If you’re new, you’re exactly who this is for.
            </p>
            <div className="flex flex-wrap gap-3">
              {slug ? (
                <Button asChild variant="outline" className="rounded-full">
                  <a href={`/api/events/${slug}/ics`}>Add to calendar (ICS)</a>
                </Button>
              ) : null}
              <Button asChild className="rounded-full bg-gradient-to-r from-amber-400 to-cyan-600 text-black hover:opacity-90">
                <Link href="/events">
                  Explore more events <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/resources">Beginner resources</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Celebration() {
  // lightweight CSS confetti-ish animation using gradients (no canvas dependency)
  return (
    <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-amber-100/70 via-background to-cyan-100/60 p-6 dark:from-amber-900/25 dark:via-background dark:to-cyan-900/25">
      <div className="absolute inset-0 opacity-70">
        <div className="absolute -left-10 top-6 h-24 w-24 rounded-full bg-amber-400/25 blur-2xl" />
        <div className="absolute right-10 top-10 h-28 w-28 rounded-full bg-cyan-600/20 blur-2xl" />
        <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      <div className="relative flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-r from-amber-400 to-cyan-600 text-black">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <div className="font-semibold">RSVP confirmed</div>
          <div className="text-sm text-muted-foreground">
            Your spot is saved. We can’t wait to meet you.
          </div>
        </div>
      </div>

      {/* floating dots */}
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            className="absolute h-2 w-2 animate-[float_3.5s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-amber-400/70 to-cyan-600/70"
            style={{
              left: `${(i * 7) % 95}%`,
              top: `${(i * 13) % 70}%`,
              animationDelay: `${i * 120}ms`,
              opacity: 0.35,
            }}
          />
        ))}
      </div>
    </div>
  )
}
