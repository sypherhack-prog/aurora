export const VALID_ROLES = ['USER', 'ADMIN'] as const
export type Role = (typeof VALID_ROLES)[number]

export const isValidRole = (role: unknown): role is Role => {
    return typeof role === 'string' && VALID_ROLES.includes(role as Role)
}

export const VALID_STATUSES = ['PENDING', 'ACTIVE', 'EXPIRED', 'CANCELLED'] as const
export type Status = (typeof VALID_STATUSES)[number]

export const isValidStatus = (status: unknown): status is Status => {
    return typeof status === 'string' && VALID_STATUSES.includes(status as Status)
}

export const VALID_PLANS = ['STARTER', 'PRO', 'BUSINESS'] as const
export type Plan = (typeof VALID_PLANS)[number]

export const isValidPlan = (plan: unknown): plan is Plan => {
    return typeof plan === 'string' && VALID_PLANS.includes(plan as Plan)
}

export const isValidDate = (date: unknown): boolean => {
    if (typeof date === 'string' || date instanceof Date) {
        const d = new Date(date)
        return !isNaN(d.getTime())
    }
    return false
}

export const isExpired = (date: string | Date): boolean => new Date(date) < new Date()

export const isPositiveNumber = (value: unknown): boolean => {
    return typeof value === 'number' && !isNaN(value) && value > 0
}

export const isWithinRange = (value: number, min: number, max: number): boolean => {
    return value >= min && value <= max
}
