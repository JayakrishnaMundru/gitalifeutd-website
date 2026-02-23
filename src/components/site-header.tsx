import Link from 'next/link'
import { navLinks, siteConfig } from '@/content/site'
import { ModeToggle } from '@/components/mode-toggle'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="h-8 w-8 rounded-xl bg-gradient-to-br from-amber-400 to-cyan-600" />
          <span>{siteConfig.shortName}</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Link
            href="/events"
            className="hidden rounded-full bg-gradient-to-r from-amber-400 to-cyan-600 px-4 py-2 text-sm font-semibold text-black shadow-sm hover:opacity-90 md:inline-block"
          >
            Explore Events
          </Link>
        </div>
      </div>
    </header>
  )
}
