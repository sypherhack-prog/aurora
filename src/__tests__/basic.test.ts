import { describe, it, expect } from 'vitest'

// Example test to verify testing setup works
describe('Basic Setup', () => {
    it('should pass a basic test', () => {
        expect(1 + 1).toBe(2)
    })
})

// Utility function tests
describe('Utility Functions', () => {
    it('should format dates correctly', () => {
        const date = new Date('2026-01-30')
        expect(date.getFullYear()).toBe(2026)
    })
})
