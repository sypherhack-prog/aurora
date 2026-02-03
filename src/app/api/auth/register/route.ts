import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { checkRateLimit, getClientIP, RATE_LIMITS } from '@/lib/rate-limit'
import { validateRegistration, userExists, createUserWithSubscription } from '@/lib/user-service'

export async function POST(req: NextRequest) {
    try {
        // Rate limiting to prevent brute-force
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
            // Use same error message to prevent email enumeration
            return NextResponse.json({ error: 'Impossible de créer le compte. Vérifiez vos informations.' }, { status: 400 })
        }

        await createUserWithSubscription(name, email, password)

        return NextResponse.json({
            success: true,
            message: 'Compte créé avec succès',
        })
    } catch (error: any) {
        if (error.message === 'MAX_USERS_REACHED') {
            return NextResponse.json(
                { error: 'Le nombre maximum d\'utilisateurs a été atteint. Les inscriptions sont temporairement fermées.' },
                { status: 403 }
            )
        }
        logger.error('Registration error:', error)
        return NextResponse.json({ error: 'Erreur lors de la création du compte' }, { status: 500 })
    }
}

