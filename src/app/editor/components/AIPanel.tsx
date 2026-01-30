import {
    Sparkles,
    X,
    Zap,
    Wand2,
    Pencil,
    RefreshCw,
    FileEdit,
    Type,
    Plus,
    Loader2,
    Table as TableIcon,
    BarChart3,
    Languages,
    Lightbulb,
    LucideIcon,
} from 'lucide-react'

// Types
interface AIButtonProps {
    icon: LucideIcon
    label: string
    loading?: boolean
    onClick: () => void
}

interface TranslationConfig {
    language: string
    setLanguage: (lang: string) => void
    onTranslate: () => void
}

interface AIPanelProps {
    isOpen: boolean
    onClose: () => void
    aiLoading: string | null
    callAI: (action: string, insertMode?: 'replace' | 'append' | 'insert') => void
    translation: TranslationConfig
}

// Components
function AIButton({ icon: Icon, label, loading, onClick }: AIButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={loading}
            className="w-full text-left text-xs text-zinc-300 hover:text-white hover:bg-zinc-700/50 p-2.5 rounded-lg transition flex items-center gap-2 disabled:opacity-50 group"
        >
            {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <Icon className="w-4 h-4 text-zinc-500 group-hover:text-cyan-400 transition" />
            )}
            <span className="group-hover:translate-x-1 transition-transform">{label}</span>
        </button>
    )
}

function AIHeader({ onClose }: { onClose: () => void }) {
    return (
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Assistant IA
            </h3>
            <button onClick={onClose} className="md:hidden text-zinc-400">
                <X className="w-4 h-4" />
            </button>
        </div>
    )
}

function FormattingSection({ aiLoading, callAI }: Pick<AIPanelProps, 'aiLoading' | 'callAI'>) {
    return (
        <section className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 rounded-lg p-4">
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Formatage Intelligent
            </h4>
            <div className="space-y-2">
                <AIButton
                    icon={Wand2}
                    label="Auto-formatter tout"
                    loading={aiLoading === 'auto-format'}
                    onClick={() => callAI('auto-format', 'replace')}
                />
                <AIButton
                    icon={Pencil}
                    label="Corriger les erreurs"
                    loading={aiLoading === 'fix-errors'}
                    onClick={() => callAI('fix-errors', 'replace')}
                />
                <AIButton
                    icon={RefreshCw}
                    label="Améliorer espacements"
                    loading={aiLoading === 'improve-spacing'}
                    onClick={() => callAI('improve-spacing', 'replace')}
                />
            </div>
        </section>
    )
}

function WritingSection({ aiLoading, callAI }: Pick<AIPanelProps, 'aiLoading' | 'callAI'>) {
    return (
        <section className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <FileEdit className="w-4 h-4 text-purple-400" />
                Assistant Rédaction
            </h4>
            <div className="space-y-2">
                <AIButton
                    icon={RefreshCw}
                    label="Continuer l'écriture"
                    loading={aiLoading === 'continue-writing'}
                    onClick={() => callAI('continue-writing', 'append')}
                />
                <AIButton
                    icon={Type}
                    label="Convertir en titre"
                    loading={aiLoading === 'smart-heading'}
                    onClick={() => callAI('smart-heading', 'insert')}
                />
                <AIButton
                    icon={FileEdit}
                    label="Améliorer paragraphe"
                    loading={aiLoading === 'improve-paragraph'}
                    onClick={() => callAI('improve-paragraph', 'replace')}
                />
            </div>
        </section>
    )
}

function InsertSection({ aiLoading, callAI }: Pick<AIPanelProps, 'aiLoading' | 'callAI'>) {
    return (
        <section className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Plus className="w-4 h-4 text-green-400" />
                Insérer
            </h4>
            <div className="space-y-2">
                <AIButton
                    icon={TableIcon}
                    label="Tableau formaté"
                    loading={aiLoading === 'generate-table'}
                    onClick={() => callAI('generate-table', 'insert')}
                />
                <AIButton
                    icon={BarChart3}
                    label="Résumé statistiques"
                    loading={aiLoading === 'summarize'}
                    onClick={() => callAI('summarize', 'insert')}
                />
            </div>
        </section>
    )
}

const TRANSLATION_OPTIONS = [
    { value: 'Anglais', label: 'Anglais' },
    { value: 'Français', label: 'Français' },
    { value: 'Espagnol', label: 'Espagnol' },
    { value: 'Allemand', label: 'Allemand' },
    { value: 'Italien', label: 'Italien' },
    { value: 'Chinois', label: 'Chinois' },
    { value: 'Japonais', label: 'Japonais' },
    { value: 'Russe', label: 'Russe' },
]

function TranslationSection({
    aiLoading,
    translation,
}: {
    aiLoading: string | null
    translation: TranslationConfig
}) {
    return (
        <section className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Languages className="w-4 h-4 text-pink-400" />
                Traduction
            </h4>
            <div className="space-y-2">
                <select
                    value={translation.language}
                    onChange={(e) => translation.setLanguage(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-zinc-300 p-2 focus:outline-none focus:border-cyan-500 mb-2"
                >
                    {TRANSLATION_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <AIButton
                    icon={Languages}
                    label="Traduire le document"
                    loading={aiLoading === 'translate'}
                    onClick={translation.onTranslate}
                />
            </div>
        </section>
    )
}

function IdeasSection({ aiLoading, callAI }: Pick<AIPanelProps, 'aiLoading' | 'callAI'>) {
    return (
        <section className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-400" />
                Idées
            </h4>
            <AIButton
                icon={Lightbulb}
                label="Suggérer un plan"
                loading={aiLoading === 'suggest-ideas'}
                onClick={() => callAI('suggest-ideas', 'insert')}
            />
        </section>
    )
}

// Main Component
export function AIPanel({ isOpen, onClose, aiLoading, callAI, translation }: AIPanelProps) {
    if (!isOpen) return null

    return (
        <aside className="w-80 border-l border-zinc-800 bg-zinc-900/30 flex flex-col shrink-0 overflow-hidden absolute md:static right-0 h-full backdrop-blur-xl md:backdrop-blur-none z-40">
            <AIHeader onClose={onClose} />
            <div className="flex-1 overflow-auto p-4 space-y-4 custom-scrollbar">
                <FormattingSection aiLoading={aiLoading} callAI={callAI} />
                <WritingSection aiLoading={aiLoading} callAI={callAI} />
                <InsertSection aiLoading={aiLoading} callAI={callAI} />
                <TranslationSection aiLoading={aiLoading} translation={translation} />
                <IdeasSection aiLoading={aiLoading} callAI={callAI} />
            </div>
        </aside>
    )
}
