import prisma from "@/lib/db"
import {
    DollarSign,
    Users,
    CreditCard,
    Clock,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react"

export default async function AdminDashboard() {
    // Fetch real data
    const [usersCount, subscriptions, payments] = await Promise.all([
        prisma.user.count(),
        prisma.subscription.findMany({ include: { payments: true } }),
        prisma.payment.findMany(),
    ])

    const activeSubscriptions = subscriptions.filter(s => s.status === 'ACTIVE').length
    const pendingPayments = subscriptions.filter(s => s.status === 'PENDING').length
    const totalRevenue = payments
        .filter(p => p.verifiedAt)
        .reduce((sum, p) => sum + p.amount, 0)

    const stats = [
        {
            title: "Revenu Total",
            value: `${totalRevenue.toLocaleString()} Ar`,
            change: "+12.5%",
            trend: "up",
            icon: DollarSign,
            color: "from-green-500 to-emerald-600",
        },
        {
            title: "Abonnements Actifs",
            value: activeSubscriptions.toString(),
            change: "+3",
            trend: "up",
            icon: CreditCard,
            color: "from-cyan-500 to-blue-600",
        },
        {
            title: "Utilisateurs",
            value: usersCount.toString(),
            change: "+8",
            trend: "up",
            icon: Users,
            color: "from-purple-500 to-pink-600",
        },
        {
            title: "En Attente",
            value: pendingPayments.toString(),
            change: pendingPayments > 0 ? "Action requise" : "Aucun",
            trend: pendingPayments > 0 ? "warning" : "neutral",
            icon: Clock,
            color: "from-amber-500 to-orange-600",
        },
    ]

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Tableau de Bord
                </h1>
                <p className="text-zinc-400 mt-1">Vue d&apos;ensemble de votre activité</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div
                        key={stat.title}
                        className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                                <stat.icon className="w-5 h-5 text-white" />
                            </div>
                            {stat.trend === "up" && (
                                <div className="flex items-center gap-1 text-green-400 text-xs">
                                    <ArrowUpRight className="w-3 h-3" />
                                    {stat.change}
                                </div>
                            )}
                            {stat.trend === "down" && (
                                <div className="flex items-center gap-1 text-red-400 text-xs">
                                    <ArrowDownRight className="w-3 h-3" />
                                    {stat.change}
                                </div>
                            )}
                            {stat.trend === "warning" && (
                                <div className="flex items-center gap-1 text-amber-400 text-xs">
                                    <Clock className="w-3 h-3" />
                                    {stat.change}
                                </div>
                            )}
                            {stat.trend === "neutral" && (
                                <div className="text-zinc-500 text-xs">{stat.change}</div>
                            )}
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                        <div className="text-sm text-zinc-400">{stat.title}</div>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Subscriptions */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-cyan-400" />
                        Abonnements Récents
                    </h3>
                    <div className="space-y-3">
                        {subscriptions.slice(0, 5).map((sub) => (
                            <div key={sub.id} className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0">
                                <div>
                                    <div className="text-sm font-medium">{sub.plan}</div>
                                    <div className="text-xs text-zinc-500">{new Date(sub.createdAt).toLocaleDateString('fr-FR')}</div>
                                </div>
                                <StatusBadge status={sub.status} />
                            </div>
                        ))}
                        {subscriptions.length === 0 && (
                            <div className="text-center text-zinc-500 py-8">
                                Aucun abonnement pour le moment
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                    <h3 className="font-semibold mb-4">Actions Rapides</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <a
                            href="/admin/subscriptions"
                            className="p-4 bg-zinc-800/50 hover:bg-zinc-800 rounded-xl transition text-center"
                        >
                            <CreditCard className="w-6 h-6 mx-auto mb-2 text-cyan-400" />
                            <div className="text-sm">Gérer les abonnements</div>
                        </a>
                        <a
                            href="/admin/users"
                            className="p-4 bg-zinc-800/50 hover:bg-zinc-800 rounded-xl transition text-center"
                        >
                            <Users className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                            <div className="text-sm">Voir les utilisateurs</div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    const styles: Record<string, string> = {
        PENDING: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
        ACTIVE: 'bg-green-500/20 text-green-400 border-green-500/30',
        EXPIRED: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30',
        BLOCKED: 'bg-red-500/20 text-red-400 border-red-500/30',
    }

    const labels: Record<string, string> = {
        PENDING: 'En attente',
        ACTIVE: 'Actif',
        EXPIRED: 'Expiré',
        BLOCKED: 'Bloqué',
    }

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles.EXPIRED}`}>
            {labels[status] || status}
        </span>
    )
}
