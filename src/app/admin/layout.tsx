import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
    LayoutDashboard,
    Users,
    CreditCard,
    Settings,
    LogOut,
    Sparkles,
    ChevronRight
} from "lucide-react"

const sidebarItems = [
    { icon: LayoutDashboard, label: "Tableau de bord", href: "/admin", active: true },
    { icon: CreditCard, label: "Abonnements", href: "/admin/subscriptions", active: false },
    { icon: Users, label: "Utilisateurs", href: "/admin/users", active: false },
    { icon: Settings, label: "Paramètres", href: "/admin/settings", active: false },
]

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
        redirect("/login")
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white flex">
            {/* Sidebar */}
            <aside className="w-64 bg-zinc-900/50 border-r border-zinc-800 flex flex-col">
                {/* Logo */}
                <div className="p-6 border-b border-zinc-800">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-semibold text-lg">Aurora AI</span>
                    </Link>
                </div>

                {/* Admin Badge */}
                <div className="px-6 py-4 border-b border-zinc-800">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-xs text-zinc-400 uppercase tracking-wider">Administration</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${item.active
                                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-400 border border-cyan-500/30'
                                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* User Info */}
                <div className="p-4 border-t border-zinc-800">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                            {session.user.name?.charAt(0) || session.user.email?.charAt(0) || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">{session.user.name || 'Admin'}</div>
                            <div className="text-xs text-zinc-500 truncate">{session.user.email}</div>
                        </div>
                    </div>
                    <Link
                        href="/api/auth/signout"
                        className="w-full flex items-center justify-center gap-2 text-zinc-400 hover:text-red-400 py-2 text-sm transition"
                    >
                        <LogOut className="w-4 h-4" />
                        Déconnexion
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                {/* Top Bar */}
                <header className="h-14 border-b border-zinc-800 flex items-center px-6">
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-zinc-500">Admin</span>
                        <ChevronRight className="w-4 h-4 text-zinc-600" />
                        <span className="text-sm">Tableau de bord</span>
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 overflow-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
