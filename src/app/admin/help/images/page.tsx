import { redirect } from 'next/navigation'
import { isAdminRequest } from '@/lib/admin-auth'
import { PageHero } from '@/components/page-hero'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

export default async function AdminImageHelpPage() {
  const ok = await isAdminRequest()
  if (!ok) redirect('/admin/login')

  return (
    <div className="space-y-8">
      <PageHero title="Image URLs" subtitle="How to use Google Drive images for event covers and resources." />

      <Card>
        <CardHeader>
          <CardTitle>Google Drive (recommended)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            1) Upload image to Google Drive → Right click → Share → set to <b>Anyone with the link</b>.
          </p>
          <p>
            2) Copy the share link like:
            <br />
            <code className="text-xs">https://drive.google.com/file/d/&lt;FILE_ID&gt;/view?usp=sharing</code>
          </p>
          <p>
            3) Paste it into the <b>Cover image URL</b> field. The site will automatically convert it to a direct image URL.
          </p>
          <p className="text-xs">
            Tip: If Drive shows an interstitial / permissions page, make sure sharing is public.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
