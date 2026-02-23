import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { siteConfig } from '@/content/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url

  const staticRoutes = ['/', '/events', '/programs', '/resources', '/about', '/contact'].map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
  }))

  const events = await prisma.event.findMany({ select: { slug: true, updatedAt: true } })
  const eventRoutes = events.map((e) => ({
    url: `${base}/events/${e.slug}`,
    lastModified: e.updatedAt,
  }))

  return [...staticRoutes, ...eventRoutes]
}
