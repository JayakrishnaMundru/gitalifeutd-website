import type { MetadataRoute } from 'next'
import { siteConfig } from '@/content/site'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url

  const staticRoutes = ['/', '/events', '/programs', '/resources', '/about', '/contact'].map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
  }))

  // IMPORTANT:
  // During first deploy the database may not be migrated/seeded yet.
  // Avoid failing the build by treating event routes as optional.
  try {
    const { prisma } = await import('@/lib/prisma')
    const events = await prisma.event.findMany({ select: { slug: true, updatedAt: true } })
    const eventRoutes = events.map((e: (typeof events)[number]) => ({
      url: `${base}/events/${e.slug}`,
      lastModified: e.updatedAt,
    }))
    return [...staticRoutes, ...eventRoutes]
  } catch {
    return staticRoutes
  }
}
