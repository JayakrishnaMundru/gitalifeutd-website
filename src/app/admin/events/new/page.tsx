import { redirect } from 'next/navigation'
import { isAdminRequest } from '@/lib/admin-auth'
import { PageHero } from '@/components/page-hero'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function AdminEventNewPage() {
  const ok = await isAdminRequest()
  if (!ok) redirect('/admin/login')

  return (
    <div className="space-y-8">
      <PageHero title="New Event" subtitle="Create a new event (published by default)." />

      <Card>
        <CardHeader>
          <CardTitle>Event details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createEventAction} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required />
            </div>

            <div className="grid gap-2 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="start">Start (local time)</Label>
                <Input id="start" name="startDateTime" type="datetime-local" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end">End (local time)</Label>
                <Input id="end" name="endDateTime" type="datetime-local" required />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input id="tags" name="tags" placeholder="Beginner, Talk, Free Dinner" />
            </div>

            <div className="grid gap-2 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="speakerName">Speaker name (optional)</Label>
                <Input id="speakerName" name="speakerName" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="coverImage">Cover image URL (optional)</Label>
                <Input id="coverImage" name="coverImage" placeholder="/images/events/xyz.jpg" />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="speakerBio">Speaker bio (optional)</Label>
              <Textarea id="speakerBio" name="speakerBio" rows={3} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" rows={4} required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="agenda">Agenda (optional)</Label>
              <Textarea id="agenda" name="agenda" rows={4} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="faq">FAQ (optional)</Label>
              <Textarea id="faq" name="faq" rows={4} />
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="rounded-full">Create</Button>
              <Button type="button" variant="outline" className="rounded-full" asChild>
                <a href="/admin">Cancel</a>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

async function createEventAction(formData: FormData) {
  'use server'

  const ok = await isAdminRequest()
  if (!ok) redirect('/admin/login')

  const { prisma } = await import('@/lib/prisma')
  const { slugify } = await import('@/lib/slug')

  const title = String(formData.get('title') ?? '').trim()
  const startRaw = String(formData.get('startDateTime') ?? '')
  const endRaw = String(formData.get('endDateTime') ?? '')
  const location = String(formData.get('location') ?? '').trim()
  const tagsRaw = String(formData.get('tags') ?? '')
  const speakerName = String(formData.get('speakerName') ?? '').trim()
  const speakerBio = String(formData.get('speakerBio') ?? '').trim()
  const coverImage = String(formData.get('coverImage') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()
  const agenda = String(formData.get('agenda') ?? '').trim()
  const faq = String(formData.get('faq') ?? '').trim()

  if (!title || !startRaw || !endRaw || !location || !description) {
    redirect('/admin/events/new')
  }

  const startDateTime = new Date(startRaw)
  const endDateTime = new Date(endRaw)

  const tags = tagsRaw
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

  const baseSlug = slugify(title)
  let slug = baseSlug
  // ensure unique
  for (let i = 0; i < 20; i++) {
    const exists = await prisma.event.findUnique({ where: { slug } })
    if (!exists) break
    slug = `${baseSlug}-${i + 2}`
  }

  await prisma.event.create({
    data: {
      title,
      slug,
      startDateTime,
      endDateTime,
      location,
      tags,
      speakerName: speakerName || null,
      speakerBio: speakerBio || null,
      coverImage: coverImage || null,
      gallery: [],
      description,
      agenda: agenda || null,
      faq: faq || null,
      published: true,
    },
  })

  redirect(`/admin?toast=event-created`) 
}
