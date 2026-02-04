import prisma from '@/lib/db'

export async function getUserPlan(userId: string): Promise<string> {
    if (!userId) return 'FREE'

    // 1. Check if user is admin (equivalent to unlimited/highest plan)
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
    })

    if (user?.role === 'ADMIN') {
        return 'ADMIN'
    }

    // 2. Check for ACTIVE subscription that hasn't expired
    const activeSub = await prisma.subscription.findFirst({
        where: {
            userId: userId,
            status: 'ACTIVE',
            endDate: {
                gt: new Date(), // End date must be in the future
            },
        },
    })

    if (activeSub) {
        return activeSub.plan
    }

    // 3. Check if user has ANY subscription (even expired)
    const anySub = await prisma.subscription.findFirst({
        where: { userId },
    })

    // If they had a subscription before (expired), block them
    // If they never had one (new user), give FREE plan
    return anySub ? 'EXPIRED' : 'FREE'
}
