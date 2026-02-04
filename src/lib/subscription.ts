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

    if (anySub) {
        if (anySub.status === 'EXPIRED') return 'EXPIRED'
        // If there is an end date and it's in the past, it's expired
        // If endDate is null, it means unlimited duration (so NOT expired)
        if (anySub.endDate && anySub.endDate < new Date()) return 'EXPIRED'
    }

    // If they never had one (new user) or have a non-active/non-expired status (e.g. PENDING), give FREE plan
    return 'FREE'
}
