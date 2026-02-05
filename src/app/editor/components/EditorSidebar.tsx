import Link from 'next/link'
import { AuroraIcon } from '@/components/AuroraIcon'
import {
    FileText,
    FolderOpen,
    BarChart3,
    Settings,
    Shield,
    GraduationCap,
    BookOpen,
    Briefcase,
    Mail,
    PenTool,
    Plus,
    LogOut,
    User,
    List,
} from 'lucide-react'
import { APP_CONSTANTS } from '@/lib/constants'
import { signOut } from 'next-auth/react'

interface EditorSidebarProps {
    session: {
        user?: {
            name?: string | null
            email?: string | null
            role?: string
        }
    } | null
    activeTab: string
    setActiveTab: (tab: string) => void
    onCreateNewDoc: (theme: string, type: string) => void
    onOpenNewDocModal: () => void
    stats: {
        wordCount: number
        charCount: number
    }
    settings: {
        docTheme: string
        aiPanelOpen: boolean
        setAiPanelOpen: (open: boolean) => void
    }
    navigation: {
        headings: { level: number; text: string; pos: number }[]
        onScrollToHeading: (pos: number) => void
    }
}

export function EditorSidebar(props: EditorSidebarProps) {
    const {
        session,
        activeTab,
        setActiveTab,
        onCreateNewDoc,
        onOpenNewDocModal,
        stats,
        settings,
        navigation,
    } = props

    return (
        <aside className="w-64 bg-zinc-900/50 border-r border-zinc-800 flex flex-col hidden md:flex">
            <div className="p-6 border-b border-zinc-800">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
                        <AuroraIcon className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-lg">Aurora AI</span>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-1">
                <SidebarButton
                    active={activeTab === 'documents'}
                    onClick={() => setActiveTab('documents')}
                    icon={FileText}
                    label="Documents Récents"
                />
                <SidebarButton
                    active={activeTab === 'templates'}
                    onClick={() => setActiveTab('templates')}
                    icon={FolderOpen}
                    label="Modèles"
                />
                <SidebarButton
                    active={activeTab === 'insights'}
                    onClick={() => setActiveTab('insights')}
                    icon={BarChart3}
                    label="Insights IA"
                />
                <SidebarButton
                    active={activeTab === 'navigation'}
                    onClick={() => setActiveTab('navigation')}
                    icon={List}
                    label="Navigation"
                />
                <SidebarButton
                    active={activeTab === 'settings'}
                    onClick={() => setActiveTab('settings')}
                    icon={Settings}
                    label="Paramètres"
                />

                {session?.user?.role === 'ADMIN' && (
                    <Link
                        href="/admin"
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 transition-all font-medium"
                    >
                        <Shield className="w-5 h-5" />
                        Administration
                    </Link>
                )}
            </nav>

            {/* Sidebar Content Based on Tab */}
            <div className="p-4 border-t border-zinc-800 max-h-48 overflow-auto">
                {activeTab === 'documents' && (
                    <div className="space-y-2 text-sm">
                        <div className="text-zinc-500 text-xs mb-2">Documents récents</div>
                        <div className="p-2 bg-zinc-800 rounded-lg text-zinc-300 truncate border border-zinc-700">
                            📄 Nouveau Document
                        </div>
                        <div className="text-xs text-zinc-500 text-center py-2">Pas d&apos;autres documents</div>
                    </div>
                )}
                {activeTab === 'templates' && (
                    <div className="space-y-2 text-sm">
                        <div className="text-zinc-500 text-xs mb-2">Modèles disponibles</div>
                        <TemplateButton
                            onClick={() => onCreateNewDoc('academic', 'exam')}
                            icon={GraduationCap}
                            label="Sujet d'examen"
                            color="text-blue-400"
                        />
                        <TemplateButton
                            onClick={() => onCreateNewDoc('academic', 'notes')}
                            icon={BookOpen}
                            label="Notes de cours"
                            color="text-purple-400"
                        />
                        <TemplateButton
                            onClick={() => onCreateNewDoc('business', 'report')}
                            icon={Briefcase}
                            label="Rapport de Stage"
                            color="text-cyan-400"
                        />
                        <TemplateButton
                            onClick={() => onCreateNewDoc('letter', 'cover-letter')}
                            icon={Mail}
                            label="Lettre de motivation"
                            color="text-green-400"
                        />
                        <TemplateButton
                            onClick={() => onCreateNewDoc('creative', 'manuscript')}
                            icon={PenTool}
                            label="Manuscrit"
                            color="text-orange-400"
                        />
                    </div>
                )}
                {activeTab === 'insights' && (
                    <div className="space-y-3 text-sm">
                        <div className="text-zinc-500 text-xs mb-2">Analyse du document</div>
                        <StatRow label="Mots" value={stats.wordCount.toString()} color="text-cyan-400" />
                        <StatRow label="Caractères" value={stats.charCount.toString()} color="text-cyan-400" />
                        <StatRow
                            label="Lecture"
                            value={`${Math.ceil(stats.wordCount / APP_CONSTANTS.EDITOR.AVG_READING_SPEED)} min`}
                            color="text-cyan-400"
                        />
                        <StatRow label="Thème" value={settings.docTheme} color="text-green-400" capitalize />
                    </div>
                )}
                {activeTab === 'settings' && (
                    <div className="space-y-3 text-sm">
                        <div className="text-zinc-500 text-xs mb-2">Préférences</div>
                        <label className="flex items-center justify-between cursor-pointer">
                            <span className="text-zinc-400">Panneau IA</span>
                            <input
                                type="checkbox"
                                checked={settings.aiPanelOpen}
                                onChange={() => settings.setAiPanelOpen(!settings.aiPanelOpen)}
                                className="w-4 h-4 rounded bg-zinc-800 border-zinc-600 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-zinc-900"
                            />
                        </label>
                        <div className="text-xs text-zinc-500 pt-2">Version: Aurora AI 1.1</div>
                    </div>
                )}
                {activeTab === 'navigation' && (
                    <div className="space-y-1 text-sm">
                        <div className="text-zinc-500 text-xs mb-2">Table des matières</div>
                        {navigation.headings.length === 0 ? (
                            <div className="text-xs text-zinc-600 italic py-2 text-center">Aucun titre détecté</div>
                        ) : (
                            navigation.headings.map((heading, i) => (
                                <button
                                    key={i}
                                    onClick={() => navigation.onScrollToHeading(heading.pos)}
                                    className={`w-full text-left truncate py-1.5 px-2 rounded hover:bg-zinc-800 transition text-zinc-400 hover:text-cyan-400 ${heading.level === 1 ? 'font-medium pl-2' : ''
                                        } ${heading.level === 2 ? 'pl-4 text-xs' : ''} ${heading.level >= 3 ? 'pl-6 text-xs' : ''
                                        }`}
                                >
                                    {heading.text || 'Sans titre'}
                                </button>
                            ))
                        )}
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-zinc-800">
                <button
                    onClick={onOpenNewDocModal}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-3 px-4 rounded-lg font-medium transition-all shadow-lg shadow-cyan-500/20"
                >
                    <Plus className="w-4 h-4" />
                    Nouveau Document
                </button>
            </div>

            <div className="p-4 border-t border-zinc-800">
                {session?.user ? (
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                            {session.user.name?.charAt(0) || session.user.email?.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{session.user.name || 'Utilisateur'}</div>
                            <div className="text-xs text-zinc-500 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                Plan Gratuit
                            </div>
                        </div>
                        <button
                            onClick={() => signOut()}
                            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition"
                            title="Se déconnecter"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <Link
                        href="/auth/login"
                        className="flex items-center gap-3 text-sm text-zinc-400 hover:text-white transition"
                    >
                        <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4" />
                        </div>
                        <span>Connexion</span>
                    </Link>
                )}
            </div>
        </aside>
    )
}

function SidebarButton({
    active,
    onClick,
    icon: Icon,
    label,
}: {
    active: boolean
    onClick: () => void
    icon: React.ElementType
    label: string
}) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${active ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                }`}
        >
            <Icon className="w-5 h-5" />
            {label}
        </button>
    )
}

function TemplateButton({
    onClick,
    icon: Icon,
    label,
    color,
}: {
    onClick: () => void
    icon: React.ElementType
    label: string
    color: string
}) {
    return (
        <button
            onClick={onClick}
            className="w-full p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-left transition flex items-center gap-2"
        >
            <Icon className={`w-4 h-4 ${color}`} /> {label}
        </button>
    )
}

function StatRow({
    label,
    value,
    color,
    capitalize,
}: {
    label: string
    value: string
    color: string
    capitalize?: boolean
}) {
    return (
        <div className="flex justify-between">
            <span className="text-zinc-400">{label}</span>
            <span className={`${color} font-medium ${capitalize ? 'capitalize' : ''}`}>{value}</span>
        </div>
    )
}
