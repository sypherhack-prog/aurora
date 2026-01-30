import Link from 'next/link'
import { Sparkles, Zap, Layout, Type, Image as ImageIcon, Table2, ArrowRight, Play, Star } from 'lucide-react'

const features = [
  {
    icon: Layout,
    title: 'Auto-Layout',
    description:
      'Laissez notre IA intelligente optimiser la présentation de vos documents en un clic.',
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

const testimonials = [
  { name: 'Marie L.', role: 'Rédactrice', quote: 'Je gagne 3 heures par jour sur mes rapports.', rating: 5 },
  { name: 'Pierre D.', role: 'Directeur', quote: "Nos documents n'ont jamais été aussi professionnels.", rating: 5 },
  { name: 'Sarah K.', role: 'Étudiante', quote: 'Mes mémoires sont formatés parfaitement à chaque fois.', rating: 5 },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-zinc-950/80 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">Aurora AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-zinc-400 hover:text-white transition">
              Fonctionnalités
            </Link>
            <Link href="/pricing" className="text-zinc-400 hover:text-white transition">
              Tarifs
            </Link>
            <Link href="#testimonials" className="text-zinc-400 hover:text-white transition">
              Témoignages
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="text-zinc-400 hover:text-white transition">
              Connexion
            </Link>
            <Link
              href="/auth/register"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-cyan-500/25"
            >
              Essayer Gratuit
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-500/10 to-blue-600/10 rounded-full blur-3xl" />
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
              className="group flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-2xl shadow-cyan-500/30"
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

      {/* Features Section */}
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
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-6 hover:border-cyan-500/50 hover:bg-zinc-800 transition-all duration-300"
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

      {/* How It Works */}
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

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-6 bg-zinc-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ce qu&apos;ils en <span className="text-cyan-400">disent</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
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

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 rounded-3xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Prêt à transformer vos documents ?</h2>
            <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
              Commencez gratuitement et découvrez une nouvelle façon de créer vos documents.
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-2xl shadow-cyan-500/30"
            >
              Commencer Gratuitement
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">Aurora AI</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-zinc-500">
            <Link href="/pricing" className="hover:text-white transition">
              Tarifs
            </Link>
            <Link href="/login" className="hover:text-white transition">
              Connexion
            </Link>
            <Link href="/admin" className="hover:text-white transition">
              Admin
            </Link>
          </div>
          <div className="text-sm text-zinc-500">© 2025 Aurora AI. Tous droits réservés.</div>
        </div>
      </footer>
    </div>
  )
}
