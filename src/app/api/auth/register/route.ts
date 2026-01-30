import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import prisma from '@/lib/db'
import { logger } from '@/lib/logger'

export async function POST(req: NextRequest) {
    try {
        const { name, email, password } = await req.json()

        if (!email || !password) {
            return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 })
        }

        if (password.length < 6) {
            return NextResponse.json({ error: 'Le mot de passe doit contenir au moins 6 caractères' }, { status: 400 })
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return NextResponse.json({ error: 'Un compte existe déjà avec cet email' }, { status: 400 })
        }

        // Hash password and create user
        const hashedPassword = await hash(password, 12)

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'USER',
            },
        })

        // Create free tier subscription (BASIC plan with no end date = free trial)
        await prisma.subscription.create({
            data: {
                userId: user.id,
                plan: 'BASIC',
                status: 'ACTIVE',
                startDate: new Date(),
                endDate: null,
            },
        })

        return NextResponse.json({
            success: true,
            message: 'Compte créé avec succès',
        })
    } catch (error) {
        logger.error('Registration error:', error)
        return NextResponse.json({ error: 'Erreur lors de la création du compte' }, { status: 500 })
    }
}
