import { describe, it, expect } from 'vitest'

// Helper functions extracted to reduce nesting depth
const VALID_ROLES = ['USER', 'ADMIN'] as const
type Role = (typeof VALID_ROLES)[number]

const isValidRole = (role: unknown): role is Role => {
    return typeof role === 'string' && VALID_ROLES.includes(role as Role)
}

const VALID_STATUSES = ['PENDING', 'ACTIVE', 'EXPIRED', 'CANCELLED'] as const
type Status = (typeof VALID_STATUSES)[number]

const isValidStatus = (status: unknown): status is Status => {
    return typeof status === 'string' && VALID_STATUSES.includes(status as Status)
}

const VALID_PLANS = ['STARTER', 'PRO', 'BUSINESS'] as const
type Plan = (typeof VALID_PLANS)[number]

const isValidPlan = (plan: unknown): plan is Plan => {
    return typeof plan === 'string' && VALID_PLANS.includes(plan as Plan)
}

const sanitizeHtml = (input: string): string => {
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
}

const isValidDate = (date: unknown): boolean => {
    if (typeof date === 'string' || date instanceof Date) {
        const d = new Date(date)
        return !isNaN(d.getTime())
    }
    return false
}

const isExpired = (date: string | Date): boolean => new Date(date) < new Date()

const isPositiveNumber = (value: unknown): boolean => {
    return typeof value === 'number' && !isNaN(value) && value > 0
}

const isWithinRange = (value: number, min: number, max: number): boolean => {
    return value >= min && value <= max
}

// Tests
describe('User Role Validation', () => {
    it('should accept USER role', () => expect(isValidRole('USER')).toBe(true))
    it('should accept ADMIN role', () => expect(isValidRole('ADMIN')).toBe(true))
    it('should reject invalid roles', () => expect(isValidRole('GUEST')).toBe(false))
    it('should reject non-string values', () => expect(isValidRole(123)).toBe(false))
})

describe('Subscription Status Validation', () => {
    it('should accept all valid statuses', () => {
        expect(isValidStatus('PENDING')).toBe(true)
        expect(isValidStatus('ACTIVE')).toBe(true)
        expect(isValidStatus('EXPIRED')).toBe(true)
        expect(isValidStatus('CANCELLED')).toBe(true)
    })

    it('should reject invalid statuses', () => {
        expect(isValidStatus('SUSPENDED')).toBe(false)
        expect(isValidStatus('active')).toBe(false)
    })
})

describe('Plan Validation', () => {
    it('should accept all valid plans', () => {
        expect(isValidPlan('STARTER')).toBe(true)
        expect(isValidPlan('PRO')).toBe(true)
        expect(isValidPlan('BUSINESS')).toBe(true)
    })

    it('should reject invalid plans', () => {
        expect(isValidPlan('FREE')).toBe(false)
    })
})

describe('HTML Sanitization', () => {
    it('should escape HTML tags', () => {
        const result = sanitizeHtml('<script>alert("xss")</script>')
        expect(result).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;')
    })

    it('should handle empty string', () => {
        expect(sanitizeHtml('')).toBe('')
    })
})

describe('Date Validation', () => {
    it('should validate ISO date strings', () => {
        expect(isValidDate('2026-01-30T00:00:00Z')).toBe(true)
    })

    it('should reject invalid date strings', () => {
        expect(isValidDate('not-a-date')).toBe(false)
    })

    it('should detect expired dates', () => {
        expect(isExpired('2020-01-01')).toBe(true)
        expect(isExpired('2030-01-01')).toBe(false)
    })
})

describe('Numeric Validation', () => {
    it('should validate positive numbers', () => {
        expect(isPositiveNumber(10)).toBe(true)
        expect(isPositiveNumber(0)).toBe(false)
        expect(isPositiveNumber(-5)).toBe(false)
    })

    it('should check range inclusion', () => {
        expect(isWithinRange(50, 0, 100)).toBe(true)
        expect(isWithinRange(101, 0, 100)).toBe(false)
    })
})
