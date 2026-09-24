import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArticleView } from '@/components/article-view'
import { getAllArticles, getArticleBySlug } from '@/content/articles'
import { siteConfig } from '@/content/site'

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)
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
      authors: [article.author.name],
      publishedTime: new Date(article.date).toISOString(),
    },
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) return notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt,
    datePublished: new Date(article.date).toISOString(),
    author: { '@type': 'Person', name: article.author.name },
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
        coverImage={article.coverImage}
        date={article.date}
        readTime={article.readTime}
        tags={article.tags}
        content={article.content}
        author={article.author}
      />
    </div>
  )
}
