'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, CalendarDays, Clock } from 'lucide-react'
import { AuthorAvatar } from '@/components/article-media'
import { ArticleContent } from '@/components/article-content'
import { Badge } from '@/components/ui/badge'
import { isExternalUrl, resolveImageUrl } from '@/lib/images'

type Props = {
  title: string
  excerpt: string
  coverImage?: string
  /** 'contain' shows the whole image uncropped; 'cover' fills a banner and crops. */
  coverFit?: 'contain' | 'cover'
  date: string
  readTime: string
  tags?: string[]
  content: string
  author: { name: string; picture?: string; role?: string; bio?: string }
}

const ease = [0.22, 1, 0.36, 1] as const

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function ArticleView(props: Props) {
  return (
    <article className="mx-auto max-w-3xl">
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease }}
      >
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Reflections
        </Link>
      </motion.div>

      <motion.header
        className="mt-6 space-y-5"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease }}
      >
        {props.tags && props.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {props.tags.map((t) => (
              <Badge key={t} variant="secondary" className="rounded-full">
                {t}
              </Badge>
            ))}
          </div>
        )}

        <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
          {props.title}
        </h1>

        <p className="font-serif text-xl italic text-muted-foreground">{props.excerpt}</p>

        <div className="flex flex-wrap items-center gap-4 border-y py-4">
          <div className="flex items-center gap-3">
            <AuthorAvatar name={props.author.name} picture={props.author.picture} className="h-12 w-12" />
            <div className="leading-tight">
              <div className="font-semibold">{props.author.name}</div>
              {props.author.role && (
                <div className="text-sm text-muted-foreground">{props.author.role}</div>
              )}
            </div>
          </div>
          <span className="hidden h-8 w-px bg-border sm:block" />
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              {formatDate(props.date)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {props.readTime}
            </span>
          </div>
        </div>
      </motion.header>

      {props.coverImage && (
        <motion.figure
          className="mt-8 flex justify-center"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease, delay: 0.05 }}
        >
          {props.coverFit === 'cover' ? (
            // Banner mode: fill a wide frame and crop to fit.
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={isExternalUrl(props.coverImage) ? resolveImageUrl(props.coverImage) : props.coverImage}
                alt={props.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          ) : (
            // Full mode: show the whole image uncropped at any screen size.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={isExternalUrl(props.coverImage) ? resolveImageUrl(props.coverImage) : props.coverImage}
              alt={props.title}
              className="h-auto w-full max-w-xl rounded-3xl border object-contain shadow-sm"
            />
          )}
        </motion.figure>
      )}

      <motion.div
        className="mt-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease, delay: 0.12 }}
      >
        <ArticleContent content={props.content} />
      </motion.div>

      {props.author.bio && (
        <motion.div
          className="mt-12 flex items-start gap-4 rounded-3xl border bg-gradient-to-br from-amber-100/50 via-card to-cyan-100/40 p-6 dark:from-amber-900/20 dark:to-cyan-900/20"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.18 }}
        >
          <AuthorAvatar name={props.author.name} picture={props.author.picture} className="h-14 w-14 shrink-0" />
          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Written by</div>
            <div className="font-serif text-lg font-semibold">{props.author.name}</div>
            <p className="mt-1 font-serif text-base text-muted-foreground">{props.author.bio}</p>
          </div>
        </motion.div>
      )}

      <div className="mt-12 flex justify-center">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-cyan-600 px-5 py-2.5 text-sm font-semibold text-black transition hover:opacity-90"
        >
          <ArrowLeft className="h-4 w-4" />
          Read more reflections
        </Link>
      </div>
    </article>
  )
}
