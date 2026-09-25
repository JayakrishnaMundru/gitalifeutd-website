import { prisma } from '@/lib/prisma'
import type { Article as ArticleRow } from '@prisma/client'

export type { ArticleRow }

/** Estimate reading time from the body when the author did not set one. */
export function readTimeFor(article: Pick<ArticleRow, 'content' | 'readTime'>) {
  if (article.readTime && article.readTime.trim()) return article.readTime.trim()
  const words = article.content.trim().split(/\s+/).length
  const minutes = Math.max(1, Math.round(words / 200))
  return `${minutes} min read`
}

/** Published articles, newest first. */
export function listPublishedArticles() {
  return prisma.article.findMany({
    where: { published: true },
    orderBy: { date: 'desc' },
  })
}

/** A single published article by slug (or null). */
export function getPublishedArticle(slug: string) {
  return prisma.article.findFirst({ where: { slug, published: true } })
}
