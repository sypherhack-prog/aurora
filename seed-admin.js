/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: "file:./prisma/dev.db"
        }
    }
})

async function main() {
    const password = await bcrypt.hash('admin123', 12)
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
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async () => {
        await prisma.$disconnect()
        process.exit(1)
    })
