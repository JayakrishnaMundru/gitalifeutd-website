import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { programs } from '@/content/site'

export default function ProgramsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Programs</h1>
        <p className="mt-2 text-muted-foreground">What we do throughout the semester.</p>
      </div>

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
