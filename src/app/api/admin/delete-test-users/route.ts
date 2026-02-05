import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'
import { logger } from '@/lib/logger'

/**
 * POST /api/admin/delete-test-users
 * Admin-only endpoint to delete test users from production database
 */
export async function POST(req: NextRequest) {
    try {
        // Verify admin authentication
        const session = await getServerSession(authOptions)
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Non autorisé. Admin requis.' },
                { status: 403 }
            )
        }

        // List of test user emails to delete
        const testUserEmails = [
            'cursorailesy@gmail.com',
            'tonylesyeh@gmail.com',
            'refactor@test.com',
            'testuser789@test.com',
            'oree.35@usualion.com',
            'daxojas492@juhxs.com',
            'sypherhack@gmail.com',
        ]

        const results: Array<{ email: string; deleted: number }> = []

        for (const email of testUserEmails) {
            try {
                // Delete user (cascade will handle subscriptions and payments)
                const result = await prisma.user.deleteMany({
                    where: { email },
                })
                results.push({ email, deleted: result.count })
                logger.info(`Admin deleted test user: ${email}`, {
                    adminId: session.user.id,
                    deletedCount: result.count,
                })
            } catch (error: unknown) {
                const message = error instanceof Error ? error.message : 'Unknown error'
                logger.error(`Failed to delete test user ${email}`, { error: message })
                results.push({ email, deleted: 0 })
            }
        }

        const totalDeleted = results.reduce((sum, r) => sum + r.deleted, 0)

        return NextResponse.json({
            success: true,
            message: `${totalDeleted} compte(s) de test supprimé(s)`,
            results,
        })
    } catch (error: unknown) {
        logger.error('Admin delete-test-users error', {
            error: error instanceof Error ? error.message : 'Unknown error',
        })
        return NextResponse.json(
            { error: 'Erreur lors de la suppression des comptes de test' },
            { status: 500 }
        )
    }
}
