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

export default async function AdminResourceEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const ok = await isAdminRequest()
  if (!ok) redirect('/admin/login')

  const { id } = await params
  const r = await prisma.resource.findUnique({ where: { id } })
  if (!r) redirect('/admin/resources')

  return (
    <div className="space-y-8">
      <PageHero title="Edit Resource" subtitle={r.title} />

      <Card>
        <CardHeader>
          <CardTitle>Resource details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateResourceAction} className="grid gap-4">
            <input type="hidden" name="id" value={r.id} />

            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" defaultValue={r.title} required />
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" name="category" defaultValue={r.category} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="externalUrl">External URL</Label>
                <Input id="externalUrl" name="externalUrl" defaultValue={r.externalUrl ?? ''} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="youtubeUrl">YouTube URL</Label>
              <Input id="youtubeUrl" name="youtubeUrl" defaultValue={r.youtubeUrl ?? ''} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="summary">Summary</Label>
              <Textarea id="summary" name="summary" rows={2} defaultValue={r.summary ?? ''} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contentMd">Content (Markdown)</Label>
              <Textarea id="contentMd" name="contentMd" rows={10} defaultValue={r.contentMd ?? ''} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="downloads">Downloads (comma-separated)</Label>
              <Input id="downloads" name="downloads" defaultValue={r.downloads.join(', ')} />
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="rounded-full">Save</Button>
              <Button type="button" variant="outline" className="rounded-full" asChild>
                <a href="/admin/resources">Back</a>
              </Button>
            </div>
          </form>

          <form action={deleteResourceAction} className="mt-6">
            <input type="hidden" name="id" value={r.id} />
            <Button type="submit" variant="destructive" className="rounded-full">
              Delete resource
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

async function updateResourceAction(formData: FormData) {
  'use server'
  const ok = await isAdminRequest()
  if (!ok) redirect('/admin/login')

  const { prisma } = await import('@/lib/prisma')
  const id = String(formData.get('id') ?? '')

  const title = String(formData.get('title') ?? '').trim()
  const category = String(formData.get('category') ?? '').trim() || 'Beginner'
  const externalUrl = String(formData.get('externalUrl') ?? '').trim()
  const youtubeUrl = String(formData.get('youtubeUrl') ?? '').trim()
  const summary = String(formData.get('summary') ?? '').trim()
  const contentMd = String(formData.get('contentMd') ?? '').trim()
  const downloadsRaw = String(formData.get('downloads') ?? '').trim()

  const downloads = downloadsRaw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  await prisma.resource.update({
    where: { id },
    data: {
      title,
      category,
      summary: summary || null,
      contentMd: contentMd || null,
      externalUrl: externalUrl || null,
      youtubeUrl: youtubeUrl || null,
      downloads,
      published: true,
    },
  })

  redirect('/admin/resources')
}

async function deleteResourceAction(formData: FormData) {
  'use server'
  const ok = await isAdminRequest()
  if (!ok) redirect('/admin/login')

  const { prisma } = await import('@/lib/prisma')
  const id = String(formData.get('id') ?? '')
  await prisma.resource.delete({ where: { id } })

  redirect('/admin/resources')
}
