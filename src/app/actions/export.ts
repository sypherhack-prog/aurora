'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { checkExportLimit } from '@/lib/export-service'

export async function checkAndIncrementExportLimit() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        throw new Error('UNAUTHORIZED')
    }

    try {
        await checkExportLimit(session.user.id)
        return { success: true }
    } catch (error: unknown) {
        if (error instanceof Error && error.message === 'EXPORT_LIMIT_REACHED') {
            return { success: false, error: 'LIMIT_REACHED' }
        }
        throw error
    }
}
