import { APP_CONSTANTS } from '@/lib/constants'
import { logger } from '@/lib/logger'
import { EXTENSIVE_SYSTEM_PROMPT, PROMPTS } from './ai-prompts'

const GROQ_API_KEY = process.env.GROQ_API_KEY
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
const OPENROUTER_MODEL = 'meta-llama/llama-3.1-70b-instruct'

export type AIAction =
    | 'auto-format'
    | 'fix-errors'
    | 'continue-writing'
    | 'suggest-ideas'
    | 'summarize'
    | 'generate-table'
    | 'improve-paragraph'
    | 'smart-heading'
    | 'improve-spacing'
    | 'translate'
    | 'translate-selection'

interface AIRequest {
    action: AIAction
    content: string
    theme?: string
    documentType?: string
}

type ChatMessage = {
    role: 'system' | 'user' | 'assistant'
    content: string
}

type ChatCompletionResponse = {
    choices?: Array<{
        message?: {
            content?: string
        }
    }>
}

type ErrorResponse = {
    error?: {
        message?: string
    }
}

type Provider = 'groq' | 'openrouter'

function resolvePrompt(action: AIAction, theme: string, docType: string): string {
    if (action === 'continue-writing') return PROMPTS['continue-writing'](theme, docType)
    if (action === 'suggest-ideas') return PROMPTS['suggest-ideas'](theme)
    if (action === 'generate-table') return PROMPTS['generate-table'](theme, docType)
    if (action === 'translate') return PROMPTS['translate'](theme)
    if (action === 'translate-selection') return PROMPTS['translate-selection'](theme)

    const simplePrompt = PROMPTS[action as keyof typeof PROMPTS]
    if (typeof simplePrompt === 'string') return simplePrompt

    throw new Error(`Unknown action: ${action}`)
}

function buildMessages(prompt: string, context: string): ChatMessage[] {
    return [
        {
            role: 'system',
            content: EXTENSIVE_SYSTEM_PROMPT,
        },
        {
            role: 'user',
            content: `${prompt}\n\n${context}`,
        },
    ]
}

function cleanLLMOutput(text: string): string {
    return text
        .replace(/^```html/, '')
        .replace(/```$/, '')
        .trim()
}

function isQuotaOrRateLimitError(error: unknown): boolean {
    if (!error || typeof error !== 'object') return false

    const maybeError = error as { message?: string; status?: number }
    if (maybeError.status === 429) return true

    const message = (maybeError.message || '').toLowerCase()
    return (
        message.includes('rate limit') ||
        message.includes('too many requests') ||
        message.includes('quota') ||
        message.includes('requests per minute')
    )
}

async function callGroq(messages: ChatMessage[]): Promise<string> {
    if (!GROQ_API_KEY) {
        throw new Error('Missing GROQ_API_KEY')
    }

    const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'llama-3.3-70b-versatile', // Fast & Powerful
            messages,
            temperature: 0.3,
            max_completion_tokens: APP_CONSTANTS.LIMITS.GROQ_MAX_COMPLETION_TOKENS,
        }),
    })

    if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as ErrorResponse | Record<string, never>
        const message = errorData.error?.message || `Groq API Error: ${response.status}`
        const error = new Error(message) as Error & { status?: number }
        error.status = response.status
        throw error
    }

    const data = (await response.json()) as ChatCompletionResponse
    const rawText = data.choices?.[0]?.message?.content ?? ''

    return cleanLLMOutput(rawText)
}

async function callOpenRouter(messages: ChatMessage[]): Promise<string> {
    if (!OPENROUTER_API_KEY) {
        throw new Error('Missing OPENROUTER_API_KEY')
    }

    const headers: Record<string, string> = {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
    }

    const siteUrl = process.env.SITE_URL
    if (siteUrl) {
        headers['HTTP-Referer'] = siteUrl
        headers['X-Title'] = 'Aurora Omega'
    }

    const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            model: OPENROUTER_MODEL,
            messages,
            temperature: 0.3,
            max_tokens: APP_CONSTANTS.LIMITS.GROQ_MAX_COMPLETION_TOKENS,
        }),
    })

    if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as ErrorResponse | Record<string, never>
        const message = errorData.error?.message || `OpenRouter API Error: ${response.status}`
        const error = new Error(message) as Error & { status?: number }
        error.status = response.status
        throw error
    }

    const data = (await response.json()) as ChatCompletionResponse
    const rawText = data.choices?.[0]?.message?.content ?? ''

    return cleanLLMOutput(rawText)
}

function getProviderOrderForAction(action: AIAction): Provider[] {
    // Actions critiques pour le rendu final du manuscrit → Groq en priorité
    if (
        action === 'auto-format' ||
        action === 'fix-errors' ||
        action === 'improve-paragraph' ||
        action === 'improve-spacing' ||
        action === 'smart-heading'
    ) {
        return ['groq', 'openrouter']
    }

    // Actions plus “créatives” ou secondaires → OpenRouter en priorité pour préserver le quota Groq
    return ['openrouter', 'groq']
}

async function routeAIRequest(messages: ChatMessage[], preferredOrder: Provider[]): Promise<string> {
    const providers: Provider[] = []

    // Respecter l'ordre de préférence mais ignorer les providers non configurés
    for (const provider of preferredOrder) {
        if (provider === 'groq' && GROQ_API_KEY) providers.push('groq')
        if (provider === 'openrouter' && OPENROUTER_API_KEY) providers.push('openrouter')
    }

    // Si jamais la config est incomplète, ajouter tout provider dispo en secours
    if (providers.length === 0) {
        if (GROQ_API_KEY) providers.push('groq')
        if (OPENROUTER_API_KEY) providers.push('openrouter')
    }

    if (providers.length === 0) {
        throw new Error('No AI provider configured')
    }

    let lastError: unknown

    for (const provider of providers) {
        try {
            if (provider === 'groq') {
                return await callGroq(messages)
            }
            if (provider === 'openrouter') {
                return await callOpenRouter(messages)
            }
        } catch (error) {
            lastError = error

            if (provider === 'groq' && isQuotaOrRateLimitError(error)) {
                logger.warn('Groq quota/rate limit reached, falling back to next AI provider', {
                    error: error instanceof Error ? { message: error.message, name: error.name } : String(error),
                })
                continue
            }

            // For non-quota errors, fail fast
            throw error instanceof Error
                ? error
                : new Error('AI provider error while processing request')
        }
    }

    // If we reach here, all providers failed (likely quota/rate limit)
    logger.error('All AI providers failed', {
        error: lastError instanceof Error ? { message: lastError.message, name: lastError.name } : String(lastError),
    })
    throw new Error(
        lastError instanceof Error
            ? `Groq API Error: ${lastError.message}`
            : 'Groq API Error: all AI providers unavailable',
    )
}

export async function processAIRequest({ action, content, theme, documentType }: AIRequest): Promise<string> {
    const validTheme = theme || 'general'
    const validDocType = documentType || 'document'

    const context = `
    ACTION: ${action}
    THEME: ${validTheme}
    DOCUMENT TYPE: ${validDocType}
    CONTENT:
    "${content}"
    `

    const prompt = resolvePrompt(action, validTheme, validDocType)
    const messages = buildMessages(prompt, context)
    const providerOrder = getProviderOrderForAction(action)

    try {
        return await routeAIRequest(messages, providerOrder)
    } catch (error: unknown) {
        logger.error('AI processing error:', error)
        if (error instanceof Error) {
            throw error
        }
        throw new Error('Failed to process with Groq AI')
    }
}
