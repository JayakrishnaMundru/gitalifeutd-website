import Link from 'next/link'
import { siteConfig } from '@/content/site'

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 font-semibold">
            <span className="h-8 w-8 rounded-xl bg-gradient-to-br from-amber-400 to-cyan-600" />
            <span>{siteConfig.name}</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{siteConfig.description}</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Get involved</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link href="/events" className="hover:text-foreground">
                Upcoming events
              </Link>
            </li>
            <li>
              <Link href="/programs" className="hover:text-foreground">
                Programs
              </Link>
            </li>
            <li>
              <Link href="/resources" className="hover:text-foreground">
                Beginner resources
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Contact</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <a href={`mailto:${siteConfig.socials.email}`} className="hover:text-foreground">
                {siteConfig.socials.email}
              </a>
            </li>
            <li>
              <a href={siteConfig.socials.instagram} className="hover:text-foreground">
                Instagram
              </a>
            </li>
            <li>
              <a href={siteConfig.socials.youtube} className="hover:text-foreground">
                YouTube
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t py-6 text-center text-xs text-muted-foreground">
        <div>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</div>
        <div className="mt-2 flex items-center justify-center gap-4">
          <Link href="/legal/privacy" className="hover:text-foreground">Privacy</Link>
          <Link href="/legal/terms" className="hover:text-foreground">Terms</Link>
        </div>
      </div>
    </footer>
  )
}
