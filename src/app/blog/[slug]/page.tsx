import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArticleView } from '@/components/article-view'
import { getPublishedArticle, readTimeFor } from '@/lib/articles'
import { siteConfig } from '@/content/site'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = await getPublishedArticle(slug)
  if (!article) return {}

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      url: `${siteConfig.url}/blog/${article.slug}`,
      images: article.coverImage ? [article.coverImage] : undefined,
      authors: [article.authorName],
      publishedTime: article.date.toISOString(),
    },
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = await getPublishedArticle(slug)
  if (!article) return notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date.toISOString(),
    author: { '@type': 'Person', name: article.authorName },
    publisher: { '@type': 'Organization', name: siteConfig.name, url: siteConfig.url },
    url: `${siteConfig.url}/blog/${article.slug}`,
    ...(article.coverImage ? { image: article.coverImage } : {}),
  }

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleView
        title={article.title}
        excerpt={article.excerpt}
        coverImage={article.coverImage ?? undefined}
        coverFit={article.coverFit === 'cover' ? 'cover' : 'contain'}
        date={article.date.toISOString()}
        readTime={readTimeFor(article)}
        tags={article.tags}
        content={article.content}
        author={{
          name: article.authorName,
          picture: article.authorPicture ?? undefined,
          role: article.authorRole ?? undefined,
          bio: article.authorBio ?? undefined,
        }}
      />
    </div>
  )
}
