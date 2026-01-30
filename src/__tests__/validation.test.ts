import { describe, it, expect } from 'vitest'

describe('Data Validation Utilities', () => {
    describe('User Role Validation', () => {
        const VALID_ROLES = ['USER', 'ADMIN'] as const
        type Role = (typeof VALID_ROLES)[number]

        const isValidRole = (role: unknown): role is Role => {
            return typeof role === 'string' && VALID_ROLES.includes(role as Role)
        }

        it('should accept USER role', () => {
            expect(isValidRole('USER')).toBe(true)
        })

        it('should accept ADMIN role', () => {
            expect(isValidRole('ADMIN')).toBe(true)
        })

        it('should reject invalid roles', () => {
            expect(isValidRole('GUEST')).toBe(false)
            expect(isValidRole('MODERATOR')).toBe(false)
            expect(isValidRole('')).toBe(false)
        })

        it('should reject non-string values', () => {
            expect(isValidRole(null)).toBe(false)
            expect(isValidRole(undefined)).toBe(false)
            expect(isValidRole(123)).toBe(false)
        })
    })

    describe('Subscription Status Validation', () => {
        const VALID_STATUSES = ['PENDING', 'ACTIVE', 'EXPIRED', 'CANCELLED'] as const
        type Status = (typeof VALID_STATUSES)[number]

        const isValidStatus = (status: unknown): status is Status => {
            return typeof status === 'string' && VALID_STATUSES.includes(status as Status)
        }

        it('should accept all valid statuses', () => {
            expect(isValidStatus('PENDING')).toBe(true)
            expect(isValidStatus('ACTIVE')).toBe(true)
            expect(isValidStatus('EXPIRED')).toBe(true)
            expect(isValidStatus('CANCELLED')).toBe(true)
        })

        it('should reject invalid statuses', () => {
            expect(isValidStatus('SUSPENDED')).toBe(false)
            expect(isValidStatus('active')).toBe(false) // case sensitive
        })
    })

    describe('Plan Validation', () => {
        const VALID_PLANS = ['STARTER', 'PRO', 'BUSINESS'] as const
        type Plan = (typeof VALID_PLANS)[number]

        const isValidPlan = (plan: unknown): plan is Plan => {
            return typeof plan === 'string' && VALID_PLANS.includes(plan as Plan)
        }

        it('should accept all valid plans', () => {
            expect(isValidPlan('STARTER')).toBe(true)
            expect(isValidPlan('PRO')).toBe(true)
            expect(isValidPlan('BUSINESS')).toBe(true)
        })

        it('should reject invalid plans', () => {
            expect(isValidPlan('FREE')).toBe(false)
            expect(isValidPlan('ENTERPRISE')).toBe(false)
        })
    })

    describe('Input Sanitization', () => {
        const sanitizeHtml = (input: string): string => {
            return input.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;')
        }

        it('should escape HTML tags', () => {
            expect(sanitizeHtml('<script>alert("xss")</script>')).toBe(
                '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
            )
        })

        it('should escape quotes', () => {
            expect(sanitizeHtml('Test "double" and \'single\' quotes')).toBe(
                'Test &quot;double&quot; and &#x27;single&#x27; quotes'
            )
        })

        it('should handle empty string', () => {
            expect(sanitizeHtml('')).toBe('')
        })

        it('should not modify safe text', () => {
            expect(sanitizeHtml('Hello World')).toBe('Hello World')
        })
    })

    describe('Date Validation', () => {
        const isValidDate = (date: unknown): boolean => {
            if (typeof date === 'string' || date instanceof Date) {
                const d = new Date(date)
                return !isNaN(d.getTime())
            }
            return false
        }

        const isExpired = (date: string | Date): boolean => {
            return new Date(date) < new Date()
        }

        it('should validate ISO date strings', () => {
            expect(isValidDate('2026-01-30T00:00:00Z')).toBe(true)
            expect(isValidDate('2026-01-30')).toBe(true)
        })

        it('should validate Date objects', () => {
            expect(isValidDate(new Date())).toBe(true)
        })

        it('should reject invalid date strings', () => {
            expect(isValidDate('not-a-date')).toBe(false)
            expect(isValidDate('2026-13-45')).toBe(false)
        })

        it('should detect expired dates', () => {
            expect(isExpired('2020-01-01')).toBe(true)
            expect(isExpired('2030-01-01')).toBe(false)
        })
    })

    describe('Numeric Validation', () => {
        const isPositiveNumber = (value: unknown): boolean => {
            return typeof value === 'number' && !isNaN(value) && value > 0
        }

        const isWithinRange = (value: number, min: number, max: number): boolean => {
            return value >= min && value <= max
        }

        it('should validate positive numbers', () => {
            expect(isPositiveNumber(10)).toBe(true)
            expect(isPositiveNumber(0.5)).toBe(true)
        })

        it('should reject non-positive values', () => {
            expect(isPositiveNumber(0)).toBe(false)
            expect(isPositiveNumber(-5)).toBe(false)
            expect(isPositiveNumber(NaN)).toBe(false)
        })

        it('should check range inclusion', () => {
            expect(isWithinRange(50, 0, 100)).toBe(true)
            expect(isWithinRange(0, 0, 100)).toBe(true)
            expect(isWithinRange(100, 0, 100)).toBe(true)
            expect(isWithinRange(101, 0, 100)).toBe(false)
        })
    })
})
