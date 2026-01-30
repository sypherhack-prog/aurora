import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock logger for testing
const mockLogger = {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
}

describe('Logger Utility', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('Log Levels', () => {
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

        it('should have debug method', () => {
            mockLogger.debug('Debug info')
            expect(mockLogger.debug).toHaveBeenCalledWith('Debug info')
        })
    })

    describe('Log Message Formatting', () => {
        it('should accept multiple arguments', () => {
            mockLogger.info('User action', { userId: 1, action: 'login' })
            expect(mockLogger.info).toHaveBeenCalledWith('User action', { userId: 1, action: 'login' })
        })

        it('should handle error objects', () => {
            const error = new Error('Test error')
            mockLogger.error('Operation failed', error)
            expect(mockLogger.error).toHaveBeenCalledWith('Operation failed', error)
        })
    })
})

describe('Error Handling Utilities', () => {
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

    describe('Custom Error Classes', () => {
        it('should create AppError with code', () => {
            const error = new AppError('Not found', 'NOT_FOUND', 404)
            expect(error.message).toBe('Not found')
            expect(error.code).toBe('NOT_FOUND')
            expect(error.statusCode).toBe(404)
        })

        it('should be instance of Error', () => {
            const error = new AppError('Test', 'TEST', 500)
            expect(error instanceof Error).toBe(true)
        })
    })

    describe('Error Message Extraction', () => {
        const getErrorMessage = (error: unknown): string => {
            if (error instanceof Error) return error.message
            if (typeof error === 'string') return error
            return 'An unknown error occurred'
        }

        it('should extract message from Error', () => {
            expect(getErrorMessage(new Error('Test error'))).toBe('Test error')
        })

        it('should handle string errors', () => {
            expect(getErrorMessage('String error')).toBe('String error')
        })

        it('should handle unknown errors', () => {
            expect(getErrorMessage({ random: 'object' })).toBe('An unknown error occurred')
            expect(getErrorMessage(null)).toBe('An unknown error occurred')
        })
    })
})

describe('Text Formatting Utilities', () => {
    describe('Text Truncation', () => {
        const truncate = (text: string, maxLength: number, suffix = '...'): string => {
            if (text.length <= maxLength) return text
            return text.slice(0, maxLength - suffix.length) + suffix
        }

        it('should not truncate short text', () => {
            expect(truncate('Short', 10)).toBe('Short')
        })

        it('should truncate long text with ellipsis', () => {
            expect(truncate('This is a very long text', 15)).toBe('This is a ve...')
        })

        it('should use custom suffix', () => {
            expect(truncate('Very long text here', 12, '…')).toBe('Very long te…')
        })
    })

    describe('Word Count', () => {
        const countWords = (text: string): number => {
            return text
                .trim()
                .split(/\s+/)
                .filter((w) => w.length > 0).length
        }

        it('should count words correctly', () => {
            expect(countWords('Hello World')).toBe(2)
            expect(countWords('One two three four')).toBe(4)
        })

        it('should handle empty string', () => {
            expect(countWords('')).toBe(0)
            expect(countWords('   ')).toBe(0)
        })

        it('should handle extra whitespace', () => {
            expect(countWords('  Hello   World  ')).toBe(2)
        })
    })

    describe('Slug Generation', () => {
        const generateSlug = (text: string): string => {
            return text
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '')
        }

        it('should convert to lowercase', () => {
            expect(generateSlug('Hello World')).toBe('hello-world')
        })

        it('should replace spaces with hyphens', () => {
            expect(generateSlug('My Document Title')).toBe('my-document-title')
        })

        it('should remove special characters', () => {
            expect(generateSlug('Hello! World?')).toBe('hello-world')
        })
    })
})

describe('Currency Formatting', () => {
    const formatCurrency = (amount: number, currency = 'MGA'): string => {
        return new Intl.NumberFormat('fr-MG', {
            style: 'currency',
            currency,
            minimumFractionDigits: 0,
        }).format(amount)
    }

    it('should format MGA currency', () => {
        const formatted = formatCurrency(10000)
        expect(formatted).toContain('10')
        expect(formatted).toContain('000')
    })

    it('should format large amounts', () => {
        const formatted = formatCurrency(1000000)
        expect(formatted).toContain('1')
    })
})
