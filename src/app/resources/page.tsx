import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHero } from '@/components/page-hero'
import { siteConfig } from '@/content/site'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function ResourcesPage() {
  const resources = await prisma.resource.findMany({
    where: { published: true },
    orderBy: [{ category: 'asc' }, { updatedAt: 'desc' }],
  })

  return (
    <div className="space-y-8">
      <PageHero
        title="Resources"
        subtitle="Beginner guides, playlists, and downloads to support your weekly practice."
        ctaLabel="Follow @gitalifeutd"
        ctaHref={siteConfig.socials.instagram}
      />

      {resources.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No resources yet</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Admins can add resources at <Link className="underline" href="/admin/resources">/admin/resources</Link>.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {resources.map((r) => (
            <Card key={r.id} className="transition hover:shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">{r.title}</CardTitle>
                <div className="text-sm text-muted-foreground">{r.category}</div>
              </CardHeader>
              <CardContent className="space-y-3">
                {r.summary ? <p className="text-sm text-muted-foreground">{r.summary}</p> : null}

                <div className="flex flex-wrap gap-2">
                  {r.externalUrl ? (
                    <a className="text-sm underline" href={r.externalUrl} target="_blank" rel="noreferrer">
                      Link
                    </a>
                  ) : null}
                  {r.youtubeUrl ? (
                    <a className="text-sm underline" href={r.youtubeUrl} target="_blank" rel="noreferrer">
                      YouTube
                    </a>
                  ) : null}
                  {r.downloads.map((d) => (
                    <a key={d} className="text-sm underline" href={d}>
                      Download
                    </a>
                  ))}
                </div>

                {r.contentMd ? (
                  <pre className="whitespace-pre-wrap rounded-xl border bg-muted/20 p-3 text-sm text-muted-foreground">
                    {r.contentMd}
                  </pre>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
