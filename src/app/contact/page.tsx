import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ContactForm } from '@/components/contact-form'
import { PageHero } from '@/components/page-hero'
import { siteConfig } from '@/content/site'

export default function ContactPage() {
  return (
    <div className="space-y-8">
      <PageHero
        title="Contact"
        subtitle="Questions? Want to collaborate? Send a message—we’ll get back soon."
        ctaLabel="Instagram @gitalifeutd"
        ctaHref={siteConfig.socials.instagram}
      />

      <Card>
        <CardHeader>
          <CardTitle>Send us a note</CardTitle>
        </CardHeader>
        <CardContent>
          <ContactForm />
        </CardContent>
      </Card>
    </div>
  )
}
