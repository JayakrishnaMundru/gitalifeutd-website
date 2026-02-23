import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { env } from '@/lib/env'

const COOKIE_NAME = 'gl_admin'

function secretKey() {
  // If AUTH_SECRET missing, fall back to a static dev secret.
  // Production should always set AUTH_SECRET.
  const s = env.AUTH_SECRET ?? 'dev-secret-change-me-please'
  return new TextEncoder().encode(s)
}

export async function createAdminSession() {
  const token = await new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey())

  const jar = await cookies()
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function clearAdminSession() {
  const jar = await cookies()
  jar.set(COOKIE_NAME, '', { path: '/', maxAge: 0 })
}

export async function isAdminRequest(): Promise<boolean> {
  const jar = await cookies()
  const token = jar.get(COOKIE_NAME)?.value
  if (!token) return false
  try {
    const { payload } = await jwtVerify(token, secretKey())
    return payload.role === 'admin'
  } catch {
    return false
  }
}

export function verifyAdminPassword(password: string): boolean {
  const expected = env.ADMIN_PASSWORD
  if (!expected) return false
  return password === expected
}
