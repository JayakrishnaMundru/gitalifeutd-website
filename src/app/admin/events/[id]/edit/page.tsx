import { redirect } from 'next/navigation'
import { isAdminRequest } from '@/lib/admin-auth'
import { PageHero } from '@/components/page-hero'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function AdminEventEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const ok = await isAdminRequest()
  if (!ok) redirect('/admin/login')

  const { id } = await params
  const event = await prisma.event.findUnique({ where: { id } })
  if (!event) redirect('/admin')

  return (
    <div className="space-y-8">
      <PageHero title="Edit Event" subtitle={event.title} />

      <Card>
        <CardHeader>
          <CardTitle>Event details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateEventAction} className="grid gap-4">
            <input type="hidden" name="id" value={event.id} />

            <div className="grid gap-2">
              <Label>Slug</Label>
              <div className="rounded-xl border bg-muted/20 px-3 py-2 text-sm text-muted-foreground">
                {event.slug}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" defaultValue={event.title} required />
            </div>

            <div className="grid gap-2 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="start">Start (local time)</Label>
                <Input
                  id="start"
                  name="startDateTime"
                  type="datetime-local"
                  defaultValue={toDateTimeLocal(event.startDateTime)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end">End (local time)</Label>
                <Input
                  id="end"
                  name="endDateTime"
                  type="datetime-local"
                  defaultValue={toDateTimeLocal(event.endDateTime)}
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" defaultValue={event.location} required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input id="tags" name="tags" defaultValue={event.tags.join(', ')} />
            </div>

            <div className="grid gap-2 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="speakerName">Speaker name (optional)</Label>
                <Input id="speakerName" name="speakerName" defaultValue={event.speakerName ?? ''} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="coverImage">Cover image URL (optional)</Label>
                <Input id="coverImage" name="coverImage" defaultValue={event.coverImage ?? ''} />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="speakerBio">Speaker bio (optional)</Label>
              <Textarea id="speakerBio" name="speakerBio" rows={3} defaultValue={event.speakerBio ?? ''} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" rows={4} defaultValue={event.description} required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="agenda">Agenda (optional)</Label>
              <Textarea id="agenda" name="agenda" rows={4} defaultValue={event.agenda ?? ''} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="faq">FAQ (optional)</Label>
              <Textarea id="faq" name="faq" rows={4} defaultValue={event.faq ?? ''} />
            </div>

            <div className="flex flex-wrap gap-3">
              <Button type="submit" className="rounded-full">Save</Button>
              <Button type="button" variant="outline" className="rounded-full" asChild>
                <a href="/admin">Back</a>
              </Button>
              <form action={togglePublishAction}>
                <input type="hidden" name="id" value={event.id} />
                <Button type="submit" variant="secondary" className="rounded-full">
                  {event.published ? 'Unpublish' : 'Publish'}
                </Button>
              </form>
            </div>
          </form>

          <div className="mt-8">
            <form action={deleteEventAction}>
              <input type="hidden" name="id" value={event.id} />
              <Button type="submit" variant="destructive" className="rounded-full">
                Delete event
              </Button>
            </form>
            <p className="mt-2 text-xs text-muted-foreground">
              Deleting an event will also delete its RSVPs.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function toDateTimeLocal(d: Date) {
  const pad = (n: number) => String(n).padStart(2, '0')
  const yyyy = d.getFullYear()
  const mm = pad(d.getMonth() + 1)
  const dd = pad(d.getDate())
  const hh = pad(d.getHours())
  const mi = pad(d.getMinutes())
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`
}

async function updateEventAction(formData: FormData) {
  'use server'
  const ok = await isAdminRequest()
  if (!ok) redirect('/admin/login')

  const { prisma } = await import('@/lib/prisma')

  const id = String(formData.get('id') ?? '')
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

  const tags = tagsRaw
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)

  await prisma.event.update({
    where: { id },
    data: {
      title,
      startDateTime: new Date(startRaw),
      endDateTime: new Date(endRaw),
      location,
      tags,
      speakerName: speakerName || null,
      speakerBio: speakerBio || null,
      coverImage: coverImage || null,
      description,
      agenda: agenda || null,
      faq: faq || null,
    },
  })

  redirect(`/admin`) 
}

async function togglePublishAction(formData: FormData) {
  'use server'
  const ok = await isAdminRequest()
  if (!ok) redirect('/admin/login')

  const { prisma } = await import('@/lib/prisma')
  const id = String(formData.get('id') ?? '')
  const event = await prisma.event.findUnique({ where: { id } })
  if (!event) redirect('/admin')

  await prisma.event.update({ where: { id }, data: { published: !event.published } })
  redirect(`/admin/events/${id}/edit`)
}

async function deleteEventAction(formData: FormData) {
  'use server'
  const ok = await isAdminRequest()
  if (!ok) redirect('/admin/login')

  const { prisma } = await import('@/lib/prisma')
  const id = String(formData.get('id') ?? '')
  await prisma.event.delete({ where: { id } })
  redirect('/admin')
}
