import { ArrowUpRight, ArrowDownRight, Clock, LucideIcon } from 'lucide-react'

interface StatItem {
    title: string
    value: string
    change: string
    trend: string
    icon: LucideIcon
    color: string
}

const TREND_CONFIG = {
    up: { icon: ArrowUpRight, color: 'text-green-400' },
    down: { icon: ArrowDownRight, color: 'text-red-400' },
    warning: { icon: Clock, color: 'text-amber-400' },
} as const

function TrendIndicator({ trend, change }: { trend: string; change: string }) {
    const config = TREND_CONFIG[trend as keyof typeof TREND_CONFIG]

    if (!config) {
        return <div className="text-zinc-500 text-xs">{change}</div>
    }

    const Icon = config.icon

    return (
        <div className={`flex items-center gap-1 ${config.color} text-xs`}>
            <Icon className="w-3 h-3" />
            {change}
        </div>
    )
}

function StatCard({ stat }: { stat: StatItem }) {
    return (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-700 transition-all">
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                    <stat.icon className="w-5 h-5 text-white" />
                </div>
                <TrendIndicator trend={stat.trend} change={stat.change} />
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-zinc-400">{stat.title}</div>
        </div>
    )
}

export function StatsGrid({ stats }: { stats: StatItem[] }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
                <StatCard key={stat.title} stat={stat} />
            ))}
        </div>
    )
}
