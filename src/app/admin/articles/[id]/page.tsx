import { redirect } from 'next/navigation'
import Link from 'next/link'
import { isAdminRequest } from '@/lib/admin-auth'
import { PageHero } from '@/components/page-hero'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const CONTENT_HINT =
  'Formatting: "## Heading", "### Smaller heading", "> quote or verse", "- bullet item", "---" for a divider. Leave a blank line between paragraphs.'

export default async function AdminArticleEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const ok = await isAdminRequest()
  if (!ok) redirect('/admin/login')

  const { id } = await params
  const a = await prisma.article.findUnique({ where: { id } })
  if (!a) redirect('/admin/articles')

  const dateValue = a.date.toISOString().slice(0, 10)

  return (
    <div className="space-y-8">
      <PageHero title="Edit Reflection" subtitle={a.title} />

      <Card>
        <CardHeader>
          <CardTitle>Reflection details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateArticleAction} className="grid gap-5">
            <input type="hidden" name="id" value={a.id} />

            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" defaultValue={a.title} required />
              <p className="text-xs text-muted-foreground">
                URL: <code>/blog/{a.slug}</code> (the link stays the same even if you rename the title)
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea id="excerpt" name="excerpt" rows={2} defaultValue={a.excerpt} required />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="content">Body</Label>
              <Textarea id="content" name="content" rows={16} defaultValue={a.content} required />
              <p className="text-xs text-muted-foreground">{CONTENT_HINT}</p>
            </div>

            <div className="grid gap-4 rounded-2xl border p-4">
              <div className="text-sm font-semibold">Cover picture</div>
              <div className="grid gap-2">
                <Label htmlFor="coverImage">Image URL</Label>
                <Input id="coverImage" name="coverImage" defaultValue={a.coverImage ?? ''} placeholder="/images/blog/my-cover.png or a Google Drive share link" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="coverFit">How to display it</Label>
                <select
                  id="coverFit"
                  name="coverFit"
                  defaultValue={a.coverFit === 'cover' ? 'cover' : 'contain'}
                  className="h-9 w-full rounded-md border bg-transparent px-3 text-sm shadow-xs"
                >
                  <option value="contain">Show full image (no crop) — best for posters</option>
                  <option value="cover">Fill a wide banner (crops edges)</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4 rounded-2xl border p-4">
              <div className="text-sm font-semibold">Author</div>
              <div className="grid gap-2 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="authorName">Name</Label>
                  <Input id="authorName" name="authorName" defaultValue={a.authorName} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="authorRole">Role (optional)</Label>
                  <Input id="authorRole" name="authorRole" defaultValue={a.authorRole ?? ''} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="authorPicture">Photo URL (optional)</Label>
                <Input id="authorPicture" name="authorPicture" defaultValue={a.authorPicture ?? ''} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="authorBio">Short bio (optional)</Label>
                <Textarea id="authorBio" name="authorBio" rows={2} defaultValue={a.authorBio ?? ''} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" name="date" type="date" defaultValue={dateValue} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="readTime">Read time (optional)</Label>
                <Input id="readTime" name="readTime" defaultValue={a.readTime ?? ''} placeholder="Auto if blank" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input id="tags" name="tags" defaultValue={a.tags.join(', ')} />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="published" defaultChecked={a.published} className="h-4 w-4" />
              Published (uncheck to hide from the public site)
            </label>

            <div className="flex gap-3">
              <Button type="submit" className="rounded-full">Save</Button>
              <Button type="button" variant="outline" className="rounded-full" asChild>
                <Link href="/admin/articles">Back</Link>
              </Button>
            </div>
          </form>

          <form action={deleteArticleAction} className="mt-6">
            <input type="hidden" name="id" value={a.id} />
            <Button type="submit" variant="destructive" className="rounded-full">
              Delete reflection
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

async function updateArticleAction(formData: FormData) {
  'use server'
  const ok = await isAdminRequest()
  if (!ok) redirect('/admin/login')

  const { prisma } = await import('@/lib/prisma')
  const id = String(formData.get('id') ?? '')

  const title = String(formData.get('title') ?? '').trim()
  const excerpt = String(formData.get('excerpt') ?? '').trim()
  const content = String(formData.get('content') ?? '').trim()
  const coverImage = String(formData.get('coverImage') ?? '').trim()
  const coverFitRaw = String(formData.get('coverFit') ?? 'contain').trim()
  const coverFit = coverFitRaw === 'cover' ? 'cover' : 'contain'
  const authorName = String(formData.get('authorName') ?? '').trim()
  const authorRole = String(formData.get('authorRole') ?? '').trim()
  const authorPicture = String(formData.get('authorPicture') ?? '').trim()
  const authorBio = String(formData.get('authorBio') ?? '').trim()
  const readTime = String(formData.get('readTime') ?? '').trim()
  const dateRaw = String(formData.get('date') ?? '').trim()
  const tagsRaw = String(formData.get('tags') ?? '').trim()
  const published = formData.get('published') === 'on'

  if (!title || !excerpt || !content || !authorName) {
    redirect(`/admin/articles/${id}`)
  }

  const tags = tagsRaw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  const parsedDate = dateRaw ? new Date(dateRaw) : new Date()
  const date = isNaN(parsedDate.getTime()) ? new Date() : parsedDate

  await prisma.article.update({
    where: { id },
    data: {
      title,
      excerpt,
      content,
      coverImage: coverImage || null,
      coverFit,
      authorName,
      authorRole: authorRole || null,
      authorPicture: authorPicture || null,
      authorBio: authorBio || null,
      tags,
      date,
      readTime: readTime || null,
      published,
    },
  })

  redirect('/admin/articles?toast=article-saved')
}

async function deleteArticleAction(formData: FormData) {
  'use server'
  const ok = await isAdminRequest()
  if (!ok) redirect('/admin/login')

  const { prisma } = await import('@/lib/prisma')
  const id = String(formData.get('id') ?? '')
  await prisma.article.delete({ where: { id } })

  redirect('/admin/articles?toast=article-deleted')
}
