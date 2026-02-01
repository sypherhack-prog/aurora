export function LandingHowItWorks() {
    return (
        <section className="py-24 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Comment ça <span className="text-cyan-400">fonctionne</span> ?
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        {
                            step: '01',
                            title: 'Écrivez',
                            desc: 'Rédigez votre contenu sans vous soucier du format.',
                        },
                        {
                            step: '02',
                            title: "L'IA Analyse",
                            desc: 'Aurora comprend la structure et le contexte de votre texte.',
                        },
                        {
                            step: '03',
                            title: "C'est Prêt",
                            desc: "Document parfaitement formaté, prêt à l'export.",
                        },
                    ].map((item) => (
                        <div key={item.step} className="relative">
                            <div className="text-6xl font-bold text-zinc-800 mb-4">{item.step}</div>
                            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                            <p className="text-zinc-400">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
