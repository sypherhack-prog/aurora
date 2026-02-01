import Link from 'next/link'
import { Zap, Play, ArrowRight } from 'lucide-react'

export function LandingHero() {
    return (
        <section className="relative pt-32 pb-20 px-6">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]
                    bg-gradient-to-r from-cyan-500/10 to-blue-600/10 rounded-full blur-3xl"
                />
            </div>

            <div className="max-w-5xl mx-auto text-center relative z-10">
                <div className="inline-flex items-center gap-2 bg-zinc-800/50 backdrop-blur border border-zinc-700 rounded-full px-4 py-2 mb-8">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span className="text-sm text-zinc-300">Propulsé par l&apos;Intelligence Artificielle</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                    Vos Documents,{' '}
                    <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                        Formatés Automatiquement
                    </span>
                </h1>

                <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
                    Aurora AI formate, structure et optimise vos documents instantanément. Plus jamais de mise en
                    page manuelle.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/editor"
                        className="group flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600
                        hover:from-cyan-400 hover:to-blue-500 text-white px-8 py-4 rounded-xl
                        font-semibold text-lg transition-all shadow-2xl shadow-cyan-500/30"
                    >
                        <Play className="w-5 h-5" />
                        Commencer Maintenant
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        href="#demo"
                        className="flex items-center gap-2 text-zinc-400 hover:text-white px-6 py-4 transition"
                    >
                        <Play className="w-5 h-5" />
                        Voir la Démo
                    </Link>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-center gap-12 mt-16 pt-8 border-t border-zinc-800">
                    <div>
                        <div className="text-3xl font-bold text-white">10K+</div>
                        <div className="text-sm text-zinc-500">Utilisateurs</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-white">500K+</div>
                        <div className="text-sm text-zinc-500">Documents Créés</div>
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-white">4.9/5</div>
                        <div className="text-sm text-zinc-500">Satisfaction</div>
                    </div>
                </div>
            </div>
        </section>
    )
}
