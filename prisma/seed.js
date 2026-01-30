/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client')
const { hash } = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    const password = await hash('admin123', 12)
    await prisma.user.upsert({
        where: { email: 'admin@autonomous-docs.com' },
        update: {},
        create: {
            email: 'admin@autonomous-docs.com',
            name: 'Admin User',
            password,
            role: 'ADMIN',
        },
    })
}

main()
    .then(() => prisma.$disconnect())
    .catch(async () => {
        await prisma.$disconnect()
        process.exit(1)
    })
