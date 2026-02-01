import { Star } from 'lucide-react'

const TESTIMONIALS = [
    { name: 'Marie L.', role: 'Rédactrice', quote: 'Je gagne 3 heures par jour sur mes rapports.', rating: 5 },
    { name: 'Pierre D.', role: 'Directeur', quote: "Nos documents n'ont jamais été aussi professionnels.", rating: 5 },
    { name: 'Sarah K.', role: 'Étudiante', quote: 'Mes mémoires sont formatés parfaitement à chaque fois.', rating: 5 },
]

export function LandingTestimonials() {
    return (
        <section id="testimonials" className="py-24 px-6 bg-zinc-900/50">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ce qu&apos;ils en <span className="text-cyan-400">disent</span>
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {TESTIMONIALS.map((t) => (
                        <div key={t.name} className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-6">
                            <div className="flex gap-1 mb-4">
                                {[...Array(t.rating)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                ))}
                            </div>
                            <p className="text-zinc-300 mb-4">&quot;{t.quote}&quot;</p>
                            <div>
                                <div className="font-medium">{t.name}</div>
                                <div className="text-sm text-zinc-500">{t.role}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
