'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { navLinks, siteConfig } from '@/content/site'

export function MobileNav() {
  const pathname = usePathname()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open menu" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[320px]">
        <SheetHeader>
          <SheetTitle>{siteConfig.shortName}</SheetTitle>
        </SheetHeader>
        <nav className="mt-6 grid gap-2">
          {navLinks.map((l) => {
            const active = pathname === l.href || pathname.startsWith(l.href + '/')
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-xl border px-4 py-3 text-sm transition ${
                  active
                    ? 'bg-foreground text-background'
                    : 'bg-background text-muted-foreground hover:text-foreground'
                }`}
              >
                {l.label}
              </Link>
            )
          })}
          <a
            href={siteConfig.socials.instagram}
            className="mt-2 rounded-xl bg-gradient-to-r from-amber-400 to-cyan-600 px-4 py-3 text-sm font-semibold text-black"
          >
            Follow @gitalifeutd
          </a>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
