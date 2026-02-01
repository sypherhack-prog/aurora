import { Layout, Type, Table2, Image as ImageIcon } from 'lucide-react'

const FEATURES = [
    {
        icon: Layout,
        title: 'Auto-Layout',
        description: 'Laissez notre IA intelligente optimiser la présentation de vos documents en un clic.',
    },
    {
        icon: Type,
        title: 'Style Intelligent',
        description: 'Titres, sous-titres, gras et italique appliqués intelligemment selon le contexte.',
    },
    {
        icon: Table2,
        title: 'Tableaux Automatiques',
        description: 'Transformez vos données en tableaux formatés en un clic.',
    },
    {
        icon: ImageIcon,
        title: "Placement d'Images",
        description: "L'IA positionne vos images de manière optimale dans le document.",
    },
]

export function LandingFeatures() {
    return (
        <section id="features" className="py-24 px-6 bg-zinc-900/50">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Tout est <span className="text-cyan-400">Automatisé</span>
                    </h2>
                    <p className="text-zinc-400 max-w-xl mx-auto">
                        L&apos;IA s&apos;occupe de tout. Vous écrivez, Aurora formate.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {FEATURES.map((feature) => (
                        <div
                            key={feature.title}
                            className="group bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-6
                            hover:border-cyan-500/50 hover:bg-zinc-800 transition-all duration-300"
                        >
                            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:from-cyan-500/30 group-hover:to-blue-600/30 transition">
                                <feature.icon className="w-6 h-6 text-cyan-400" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                            <p className="text-sm text-zinc-400">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
