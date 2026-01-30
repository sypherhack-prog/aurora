import {
    Sparkles, X, Zap, Wand2, Pencil, RefreshCw, FileEdit, Type,
    Plus, Loader2, Table as TableIcon, BarChart3, Languages, Lightbulb
} from 'lucide-react'

interface AIButtonProps {
    icon: any
    label: string
    loading?: boolean
    onClick: () => void
}

function AIButton({ icon: Icon, label, loading, onClick }: AIButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={loading}
            className="w-full text-left text-xs text-zinc-300 hover:text-white hover:bg-zinc-700/50 p-2.5 rounded-lg transition flex items-center gap-2 disabled:opacity-50 group"
        >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Icon className="w-4 h-4 text-zinc-500 group-hover:text-cyan-400 transition" />}
            <span className="group-hover:translate-x-1 transition-transform">{label}</span>
        </button>
    )
}

interface AIPanelProps {
    isOpen: boolean
    onClose: () => void
    aiLoading: string | null
    callAI: (action: string, insertMode?: 'replace' | 'append' | 'insert') => void
    translationLang: string
    setTranslationLang: (lang: string) => void
    handleTranslate: () => void
}

export function AIPanel({
    isOpen, onClose, aiLoading, callAI,
    translationLang, setTranslationLang, handleTranslate
}: AIPanelProps) {
    if (!isOpen) return null

    return (
        <aside className="w-80 border-l border-zinc-800 bg-zinc-900/30 flex flex-col shrink-0 overflow-hidden absolute md:static right-0 h-full backdrop-blur-xl md:backdrop-blur-none z-40 transform transition-transform duration-300 ease-in-out">
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    Assistant IA
                </h3>
                <button onClick={onClose} className="md:hidden text-zinc-400">
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-4 custom-scrollbar">
                {/* Main AI Actions */}
                <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 rounded-lg p-4">
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-400" />
                        Formatage Intelligent
                    </h4>
                    <div className="space-y-2">
                        <AIButton icon={Wand2} label="Auto-formatter tout" loading={aiLoading === 'auto-format'} onClick={() => callAI('auto-format', 'replace')} />
                        <AIButton icon={Pencil} label="Corriger les erreurs" loading={aiLoading === 'fix-errors'} onClick={() => callAI('fix-errors', 'replace')} />
                        <AIButton icon={RefreshCw} label="Améliorer espacements" loading={aiLoading === 'improve-spacing'} onClick={() => callAI('improve-spacing', 'replace')} />
                    </div>
                </div>

                {/* Writing Assistant */}
                <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <FileEdit className="w-4 h-4 text-purple-400" />
                        Assistant Rédaction
                    </h4>
                    <div className="space-y-2">
                        <AIButton icon={RefreshCw} label="Continuer l'écriture" loading={aiLoading === 'continue-writing'} onClick={() => callAI('continue-writing', 'append')} />
                        <AIButton icon={Type} label="Convertir en titre" loading={aiLoading === 'smart-heading'} onClick={() => callAI('smart-heading', 'insert')} />
                        <AIButton icon={FileEdit} label="Améliorer paragraphe" loading={aiLoading === 'improve-paragraph'} onClick={() => callAI('improve-paragraph', 'replace')} />
                    </div>
                </div>

                {/* Insert */}
                <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <Plus className="w-4 h-4 text-green-400" />
                        Insérer
                    </h4>
                    <div className="space-y-2">
                        <AIButton icon={TableIcon} label="Tableau formaté" loading={aiLoading === 'generate-table'} onClick={() => callAI('generate-table', 'insert')} />
                        <AIButton icon={BarChart3} label="Résumé statistiques" loading={aiLoading === 'summarize'} onClick={() => callAI('summarize', 'insert')} />
                    </div>
                </div>

                {/* Translation */}
                <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <Languages className="w-4 h-4 text-pink-400" />
                        Traduction
                    </h4>
                    <div className="space-y-2">
                        <select
                            value={translationLang}
                            onChange={(e) => setTranslationLang(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-zinc-300 p-2 focus:outline-none focus:border-cyan-500 mb-2"
                        >
                            <option value="Anglais">Anglais</option>
                            <option value="Français">Français</option>
                            <option value="Espagnol">Espagnol</option>
                            <option value="Allemand">Allemand</option>
                            <option value="Italien">Italien</option>
                            <option value="Chinois">Chinois</option>
                            <option value="Japonais">Japonais</option>
                            <option value="Russe">Russe</option>
                        </select>
                        <AIButton icon={Languages} label="Traduire le document" loading={aiLoading === 'translate'} onClick={handleTranslate} />
                    </div>
                </div>

                {/* Suggestions */}
                <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-yellow-400" />
                        Idées
                    </h4>
                    <AIButton icon={Lightbulb} label="Suggérer un plan" loading={aiLoading === 'suggest-ideas'} onClick={() => callAI('suggest-ideas', 'insert')} />
                </div>
            </div>
        </aside>
    )
}
