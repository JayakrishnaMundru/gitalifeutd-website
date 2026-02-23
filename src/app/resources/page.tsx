import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHero } from '@/components/page-hero'
import { siteConfig } from '@/content/site'

export default function ResourcesPage() {
  return (
    <div className="space-y-8">
      <PageHero
        title="Resources"
        subtitle="Start simple: beginner guides, playlists, and downloads to support your weekly practice."
        ctaLabel="Follow @gitalifeutd"
        ctaHref={siteConfig.socials.instagram}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Beginner guide</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Start with: identity beyond labels, simple daily mantra meditation (2 minutes), and community association.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>YouTube playlist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video overflow-hidden rounded-xl border">
              <iframe
                className="h-full w-full"
                src="https://www.youtube.com/embed/videoseries?list=PL9b5m7oJ2fK6g6qS9o3b1u8tqkz0pQJZB"
                title="GitaLife UTD Playlist"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Replace with your actual playlist URL.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Downloads</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Add PDFs (beginner handout, event flyers) in the public/downloads folder and link them here.
        </CardContent>
      </Card>
    </div>
  )
}
