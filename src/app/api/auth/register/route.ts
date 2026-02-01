import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import prisma from '@/lib/db'
import { logger } from '@/lib/logger'
import { checkRateLimit, getClientIP, RATE_LIMITS } from '@/lib/rate-limit'

// Email validation regex (RFC 5322 simplified)
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

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
    } catch (error) {
        logger.error('Registration error:', error)
        return NextResponse.json({ error: 'Erreur lors de la création du compte' }, { status: 500 })
    }
}

function validateRegistration(name: string, email: string, password: string): string | null {
    // Check required fields
    if (!email || !password) {
        return 'Email et mot de passe requis'
    }

    // Validate name length
    if (name && name.length > 100) {
        return 'Le nom est trop long (max 100 caractères)'
    }

    // Validate email format
    if (!EMAIL_REGEX.test(email)) {
        return 'Format d\'email invalide'
    }

    // Validate email length
    if (email.length > 254) {
        return 'Email trop long'
    }

    // Password strength validation
    if (password.length < 8) {
        return 'Le mot de passe doit contenir au moins 8 caractères'
    }

    if (password.length > 128) {
        return 'Le mot de passe est trop long'
    }

    // Check for at least one number and one letter
    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
        return 'Le mot de passe doit contenir au moins une lettre et un chiffre'
    }

    return null
}

async function userExists(email: string): Promise<boolean> {
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
    return !!existing
}

async function createUserWithSubscription(name: string, email: string, pass: string) {
    const hashedPassword = await hash(pass, 12)

    return prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
            data: {
                name: name?.trim() || null,
                email: email.toLowerCase().trim(),
                password: hashedPassword,
                role: 'USER'
            },
        })

        await tx.subscription.create({
            data: {
                userId: user.id,
                plan: 'BASIC',
                status: 'ACTIVE',
                startDate: new Date(),
                endDate: null,
            },
        })

        return user
    })
}
