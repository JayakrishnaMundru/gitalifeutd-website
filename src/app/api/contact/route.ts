import { NextResponse } from 'next/server'
import { z } from 'zod'
import { env } from '@/lib/env'
import { Resend } from 'resend'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10).max(2000),
  website: z.string().optional().nullable(),
})

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  if (parsed.data.website && parsed.data.website.trim().length > 0) {
    return NextResponse.json({ ok: true })
  }

  if (!env.RESEND_API_KEY || !env.EMAIL_FROM) {
    // Accept message but do nothing if email not configured.
    return NextResponse.json({ ok: true, note: 'Email not configured' })
  }

  const resend = new Resend(env.RESEND_API_KEY)
  await resend.emails.send({
    from: env.EMAIL_FROM,
    to: env.EMAIL_FROM,
    subject: `GitaLife Contact: ${parsed.data.name}`,
    text: `From: ${parsed.data.name} <${parsed.data.email}>\n\n${parsed.data.message}`,
  })

  return NextResponse.json({ ok: true })
}
