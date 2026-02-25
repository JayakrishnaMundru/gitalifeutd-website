'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, ArrowRight, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { navLinks, siteConfig } from '@/content/site'

export function MobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Auto-close when route changes
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open menu" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px] p-0">
        <div className="border-b bg-gradient-to-br from-amber-100/70 via-background to-cyan-100/60 px-5 py-5 dark:from-amber-900/25 dark:to-cyan-900/25">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-r from-amber-400 to-cyan-600 text-black">
                <Sparkles className="h-5 w-5" />
              </span>
              {siteConfig.shortName}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-2 text-xs text-muted-foreground">Beginner-friendly • Dinner often • Good people</div>
        </div>

        <nav className="grid gap-2 px-4 py-4">
          {navLinks.map((l) => {
            const active = pathname === l.href || pathname.startsWith(l.href + '/')
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm transition ${
                  active
                    ? 'bg-foreground text-background'
                    : 'bg-background text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>{l.label}</span>
                <ArrowRight className={`h-4 w-4 ${active ? 'opacity-90' : 'opacity-40'}`} />
              </Link>
            )
          })}
          <a
            href={siteConfig.socials.instagram}
            className="mt-2 rounded-2xl bg-gradient-to-r from-amber-400 to-cyan-600 px-4 py-3 text-sm font-semibold text-black"
          >
            Follow @gitalifeutd
          </a>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
