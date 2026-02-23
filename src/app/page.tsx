export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { ArrowRight, CalendarDays, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { siteConfig, testimonials, programs, faqs } from '@/content/site'
import { prisma } from '@/lib/prisma'

export default async function HomePage() {
  const upcoming = await prisma.event.findMany({
    where: { startDateTime: { gte: new Date() } },
    orderBy: { startDateTime: 'asc' },
    take: 3,
  })

  return (
    <div className="space-y-16">
      <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-amber-50 via-background to-cyan-50 p-8 dark:from-amber-950/20 dark:via-background dark:to-cyan-950/20 md:p-12">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-amber-400/30 to-cyan-600/30 blur-3xl" />
        <div className="absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-gradient-to-br from-cyan-600/25 to-amber-400/25 blur-3xl" />
        <div className="relative grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" />
              Beginner-friendly • Warm community • Practical wisdom
            </div>
            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
              A joyful student community for Bhagavad‑gītā, mantra meditation, and meaningful friendships.
            </h1>
            <p className="mt-4 text-base text-muted-foreground md:text-lg">
              {siteConfig.description}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="rounded-full bg-gradient-to-r from-amber-400 to-cyan-600 text-black hover:opacity-90">
                <Link href="/events">
                  See upcoming events <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/programs">Explore programs</Link>
              </Button>
            </div>
          </div>
          <div className="grid gap-4">
            <Card className="bg-background/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <CalendarDays className="h-4 w-4" /> Next events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcoming.length === 0 ? (
                  <p className="text-sm text-muted-foreground">New events will be posted soon.</p>
                ) : (
                  upcoming.map((e: (typeof upcoming)[number]) => (
                    <Link
                      key={e.id}
                      href={`/events/${e.slug}`}
                      className="block rounded-xl border bg-background p-3 transition hover:shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-semibold">{e.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(e.startDateTime).toLocaleString(undefined, {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                        <Badge variant="secondary" className="shrink-0">
                          RSVP
                        </Badge>
                      </div>
                    </Link>
                  ))
                )}
              </CardContent>
            </Card>
            <Card className="bg-background/60">
              <CardHeader>
                <CardTitle className="text-base">What you’ll experience</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3 text-sm">
                {['Gītā discussions', 'Mantra meditation', 'Kīrtan nights', 'Retreats', 'Service', 'Vegetarian dinner'].map((t) => (
                  <div key={t} className="rounded-xl border bg-background px-3 py-2">
                    {t}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {programs.slice(0, 3).map((p) => (
          <Card key={p.title} className="transition hover:shadow-sm">
            <CardHeader>
              <CardTitle>{p.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{p.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {testimonials.map((t) => (
          <Card key={t.name} className="bg-gradient-to-br from-background to-amber-50/40 dark:to-amber-950/20">
            <CardHeader>
              <CardTitle className="text-base">{t.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">“{t.quote}”</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="rounded-3xl border p-8 md:p-12">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold">Join the community</h2>
            <p className="mt-2 text-muted-foreground">
              New? Start with one event. Come as you are—no pressure.
            </p>
          </div>
          <Button asChild className="rounded-full bg-gradient-to-r from-amber-400 to-cyan-600 text-black hover:opacity-90">
            <Link href="/events">Find an event</Link>
          </Button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold">FAQs</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {faqs.map((f) => (
            <Card key={f.q}>
              <CardHeader>
                <CardTitle className="text-base">{f.q}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{f.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
