import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHero } from '@/components/page-hero'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function ProgramsPage() {
  const programs = await prisma.program.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }],
  })

  return (
    <div className="space-y-8">
      <PageHero
        title="Programs"
        subtitle="A beginner-friendly path: discussions, meditation through sound, retreats, and service."
        ctaLabel="See events"
        ctaHref="/events"
      />

      {programs.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No programs yet</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Add programs in the database (migration included). Admin UI for programs can be added next.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {programs.map((p) => (
            <Card key={p.id} className="transition hover:shadow-sm">
              <CardHeader>
                <CardTitle>{p.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{p.summary}</p>
                {p.detailsMd ? (
                  <pre className="mt-3 whitespace-pre-wrap rounded-xl border bg-muted/20 p-3 text-sm text-muted-foreground">
                    {p.detailsMd}
                  </pre>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="text-xs text-muted-foreground">
        Admin: resources can be edited at <Link className="underline" href="/admin/resources">/admin/resources</Link>.
      </div>
    </div>
  )
}
