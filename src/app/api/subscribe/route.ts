import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'
import { logger } from '@/lib/logger'
import { APP_CONSTANTS } from '@/lib/constants'
import { checkRateLimit, getClientIP, RATE_LIMITS } from '@/lib/rate-limit'

// Map plan names to constant values (BASIC and ANNUAL only; PRO plan removed)
const planAmounts: Record<string, number> = {
    BASIC: APP_CONSTANTS.PRICING.BASIC,
    ANNUAL: APP_CONSTANTS.PRICING.ANNUAL,
}

export async function POST(req: NextRequest) {
    try {
        // Rate limiting
        const ip = getClientIP(req)
        const rateLimit = checkRateLimit(`subscribe:${ip}`, RATE_LIMITS.API)

        if (!rateLimit.success) {
            return NextResponse.json(
                { error: 'Trop de requêtes. Réessayez plus tard.' },
                {
                    status: 429,
                    headers: {
                        'Retry-After': rateLimit.resetIn.toString(),
                    }
                }
            )
        }

        const session = await getServerSession(authOptions)
        const userId = session?.user?.id

        if (!userId) {
            return NextResponse.json({ error: 'Vous devez être connecté' }, { status: 401 })
        }

        const body = await req.json()
        const { plan, mvolaRef, phoneNumber } = body

        if (!plan || !mvolaRef || !phoneNumber) {
            return NextResponse.json({ error: 'Tous les champs sont requis' }, { status: 400 })
        }

        const planAmount = planAmounts[plan]
        if (!planAmount) {
            return NextResponse.json({ error: 'Plan invalide' }, { status: 400 })
        }

        if (await hasPendingSubscription(session.user.id)) {
            return NextResponse.json(
                { error: 'Vous avez déjà une demande en attente de vérification' },
                { status: 400 }
            )
        }

        const subscription = await createSubscription(session.user.id, plan, planAmount, mvolaRef, phoneNumber)

        return NextResponse.json({
            success: true,
            subscription: {
                id: subscription.id,
                plan: subscription.plan,
                status: subscription.status,
            },
        })
    } catch (error) {
        logger.error('Subscription error:', error)
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
    }
}

async function hasPendingSubscription(userId: string) {
    const existing = await prisma.subscription.findFirst({
        where: { userId, status: 'PENDING' },
    })
    return !!existing
}

async function createSubscription(
    userId: string,
    plan: string,
    amount: number,
    mvolaRef: string,
    phoneNumber: string
) {
    return prisma.subscription.create({
        data: {
            userId,
            plan: plan as 'BASIC' | 'PRO' | 'ANNUAL',
            status: 'PENDING',
            payments: {
                create: {
                    amount,
                    mvolaRef,
                    phoneNumber,
                },
            },
        },
        include: { payments: true },
    })
}
