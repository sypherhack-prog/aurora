import { describe, it, expect, beforeEach, vi } from 'vitest'
import { validateUsageLimit } from '../lib/usage'
import { APP_CONSTANTS } from '../lib/constants'

// Mock prisma and strict types
const mockFindUnique = vi.fn()
const mockFindFirst = vi.fn()
const mockUpdate = vi.fn()

vi.mock('../lib/db', () => ({
    __esModule: true,
    default: {
        user: {
            findUnique: (...args: any[]) => mockFindUnique(...args),
            update: (...args: any[]) => mockUpdate(...args),
        },
        subscription: {
            findFirst: (...args: any[]) => mockFindFirst(...args),
        },
    },
}))

describe('validateUsageLimit', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('should allow usage for FREE user under limit', async () => {
        // Mock FREE plan (no active subscription)
        mockFindFirst.mockResolvedValue(null)
        // Mock user with usage count 0
        mockFindUnique.mockResolvedValue({ role: 'USER', aiUsageCount: 0 })

        await expect(validateUsageLimit('user-id')).resolves.not.toThrow()

        // Should verify it tries to increment
        expect(mockUpdate).toHaveBeenCalled()
    })

    it('should throw LIMIT_REACHED for FREE user at limit', async () => {
        // Mock FREE plan
        mockFindFirst.mockResolvedValue(null)
        // Mock user with usage count >= MAX_FREE_GENERATIONS
        mockFindUnique.mockResolvedValue({ role: 'USER', aiUsageCount: APP_CONSTANTS.MAX_FREE_GENERATIONS })

        await expect(validateUsageLimit('user-id')).rejects.toThrow('LIMIT_REACHED')

        // Should NOT increment
        expect(mockUpdate).not.toHaveBeenCalled()
    })

    it('should allow usage for PRO user over free limit', async () => {
        // Mock PRO plan
        mockFindFirst.mockResolvedValue({ plan: 'PRO' })
        // Note: usage check is skipped for non-FREE, so we don't mock user query for usage
        // But validateUsageLimit calls getUserPlan which checks activeSub
        // then if not FREE, it returns early.

        await expect(validateUsageLimit('user-id')).resolves.not.toThrow()
    })
})
