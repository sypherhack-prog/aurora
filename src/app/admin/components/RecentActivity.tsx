import { TrendingUp, CreditCard, Users } from 'lucide-react'
import { STATUS_STYLES, STATUS_LABELS } from '@/lib/constants'

interface Subscription {
    id: string
    plan: string
    createdAt: Date
    status: string
}

function StatusBadge({ status }: { status: string }) {
    const style = STATUS_STYLES[status as keyof typeof STATUS_STYLES] || STATUS_STYLES.EXPIRED
    const label = STATUS_LABELS[status as keyof typeof STATUS_LABELS] || status

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}
        >
            {label}
        </span>
    )
}

function SubscriptionItem({ sub }: { sub: Subscription }) {
    return (
        <div className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0">
            <div>
                <div className="text-sm font-medium">{sub.plan}</div>
                <div className="text-xs text-zinc-500">
                    {new Date(sub.createdAt).toLocaleDateString('fr-FR')}
                </div>
            </div>
            <StatusBadge status={sub.status} />
        </div>
    )
}

function EmptySubscriptions() {
    return <div className="text-center text-zinc-500 py-8">Aucun abonnement pour le moment</div>
}

function RecentSubscriptions({ subscriptions }: { subscriptions: Subscription[] }) {
    return (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                Abonnements Récents
            </h3>
            <div className="space-y-3">
                {subscriptions.slice(0, 5).map((sub) => (
                    <SubscriptionItem key={sub.id} sub={sub} />
                ))}
                {subscriptions.length === 0 && <EmptySubscriptions />}
            </div>
        </div>
    )
}

function QuickActions() {
    return (
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
    )
}

export function RecentActivity({ subscriptions }: { subscriptions: Subscription[] }) {
    return (
        <div className="grid lg:grid-cols-2 gap-6">
            <RecentSubscriptions subscriptions={subscriptions} />
            <QuickActions />
        </div>
    )
}
