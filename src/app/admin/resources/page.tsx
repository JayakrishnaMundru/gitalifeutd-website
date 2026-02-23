import { redirect } from 'next/navigation'
import Link from 'next/link'
import { isAdminRequest } from '@/lib/admin-auth'
import { PageHero } from '@/components/page-hero'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function AdminResourcesPage() {
  const ok = await isAdminRequest()
  if (!ok) redirect('/admin/login')

  const resources = await prisma.resource.findMany({ orderBy: { updatedAt: 'desc' } })

  return (
    <div className="space-y-8">
      <PageHero title="Resources" subtitle="Create and manage resources displayed on the Resources page." />

      <div className="flex justify-end">
        <Button asChild className="rounded-full">
          <Link href="/admin/resources/new">New resource</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {resources.map((r) => (
          <Card key={r.id} className="transition hover:shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">{r.title}</CardTitle>
              <div className="text-sm text-muted-foreground">
                {r.category} · {r.published ? 'Published' : 'Draft'}
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">Updated {new Date(r.updatedAt).toLocaleString()}</div>
              <Button asChild variant="outline" className="rounded-full">
                <Link href={`/admin/resources/${r.id}`}>Edit</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
