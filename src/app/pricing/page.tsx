import Link from 'next/link'
import { Check, Sparkles, Zap, ArrowRight } from 'lucide-react'
import { APP_CONSTANTS } from '@/lib/constants'

// Helper to format price
const formatPrice = (price: number) => price.toLocaleString('en-US')
const getPlanHref = (code: string) => (code === 'FREE' ? '/auth/register' : `/subscribe?plan=${code}`)

const plans = [
    {
        name: 'Gratuit',
        price: '0',
        period: 'pour toujours',
        description: 'Parfait pour découvrir Aurora AI',
        features: ['2 exports PDF/Word par mois', 'Formatage IA basique', 'Export en filigrane', 'Accès éditeur complet'],
        limitations: ['Pas de support prioritaire', 'Fonctionnalités limitées'],
        planCode: 'FREE',
        highlight: false,
        cta: 'Commencer Gratuitement',
        popular: false,
    },
    {
        name: 'Basic',
        price: formatPrice(APP_CONSTANTS.PRICING.BASIC),
        period: '1 mois',
        description: 'Pour les utilisateurs réguliers',
        features: [
            '50 documents par mois',
            'Formatage IA complet',
            'Export PDF, Word, HTML',
            'Sans filigrane',
            'Support email',
        ],
        planCode: 'BASIC',
        highlight: false,
        cta: 'Souscrire',
        popular: false,
    },
    {
        name: 'Pro',
        price: formatPrice(APP_CONSTANTS.PRICING.PRO),
        period: '3 mois',
        description: 'Pour les professionnels exigeants',
        features: [
            'Documents illimités',
            'IA avancée (GPT-4)',
            "Tous les formats d'export",
            'Support prioritaire 24/7',
            'Templates premium',
            'Collaboration équipe',
        ],
        planCode: 'PRO',
        highlight: true,
        cta: 'Choisir Pro',
        popular: true,
    },
    {
        name: 'Annuel',
        price: formatPrice(APP_CONSTANTS.PRICING.ANNUAL),
        period: '12 mois',
        description: 'Économisez 2 mois',
        features: [
            'Tout du Pro inclus',
            '2 mois gratuits',
            'Accès anticipé aux nouveautés',
            'Support dédié',
            'Formation personnalisée',
        ],
        planCode: 'ANNUAL',
        highlight: false,
        cta: 'Économiser 25%',
        popular: false,
    },
]

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-zinc-950/80 border-b border-zinc-800">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-xl">Aurora AI</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link href="/editor" className="text-zinc-400 hover:text-white transition">
                            Éditeur
                        </Link>
                        <Link href="/auth/login" className="text-zinc-400 hover:text-white transition">
                            Connexion
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="pt-32 pb-16 px-6 relative">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
                </div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 rounded-full px-4 py-2 mb-6">
                        <Zap className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm text-cyan-300">Essai gratuit • Sans carte bancaire</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Choisissez votre{' '}
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            plan
                        </span>
                    </h1>
                    <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                        Commencez gratuitement, évoluez selon vos besoins. Paiement simple via MVola.
                    </p>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="pb-24 px-6">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`relative rounded-2xl p-6 transition-all duration-300 ${plan.highlight
                                ? 'bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border-2 border-cyan-500/50 scale-105'
                                : 'bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                                    POPULAIRE
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                                <p className="text-sm text-zinc-400">{plan.description}</p>
                            </div>

                            <div className="mb-6">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    <span className="text-zinc-400">Ar</span>
                                </div>
                                <p className="text-sm text-zinc-500">{plan.period}</p>
                            </div>

                            <ul className="space-y-3 mb-6">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-2">
                                        <Check
                                            className={`w-5 h-5 flex-shrink-0 ${plan.highlight ? 'text-cyan-400' : 'text-green-500'}`}
                                        />
                                        <span className="text-sm text-zinc-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href={getPlanHref(plan.planCode)}
                                className={`block w-full text-center py-3 px-4 rounded-lg font-medium transition-all ${plan.highlight
                                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25'
                                    : plan.planCode === 'FREE'
                                        ? 'bg-zinc-800 hover:bg-zinc-700 text-white'
                                        : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700'
                                    }`}
                            >
                                {plan.cta}
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* MVola Section */}
            <section className="pb-24 px-6">
                <div className="max-w-2xl mx-auto bg-gradient-to-br from-amber-500/10 to-orange-600/10 border border-amber-500/30 rounded-2xl p-8">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold mb-2">Paiement via MVola</h2>
                        <p className="text-zinc-400">Simple, rapide et sécurisé</p>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4 text-center">
                        <div className="bg-zinc-900/50 rounded-xl p-4">
                            <div className="text-2xl font-bold text-amber-400 mb-1">1</div>
                            <div className="text-sm text-zinc-300">Composez *111#</div>
                        </div>
                        <div className="bg-zinc-900/50 rounded-xl p-4">
                            <div className="text-2xl font-bold text-amber-400 mb-1">2</div>
                            <div className="text-sm text-zinc-300">Envoyez au 034 00 000 00</div>
                        </div>
                        <div className="bg-zinc-900/50 rounded-xl p-4">
                            <div className="text-2xl font-bold text-amber-400 mb-1">3</div>
                            <div className="text-sm text-zinc-300">Entrez votre référence</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-zinc-800 py-8 px-6">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition">
                        <ArrowRight className="w-4 h-4 rotate-180" />
                        Retour à l&apos;accueil
                    </Link>
                    <div className="text-sm text-zinc-500">© 2025 Aurora AI</div>
                </div>
            </footer>
        </div>
    )
}
