import Link from 'next/link'
import { Check } from 'lucide-react'
import { APP_CONSTANTS } from '@/lib/constants'

// Helper to format price
const formatPrice = (price: number) => price.toLocaleString('en-US')

export function LandingPricing() {
    return (
        <section className="py-24 px-6 bg-zinc-900/50">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                        Des Tarifs <span className="text-cyan-400">Simples</span>
                    </h2>
                    <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                        Commencez gratuitement et passez à la vitesse supérieure quand vous en avez besoin.
                    </p>
                </div>

                <div className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto">
                    {/* Free Plan */}
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 relative hover:border-zinc-700 transition-colors">
                        <div className="mb-6">
                            <h3 className="text-2xl font-bold text-white mb-2">Gratuit</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-white">0</span>
                                <span className="text-zinc-500">Ar/mois</span>
                            </div>
                            <p className="text-zinc-400 mt-4">Parfait pour découvrir Aurora AI.</p>
                        </div>

                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center gap-3 text-zinc-300">
                                <Check className="w-5 h-5 text-cyan-400 shrink-0" />
                                2 exports PDF/Word par mois
                            </li>
                            <li className="flex items-center gap-3 text-zinc-300">
                                <Check className="w-5 h-5 text-cyan-400 shrink-0" />
                                Formatage IA basique
                            </li>
                            <li className="flex items-center gap-3 text-zinc-300">
                                <Check className="w-5 h-5 text-cyan-400 shrink-0" />
                                Extension Word (Lecture seule)
                            </li>
                        </ul>

                        <Link
                            href="/auth/register"
                            className="block w-full py-3 px-6 text-center rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold transition-colors"
                        >
                            Commencer Gratuitement
                        </Link>
                    </div>

                    {/* Basic Plan */}
                    <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl p-8 relative overflow-hidden group hover:border-cyan-500/50 transition-all">
                        <div className="relative mb-6">
                            <h3 className="text-2xl font-bold text-white mb-2">Basic</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-white">{formatPrice(APP_CONSTANTS.PRICING.BASIC)}</span>
                                <span className="text-zinc-500">Ar/mois</span>
                            </div>
                            <p className="text-zinc-400 mt-4">Pour les utilisateurs réguliers.</p>
                        </div>

                        <ul className="space-y-4 mb-8 relative">
                            <li className="flex items-center gap-3 text-zinc-300">
                                <Check className="w-5 h-5 text-green-500 shrink-0" />
                                50 documents par mois
                            </li>
                            <li className="flex items-center gap-3 text-zinc-300">
                                <Check className="w-5 h-5 text-green-500 shrink-0" />
                                Paysage IA Complet
                            </li>
                            <li className="flex items-center gap-3 text-zinc-300">
                                <Check className="w-5 h-5 text-green-500 shrink-0" />
                                Exports sans filigrane
                            </li>
                        </ul>

                        <Link
                            href="/subscribe?plan=BASIC"
                            className="block w-full py-3 px-6 text-center rounded-xl bg-zinc-800 hover:bg-zinc-700 hover:text-white border border-zinc-700 text-zinc-300 font-semibold transition-colors"
                        >
                            Choisir Basic
                        </Link>
                    </div>

                    {/* Pro Plan */}
                    <div className="bg-zinc-900/80 border border-cyan-500/30 rounded-2xl p-8 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-cyan-500/5 group-hover:bg-cyan-500/10 transition-colors" />

                        <div className="absolute top-0 right-0 bg-gradient-to-l from-cyan-500 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                            POPULAIRE
                        </div>

                        <div className="relative mb-6">
                            <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-white">{formatPrice(APP_CONSTANTS.PRICING.PRO)}</span>
                                <span className="text-zinc-500">Ar/ois</span>
                            </div>
                            <p className="text-cyan-200 mt-4">Pour les professionnels exigeants.</p>
                        </div>

                        <ul className="space-y-4 mb-8 relative">
                            <li className="flex items-center gap-3 text-white">
                                <div className="bg-cyan-500/20 p-1 rounded-full">
                                    <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                                </div>
                                Documents Illimités
                            </li>
                            <li className="flex items-center gap-3 text-white">
                                <div className="bg-cyan-500/20 p-1 rounded-full">
                                    <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                                </div>
                                IA Avancée (GPT-4)
                            </li>
                            <li className="flex items-center gap-3 text-white">
                                <div className="bg-cyan-500/20 p-1 rounded-full">
                                    <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                                </div>
                                Extension Word Complète
                            </li>
                            <li className="flex items-center gap-3 text-white">
                                <div className="bg-cyan-500/20 p-1 rounded-full">
                                    <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                                </div>
                                Support Prioritaire 24/7
                            </li>
                        </ul>

                        <Link
                            href="/subscribe?plan=PRO"
                            className="relative block w-full py-3 px-6 text-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/20 transition-all transform hover:-translate-y-0.5"
                        >
                            Pack Pro
                        </Link>
                    </div>

                    {/* Annual Plan */}
                    <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl p-8 relative overflow-hidden group hover:border-cyan-500/50 transition-all">
                        <div className="relative mb-6">
                            <h3 className="text-2xl font-bold text-white mb-2">Annuel</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-white">{formatPrice(APP_CONSTANTS.PRICING.ANNUAL)}</span>
                                <span className="text-zinc-500">Ar/an</span>
                            </div>
                            <p className="text-zinc-400 mt-4">Économisez 2 mois.</p>
                        </div>

                        <ul className="space-y-4 mb-8 relative">
                            <li className="flex items-center gap-3 text-zinc-300">
                                <Check className="w-5 h-5 text-cyan-500 shrink-0" />
                                2 mois offerts
                            </li>
                            <li className="flex items-center gap-3 text-zinc-300">
                                <Check className="w-5 h-5 text-cyan-500 shrink-0" />
                                Documents Illimités
                            </li>
                            <li className="flex items-center gap-3 text-zinc-300">
                                <Check className="w-5 h-5 text-cyan-500 shrink-0" />
                                IA Avancée (GPT-4)
                            </li>
                            <li className="flex items-center gap-3 text-zinc-300">
                                <Check className="w-5 h-5 text-cyan-500 shrink-0" />
                                Support Prioritaire 24/7
                            </li>
                        </ul>

                        <Link
                            href="/subscribe?plan=ANNUAL"
                            className="block w-full py-3 px-6 text-center rounded-xl bg-zinc-800 hover:bg-zinc-700 hover:text-white border border-zinc-700 text-zinc-300 font-semibold transition-colors"
                        >
                            Choisir Annuel
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
