import { redirect } from 'next/navigation'
import { isAdminRequest } from '@/lib/admin-auth'
import { PageHero } from '@/components/page-hero'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function AdminResourceNewPage() {
  const ok = await isAdminRequest()
  if (!ok) redirect('/admin/login')

  return (
    <div className="space-y-8">
      <PageHero title="New Resource" subtitle="Create a resource for the Resources page." />
      <Card>
        <CardHeader>
          <CardTitle>Resource details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createResourceAction} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required />
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" name="category" placeholder="Beginner" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="externalUrl">External URL (optional)</Label>
                <Input id="externalUrl" name="externalUrl" placeholder="https://..." />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="youtubeUrl">YouTube URL (optional)</Label>
              <Input id="youtubeUrl" name="youtubeUrl" placeholder="https://youtube.com/watch?v=..." />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="summary">Summary (optional)</Label>
              <Textarea id="summary" name="summary" rows={2} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contentMd">Content (Markdown, optional)</Label>
              <Textarea id="contentMd" name="contentMd" rows={8} placeholder="## Beginner guide\n\n..." />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="downloads">Downloads (comma-separated, optional)</Label>
              <Input id="downloads" name="downloads" placeholder="/downloads/guide.pdf, /downloads/flyer.pdf" />
            </div>
            <div className="flex gap-3">
              <Button type="submit" className="rounded-full">Create</Button>
              <Button type="button" variant="outline" className="rounded-full" asChild>
                <a href="/admin/resources">Cancel</a>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

async function createResourceAction(formData: FormData) {
  'use server'
  const ok = await isAdminRequest()
  if (!ok) redirect('/admin/login')

  const { prisma } = await import('@/lib/prisma')
  const { slugify } = await import('@/lib/slug')

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

  const baseSlug = slugify(title)
  let slug = baseSlug
  for (let i = 0; i < 20; i++) {
    const exists = await prisma.resource.findUnique({ where: { slug } })
    if (!exists) break
    slug = `${baseSlug}-${i + 2}`
  }

  await prisma.resource.create({
    data: {
      title,
      slug,
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
