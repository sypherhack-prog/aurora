import Link from 'next/link'
import { AuroraIcon } from '@/components/AuroraIcon'

export function LandingFooter() {
    return (
        <footer className="border-t border-zinc-800 py-12 px-6">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
                        <AuroraIcon className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold">Aurora AI</span>
                </div>
                <div className="flex items-center gap-6 text-sm text-zinc-500">
                    <Link href="/pricing" className="hover:text-white transition">
                        Tarifs
                    </Link>
                    <Link href="/auth/login" className="hover:text-white transition">
                        Connexion
                    </Link>
                </div>
                <div className="text-sm text-zinc-500">© 2025 Aurora AI. Tous droits réservés.</div>
            </div>
        </footer>
    )
}
