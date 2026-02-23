'use client'

import * as React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const schema = z.object({
  eventId: z.string().min(1),
  fullName: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  studentStatus: z.enum(['UNDERGRAD', 'GRAD', 'PHD', 'ALUMNI', 'FACULTY', 'STAFF', 'OTHER']),
  dietaryPreference: z.enum(['VEG', 'VEGAN', 'NO_PREFERENCE', 'OTHER']).default('VEG'),
  notes: z.string().max(500).optional(),
  consent: z.literal(true, { errorMap: () => ({ message: 'Consent is required' }) }),

  // honeypot
  website: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function RSVPForm({ eventId }: { eventId: string }) {
  const [submitting, setSubmitting] = React.useState(false)
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      eventId,
      fullName: '',
      email: '',
      phone: '',
      studentStatus: 'UNDERGRAD',
      dietaryPreference: 'VEG',
      notes: '',
      consent: true,
      website: '',
    },
  })

  async function onSubmit(values: FormValues) {
    setSubmitting(true)
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(values),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data?.error ?? 'Failed to RSVP')
      }
      toast.success('RSVP confirmed. See you there!')
      form.reset({
        ...form.getValues(),
        fullName: '',
        email: '',
        phone: '',
        notes: '',
        website: '',
      })
    } catch (e: any) {
      toast.error(e?.message ?? 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
      <input type="hidden" {...form.register('eventId')} />

      <div className="grid gap-2">
        <Label htmlFor="fullName">Full name</Label>
        <Input id="fullName" {...form.register('fullName')} />
        {form.formState.errors.fullName && (
          <p className="text-sm text-destructive">{form.formState.errors.fullName.message}</p>
        )}
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...form.register('email')} />
          {form.formState.errors.email && (
            <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">Phone (optional)</Label>
          <Input id="phone" {...form.register('phone')} />
        </div>
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        <div className="grid gap-2">
          <Label>Student status</Label>
          <Select
            value={form.watch('studentStatus')}
            onValueChange={(v) => form.setValue('studentStatus', v as any)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {['UNDERGRAD', 'GRAD', 'PHD', 'ALUMNI', 'FACULTY', 'STAFF', 'OTHER'].map((v) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label>Dietary preference</Label>
          <Select
            value={form.watch('dietaryPreference')}
            onValueChange={(v) => form.setValue('dietaryPreference', v as any)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {['VEG', 'VEGAN', 'NO_PREFERENCE', 'OTHER'].map((v) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea id="notes" {...form.register('notes')} />
      </div>

      {/* honeypot field */}
      <div className="hidden" aria-hidden="true">
        <Label htmlFor="website">Website</Label>
        <Input id="website" tabIndex={-1} autoComplete="off" {...form.register('website')} />
      </div>

      <div className="text-xs text-muted-foreground">
        By RSVPing you consent to be contacted about this event.
      </div>

      <Button
        type="submit"
        disabled={submitting}
        className="rounded-full bg-gradient-to-r from-amber-400 to-cyan-600 text-black hover:opacity-90"
      >
        {submitting ? 'Submitting…' : 'RSVP'}
      </Button>
    </form>
  )
}
