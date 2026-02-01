import { Loader2 } from 'lucide-react'

export default function AdminLoading() {
    return (
        <div className="min-h-screen bg-zinc-950 flex">
            {/* Sidebar Skeleton */}
            <aside className="w-64 bg-zinc-900/50 border-r border-zinc-800 flex flex-col">
                <div className="p-6 border-b border-zinc-800">
                    <div className="w-32 h-6 bg-zinc-800 rounded animate-pulse" />
                </div>
                <div className="px-6 py-4 border-b border-zinc-800">
                    <div className="w-24 h-4 bg-zinc-800 rounded animate-pulse" />
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-10 bg-zinc-800 rounded-lg animate-pulse" />
                    ))}
                </nav>
            </aside>

            {/* Main Content Skeleton */}
            <main className="flex-1 flex flex-col">
                {/* Header */}
                <header className="h-14 border-b border-zinc-800 flex items-center px-6">
                    <div className="w-48 h-5 bg-zinc-800 rounded animate-pulse" />
                </header>

                {/* Content */}
                <div className="flex-1 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                        <span className="text-zinc-400 text-sm">Chargement du tableau de bord...</span>
                    </div>
                </div>
            </main>
        </div>
    )
}
