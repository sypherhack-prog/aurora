import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { checkRateLimit, getClientIP, RATE_LIMITS } from '@/lib/rate-limit'
import { validateRegistration, userExists, createUserWithSubscription } from '@/lib/user-service'

const TRANSIENT_PRISMA_CODES = new Set(['P1001', 'P1017', 'P2024'])

function isTransientDbError(error: unknown): boolean {
    const e = error as { code?: string; message?: string } | undefined
    if (!e) return false
    if (e.code && TRANSIENT_PRISMA_CODES.has(e.code)) return true
    const msg = (e.message || '').toLowerCase()
    return (
        msg.includes('connect') ||
        msg.includes('timeout') ||
        msg.includes('econnrefused') ||
        msg.includes('etimedout') ||
        msg.includes('connection')
    )
}

export async function POST(req: NextRequest) {
    try {
        const ip = getClientIP(req)
        const rateLimit = checkRateLimit(`register:${ip}`, RATE_LIMITS.AUTH)

        if (!rateLimit.success) {
            return NextResponse.json(
                { error: 'Trop de tentatives. Réessayez dans quelques minutes.' },
                {
                    status: 429,
                    headers: {
                        'Retry-After': rateLimit.resetIn.toString(),
                        'X-RateLimit-Remaining': '0',
                    }
                }
            )
        }

        const { name, email, password } = await req.json()

        const validationError = validateRegistration(name, email, password)
        if (validationError) {
            return NextResponse.json({ error: validationError }, { status: 400 })
        }

        if (await userExists(email)) {
            return NextResponse.json({ error: 'Impossible de créer le compte. Vérifiez vos informations.' }, { status: 400 })
        }

        let lastError: unknown
        for (let attempt = 1; attempt <= 2; attempt++) {
            try {
                await createUserWithSubscription(name, email, password)
                return NextResponse.json({
                    success: true,
                    message: 'Compte créé avec succès',
                })
            } catch (err) {
                lastError = err
                if (attempt === 1 && isTransientDbError(err)) {
                    logger.warn('Registration transient error, retrying', { error: err })
                    continue
                }
                throw err
            }
        }
        throw lastError
    } catch (error: unknown) {
        if (error instanceof Error && error.message === 'MAX_USERS_REACHED') {
            return NextResponse.json(
                { error: 'Le nombre maximum d\'utilisateurs a été atteint. Les inscriptions sont temporairement fermées.' },
                { status: 403 }
            )
        }
        const prismaError = error as { code?: string } | undefined
        if (prismaError?.code === 'P2002') {
            return NextResponse.json(
                { error: 'Un compte existe déjà avec cet email. Connectez-vous.' },
                { status: 409 }
            )
        }
        logger.error('Registration error:', error)
        return NextResponse.json(
            { error: 'Erreur temporaire lors de la création du compte. Réessayez dans quelques secondes.' },
            { status: 500 }
        )
    }
}

