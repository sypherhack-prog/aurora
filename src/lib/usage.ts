import prisma from '@/lib/db'
import { APP_CONSTANTS } from '@/lib/constants'
import { getUserPlan } from '@/lib/subscription'

export async function validateUsageLimit(userId: string) {
    const plan = await getUserPlan(userId)

    // Block expired users
    if (plan === 'EXPIRED') {
        throw new Error('SUBSCRIPTION_EXPIRED')
    }

    if (plan !== 'FREE') return

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { aiUsageCount: true },
    })

    if (!user) {
        throw new Error('USER_NOT_FOUND')
    }

    // Hardcoded limit for FREE plan (can be moved to constants)
    if (user.aiUsageCount >= APP_CONSTANTS.MAX_FREE_GENERATIONS) {
        throw new Error('LIMIT_REACHED')
    }

    await prisma.user.update({
        where: { id: userId },
        data: { aiUsageCount: { increment: 1 } },
    })
}
