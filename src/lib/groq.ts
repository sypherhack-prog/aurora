
import { logger } from '@/lib/logger'
import { EXTENSIVE_SYSTEM_PROMPT, PROMPTS } from './ai-prompts'

const GROQ_API_KEY = process.env.GROQ_API_KEY
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

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

export async function processAIRequest({ action, content, theme, documentType }: AIRequest): Promise<string> {
    if (!GROQ_API_KEY) {
        throw new Error('Missing GROQ_API_KEY')
    }

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

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile', // Fast & Powerful
                messages: [
                    {
                        role: 'system',
                        content: EXTENSIVE_SYSTEM_PROMPT
                    },
                    {
                        role: 'user',
                        content: `${prompt}\n\n${context}`
                    }
                ],
                temperature: 0.3,
                max_completion_tokens: 4000,
            })
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.error?.message || `Groq API Error: ${response.status}`)
        }

        const data = await response.json()
        let text = data.choices[0]?.message?.content || ''

        // Cleanup markdown code blocks common in LLM outputs
        text = text
            .replace(/^```html/, '')
            .replace(/```$/, '')
            .trim()

        return text
    } catch (error: unknown) {
        logger.error('Groq API Error:', error)
        throw new Error(error instanceof Error ? error.message : 'Failed to process with Groq AI')
    }
}
