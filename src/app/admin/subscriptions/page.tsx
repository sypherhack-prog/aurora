import prisma from "@/lib/db"
import SubscriptionActions from "./subscription-actions"
import { CreditCard, Search } from "lucide-react"

export default async function SubscriptionsPage() {
    const subscriptions = await prisma.subscription.findMany({
        include: {
            user: true,
            payments: true
        },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        Abonnements
                    </h1>
                    <p className="text-zinc-400 mt-1">Gérez les abonnements et vérifiez les paiements</p>
                </div>
                <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        className="bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-sm w-64 focus:outline-none focus:border-cyan-500 transition"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
                <table className="min-w-full divide-y divide-zinc-800">
                    <thead className="bg-zinc-800/50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Utilisateur</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Plan</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Statut</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Réf. MVola</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Téléphone</th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-right text-xs font-medium text-zinc-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                        {subscriptions.map((sub) => (
                            <tr key={sub.id} className="hover:bg-zinc-800/30 transition">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                            {sub.user.email?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-white">{sub.user.name || 'Utilisateur'}</div>
                                            <div className="text-xs text-zinc-500">{sub.user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <PlanBadge plan={sub.plan} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusBadge status={sub.status} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm text-zinc-400 font-mono">
                                        {sub.payments[0]?.mvolaRef || '—'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">
                                    {sub.payments[0]?.phoneNumber || '—'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">
                                    {new Date(sub.createdAt).toLocaleDateString('fr-FR')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <SubscriptionActions
                                        subscriptionId={sub.id}
                                        status={sub.status}
                                    />
                                </td>
                            </tr>
                        ))}
                        {subscriptions.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-6 py-16 text-center">
                                    <CreditCard className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                                    <div className="text-zinc-500">Aucun abonnement pour le moment</div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function PlanBadge({ plan }: { plan: string }) {
    const styles: Record<string, string> = {
        BASIC: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30',
        PRO: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
        ANNUAL: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    }

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[plan] || styles.BASIC}`}>
            {plan}
        </span>
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
