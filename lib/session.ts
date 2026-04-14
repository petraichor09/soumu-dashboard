import { SignJWT, jwtVerify } from 'jose'

const secretKey = process.env.SESSION_SECRET!
const encodedKey = new TextEncoder().encode(secretKey)

export type SessionPayload = {
  userId: number
  name: string
  role: string
  expiresAt: Date
}

export async function encrypt(payload: SessionPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
}

export async function decrypt(session: string | undefined = '') {
  if (!session) return null
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}
