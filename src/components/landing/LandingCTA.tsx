import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function LandingCTA() {
    return (
        <section className="py-24 px-6">
            <div className="max-w-4xl mx-auto text-center">
                <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 rounded-3xl p-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Prêt à transformer vos documents ?</h2>
                    <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
                        Commencez gratuitement et découvrez une nouvelle façon de créer vos documents.
                    </p>
                    <Link
                        href="/pricing"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500
                        to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-8
                        py-4 rounded-xl font-semibold text-lg transition-all shadow-2xl shadow-cyan-500/30"
                    >
                        Commencer Gratuitement
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </section>
    )
}
