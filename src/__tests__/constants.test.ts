import { describe, it, expect } from 'vitest'
import { APP_CONSTANTS, VALIDATION, USER_ROLES, SUBSCRIPTION, HTTP_STATUS } from '@/lib/constants'

describe('Application Constants', () => {
    describe('APP_CONSTANTS', () => {
        it('should have correct MAX_FREE_GENERATIONS', () => {
            expect(APP_CONSTANTS.MAX_FREE_GENERATIONS).toBe(5)
        })

        it('should have PDF configuration', () => {
            expect(APP_CONSTANTS.PDF_CONFIG.MARGIN).toBe(1)
            expect(APP_CONSTANTS.PDF_CONFIG.SCALE).toBe(2)
            expect(APP_CONSTANTS.PDF_CONFIG.QUALITY).toBe(0.98)
        })

        it('should have timeout configuration', () => {
            expect(APP_CONSTANTS.TIMEOUTS.EXPORT).toBe(600)
            expect(APP_CONSTANTS.TIMEOUTS.NOTIFICATION).toBe(3000)
            expect(APP_CONSTANTS.TIMEOUTS.DEBOUNCE).toBe(500)
        })

        it('should have pricing tiers', () => {
            expect(APP_CONSTANTS.PRICING.BASIC).toBe(10000)
            expect(APP_CONSTANTS.PRICING.PRO).toBe(20000)
            expect(APP_CONSTANTS.PRICING.ANNUAL).toBe(100000)
        })

        it('should have LIMITS for AI and Groq', () => {
            expect(APP_CONSTANTS.LIMITS.MAX_AI_CONTENT_LENGTH).toBe(28_000)
            expect(APP_CONSTANTS.LIMITS.AI_GLOBAL_REQUESTS_PER_MINUTE).toBe(25)
            expect(APP_CONSTANTS.LIMITS.GROQ_MAX_COMPLETION_TOKENS).toBe(4000)
        })
    })

    describe('VALIDATION', () => {
        it('should have password length constraints', () => {
            expect(VALIDATION.MIN_PASSWORD_LENGTH).toBe(8)
            expect(VALIDATION.MAX_PASSWORD_LENGTH).toBe(128)
        })

        it('should have field length constraints', () => {
            expect(VALIDATION.MAX_EMAIL_LENGTH).toBe(255)
            expect(VALIDATION.MAX_NAME_LENGTH).toBe(100)
        })
    })

    describe('USER_ROLES', () => {
        it('should have USER role', () => {
            expect(USER_ROLES.USER).toBe('USER')
        })

        it('should have ADMIN role', () => {
            expect(USER_ROLES.ADMIN).toBe('ADMIN')
        })
    })

    describe('SUBSCRIPTION', () => {
        it('should have all plan types', () => {
            expect(SUBSCRIPTION.PLANS.STARTER).toBe('STARTER')
            expect(SUBSCRIPTION.PLANS.PRO).toBe('PRO')
            expect(SUBSCRIPTION.PLANS.BUSINESS).toBe('BUSINESS')
        })

        it('should have all status types', () => {
            expect(SUBSCRIPTION.STATUSES.PENDING).toBe('PENDING')
            expect(SUBSCRIPTION.STATUSES.ACTIVE).toBe('ACTIVE')
            expect(SUBSCRIPTION.STATUSES.EXPIRED).toBe('EXPIRED')
            expect(SUBSCRIPTION.STATUSES.CANCELLED).toBe('CANCELLED')
        })
    })

    describe('HTTP_STATUS', () => {
        it('should have success codes', () => {
            expect(HTTP_STATUS.OK).toBe(200)
            expect(HTTP_STATUS.CREATED).toBe(201)
        })

        it('should have client error codes', () => {
            expect(HTTP_STATUS.BAD_REQUEST).toBe(400)
            expect(HTTP_STATUS.UNAUTHORIZED).toBe(401)
            expect(HTTP_STATUS.FORBIDDEN).toBe(403)
            expect(HTTP_STATUS.NOT_FOUND).toBe(404)
        })

        it('should have server error codes', () => {
            expect(HTTP_STATUS.INTERNAL_SERVER_ERROR).toBe(500)
        })
    })
})
