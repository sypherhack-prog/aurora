/**
 * Simple in-memory rate limiter for API routes
 * For production, consider using Redis (e.g., @upstash/ratelimit)
 */

interface RateLimitEntry {
    count: number
    resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up expired entries periodically
setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of rateLimitStore.entries()) {
        if (now > entry.resetTime) {
            rateLimitStore.delete(key)
        }
    }
}, 60000) // Clean every minute

export interface RateLimitConfig {
    /** Maximum number of requests allowed in the window */
    limit: number
    /** Time window in seconds */
    windowSeconds: number
}

export interface RateLimitResult {
    success: boolean
    remaining: number
    resetIn: number
}

/**
 * Check rate limit for a given identifier (IP, user ID, etc.)
 */
export function checkRateLimit(
    identifier: string,
    config: RateLimitConfig
): RateLimitResult {
    const now = Date.now()
    const windowMs = config.windowSeconds * 1000
    const key = identifier

    const entry = rateLimitStore.get(key)

    // No existing entry or expired - create new
    if (!entry || now > entry.resetTime) {
        rateLimitStore.set(key, {
            count: 1,
            resetTime: now + windowMs,
        })
        return {
            success: true,
            remaining: config.limit - 1,
            resetIn: config.windowSeconds,
        }
    }

    // Existing entry - check limit
    if (entry.count >= config.limit) {
        return {
            success: false,
            remaining: 0,
            resetIn: Math.ceil((entry.resetTime - now) / 1000),
        }
    }

    // Increment count
    entry.count++
    return {
        success: true,
        remaining: config.limit - entry.count,
        resetIn: Math.ceil((entry.resetTime - now) / 1000),
    }
}

/**
 * Get client IP from request headers
 */
export function getClientIP(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for')
    if (forwarded) {
        return forwarded.split(',')[0].trim()
    }
    return request.headers.get('x-real-ip') || 'unknown'
}

// Pre-configured rate limiters for common use cases
export const RATE_LIMITS = {
    /** Auth endpoints: 5 requests per minute */
    AUTH: { limit: 5, windowSeconds: 60 },
    /** AI endpoints: 20 requests per minute */
    AI: { limit: 20, windowSeconds: 60 },
    /** General API: 100 requests per minute */
    API: { limit: 100, windowSeconds: 60 },
} as const
