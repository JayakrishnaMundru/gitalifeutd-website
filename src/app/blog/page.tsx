import type { Metadata } from 'next'
import { PageHero } from '@/components/page-hero'
import { BlogList, type ArticleCardData } from '@/components/blog-list'
import { getAllArticles } from '@/content/articles'
import { siteConfig } from '@/content/site'

export const metadata: Metadata = {
  title: 'Reflections',
  description:
    'Spiritual reflections, stories, and insights written by the GitaLife student community.',
}

export default function BlogPage() {
  const articles: ArticleCardData[] = getAllArticles().map((a) => ({
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    coverImage: a.coverImage,
    date: a.date,
    readTime: a.readTime,
    tags: a.tags,
    author: { name: a.author.name, picture: a.author.picture, role: a.author.role },
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
