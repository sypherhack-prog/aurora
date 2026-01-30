import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import prisma from '@/lib/db'
import { logger } from '@/lib/logger'

export async function POST(req: NextRequest) {
    try {
        const { name, email, password } = await req.json()

        const validationError = validateRegistration(email, password)
        if (validationError) {
            return NextResponse.json({ error: validationError }, { status: 400 })
        }

        if (await userExists(email)) {
            return NextResponse.json({ error: 'Un compte existe déjà avec cet email' }, { status: 400 })
        }

        const user = await createUserWithSubscription(name, email, password)

        return NextResponse.json({
            success: true,
            message: 'Compte créé avec succès',
        })
    } catch (error) {
        logger.error('Registration error:', error)
        return NextResponse.json({ error: 'Erreur lors de la création du compte' }, { status: 500 })
    }
}

function validateRegistration(email: string, password: string): string | null {
    if (!email || !password) return 'Email et mot de passe requis'
    if (password.length < 6) return 'Le mot de passe doit contenir au moins 6 caractères'
    return null
}

async function userExists(email: string): Promise<boolean> {
    const existing = await prisma.user.findUnique({ where: { email } })
    return !!existing
}

async function createUserWithSubscription(name: string, email: string, pass: string) {
    const hashedPassword = await hash(pass, 12)

    return prisma.$transaction(async (tx: any) => {
        const user = await tx.user.create({
            data: { name, email, password: hashedPassword, role: 'USER' },
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
