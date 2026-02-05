import Link from 'next/link'
import { AuroraIcon } from '@/components/AuroraIcon'

export function LandingNavbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-zinc-950/80 border-b border-zinc-800">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
                        <AuroraIcon className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-xl">Aurora AI</span>
                </div>
                <div className="hidden md:flex items-center gap-8">
                    <Link href="#features" className="text-zinc-400 hover:text-white transition">
                        Fonctionnalités
                    </Link>
                    <Link href="/pricing" className="text-zinc-400 hover:text-white transition">
                        Tarifs
                    </Link>
                    <Link href="#testimonials" className="text-zinc-400 hover:text-white transition">
                        Témoignages
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/auth/login" className="text-zinc-400 hover:text-white transition">
                        Connexion
                    </Link>
                    <Link
                        href="/auth/register"
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-cyan-500/25"
                    >
                        Essayer Gratuit
                    </Link>
                </div>
            </div>
        </nav>
    )
}
