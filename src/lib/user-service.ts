import { hash } from 'bcryptjs'
import prisma from '@/lib/db'

// Email validation regex (RFC 5322 simplified)
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

export function validateRegistration(name: string, email: string, password: string): string | null {
    // Check required fields
    if (!email || !password) {
        return 'Email et mot de passe requis'
    }

    // Validate name length
    if (name && name.length > 100) {
        return 'Le nom est trop long (max 100 caractères)'
    }

    // Validate email format
    if (!EMAIL_REGEX.test(email)) {
        return 'Format d\'email invalide'
    }

    // Validate email length
    if (email.length > 254) {
        return 'Email trop long'
    }

    // Password strength validation
    if (password.length < 8) {
        return 'Le mot de passe doit contenir au moins 8 caractères'
    }

    if (password.length > 128) {
        return 'Le mot de passe est trop long'
    }

    // Check for at least one number and one letter
    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
        return 'Le mot de passe doit contenir au moins une lettre et un chiffre'
    }

    return null
}

export async function userExists(email: string): Promise<boolean> {
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
    return !!existing
}

export async function createUserWithSubscription(name: string, email: string, pass: string) {
    const hashedPassword = await hash(pass, 12)

    return prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
            data: {
                name: name?.trim() || null,
                email: email.toLowerCase().trim(),
                password: hashedPassword,
                role: 'USER'
            },
        })

        await tx.subscription.create({
            data: {
                userId: user.id,
                plan: 'BASIC',
                status: 'ACTIVE',
                startDate: new Date(),
                endDate: null,
            },
        })

        return user
    })
}
