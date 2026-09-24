'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, CalendarDays, Clock } from 'lucide-react'
import { AuthorAvatar, CoverImage } from '@/components/article-media'

export type ArticleCardData = {
  slug: string
  title: string
  excerpt: string
  coverImage?: string
  date: string
  readTime: string
  tags?: string[]
  author: { name: string; picture?: string; role?: string }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function BlogList({ articles }: { articles: ArticleCardData[] }) {
  if (articles.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No reflections published yet. Check back soon.
      </p>
    )
  }

  return (
    <motion.div
      className="grid gap-6 md:grid-cols-2"
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.09 } },
      }}
    >
      {articles.map((a) => (
        <motion.div
          key={a.slug}
          variants={{
            hidden: { opacity: 0, y: 24 },
            show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
          }}
          whileHover={{ y: -6 }}
          className="h-full"
        >
          <Link
            href={`/blog/${a.slug}`}
            className="group flex h-full flex-col overflow-hidden rounded-3xl border bg-card/70 shadow-sm backdrop-blur transition hover:shadow-xl"
          >
            <div className="relative">
              <CoverImage
                src={a.coverImage}
                alt={a.title}
                className="aspect-[16/10] w-full"
                imgClassName="transition duration-500 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              {a.tags?.[0] && (
                <span className="absolute left-3 top-3 rounded-full bg-background/85 px-3 py-1 text-xs font-medium backdrop-blur">
                  {a.tags[0]}
                </span>
              )}
            </div>

            <div className="flex flex-1 flex-col gap-4 p-5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" />
                <span>{formatDate(a.date)}</span>
                <span className="text-border">•</span>
                <Clock className="h-3.5 w-3.5" />
                <span>{a.readTime}</span>
              </div>

              <h2 className="font-serif text-2xl font-semibold leading-snug tracking-tight transition group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-amber-500 group-hover:to-cyan-600">
                {a.title}
              </h2>

              <p className="line-clamp-2 font-serif text-base text-muted-foreground">{a.excerpt}</p>

              <div className="mt-auto flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  <AuthorAvatar name={a.author.name} picture={a.author.picture} className="h-10 w-10" />
                  <div className="leading-tight">
                    <div className="text-sm font-semibold">{a.author.name}</div>
                    {a.author.role && (
                      <div className="text-xs text-muted-foreground">{a.author.role}</div>
                    )}
                  </div>
                </div>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-cyan-600 text-black opacity-0 transition group-hover:opacity-100">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}
