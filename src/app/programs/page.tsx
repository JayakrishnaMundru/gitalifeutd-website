import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { programs, siteConfig } from '@/content/site'
import { PageHero } from '@/components/page-hero'

export default function ProgramsPage() {
  return (
    <div className="space-y-8">
      <PageHero
        title="Programs"
        subtitle="A beginner-friendly path: discussions, meditation through sound, retreats, and service."
        ctaLabel="See events"
        ctaHref="/events"
      />

      <div className="grid gap-4 md:grid-cols-2">
        {programs.map((p) => (
          <Card key={p.title} className="transition hover:shadow-sm">
            <CardHeader>
              <CardTitle>{p.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{p.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
