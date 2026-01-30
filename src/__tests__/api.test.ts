import { describe, it, expect } from 'vitest'


// Helper functions extracted to reduce nesting depth
interface ApiResponse<T = unknown> {
    success: boolean
    data?: T
    error?: string
}

const createSuccessResponse = <T>(data: T): ApiResponse<T> => ({
    success: true,
    data,
})

const createErrorResponse = (error: string): ApiResponse => ({
    success: false,
    error,
})

interface AIFormatRequest {
    action: string
    content: string
    theme?: string
    documentType?: string
}

const validateAIRequest = (req: AIFormatRequest): boolean => {
    if (!req.action || typeof req.action !== 'string') return false
    if (!req.content || typeof req.content !== 'string') return false
    return true
}

interface PaymentRequest {
    reference: string
    phone: string
    amount: number
}

const validatePaymentRequest = (req: PaymentRequest): string[] => {
    const errors: string[] = []
    if (!req.reference || req.reference.length < 5) {
        errors.push('Invalid reference number')
    }
    if (!req.phone || !/^0[0-9]{9}$/.test(req.phone)) {
        errors.push('Invalid phone number format')
    }
    if (!req.amount || req.amount <= 0) {
        errors.push('Amount must be positive')
    }
    return errors
}

// Tests
describe('Success Response', () => {
    it('should create valid success response', () => {
        const response = createSuccessResponse({ id: 1, name: 'Test' })
        expect(response.success).toBe(true)
        expect(response.data).toEqual({ id: 1, name: 'Test' })
    })

    it('should handle empty data', () => {
        const response = createSuccessResponse(null)
        expect(response.success).toBe(true)
    })

    it('should handle arrays', () => {
        const response = createSuccessResponse([1, 2, 3])
        expect(response.data).toHaveLength(3)
    })
})

describe('Error Response', () => {
    it('should create valid error response', () => {
        const response = createErrorResponse('Not found')
        expect(response.success).toBe(false)
        expect(response.error).toBe('Not found')
    })

    it('should handle empty error message', () => {
        const response = createErrorResponse('')
        expect(response.error).toBe('')
    })
})

describe('AI Format Request Validation', () => {
    it('should validate valid AI request', () => {
        const valid = validateAIRequest({ action: 'auto-format', content: '<p>Test</p>' })
        expect(valid).toBe(true)
    })

    it('should reject request without action', () => {
        const valid = validateAIRequest({ action: '', content: '<p>Test</p>' })
        expect(valid).toBe(false)
    })

    it('should reject request without content', () => {
        const valid = validateAIRequest({ action: 'auto-format', content: '' })
        expect(valid).toBe(false)
    })
})

describe('Payment Request Validation', () => {
    it('should validate valid payment request', () => {
        const errors = validatePaymentRequest({
            reference: 'REF12345',
            phone: '0341234567',
            amount: 10000,
        })
        expect(errors).toHaveLength(0)
    })

    it('should reject invalid phone number', () => {
        const errors = validatePaymentRequest({
            reference: 'REF12345',
            phone: '123',
            amount: 10000,
        })
        expect(errors).toContain('Invalid phone number format')
    })

    it('should reject negative amount', () => {
        const errors = validatePaymentRequest({
            reference: 'REF12345',
            phone: '0341234567',
            amount: -100,
        })
        expect(errors).toContain('Amount must be positive')
    })
})
