import { describe, it, expect } from 'vitest'

// Helper functions extracted to reduce nesting depth
const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = []
    if (password.length < 8) errors.push('Password must be at least 8 characters')
    if (!/[A-Z]/.test(password)) errors.push('Password must contain uppercase letter')
    if (!/[0-9]/.test(password)) errors.push('Password must contain a number')
    if (!/[!@#$%^&*]/.test(password)) errors.push('Password must contain special character')
    return { valid: errors.length === 0, errors }
}

const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

interface Session {
    user?: { id?: string; email?: string; role?: string }
    expires?: string
}

const isValidSession = (session: Session | null): boolean => {
    if (!session || !session.user) return false
    if (!session.user.id || !session.user.email) return false
    if (!session.expires) return false
    return new Date(session.expires) > new Date()
}

// Tests
describe('Password Validation', () => {
    it('should reject short passwords', () => {
        const result = validatePassword('Short1!')
        expect(result.valid).toBe(false)
        expect(result.errors).toContain('Password must be at least 8 characters')
    })

    it('should reject passwords without uppercase', () => {
        const result = validatePassword('lowercase123!')
        expect(result.valid).toBe(false)
    })

    it('should reject passwords without numbers', () => {
        const result = validatePassword('NoNumbers!')
        expect(result.valid).toBe(false)
    })

    it('should accept valid passwords', () => {
        const result = validatePassword('ValidPass1!')
        expect(result.valid).toBe(true)
    })
})

describe('Email Validation', () => {
    it('should accept valid email formats', () => {
        expect(validateEmail('user@example.com')).toBe(true)
        expect(validateEmail('user.name@domain.co.uk')).toBe(true)
    })

    it('should reject invalid email formats', () => {
        expect(validateEmail('invalid')).toBe(false)
        expect(validateEmail('invalid@')).toBe(false)
        expect(validateEmail('@domain.com')).toBe(false)
    })
})

describe('Session Validation', () => {
    it('should reject null session', () => {
        expect(isValidSession(null)).toBe(false)
    })

    it('should reject session without user', () => {
        expect(isValidSession({ expires: '2030-01-01' })).toBe(false)
    })

    it('should reject session without expiry', () => {
        expect(isValidSession({ user: { id: '1', email: 'test@test.com' } })).toBe(false)
    })

    it('should accept valid session', () => {
        const valid = isValidSession({
            user: { id: '1', email: 'test@test.com', role: 'USER' },
            expires: '2030-01-01',
        })
        expect(valid).toBe(true)
    })
})
