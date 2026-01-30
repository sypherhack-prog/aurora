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
    console.log('Start seeding...')
    const password = await bcrypt.hash('admin123', 12)
    const user = await prisma.user.upsert({
        where: { email: 'admin@autonomous-docs.com' },
        update: {},
        create: {
            email: 'admin@autonomous-docs.com',
            name: 'Admin User',
            password,
            role: 'ADMIN',
        },
    })
    console.log('Created user:', user)
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
