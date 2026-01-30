/* eslint-disable @typescript-eslint/no-require-imports */
require('dotenv').config()
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()


const log = (msg) => process.stdout.write(msg + '\n')

async function main() {
    log('=== SaaS Functionality Verification ===')
    log('')

    // Test 1: Database Connection
    log('1. Database Connection:')
    try {
        await prisma.$connect()
        log('   ✓ Connected to database')
    } catch (e) {
        log('   ✗ Failed: ' + e.message)
    }

    // Test 2: User Count
    log('')
    log('2. Users in Database:')
    try {
        const users = await prisma.user.findMany()
        log('   ✓ Found ' + users.length + ' user(s)')
        users.forEach(u => log('     - ' + u.email + ' (' + u.role + ')'))
    } catch (e) {
        log('   ✗ Failed: ' + e.message)
    }

    // Test 3: Subscriptions
    log('')
    log('3. Subscriptions:')
    try {
        const subs = await prisma.subscription.findMany({ include: { user: true, payments: true } })
        log('   ✓ Found ' + subs.length + ' subscription(s)')
        subs.forEach(s => log('     - ' + s.user.email + ' : ' + s.plan + ' - ' + s.status))
    } catch (e) {
        log('   ✗ Failed: ' + e.message)
    }

    // Test 4: Payments
    log('')
    log('4. Payments:')
    try {
        const payments = await prisma.payment.findMany()
        log('   ✓ Found ' + payments.length + ' payment(s)')
    } catch (e) {
        log('   ✗ Failed: ' + e.message)
    }

    log('')
    log('=== Verification Complete ===')
}

main()
    .catch(() => process.exit(1))
    .finally(() => prisma.$disconnect())
