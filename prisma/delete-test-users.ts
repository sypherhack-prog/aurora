/**
 * Script to delete specific test users by email
 * Run with: npx tsx prisma/delete-test-users.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const emailsToDelete = [
        'cursorailesy@gmail.com',
        'tonylesyeh@gmail.com',
        'refactor@test.com',
        'testuser789@test.com',
        'oree.35@usualion.com',
        'daxojas492@juhxs.com',
        'sypherhack@gmail.com'
    ]

    for (const email of emailsToDelete) {
        const result = await prisma.user.deleteMany({
            where: { email }
        })
        console.log(`Deleted ${result.count} user(s) with email: ${email}`)
    }
}

main()
    .catch((e) => {
        console.error('Error:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

