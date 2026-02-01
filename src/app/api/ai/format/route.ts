/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { processAIRequest, AIAction } from '@/lib/gemini'
import { logger } from '@/lib/logger'
import { checkRateLimit, getClientIP, RATE_LIMITS } from '@/lib/rate-limit'
import { validateUsageLimit } from '@/lib/usage'

// Valid AI actions whitelist
const VALID_ACTIONS = [
    'auto-format',
    'fix-errors',
    'continue-writing',
    'suggest-ideas',
    'summarize',
    'generate-table',
    'improve-paragraph',
    'smart-heading',
    'improve-spacing',
    'translate',
] as const

export async function POST(req: NextRequest) {
    try {
        // 0. Rate limiting
        const ip = getClientIP(req)
        const rateLimit = checkRateLimit(`ai:${ip}`, RATE_LIMITS.AI)

        if (!rateLimit.success) {
            return NextResponse.json(
                { error: 'Trop de requêtes. Réessayez plus tard.' },
                {
                    status: 429,
                    headers: {
                        'Retry-After': rateLimit.resetIn.toString(),
                        'X-RateLimit-Remaining': '0',
                    }
                }
            )
        }

        // 1. Check Authentication
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
        }

        const userId = session.user.id

        // 2. Check Subscription & Limits
        await validateUsageLimit(userId)

        const { action, content, selection, theme, documentType } = await req.json()

        // Validate action is in whitelist
        if (!VALID_ACTIONS.includes(action)) {
            return NextResponse.json({ error: 'Action invalide' }, { status: 400 })
        }

        // Validate input
        if (!content && !selection && action !== 'generate-table' && action !== 'suggest-ideas') {
            return NextResponse.json({ error: 'Contenu requis' }, { status: 400 })
        }

        // Limit content size to prevent abuse
        const textToProcess = selection || content || ''
        if (textToProcess.length > 50000) {
            return NextResponse.json({ error: 'Contenu trop long (max 50000 caractères)' }, { status: 400 })
        }

        // Call Gemini API
        const result = await processAIRequest({
            action: action as AIAction,
            content: textToProcess,
            theme,
            documentType,
        })

        return NextResponse.json({ success: true, result })
    } catch (error: unknown) {
        if (error instanceof Error && error.message === 'LIMIT_REACHED') {
            return NextResponse.json(
                {
                    error: 'Limite gratuite atteinte (5/5). Veuillez passer au plan supérieur.',
                    code: 'LIMIT_REACHED',
                },
                { status: 403 }
            )
        }

        if (error instanceof Error && (error.message === 'USER_NOT_FOUND' || (error as any).code === 'P2025')) {
            return NextResponse.json(
                { error: 'Utilisateur introuvable. Veuillez vous reconnecter.' },
                { status: 401 }
            )
        }

        logger.error('AI Processing Error:', error)
        // Don't expose error details in production
        return NextResponse.json(
            { error: 'Erreur lors du traitement AI' },
            { status: 500 }
        )
    }
}


