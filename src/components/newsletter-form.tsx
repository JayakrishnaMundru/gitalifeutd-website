'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { CheckCircle2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const schema = z.object({
  email: z.string().email('Please enter a valid email.'),
  website: z.string().optional(), // honeypot
})

type Values = z.infer<typeof schema>

export function NewsletterForm({
  source = 'website',
  className,
}: {
  source?: string
  className?: string
}) {
  const [submitting, setSubmitting] = React.useState(false)
  const [done, setDone] = React.useState(false)
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', website: '' },
  })

  async function onSubmit(values: Values) {
    setSubmitting(true)
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...values, source }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error ?? 'Subscription failed.')
      setDone(true)
      toast.success('You are subscribed. Welcome aboard!')
      form.reset()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className={cn('flex items-center gap-2 text-sm text-foreground', className)}>
        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        <span>Thanks for subscribing. Check your inbox.</span>
      </div>
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className={cn('w-full', className)}>
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex-1">
          <Label htmlFor={`newsletter-email-${source}`} className="sr-only">
            Email address
          </Label>
          <Input
            id={`newsletter-email-${source}`}
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            aria-invalid={!!form.formState.errors.email}
            {...form.register('email')}
          />
        </div>

        {/* honeypot */}
        <div className="hidden" aria-hidden="true">
          <Label htmlFor={`newsletter-website-${source}`}>Website</Label>
          <Input id={`newsletter-website-${source}`} tabIndex={-1} autoComplete="off" {...form.register('website')} />
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-gradient-to-r from-amber-400 to-cyan-600 text-black hover:opacity-90 sm:w-auto"
        >
          {submitting ? 'Subscribing…' : 'Subscribe'}
        </Button>
      </div>
      {form.formState.errors.email && (
        <p className="mt-2 text-xs text-destructive">{form.formState.errors.email.message}</p>
      )}
    </form>
  )
}
