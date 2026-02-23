import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import Papa from 'papaparse'
import { isAdminRequest } from '@/lib/admin-auth'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const ok = await isAdminRequest()
  if (!ok) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const event = await prisma.event.findUnique({ where: { id } })
  if (!event) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const rsvps = await prisma.rSVP.findMany({ where: { eventId: id }, orderBy: { createdAt: 'desc' } })

  const csv = Papa.unparse(
    rsvps.map((r: (typeof rsvps)[number]) => ({
      id: r.id,
      fullName: r.fullName,
      email: r.email,
      phone: r.phone ?? '',
      studentStatus: r.studentStatus,
      dietaryPreference: r.dietaryPreference,
      notes: r.notes ?? '',
      consent: r.consent,
      createdAt: r.createdAt.toISOString(),
    }))
  )

  const filename = `${event.slug}-rsvps.csv`
  return new NextResponse(csv, {
    status: 200,
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="${filename}"`,
    },
  })
}
