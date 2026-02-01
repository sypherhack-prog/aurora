import { GoogleGenerativeAI } from '@google/generative-ai'
import { logger } from '@/lib/logger'

if (!process.env.GEMINI_API_KEY) {
    throw new Error('Missing GEMINI_API_KEY in environment variables')
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

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

interface AIRequest {
    action: AIAction
    content: string
    theme?: string
    documentType?: string
}

import { EXTENSIVE_SYSTEM_PROMPT, PROMPTS } from './ai-prompts'


function resolvePrompt(action: AIAction, theme: string, docType: string): string {
    if (action === 'continue-writing') return PROMPTS['continue-writing'](theme, docType)
    if (action === 'suggest-ideas') return PROMPTS['suggest-ideas'](theme)
    if (action === 'generate-table') return PROMPTS['generate-table'](theme, docType)
    if (action === 'translate') return PROMPTS['translate'](theme)

    const simplePrompt = PROMPTS[action as keyof typeof PROMPTS]
    if (typeof simplePrompt === 'string') return simplePrompt

    throw new Error(`Unknown action: ${action}`)
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
    const fullPrompt = `${EXTENSIVE_SYSTEM_PROMPT}\n\n${prompt}\n\n${context}`

    try {
        const result = await model.generateContent(fullPrompt)
        const response = result.response
        let text = response.text()

        // Cleanup markdown code blocks if the model ignores the instruction
        text = text
            .replace(/^```html/, '')
            .replace(/```$/, '')
            .trim()

        return text
    } catch (error) {
        logger.error('Gemini API Error:', error)
        throw new Error('Failed to process with AI')
    }
}
