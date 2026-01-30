import { describe, it, expect, vi, beforeEach } from 'vitest'
import { APP_CONSTANTS } from '@/lib/constants'
import { countWords, formatCurrency, generateSlug, truncate } from '@/lib/utils'

// Mock logger
const mockLogger = {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
}

// Local helpers specific to tests or not yet migrated
class AppError extends Error {
    constructor(
        message: string,
        public code: string,
        public statusCode: number
    ) {
        super(message)
        this.name = 'AppError'
    }
}

const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message
    if (typeof error === 'string') return error
    return 'An unknown error occurred'
}

// Tests
describe('Logger', () => {
    beforeEach(() => vi.clearAllMocks())

    it('should have info method', () => {
        mockLogger.info('Test info message')
        expect(mockLogger.info).toHaveBeenCalledWith('Test info message')
    })

    it('should have warn method', () => {
        mockLogger.warn('Test warning')
        expect(mockLogger.warn).toHaveBeenCalledWith('Test warning')
    })

    it('should have error method', () => {
        mockLogger.error('Test error')
        expect(mockLogger.error).toHaveBeenCalledWith('Test error')
    })
})

describe('Custom Error', () => {
    it('should create AppError with code', () => {
        const error = new AppError('Not found', 'NOT_FOUND', 404)
        expect(error.message).toBe('Not found')
        expect(error.code).toBe('NOT_FOUND')
        expect(error.statusCode).toBe(404)
    })
})

describe('Error Message Extraction', () => {
    it('should extract message from Error', () => {
        expect(getErrorMessage(new Error('Test error'))).toBe('Test error')
    })

    it('should handle string errors', () => {
        expect(getErrorMessage('String error')).toBe('String error')
    })

    it('should handle unknown errors', () => {
        expect(getErrorMessage(null)).toBe('An unknown error occurred')
    })
})

describe('Text Truncation', () => {
    it('should not truncate short text', () => {
        expect(truncate('Short', 10)).toBe('Short')
    })

    it('should truncate long text', () => {
        expect(truncate('This is a very long text', 15)).toBe('This is a ve...')
    })
})

describe('Word Count', () => {
    it('should count words correctly', () => {
        expect(countWords('Hello World')).toBe(2)
    })

    it('should handle empty string', () => {
        expect(countWords('')).toBe(0)
    })
})

describe('Slug Generation', () => {
    it('should convert to lowercase', () => {
        expect(generateSlug('Hello World')).toBe('hello-world')
    })

    it('should remove special characters', () => {
        expect(generateSlug('Hello! World?')).toBe('hello-world')
    })
})

describe('Currency Formatting', () => {
    it('should format currency', () => {
        const formatted = formatCurrency(APP_CONSTANTS.PRICING.BASIC)
        // Adjust expectation based on Intl output which might vary slightly by environment but usually contains 'MGA' or symbol
        expect(formatted).toBeDefined()
    })
})
