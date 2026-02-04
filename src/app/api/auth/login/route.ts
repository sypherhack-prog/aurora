import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { compare } from 'bcryptjs'
import { signAddinToken } from '@/lib/addin-auth'

/**
 * POST /api/auth/login
 * Used by the Word Add-in: accepts email/password and returns a JWT + user.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const email = typeof body.email === 'string' ? body.email.trim() : ''
    const password = typeof body.password === 'string' ? body.password : ''

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      )
    }

    const valid = await compare(password, user.password)
    if (!valid) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect' },
        { status: 401 }
      )
    }

    const token = await signAddinToken({
      userId: user.id,
      email: user.email,
      name: user.name ?? undefined,
    })

    return NextResponse.json({
      token,
      user: {
        name: user.name ?? email.split('@')[0],
        email: user.email,
      },
    })
  } catch (e) {
    console.error('[auth/login]', e)
    return NextResponse.json(
      { error: 'Erreur de connexion' },
      { status: 500 }
    )
  }
}
