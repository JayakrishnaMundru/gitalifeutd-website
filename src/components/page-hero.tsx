import Link from 'next/link'
import { Button } from '@/components/ui/button'

type Props = {
  title: string
  subtitle?: string
  ctaLabel?: string
  ctaHref?: string
}

export function PageHero({ title, subtitle, ctaLabel, ctaHref }: Props) {
  return (
    <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-amber-100/70 via-background to-cyan-100/60 p-6 dark:from-amber-900/25 dark:via-background dark:to-cyan-900/25 md:p-10">
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-amber-400/35 to-cyan-600/25 blur-3xl" />
      <div className="absolute -left-16 -bottom-24 h-64 w-64 rounded-full bg-gradient-to-br from-cyan-600/25 to-amber-400/25 blur-3xl" />
      <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
          {subtitle ? <p className="mt-2 max-w-2xl text-muted-foreground">{subtitle}</p> : null}
        </div>
        {ctaLabel && ctaHref ? (
          <Button asChild className="rounded-full bg-gradient-to-r from-amber-400 to-cyan-600 text-black hover:opacity-90">
            <Link href={ctaHref}>{ctaLabel}</Link>
          </Button>
        ) : null}
      </div>
    </section>
  )
}
