
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Starting reset of subscriptions to FREE...')

    // Update all subscriptions that are not already FREE (or just all of them to be safe as requested)
    // We set plan to FREE and endDate to null (infinite)
    const result = await prisma.subscription.updateMany({
        data: {
            plan: 'FREE',
            endDate: null,
            status: 'ACTIVE' // Ensure they are active
        }
    })

    console.log(`Updated ${result.count} subscriptions to FREE plan.`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
