/* eslint-disable @typescript-eslint/no-require-imports */
require('dotenv').config()
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
    console.log('=== SaaS Functionality Verification ===')
    console.log('')

    // Test 1: Database Connection
    console.log('1. Database Connection:')
    try {
        await prisma.$connect()
        console.log('   ✓ Connected to database')
    } catch (e) {
        console.log('   ✗ Failed:', e.message)
    }

    // Test 2: User Count
    console.log('')
    console.log('2. Users in Database:')
    try {
        const users = await prisma.user.findMany()
        console.log('   ✓ Found', users.length, 'user(s)')
        users.forEach(u => console.log('     -', u.email, '(' + u.role + ')'))
    } catch (e) {
        console.log('   ✗ Failed:', e.message)
    }

    // Test 3: Subscriptions
    console.log('')
    console.log('3. Subscriptions:')
    try {
        const subs = await prisma.subscription.findMany({ include: { user: true, payments: true } })
        console.log('   ✓ Found', subs.length, 'subscription(s)')
        subs.forEach(s => console.log('     -', s.user.email, ':', s.plan, '-', s.status))
    } catch (e) {
        console.log('   ✗ Failed:', e.message)
    }

    // Test 4: Payments
    console.log('')
    console.log('4. Payments:')
    try {
        const payments = await prisma.payment.findMany()
        console.log('   ✓ Found', payments.length, 'payment(s)')
    } catch (e) {
        console.log('   ✗ Failed:', e.message)
    }

    console.log('')
    console.log('=== Verification Complete ===')
}

main()
    .catch(() => process.exit(1))
    .finally(() => prisma.$disconnect())
