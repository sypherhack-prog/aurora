import prisma from '@/lib/db'
import { DollarSign, Users, CreditCard, Clock } from 'lucide-react'
import { StatsGrid } from './components/StatsGrid'
import { RecentActivity } from './components/RecentActivity'

export default async function AdminDashboard() {
    // Fetch real data
    const usersCount = await prisma.user.count()
    const subscriptions = await prisma.subscription.findMany({ include: { payments: true } })
    const payments = await prisma.payment.findMany()

    const activeSubscriptions = subscriptions.filter((s) => s.status === 'ACTIVE').length
    const pendingPayments = subscriptions.filter((s) => s.status === 'PENDING').length
    const totalRevenue = payments.filter((p) => p.verifiedAt).reduce((sum, p) => sum + p.amount, 0)

    const stats = [
        {
            title: 'Revenu Total',
            value: `${totalRevenue.toLocaleString()} Ar`,
            change: '+12.5%',
            trend: 'up',
            icon: DollarSign,
            color: 'from-green-500 to-emerald-600',
        },
        {
            title: 'Abonnements Actifs',
            value: activeSubscriptions.toString(),
            change: '+3',
            trend: 'up',
            icon: CreditCard,
            color: 'from-cyan-500 to-blue-600',
        },
        {
            title: 'Utilisateurs',
            value: usersCount.toString(),
            change: '+8',
            trend: 'up',
            icon: Users,
            color: 'from-purple-500 to-pink-600',
        },
        {
            title: 'En Attente',
            value: pendingPayments.toString(),
            change: pendingPayments > 0 ? 'Action requise' : 'Aucun',
            trend: pendingPayments > 0 ? 'warning' : 'neutral',
            icon: Clock,
            color: 'from-amber-500 to-orange-600',
        },
    ]

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Tableau de Bord
                </h1>
                <p className="text-zinc-400 mt-1">Vue d&apos;ensemble de votre activité</p>
            </div>

            <StatsGrid stats={stats} />
            <RecentActivity subscriptions={subscriptions} />
        </div>
    )
}
