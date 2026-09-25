import { redirect } from 'next/navigation'
import Link from 'next/link'
import { isAdminRequest } from '@/lib/admin-auth'
import { PageHero } from '@/components/page-hero'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function AdminArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ toast?: string }>
}) {
  const ok = await isAdminRequest()
  if (!ok) redirect('/admin/login')

  const sp = await searchParams
  const articles = await prisma.article.findMany({ orderBy: { date: 'desc' } })

  const toastMsg =
    sp.toast === 'article-created'
      ? 'Reflection created'
      : sp.toast === 'article-saved'
        ? 'Reflection saved'
        : sp.toast === 'article-deleted'
          ? 'Reflection deleted'
          : undefined

  const { ToastOnLoad } = await import('@/components/toast-on-load')

  return (
    <div className="space-y-8">
      <ToastOnLoad message={toastMsg} />
      <PageHero title="Reflections" subtitle="Write, edit, and publish your reflections and vlogs." />

      <div className="flex justify-end">
        <Button asChild className="rounded-full">
          <Link href="/admin/articles/new">New reflection</Link>
        </Button>
      </div>

      {articles.length === 0 ? (
        <p className="text-sm text-muted-foreground">No reflections yet. Create your first one.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {articles.map((a) => (
            <Card key={a.id} className="transition hover:shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">{a.title}</CardTitle>
                <div className="text-sm text-muted-foreground">
                  {a.authorName} · {new Date(a.date).toLocaleDateString()} ·{' '}
                  {a.published ? 'Published' : 'Draft'}
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-between gap-3">
                <div className="text-xs text-muted-foreground">
                  Updated {new Date(a.updatedAt).toLocaleString()}
                </div>
                <div className="flex gap-2">
                  {a.published && (
                    <Button asChild variant="ghost" className="rounded-full">
                      <a href={`/blog/${a.slug}`} target="_blank" rel="noreferrer">
                        View
                      </a>
                    </Button>
                  )}
                  <Button asChild variant="outline" className="rounded-full">
                    <Link href={`/admin/articles/${a.id}`}>Edit</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
