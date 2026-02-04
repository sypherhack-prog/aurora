import prisma from '@/lib/db'
import { APP_CONSTANTS } from '@/lib/constants'
import { getUserPlan } from '@/lib/subscription'

export async function checkExportLimit(userId: string) {
    const plan = await getUserPlan(userId)

    // If not FREE, no limit (or different limit, but currently only FREE has limit mentioned)
    if (plan !== 'FREE') return

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            exportCount: true,
            lastExportDate: true
        },
    })

    if (!user) {
        throw new Error('USER_NOT_FOUND')
    }

    const now = new Date()
    const lastExport = user.lastExportDate ? new Date(user.lastExportDate) : null

    // Check if we need to reset the counter (new month)
    let currentCount = user.exportCount

    if (lastExport) {
        const isSameMonth = lastExport.getMonth() === now.getMonth() &&
            lastExport.getFullYear() === now.getFullYear()

        if (!isSameMonth) {
            currentCount = 0
            // We'll update the resets in the DB update below effectively by using 0
        }
    }

    if (currentCount >= APP_CONSTANTS.MAX_FREE_EXPORTS) {
        throw new Error('EXPORT_LIMIT_REACHED')
    }

    // Increment count and update date
    await prisma.user.update({
        where: { id: userId },
        data: {
            exportCount: lastExport && lastExport.getMonth() !== now.getMonth() ? 1 : { increment: 1 },
            lastExportDate: now
        },
    })
}
