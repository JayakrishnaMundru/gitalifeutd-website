import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { createAdminSession, verifyAdminPassword } from '@/lib/admin-auth'

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  return (
    <div className="mx-auto max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={loginAction} className="grid gap-4">
            <input type="hidden" name="next" value={(searchParams as any)?.next ?? ''} />
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button type="submit" className="rounded-full">Sign in</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

async function loginAction(formData: FormData) {
  'use server'

  const password = String(formData.get('password') ?? '')
  const next = String(formData.get('next') ?? '')

  if (!verifyAdminPassword(password)) {
    // simple failure: redirect back
    redirect('/admin/login')
  }

  await createAdminSession()
  redirect(next && next.startsWith('/admin') ? next : '/admin')
}
