import { ArrowUpRight, ArrowDownRight, Clock, LucideIcon } from 'lucide-react'

interface StatItem {
    title: string
    value: string
    change: string
    trend: string
    icon: LucideIcon
    color: string
}

export function StatsGrid({ stats }: { stats: StatItem[] }) {
    return (
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
                        {stat.trend === 'up' && (
                            <div className="flex items-center gap-1 text-green-400 text-xs">
                                <ArrowUpRight className="w-3 h-3" />
                                {stat.change}
                            </div>
                        )}
                        {stat.trend === 'down' && (
                            <div className="flex items-center gap-1 text-red-400 text-xs">
                                <ArrowDownRight className="w-3 h-3" />
                                {stat.change}
                            </div>
                        )}
                        {stat.trend === 'warning' && (
                            <div className="flex items-center gap-1 text-amber-400 text-xs">
                                <Clock className="w-3 h-3" />
                                {stat.change}
                            </div>
                        )}
                        {stat.trend === 'neutral' && <div className="text-zinc-500 text-xs">{stat.change}</div>}
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-zinc-400">{stat.title}</div>
                </div>
            ))}
        </div>
    )
}
