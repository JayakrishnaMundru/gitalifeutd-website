import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { sendRsvpConfirmationEmail } from '@/lib/email'

const schema = z.object({
  eventId: z.string().min(1),
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  studentStatus: z.enum(['UNDERGRAD', 'GRAD', 'PHD', 'ALUMNI', 'FACULTY', 'STAFF', 'OTHER']),
  dietaryPreference: z.enum(['VEG', 'VEGAN', 'NO_PREFERENCE', 'OTHER']),
  notes: z.string().max(500).optional().nullable(),
  consent: z.boolean(),

  // honeypot
  website: z.string().optional().nullable(),
})

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  if (!parsed.data.consent) {
    return NextResponse.json({ error: 'Consent required' }, { status: 400 })
  }

  if (parsed.data.website && parsed.data.website.trim().length > 0) {
    // spam
    return NextResponse.json({ ok: true })
  }

  const event = await prisma.event.findUnique({ where: { id: parsed.data.eventId } })
  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

  const rsvp = await prisma.rSVP.create({
    data: {
      eventId: parsed.data.eventId,
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      phone: parsed.data.phone ?? undefined,
      studentStatus: parsed.data.studentStatus,
      dietaryPreference: parsed.data.dietaryPreference,
      notes: parsed.data.notes ?? undefined,
      consent: parsed.data.consent,
    },
  })

  // fire-and-forget email
  sendRsvpConfirmationEmail({
    to: rsvp.email,
    name: rsvp.fullName,
    eventTitle: event.title,
    eventStart: event.startDateTime,
    eventLocation: event.location,
    eventUrl: `/events/${event.slug}`,
  }).catch(() => {})

  return NextResponse.json({
    ok: true,
    rsvpId: rsvp.id,
    event: {
      slug: event.slug,
      title: event.title,
      startDateTime: event.startDateTime,
      location: event.location,
    },
  })
}
