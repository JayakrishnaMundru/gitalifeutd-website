export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { isAdminRequest } from '@/lib/admin-auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default async function AdminEventRsvpsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const ok = await isAdminRequest()
  if (!ok) redirect('/admin/login')

  const { id } = await params
  const event = await prisma.event.findUnique({ where: { id } })
  if (!event) redirect('/admin')

  const rsvps = await prisma.rSVP.findMany({
    where: { eventId: id },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{event.title} — RSVPs</CardTitle>
          <div className="text-sm text-muted-foreground">Total: {rsvps.length}</div>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Diet</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rsvps.map((r: (typeof rsvps)[number]) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.fullName}</TableCell>
                    <TableCell>{r.email}</TableCell>
                    <TableCell>{r.phone || '—'}</TableCell>
                    <TableCell>{r.studentStatus}</TableCell>
                    <TableCell>{r.dietaryPreference}</TableCell>
                    <TableCell className="max-w-[220px] truncate" title={r.notes ?? ''}>
                      {r.notes || '—'}
                    </TableCell>
                    <TableCell>{new Date(r.createdAt).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
