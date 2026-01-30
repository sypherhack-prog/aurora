import { GoogleGenerativeAI } from '@google/generative-ai'
import { logger } from '@/lib/logger'

if (!process.env.GEMINI_API_KEY) {
    throw new Error('Missing GEMINI_API_KEY in environment variables')
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

export type AIAction =
    | 'auto-format'
    | 'fix-errors'
    | 'continue-writing'
    | 'suggest-ideas'
    | 'summarize'
    | 'generate-table'
    | 'generate-table'
    | 'improve-paragraph'
    | 'smart-heading'
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

export async function processAIRequest({ action, content, theme, documentType }: AIRequest): Promise<string> {
    const context = `
    ACTION: ${action}
    THEME: ${theme || 'general'}
    DOCUMENT TYPE: ${documentType || 'document'}
    CONTENT:
    "${content}"
    `

    let prompt = ''

    if (action === 'continue-writing') {
        prompt = PROMPTS['continue-writing'](theme || 'general', documentType || 'professional')
    } else if (action === 'suggest-ideas') {
        prompt = PROMPTS['suggest-ideas'](theme || 'general')
    } else if (action === 'generate-table') {
        prompt = PROMPTS['generate-table'](theme || 'general', documentType || 'document')
    } else if (action === 'translate') {
        prompt = PROMPTS['translate'](theme || 'English')
    } else if (action in PROMPTS) {
        // @ts-ignore
        prompt = PROMPTS[action]
    } else {
        throw new Error('Unknown action')
    }

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
