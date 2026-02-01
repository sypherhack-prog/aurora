/**
 * Script to create or update Admin user
 * Run with: npx ts-node prisma/create-admin.ts
 */

import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const email = 'tsioryraveloson25@gmail.com'
    const password = 'Aidentony270504*'
    const name = 'Admin'

    const hashedPassword = await hash(password, 12)

    // Try to find existing user
    const existingUser = await prisma.user.findUnique({
        where: { email }
    })

    if (existingUser) {
        // Update to ADMIN
        await prisma.user.update({
            where: { email },
            data: { role: 'ADMIN' }
        })
        console.log(`✅ User ${email} updated to ADMIN role`)
    } else {
        // Create new ADMIN user
        await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                role: 'ADMIN'
            }
        })
        console.log(`✅ Admin user created: ${email}`)
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
