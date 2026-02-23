import { NextResponse } from 'next/server'
import { createEvent } from 'ics'
import { prisma } from '@/lib/prisma'

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const event = await prisma.event.findUnique({ where: { slug } })
  if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const start = new Date(event.startDateTime)
  const end = new Date(event.endDateTime)

  const { error, value } = createEvent({
    title: event.title,
    start: [start.getFullYear(), start.getMonth() + 1, start.getDate(), start.getHours(), start.getMinutes()],
    end: [end.getFullYear(), end.getMonth() + 1, end.getDate(), end.getHours(), end.getMinutes()],
    location: event.location,
    description: event.description,
    productId: 'gitalifeutd',
    uid: `gitalifeutd-${event.slug}`,
  })

  if (error || !value) {
    return NextResponse.json({ error: 'Failed to generate calendar file' }, { status: 500 })
  }

  return new NextResponse(value, {
    status: 200,
    headers: {
      'content-type': 'text/calendar; charset=utf-8',
      'content-disposition': `attachment; filename="${event.slug}.ics"`,
    },
  })
}
