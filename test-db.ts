import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    try {
        const user = await prisma.user.findUnique({
            where: { email: 'admin@autonomous-docs.com' }
        })
        console.log('Admin User:', user)
    } catch (e) {
        console.error('Error:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
