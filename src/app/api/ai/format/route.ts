import { NextRequest, NextResponse } from 'next/server'
import { getServerSession, type Session } from 'next-auth'
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

type ValidAction = (typeof VALID_ACTIONS)[number]

function isValidAction(value: string): value is ValidAction {
    return (VALID_ACTIONS as readonly string[]).includes(value)
}

export async function POST(req: NextRequest) {
    try {
        // 0. Rate limiting (per-IP + global pour ne pas dépasser la clé Groq avec 100 users)
        const ip = getClientIP(req)
        const perIpLimit = checkRateLimit(`ai:${ip}`, RATE_LIMITS.AI)
        const globalLimit = checkRateLimit('ai:global', {
            limit: APP_CONSTANTS.LIMITS.AI_GLOBAL_REQUESTS_PER_MINUTE,
            windowSeconds: 60,
        })

        if (!perIpLimit.success) {
            return NextResponse.json(
                { error: 'Trop de requêtes depuis votre connexion. Réessayez dans une minute.' },
                {
                    status: 429,
                    headers: {
                        'Retry-After': perIpLimit.resetIn.toString(),
                        'X-RateLimit-Remaining': '0',
                    }
                }
            )
        }
        if (!globalLimit.success) {
            return NextResponse.json(
                { error: 'Service temporairement saturé. Réessayez dans une minute.' },
                {
                    status: 429,
                    headers: {
                        'Retry-After': globalLimit.resetIn.toString(),
                        'X-RateLimit-Remaining': '0',
                    }
                }
            )
        }

        // 1. Check Authentication (session from web app or Bearer token from Word Add-in)
        let session: Session | null = null
        try {
            session = await getServerSession(authOptions)
        } catch {
            // NextAuth can throw if NEXTAUTH_SECRET/URL missing; rely on Bearer below
        }
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

        let body: { action?: string; content?: string; selection?: string; theme?: string; documentType?: string }
        try {
            body = await req.json()
        } catch {
            return NextResponse.json(
                { error: 'Corps de requête invalide.' },
                { status: 400 }
            )
        }
        const { action, content, selection, theme, documentType } = body

        // Validate action is in whitelist
        if (!action || !isValidAction(action)) {
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

        // Call Gemini API (action narrowed by isValidAction)
        const result = await processAIRequest({
            action,
            content: textToProcess,
            theme,
            documentType,
        })

        return NextResponse.json({ success: true, result })
    } catch (error: unknown) {
        const err = error instanceof Error ? error : new Error(String(error))
        logger.error('AI route error', {
            message: err.message,
            name: err.name,
            stack: err.stack,
        })
        return formatErrorResponse(error)
    }
}

function formatErrorResponse(error: unknown): NextResponse {
    const message = error instanceof Error ? error.message : String(error)
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
    if (/429|rate limit|too many requests/i.test(message)) {
        return NextResponse.json(
            { error: 'Service IA temporairement saturé. Réessayez dans une minute.' },
            { status: 503 }
        )
    }
    if (/Groq API Error|Failed to process with Groq|Missing GROQ_API_KEY/i.test(message)) {
        return NextResponse.json(
            { error: 'Service IA indisponible. Veuillez réessayer dans un moment.' },
            { status: 503 }
        )
    }
    if (/NEXTAUTH_SECRET|Prisma|P1001|P1017|connection|ECONNREFUSED/i.test(message)) {
        return NextResponse.json(
            { error: 'Service temporairement indisponible. Réessayez dans un instant.' },
            { status: 503 }
        )
    }
    const isDev = process.env.NODE_ENV === 'development'
    return NextResponse.json(
        {
            error: 'Erreur interne. Veuillez réessayer.',
            ...(isDev && { detail: message }),
        },
        { status: 500 }
    )
}


