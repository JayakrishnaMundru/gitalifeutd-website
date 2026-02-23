import { Resend } from 'resend'
import { env } from '@/lib/env'
import * as React from 'react'
import { Html, Head, Body, Container, Heading, Text, Hr, Link } from '@react-email/components'

type RsvpEmailInput = {
  to: string
  name: string
  eventTitle: string
  eventStart: Date
  eventLocation: string
  eventUrl: string
}

function RsvpEmailTemplate(props: Omit<RsvpEmailInput, 'to'> & { appUrl?: string }) {
  const url = props.appUrl ? new URL(props.eventUrl, props.appUrl).toString() : props.eventUrl
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: 'ui-sans-serif, system-ui', backgroundColor: '#ffffff' }}>
        <Container style={{ maxWidth: 600, padding: 24 }}>
          <Heading style={{ margin: 0 }}>RSVP Confirmed</Heading>
          <Text>Hi {props.name},</Text>
          <Text>
            Thanks for RSVPing to <b>{props.eventTitle}</b>.
          </Text>
          <Text>
            <b>When:</b> {props.eventStart.toLocaleString()}
            <br />
            <b>Where:</b> {props.eventLocation}
          </Text>
          <Text>
            Event page: <Link href={url}>{url}</Link>
          </Text>
          <Hr />
          <Text style={{ color: '#666', fontSize: 12 }}>
            If you didn’t request this RSVP, you can ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export async function sendRsvpConfirmationEmail(input: RsvpEmailInput) {
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM) return

  const resend = new Resend(env.RESEND_API_KEY)
  await resend.emails.send({
    from: env.EMAIL_FROM,
    to: input.to,
    subject: `RSVP confirmed: ${input.eventTitle}`,
    react: <RsvpEmailTemplate {...input} appUrl={env.APP_URL} />,
  })
}
