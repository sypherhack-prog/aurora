import Link from 'next/link'
import { Download, ArrowLeft, Check, Zap } from 'lucide-react'
import { AuroraIcon } from '@/components/AuroraIcon'
import { CopyUrlButton } from './CopyUrlButton'

const getBaseUrl = () =>
    process.env.SITE_URL || process.env.NEXTAUTH_URL || 'https://aurora-omega.vercel.app'

export default function ExtensionWordPage() {
    const baseUrl = getBaseUrl()
    const manifestUrl = `${baseUrl}/addin/manifest.xml`

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-zinc-950/80 border-b border-zinc-800">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
                            <AuroraIcon className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-bold text-xl">Aurora AI</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link href="/pricing" className="text-zinc-400 hover:text-white transition">
                            Tarifs
                        </Link>
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
            <section className="pt-32 pb-12 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-cyan-500/20 border border-cyan-500/30 rounded-full px-4 py-2 mb-6">
                        <Zap className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm text-cyan-300">Extension Word Aurora AI</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Installez Aurora AI dans Microsoft Word
                    </h1>
                    <p className="text-xl text-zinc-400">
                        Formatez, traduisez et améliorez vos documents directement dans Word.
                        L&apos;extension est incluse dans les plans Pro et Annuel.
                    </p>
                </div>
            </section>

            {/* Installation steps */}
            <section className="pb-24 px-6">
                <div className="max-w-2xl mx-auto space-y-12">
                    {/* URL to copy */}
                    <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Check className="w-5 h-5 text-cyan-400" />
                            URL d&apos;installation
                        </h2>
                        <p className="text-zinc-400 text-sm mb-4">
                            Copiez cette URL ou téléchargez le fichier manifest pour installer l&apos;extension.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex-1 bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-3 font-mono text-sm text-cyan-300 break-all">
                                {manifestUrl}
                            </div>
                            <CopyUrlButton url={manifestUrl} />
                            <a
                                href={manifestUrl}
                                download="manifest.xml"
                                className="inline-flex items-center gap-2 px-4 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-medium transition shrink-0"
                            >
                                <Download className="w-4 h-4" />
                                Télécharger
                            </a>
                        </div>
                    </div>

                    {/* Word Desktop */}
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold mb-4">Word Desktop (Windows / Mac)</h3>
                        <ol className="list-decimal list-inside space-y-3 text-zinc-300">
                            <li>Ouvrez <strong className="text-white">Microsoft Word</strong></li>
                            <li>Allez dans <strong className="text-white">Insérer</strong> → <strong className="text-white">Obtenir des modules complémentaires</strong></li>
                            <li>Cliquez sur <strong className="text-white">Partager un module</strong> (ou Mon organisation)</li>
                            <li>Collez l&apos;URL ci-dessus dans le champ, ou cliquez sur <strong className="text-white">Parcourir</strong> et sélectionnez le fichier manifest.xml téléchargé</li>
                            <li>Validez. L&apos;extension Aurora AI apparaît dans l&apos;onglet <strong className="text-white">Accueil</strong></li>
                        </ol>
                    </div>

                    {/* Word Web */}
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold mb-4">Word sur le web (office.com)</h3>
                        <p className="text-zinc-400 mb-4 text-sm">
                            Sur Word en ligne, l&apos;URL ne fonctionne souvent pas. Téléchargez le fichier manifest, puis :
                        </p>
                        <ol className="list-decimal list-inside space-y-3 text-zinc-300">
                            <li>Ouvrez Word sur <a href="https://office.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">office.com</a></li>
                            <li><strong className="text-white">Insérer</strong> → <strong className="text-white">Obtenir des modules complémentaires</strong></li>
                            <li><strong className="text-white">Partager un module</strong> ou <strong className="text-white">Chargement personnalisé</strong></li>
                            <li><strong className="text-white">Parcourir</strong> → sélectionnez le fichier manifest.xml sur votre ordinateur</li>
                            <li>Validez</li>
                        </ol>
                    </div>

                    {/* After install */}
                    <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold mb-4 text-cyan-200">Après l&apos;installation</h3>
                        <ol className="list-decimal list-inside space-y-2 text-zinc-300">
                            <li>Cliquez sur <strong className="text-white">Aurora AI</strong> dans l&apos;onglet Accueil de Word</li>
                            <li>Connectez-vous avec le <strong className="text-white">même email et mot de passe</strong> que sur aurora-omega.vercel.app</li>
                            <li>Utilisez les fonctionnalités (formatage, traduction, etc.)</li>
                        </ol>
                        <p className="mt-4 text-sm text-zinc-400">
                            L&apos;extension est incluse dans les plans Pro et Annuel. Le plan gratuit a des limites (5 générations / mois).
                        </p>
                    </div>

                    {/* CTA */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Link
                            href="/pricing"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl font-semibold transition"
                        >
                            Voir les tarifs
                        </Link>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium transition"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Retour à l&apos;accueil
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}

