'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function verifyPayment(subscriptionId: string) {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
        throw new Error('Non autorisé')
    }

    const subscription = await prisma.subscription.findUnique({
        where: { id: subscriptionId },
        include: { payments: true },
    })

    if (!subscription) {
        throw new Error('Abonnement non trouvé')
    }

    // Calculate end date based on plan
    const now = new Date()
    const endDate = new Date(now)

    switch (subscription.plan) {
        case 'BASIC':
            // Add 1 month safely
            endDate.setMonth(endDate.getMonth() + 1)
            // Handle rollover (e.g. Jan 31 -> Feb 28/29)
            if (endDate.getDate() !== now.getDate()) {
                endDate.setDate(0)
            }
            break
        case 'PRO':
            // Add 1 month (same as BASIC)
            endDate.setMonth(endDate.getMonth() + 1)
            if (endDate.getDate() !== now.getDate()) {
                endDate.setDate(0)
            }
            break
        case 'ANNUAL':
            endDate.setFullYear(endDate.getFullYear() + 1)
            break
    }

    // Update subscription status and payment
    await prisma.subscription.update({
        where: { id: subscriptionId },
        data: {
            status: 'ACTIVE',
            startDate: now,
            endDate: endDate,
        },
    })

    // Mark payment as verified
    if (subscription.payments[0]) {
        await prisma.payment.update({
            where: { id: subscription.payments[0].id },
            data: {
                verifiedAt: now,
                verifiedBy: session.user.id,
            },
        })
    }

    revalidatePath('/admin/subscriptions')
    return { success: true }
}

export async function blockSubscription(subscriptionId: string) {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== 'ADMIN') {
        throw new Error('Non autorisé')
    }

    await prisma.subscription.update({
        where: { id: subscriptionId },
        data: { status: 'BLOCKED' },
    })

    revalidatePath('/admin/subscriptions')
    return { success: true }
}
