import { Wand2, FileText, Languages, LayoutTemplate, FileJson, Shield } from 'lucide-react'

const features = [
    {
        icon: Wand2,
        title: "Formatage Intelligent",
        description: "Transformez du texte brut en documents structurés avec titres, listes et espacements parfaits."
    },
    {
        icon: FileText,
        title: "Extension Word",
        description: "Utilisez la puissance d'Aurora AI directement dans Microsoft Word sans quitter votre document."
    },
    {
        icon: Languages,
        title: "Traduction Contextuelle",
        description: "Traduisez vos documents en gardant le sens et le contexte, pas juste mot à mot."
    },
    {
        icon: LayoutTemplate,
        title: "Modèles Pro",
        description: "Accédez à une bibliothèque de modèles pour CVs, rapports, lettres et plus encore."
    },
    {
        icon: FileJson,
        title: "Multi-Formats",
        description: "Importez et exportez facilement en PDF, DOCX, Markdown et texte brut."
    },
    {
        icon: Shield,
        title: "Données Sécurisées",
        description: "Vos documents sont traités de manière sécurisée et ne sont jamais partagés."
    }
]

export function LandingFeatures() {
    return (
        <section className="py-24 px-6 bg-zinc-950">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">
                        Tout pour vos <span className="text-blue-500">Documents</span>
                    </h2>
                    <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                        Une suite d'outils complète pour accélérer votre flux de travail rédactionnel.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl hover:border-zinc-700 transition-colors group"
                        >
                            <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center mb-6 text-cyan-400 group-hover:scale-110 transition-transform">
                                <feature.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
