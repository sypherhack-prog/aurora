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
                <div className="inline-flex items-center gap-2 bg-zinc-800/50 backdrop-blur border border-zinc-700 rounded-full px-4 py-2 mb-8 animate-fade-in-up">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                    </span>
                    <span className="text-sm font-medium text-white">Nouveau : Extension Word disponible !</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                    Rédigez, Formatez et Traduisez{' '}
                    <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                        10x Plus Vite
                    </span>
                </h1>

                <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
                    Aurora AI transforme vos brouillons en documents professionnels structurés.
                    Utilisez notre éditeur en ligne ou travaillez directement dans Microsoft Word.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/editor"
                        className="group flex items-center gap-3 bg-white text-zinc-950 px-8 py-4 rounded-xl
                        font-bold text-lg transition-all hover:bg-zinc-200 shadow-xl shadow-cyan-500/10"
                    >
                        <Play className="w-5 h-5 fill-current" />
                        Essayer Gratuitement
                    </Link>
                    <Link
                        href="/extension-word"
                        className="flex items-center gap-2 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 text-white px-6 py-4 rounded-xl transition-all"
                    >
                        <Zap className="w-5 h-5 text-cyan-400" />
                        Extension Word
                    </Link>
                </div>
            </div>
        </section>
    )
}
