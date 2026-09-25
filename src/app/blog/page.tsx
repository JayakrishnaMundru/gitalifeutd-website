import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { BlogList, type ArticleCardData } from '@/components/blog-list'
import { listPublishedArticles, readTimeFor } from '@/lib/articles'
import { siteConfig } from '@/content/site'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Reflections',
  description:
    'Spiritual reflections, stories, and insights written by the GitaLife student community.',
}

export default async function BlogPage() {
  const rows = await listPublishedArticles()

  const articles: ArticleCardData[] = rows.map((a) => ({
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    coverImage: a.coverImage ?? undefined,
    date: a.date.toISOString(),
    readTime: readTimeFor(a),
    tags: a.tags,
    author: { name: a.authorName, picture: a.authorPicture ?? undefined, role: a.authorRole ?? undefined },
  }))

  return (
    <div className="space-y-10">
      <PageHero
        title="Reflections"
        subtitle="Stories, insights, and spiritual journeys shared by our community. Grab a chai, settle in, and read."
        ctaLabel="Follow @gitalifeutd"
        ctaHref={siteConfig.socials.instagram}
      />
      <BlogList articles={articles} />
    </div>
  )
}
