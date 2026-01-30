import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'
import { logger } from '@/lib/logger'
import { APP_CONSTANTS } from '@/lib/constants'

// Map plan names to constant values
const planAmounts: Record<string, number> = {
    BASIC: APP_CONSTANTS.PRICING.BASIC,
    PRO: APP_CONSTANTS.PRICING.PRO,
    ANNUAL: APP_CONSTANTS.PRICING.ANNUAL,
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Vous devez être connecté' }, { status: 401 })
        }

        const body = await req.json()
        const { plan, mvolaRef, phoneNumber } = body

        if (!plan || !mvolaRef || !phoneNumber) {
            return NextResponse.json({ error: 'Tous les champs sont requis' }, { status: 400 })
        }

        if (!planAmounts[plan]) {
            return NextResponse.json({ error: 'Plan invalide' }, { status: 400 })
        }

        // Check for existing pending subscription
        const existingPending = await prisma.subscription.findFirst({
            where: {
                userId: session.user.id,
                status: 'PENDING',
            },
        })

        if (existingPending) {
            return NextResponse.json({
                error: 'Vous avez déjà une demande en attente de vérification'
            }, { status: 400 })
        }

        // Create subscription with payment record
        const subscription = await prisma.subscription.create({
            data: {
                userId: session.user.id,
                plan: plan as 'BASIC' | 'PRO' | 'ANNUAL',
                status: 'PENDING',
                payments: {
                    create: {
                        amount: planAmounts[plan],
                        mvolaRef,
                        phoneNumber,
                    },
                },
            },
            include: {
                payments: true,
            },
        })

        return NextResponse.json({
            success: true,
            subscription: {
                id: subscription.id,
                plan: subscription.plan,
                status: subscription.status,
            }
        })
    } catch (error) {
        logger.error('Subscription error:', error)
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }
}
