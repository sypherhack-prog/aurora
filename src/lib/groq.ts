import { APP_CONSTANTS } from '@/lib/constants'
import { logger } from '@/lib/logger'
import { EXTENSIVE_SYSTEM_PROMPT, PROMPTS } from './ai-prompts'

// OpenAI (GPT‑4 mini) — seul provider utilisé
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'
const OPENAI_MODEL = 'gpt-4o-mini'

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

/** Ensures the API returns only the HTML fragment (or plain text), so it is never shown as raw markup in Word/editor. */
function cleanLLMOutput(text: string): string {
    let s = text
        .replace(/^```html\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/\s*```\s*$/i, '')
        .trim()
    const firstBracket = s.indexOf('<')
    const lastBracket = s.lastIndexOf('>')
    if (firstBracket !== -1 && lastBracket !== -1 && lastBracket >= firstBracket) {
        s = s.slice(firstBracket, lastBracket + 1)
    }
    return s.trim()
}

async function callOpenAI(messages: ChatMessage[]): Promise<string> {
    if (!OPENAI_API_KEY) {
        throw new Error('Missing OPENAI_API_KEY')
    }

    const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: OPENAI_MODEL,
            messages,
            temperature: 0.3,
            max_tokens: APP_CONSTANTS.LIMITS.GROQ_MAX_COMPLETION_TOKENS,
        }),
    })

    if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as ErrorResponse | Record<string, never>
        const message = errorData.error?.message || `OpenAI API Error: ${response.status}`
        const error = new Error(message) as Error & { status?: number }
        error.status = response.status
        throw error
    }

    const data = (await response.json()) as ChatCompletionResponse
    const rawText = data.choices?.[0]?.message?.content ?? ''

    return cleanLLMOutput(rawText)
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

    try {
        return await callOpenAI(messages)
    } catch (error: unknown) {
        logger.error('AI processing error:', error)
        if (error instanceof Error) {
            throw error
        }
        throw new Error('Failed to process with OpenAI (GPT‑4 mini)')
    }
}
