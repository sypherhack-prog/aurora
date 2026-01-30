import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

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
    .catch(async (e) => {
        console.error(String(e))
        await prisma.$disconnect()
        process.exit(1)
    })
