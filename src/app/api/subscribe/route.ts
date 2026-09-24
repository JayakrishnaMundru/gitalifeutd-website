import { NextResponse } from 'next/server'
import { z } from 'zod'
import { Resend } from 'resend'
import { prisma } from '@/lib/prisma'
import { env } from '@/lib/env'
import { siteConfig } from '@/content/site'

const schema = z.object({
  email: z.string().email(),
  name: z.string().max(120).optional().nullable(),
  source: z.string().max(60).optional().nullable(),
  // honeypot: real users never fill this
  website: z.string().optional().nullable(),
})

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }

  // Silently accept bots so we don't reveal the honeypot.
  if (parsed.data.website && parsed.data.website.trim().length > 0) {
    return NextResponse.json({ ok: true })
  }

  const email = parsed.data.email.trim().toLowerCase()
  const name = parsed.data.name?.trim() || null
  const source = parsed.data.source?.trim() || 'website'

  // Store the subscriber. Idempotent: re-subscribing is fine and re-activates.
  try {
    await prisma.subscriber.upsert({
      where: { email },
      create: { email, name, source, confirmed: true },
      update: { unsubscribedAt: null, confirmed: true, ...(name ? { name } : {}) },
    })
  } catch {
    return NextResponse.json(
      { error: 'We could not save your subscription right now. Please try again later.' },
      { status: 500 },
    )
  }

  // Optional welcome email (only if Resend is configured). Never blocks the subscription.
  if (env.RESEND_API_KEY && env.EMAIL_FROM) {
    try {
      const resend = new Resend(env.RESEND_API_KEY)
      const { data, error } = await resend.emails.send({
        from: env.EMAIL_FROM,
        to: email,
        subject: `Welcome to ${siteConfig.name} Reflections`,
        text: `Thanks for subscribing to ${siteConfig.name}!\n\nYou'll receive our latest spiritual reflections, stories, and event updates. Hare Krishna.\n\n— The ${siteConfig.name} team`,
      })
      if (error) {
        console.error('[subscribe] Resend rejected the welcome email:', error)
      } else {
        console.log('[subscribe] Welcome email sent:', data?.id)
      }
    } catch (e) {
      // Never block the subscription on an email failure—just log it.
      console.error('[subscribe] Failed to send welcome email:', e)
    }
  } else {
    console.warn('[subscribe] Welcome email skipped: RESEND_API_KEY and/or EMAIL_FROM not set.')
  }

  return NextResponse.json({ ok: true })
}
