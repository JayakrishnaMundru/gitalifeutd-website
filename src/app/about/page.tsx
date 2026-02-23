import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">About</h1>
        <p className="mt-2 text-muted-foreground">
          GitaLife is a Bhakti Yoga student community centered on Bhagavad‑gītā and Śrīmad‑Bhāgavatam teachings.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Mission</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            To build a joyful, beginner‑friendly community for practical spiritual learning—identity, purpose, habits, and meaningful friendships.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Culture</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Warm, welcoming, non‑preachy. Come as you are. Learn, ask questions, try simple practices, and grow together.
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Meet the team</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Add your team profiles in the CMS (Keystatic) or edit this page. We recommend listing: President, Vice President, Events, Outreach, Media.
        </CardContent>
      </Card>
    </div>
  )
}
