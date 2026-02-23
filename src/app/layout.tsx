import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { Toaster } from '@/components/ui/sonner'
import { siteConfig } from '@/content/site'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(process.env.APP_URL || siteConfig.url),
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative min-h-dvh bg-background text-foreground">
            {/* Global gradient wash (subtle) */}
            <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
              <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-gradient-to-br from-amber-400/20 to-cyan-600/20 blur-3xl" />
              <div className="absolute top-[35vh] -left-40 h-[520px] w-[520px] rounded-full bg-gradient-to-br from-cyan-600/15 to-amber-400/15 blur-3xl" />
              <div className="absolute -bottom-56 right-[-180px] h-[620px] w-[620px] rounded-full bg-gradient-to-br from-amber-400/15 to-fuchsia-500/10 blur-3xl" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(244,178,71,0.10),transparent_55%),radial-gradient(circle_at_bottom,rgba(11,79,108,0.08),transparent_55%)] dark:bg-[radial-gradient(circle_at_top,rgba(244,178,71,0.08),transparent_55%),radial-gradient(circle_at_bottom,rgba(11,79,108,0.10),transparent_55%)]" />
            </div>
            <SiteHeader />
            <main className="mx-auto w-full max-w-6xl px-4 py-10">
              <div className="rounded-[28px] border bg-background/65 p-4 shadow-sm backdrop-blur-md md:p-6">
                {children}
              </div>
            </main>
            <SiteFooter />
          </div>
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
