/**
 * JWT auth for Word Add-in (Bearer token).
 * Uses same secret as NextAuth for consistency.
 */
import * as jose from 'jose'

const SECRET = process.env.NEXTAUTH_SECRET
const ISSUER = 'aurora-addin'
const AUDIENCE = 'aurora-addin'
const EXPIRY = '7d'

export type AddinTokenPayload = {
  userId: string
  email: string
  name?: string
}

export async function signAddinToken(payload: AddinTokenPayload): Promise<string> {
  if (!SECRET) {
    throw new Error('NEXTAUTH_SECRET is not set')
  }
  const key = new TextEncoder().encode(SECRET)
  return await new jose.SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setExpirationTime(EXPIRY)
    .sign(key)
}

export async function verifyAddinToken(token: string): Promise<AddinTokenPayload | null> {
  if (!SECRET) return null
  try {
    const key = new TextEncoder().encode(SECRET)
    const { payload } = await jose.jwtVerify(token, key, {
      issuer: ISSUER,
      audience: AUDIENCE,
    })
    const userId = payload.userId as string
    const email = payload.email as string
    const name = payload.name as string | undefined
    if (!userId || !email) return null
    return { userId, email, name }
  } catch {
    return null
  }
}

/**
 * Extract Bearer token from Authorization header.
 */
export function getBearerToken(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null
  return authHeader.slice(7).trim() || null
}
