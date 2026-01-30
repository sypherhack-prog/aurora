'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, CreditCard, Settings, LogOut, Sparkles, LucideIcon } from 'lucide-react'

interface UserSession {
    name?: string | null
    email?: string | null
}

const SIDEBAR_ITEMS = [
    { icon: LayoutDashboard, label: 'Tableau de bord', href: '/admin' },
    { icon: CreditCard, label: 'Abonnements', href: '/admin/subscriptions' },
    { icon: Users, label: 'Utilisateurs', href: '/admin/users' },
    { icon: Settings, label: 'Paramètres', href: '/admin/settings' },
]


function SidebarHeader() {
    return (
        <div className="p-6 border-b border-zinc-800">
            <Link href="/" className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-lg">Aurora AI</span>
            </Link>
        </div>
    )
}

function SidebarBadge() {
    return (
        <div className="px-6 py-4 border-b border-zinc-800">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-zinc-400 uppercase tracking-wider">Administration</span>
            </div>
        </div>
    )
}

function UserProfile({ user }: { user: UserSession }) {
    const initials = user.name?.charAt(0) || user.email?.charAt(0) || 'A'

    return (
        <div className="p-4 border-t border-zinc-800">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                    {initials}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{user.name || 'Admin'}</div>
                    <div className="text-xs text-zinc-500 truncate">{user.email}</div>
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
    )
}

export function AdminSidebar({ user }: { user: UserSession }) {
    const pathname = usePathname()

    return (
        <aside className="w-64 bg-zinc-900/50 border-r border-zinc-800 flex flex-col">
            <SidebarHeader />
            <SidebarBadge />

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {SIDEBAR_ITEMS.map((item) => (
                    <SidebarItem key={item.href} item={item} isActive={pathname === item.href} />
                ))}
            </nav>

            <UserProfile user={user} />
        </aside>
    )
}

function SidebarItem({
    item,
    isActive,
}: {
    item: { icon: LucideIcon; label: string; href: string }
    isActive: boolean
}) {
    return (
        <Link
            href={item.href}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${isActive
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-400 border border-cyan-500/30'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                }`}
        >
            <item.icon className="w-5 h-5" />
            {item.label}
        </Link>
    )
}
