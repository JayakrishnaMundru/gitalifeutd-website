export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { PageHero } from '@/components/page-hero'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import { isAdminRequest } from '@/lib/admin-auth'

export default async function AdminDashboard() {
  const ok = await isAdminRequest()
  if (!ok) redirect('/admin/login')

  const events = await prisma.event.findMany({
    orderBy: { startDateTime: 'desc' },
    include: { _count: { select: { rsvps: true } } },
    take: 20,
  })

  return (
    <div className="space-y-6">
      <PageHero
        title="Admin"
        subtitle="RSVP dashboard and CSV exports."
      />

      <div className="flex items-center justify-end">
        <form action={logoutAction}>
          <Button variant="outline" className="rounded-full" type="submit">
            Logout
          </Button>
        </form>
      </div>

      <div className="grid gap-4">
        {events.map((e: (typeof events)[number]) => (
          <Card key={e.id}>
            <CardHeader>
              <CardTitle className="text-lg">{e.title}</CardTitle>
              <div className="text-sm text-muted-foreground">
                {new Date(e.startDateTime).toLocaleString()} · {e.location}
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm">
                RSVPs: <span className="font-semibold">{e._count.rsvps}</span>
              </div>
              <div className="flex gap-2">
                <Button asChild variant="outline" className="rounded-full">
                  <Link href={`/admin/events/${e.id}`}>View RSVPs</Link>
                </Button>
                <Button asChild className="rounded-full">
                  <a href={`/admin/events/${e.id}/export.csv`}>Export CSV</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

async function logoutAction() {
  'use server'
  const { clearAdminSession } = await import('@/lib/admin-auth')
  await clearAdminSession()
  redirect('/admin/login')
}
