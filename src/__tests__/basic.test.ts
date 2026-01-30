import { describe, it, expect } from 'vitest'

// Helper functions extracted to reduce nesting depth
const formatDate = (date: Date): number => date.getFullYear()

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-MG', {
        style: 'currency',
        currency: 'MGA',
    }).format(amount)
}

const truncate = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength - 3) + '...'
}

// Tests - flat structure to reduce nesting
describe('Basic Setup', () => {
    it('should pass a basic test', () => {
        expect(1 + 1).toBe(2)
    })
})

describe('Date Formatting', () => {
    it('should get correct year', () => {
        const date = new Date('2026-01-30')
        expect(formatDate(date)).toBe(2026)
    })
})

describe('Currency Formatting', () => {
    it('should format MGA currency', () => {
        const formatted = formatCurrency(10000)
        expect(formatted).toContain('10')
        expect(formatted).toContain('000')
    })
})

describe('Text Truncation', () => {
    it('should not truncate short text', () => {
        expect(truncate('Short', 10)).toBe('Short')
    })

    it('should truncate long text with ellipsis', () => {
        expect(truncate('This is a very long text', 15)).toBe('This is a ve...')
    })
})
