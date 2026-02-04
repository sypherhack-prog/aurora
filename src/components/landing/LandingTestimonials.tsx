import { TrendingUp, Clock, Award } from 'lucide-react'

const benefits = [
    {
        icon: Clock,
        stat: "10x",
        label: "Plus Rapide",
        description: "Ne perdez plus de temps sur la mise en page. Concentrez-vous uniquement sur le contenu."
    },
    {
        icon: TrendingUp,
        stat: "+40%",
        label: "De Productivité",
        description: "Les utilisateurs d'Aurora AI produisent plus de documents de meilleure qualité en moins de temps."
    },
    {
        icon: Award,
        stat: "100%",
        label: "Professionnel",
        description: "Des documents au rendu impeccable à chaque export, compatibles avec tous les standards."
    }
]

export function LandingTestimonials() {
    return (
        <section className="py-24 px-6 bg-zinc-900 border-y border-zinc-800">
            <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-16">
                    Pourquoi choisir <span className="text-cyan-400">Aurora AI</span> ?
                </h2>

                <div className="grid md:grid-cols-3 gap-12">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-6 text-cyan-400">
                                <benefit.icon className="w-8 h-8" />
                            </div>
                            <div className="text-5xl font-bold text-white mb-2">{benefit.stat}</div>
                            <div className="text-xl font-semibold text-blue-400 mb-4">{benefit.label}</div>
                            <p className="text-zinc-400 max-w-sm">
                                {benefit.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
