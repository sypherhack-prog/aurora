import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getUserPlan } from '@/lib/subscription'
import { processAIRequest, AIAction } from '@/lib/gemini'
import prisma from '@/lib/db'
import { logger } from '@/lib/logger'

export async function POST(req: NextRequest) {
    try {
        // 1. Check Authentication & Subscription
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
        }

        const plan = await getUserPlan(session.user.id)

        // Check Free Tier Limits
        if (plan === 'FREE') {
            const user = await prisma.user.findUnique({
                where: { id: session.user.id },
                select: { aiUsageCount: true }
            })

            if ((user?.aiUsageCount || 0) >= 5) {
                return NextResponse.json({
                    error: 'Limite gratuite atteinte (5/5). Veuillez passer au plan supérieur.',
                    code: 'LIMIT_REACHED'
                }, { status: 403 })
            }

            // Increment usage
            await prisma.user.update({
                where: { id: session.user.id },
                data: { aiUsageCount: { increment: 1 } }
            })
        }

        const { action, content, selection, theme, documentType } = await req.json()

        // Validate input
        if (!content && !selection && action !== 'generate-table' && action !== 'suggest-ideas') {
            return NextResponse.json({ error: 'Contenu requis' }, { status: 400 })
        }

        // Determine the content to process (selection takes precedence)
        const textToProcess = selection || content || ''

        // Call Gemini API
        const result = await processAIRequest({
            action: action as AIAction,
            content: textToProcess,
            theme,
            documentType
        })

        return NextResponse.json({ success: true, result })
    } catch (error) {
        logger.error('AI Processing Error:', error)
        return NextResponse.json({
            error: 'Erreur lors du traitement AI',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}

