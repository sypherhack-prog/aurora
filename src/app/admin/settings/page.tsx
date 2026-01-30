import { AlertCircle } from 'lucide-react'

export default function AdminSettingsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
                Paramètres
            </h1>

            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-xl">
                <h2 className="text-xl font-semibold text-zinc-100 mb-4">Configuration Générale</h2>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-zinc-950 rounded-lg border border-zinc-800">
                        <div>
                            <div className="font-medium text-zinc-200">Mode Maintenance</div>
                            <div className="text-sm text-zinc-500">Désactiver l&apos;accès public au site</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" disabled />
                            <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600 opacity-50 cursor-not-allowed"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-zinc-950 rounded-lg border border-zinc-800">
                        <div>
                            <div className="font-medium text-zinc-200">Inscriptions</div>
                            <div className="text-sm text-zinc-500">Autoriser les nouveaux utilisateurs</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                        </label>
                    </div>
                </div>

                <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-500/20 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-yellow-400 font-medium">Note</h4>
                        <p className="text-yellow-200/70 text-sm mt-1">
                            Ces paramètres sont actuellement statiques (démo). Une table `GlobalSettings` sera
                            nécessaire pour les rendre fonctionnels.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
