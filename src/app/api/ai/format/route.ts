import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getBearerToken, verifyAddinToken } from '@/lib/addin-auth'
import { APP_CONSTANTS } from '@/lib/constants'
import { processAIRequest, AIAction } from '@/lib/groq'
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
    'translate-selection',
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

        // 1. Check Authentication (session from web app or Bearer token from Word Add-in)
        const session = await getServerSession(authOptions)
        const bearerToken = getBearerToken(req.headers.get('authorization'))
        let userId: string | null = session?.user?.id ?? null

        if (!userId && bearerToken) {
            const addinPayload = await verifyAddinToken(bearerToken)
            if (addinPayload) userId = addinPayload.userId
        }

        if (!userId) {
            return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
        }

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
        const maxLength = APP_CONSTANTS.LIMITS.MAX_AI_CONTENT_LENGTH
        if (textToProcess.length > maxLength) {
            return NextResponse.json(
                { error: `Contenu trop long (max ${maxLength} caractères)` },
                { status: 400 }
            )
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
        logger.error('AI route error', {
            message: error instanceof Error ? error.message : 'Unknown error',
            name: error instanceof Error ? error.name : 'UnknownError',
        })
        return formatErrorResponse(error)
    }
}

function formatErrorResponse(error: unknown): NextResponse {
    const message = error instanceof Error ? error.message : undefined
    const code = (error as { code?: string } | null)?.code

    if (message === 'SUBSCRIPTION_EXPIRED') {
        return NextResponse.json(
            {
                error: 'Votre abonnement a expiré. Veuillez renouveler pour continuer.',
                code: 'SUBSCRIPTION_EXPIRED',
            },
            { status: 403 }
        )
    }
    if (message === 'LIMIT_REACHED') {
        return NextResponse.json(
            {
                error: 'Limite gratuite atteinte (5/5). Veuillez passer au plan supérieur.',
                code: 'LIMIT_REACHED',
            },
            { status: 403 }
        )
    }
    if (message === 'USER_NOT_FOUND' || code === 'P2025') {
        return NextResponse.json(
            { error: 'Utilisateur introuvable. Veuillez vous reconnecter.' },
            { status: 401 }
        )
    }
    return NextResponse.json(
        { error: 'Erreur interne. Veuillez réessayer.' },
        { status: 500 }
    )
}


