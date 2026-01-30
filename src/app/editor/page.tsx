'use client'

import { useState, useEffect, useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import {
    FileText,
    FolderOpen,
    Sparkles,
    Settings,
    Plus,
    Bold,
    Italic,
    List,
    ListOrdered,
    Quote,
    Code,
    Heading1,
    Heading2,
    Heading3,
    Undo,
    Redo,
    Wand2,
    ChevronRight,
    BarChart3,
    RefreshCw,
    User,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Table as TableIcon,
    Type,
    Loader2,
    FileEdit,
    Zap,
    Download,
    Check,
    X,
    FileDown,
    Pencil,
    GraduationCap,
    Briefcase,
    Mail,
    PenTool,
    BookOpen,
    Lightbulb,
    Languages,
} from 'lucide-react'
import { logger } from '@/lib/logger'
import { AIPanel } from './components/AIPanel'

const DOC_TITLES: Record<string, string> = {
    exam: "Sujet d'Examen",
    notes: 'Notes de Cours',
    report: 'Rapport de Stage',
    'cover-letter': 'Lettre de Motivation',
    manuscript: 'Manuscrit',
}

export default function EditorPage() {
    const { data: session } = useSession()
    const [mounted, setMounted] = useState(false)
    const [aiPanelOpen, setAiPanelOpen] = useState(true)
    const [aiLoading, setAiLoading] = useState<string | null>(null)
    const [wordCount, setWordCount] = useState(0)
    const [charCount, setCharCount] = useState(0)
    const [activeTab, setActiveTab] = useState('documents')
    const [showExportModal, setShowExportModal] = useState(false)
    const [showNewDocModal, setShowNewDocModal] = useState(false)
    const [exportLoading, setExportLoading] = useState(false)
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
    const [docTheme, setDocTheme] = useState('general')
    const [docType, setDocType] = useState('document')
    const [translationLang, setTranslationLang] = useState('Anglais')

    const editor = useEditor({
        extensions: [
            StarterKit,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Placeholder.configure({
                placeholder: "Commencez à écrire... L'IA formatera automatiquement.",
            }),
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
        ],
        content: '',
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[500px] p-4',
            },
        },
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            const text = editor.getText()
            setWordCount(text.split(/\s+/).filter((w) => w.length > 0).length)
            setCharCount(text.length)
        },
    })

    useEffect(() => {
        setMounted(true)
        // Show modal only if editor is empty and mounted
        const checkEmpty = setTimeout(() => {
            if (editor && editor.getText().trim().length === 0) {
                setShowNewDocModal(true)
            }
        }, 500)
        return () => clearTimeout(checkEmpty)
    }, [editor])

    // Show notification
    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message })
        setTimeout(() => setNotification(null), 3000)
    }

    // Call AI API with context
    const callAI = useCallback(
        async (action: string, insertMode: 'replace' | 'append' | 'insert' = 'replace') => {
            if (!editor) return
            setAiLoading(action)

            try {
                const content = editor.getHTML()
                const { from, to } = editor.state.selection
                const selection = from !== to ? editor.state.doc.textBetween(from, to) : null

                const res = await fetch('/api/ai/format', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action,
                        content,
                        selection,
                        theme: docTheme,
                        documentType: docType,
                    }),
                })

                const data = await res.json()

                if (data.success && data.result) {
                    if (action === 'auto-format' || action === 'fix-errors' || action === 'improve-spacing') {
                        editor.commands.setContent(data.result)
                        showNotification('success', 'Document formaté avec succès!')
                    } else if (insertMode === 'append') {
                        editor.commands.insertContentAt(editor.state.doc.content.size, data.result)
                        // Scroll to bottom
                        setTimeout(() => {
                            const scrollHeight = document.documentElement.scrollHeight
                            window.scrollTo(0, scrollHeight)
                        }, 100)
                    } else {
                        editor.commands.insertContent(data.result)
                        showNotification('success', 'Contenu inséré!')
                    }
                } else {
                    showNotification('error', data.error || 'Erreur AI')
                }
            } catch (e) {
                logger.error('AI error:', e)
                showNotification('error', 'Erreur de connexion')
            } finally {
                setAiLoading(null)
            }
        },
        [editor, docTheme, docType]
    )

    // Handle Translation
    const handleTranslate = () => {
        // Temporarily set theme to target language just for this request
        const originalTheme = docTheme
        setDocTheme(translationLang)
        callAI('translate', 'replace')
            .then(() => {
                setDocTheme(originalTheme)
            })
            .catch((e) => {
                logger.error('Translation error', e)
                setDocTheme(originalTheme)
            })
    }

    const createNewDoc = (theme: string, type: string, initialContent?: string) => {
        setDocTheme(theme)
        setDocType(type)
        setShowNewDocModal(false)
        showNotification('success', 'Nouveau document créé')

        if (initialContent) {
            editor?.commands.setContent(initialContent)
            return
        }

        const DEFAULT_CONTENT: Record<string, string> = {
            exam: "<h1>Sujet d'Examen</h1><p><strong>Matière :</strong> ...</p><p><strong>Durée :</strong> ...</p><h2>Exercice 1</h2><p>...</p>",
            notes: '<h1>Notes de Cours</h1><p><strong>Date :</strong> ...</p><h2>Introduction</h2><p>...</p>',
            report: '<h1>Rapport de Stage</h1><p><strong>Entreprise :</strong> ...</p><p><strong>Période :</strong> ...</p><h2>Introduction</h2><p>Ce rapport présente...</p><h2>Missions effectuées</h2><p>...</p><h2>Bilan</h2><p>...</p>',
            'cover-letter': '<p>Prénom Nom</p><p>Adresse</p><p>Tél</p><br><p>Entreprise</p><p>Adresse</p><br><p><strong>Objet : Candidature au poste de...</strong></p><br><p>Madame, Monsieur,</p><p>...</p><br><p>Cordialement,</p>',
            manuscript: "<h1>Titre du Roman</h1><h2>Chapitre 1</h2><p>C'était une nuit sombre et orageuse...</p>",
            blank: '',
        }

        editor?.commands.setContent(DEFAULT_CONTENT[type] || '')
    }

    // Export document
    const exportDocument = async (format: 'html' | 'txt' | 'md') => {
        if (!editor) return
        setExportLoading(true)

        try {
            const content = editor.getHTML()
            const res = await fetch('/api/export', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content, format, title: 'Document Aurora AI' }),
            })

            if (res.ok) {
                const blob = await res.blob()
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `document.${format}`
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
                window.URL.revokeObjectURL(url)
                showNotification('success', `Exporté en ${format.toUpperCase()}!`)
                setShowExportModal(false)
            } else {
                showNotification('error', 'Erreur export')
            }
        } catch (e) {
            logger.error('Export error:', e)
            showNotification('error', 'Erreur export')
        } finally {
            setExportLoading(false)
        }
    }

    // Export PDF using html2pdf
    const exportPDF = async () => {
        if (!editor) return
        setExportLoading(true)
        try {
            // Dynamically load html2pdf
            // @ts-ignore
            if (typeof window.html2pdf === 'undefined') {
                const script = document.createElement('script')
                script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'
                document.head.appendChild(script)
                await new Promise((resolve) => (script.onload = resolve))
            }

            const element = document.querySelector('.ProseMirror')
            const opt = {
                margin: 1,
                filename: 'document.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
            }

            // @ts-ignore
            await window.html2pdf().set(opt).from(element).save()
            showNotification('success', 'PDF exporté!')
            setShowExportModal(false)
        } catch (e) {
            logger.error('PDF Export', e)
            showNotification('error', 'Erreur PDF')
        } finally {
            setExportLoading(false)
        }
    }

    if (!mounted) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-white flex">
            {/* Notification */}
            {notification && (
                <div
                    className={`fixed top-4 right-4 z-[60] flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg border ${notification.type === 'success'
                        ? 'bg-zinc-900 border-green-500/30 text-green-400'
                        : 'bg-zinc-900 border-red-500/30 text-red-400'
                        }`}
                >
                    {notification.type === 'success' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    {notification.message}
                </div>
            )}

            {/* New Document Modal */}
            {showNewDocModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 w-full max-w-3xl shadow-2xl relative overflow-hidden">
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                        <h2 className="text-2xl font-bold mb-2 flex items-center gap-3 relative z-10">
                            <Sparkles className="w-6 h-6 text-cyan-400" />
                            Nouveau Document
                        </h2>
                        <p className="text-zinc-400 mb-8 relative z-10">
                            Choisissez un modèle pour optimiser l&apos;assistance IA selon votre besoin.
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8 relative z-10">
                            <button
                                onClick={() => createNewDoc('general', 'blank')}
                                className="p-4 bg-zinc-800 hover:bg-zinc-700/80 border border-zinc-700 hover:border-cyan-500/50 rounded-xl transition text-left group"
                            >
                                <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition border border-zinc-700">
                                    <Plus className="w-5 h-5 text-white" />
                                </div>
                                <div className="font-semibold text-white">Document Vierge</div>
                                <div className="text-xs text-zinc-400 mt-1">Partir de zéro</div>
                            </button>

                            <button
                                onClick={() => createNewDoc('academic', 'exam')}
                                className="p-4 bg-zinc-800 hover:bg-zinc-700/80 border border-zinc-700 hover:border-cyan-500/50 rounded-xl transition text-left group"
                            >
                                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition border border-blue-500/20">
                                    <GraduationCap className="w-5 h-5 text-blue-400" />
                                </div>
                                <div className="font-semibold text-white">Sujet d&apos;Examen</div>
                                <div className="text-xs text-zinc-400 mt-1">Structure académique</div>
                            </button>

                            <button
                                onClick={() => createNewDoc('academic', 'notes')}
                                className="p-4 bg-zinc-800 hover:bg-zinc-700/80 border border-zinc-700 hover:border-cyan-500/50 rounded-xl transition text-left group"
                            >
                                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition border border-purple-500/20">
                                    <BookOpen className="w-5 h-5 text-purple-400" />
                                </div>
                                <div className="font-semibold text-white">Notes de Cours</div>
                                <div className="text-xs text-zinc-400 mt-1">Organisation claire</div>
                            </button>

                            <button
                                onClick={() => createNewDoc('business', 'report')}
                                className="p-4 bg-zinc-800 hover:bg-zinc-700/80 border border-zinc-700 hover:border-cyan-500/50 rounded-xl transition text-left group"
                            >
                                <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition border border-cyan-500/20">
                                    <Briefcase className="w-5 h-5 text-cyan-400" />
                                </div>
                                <div className="font-semibold text-white">Rapport de Stage</div>
                                <div className="text-xs text-zinc-400 mt-1">Structure professionnelle</div>
                            </button>

                            <button
                                onClick={() => createNewDoc('letter', 'cover-letter')}
                                className="p-4 bg-zinc-800 hover:bg-zinc-700/80 border border-zinc-700 hover:border-cyan-500/50 rounded-xl transition text-left group"
                            >
                                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition border border-green-500/20">
                                    <Mail className="w-5 h-5 text-green-400" />
                                </div>
                                <div className="font-semibold text-white">Lettre de Motiv.</div>
                                <div className="text-xs text-zinc-400 mt-1">Format professionnel</div>
                            </button>

                            <button
                                onClick={() => createNewDoc('creative', 'manuscript')}
                                className="p-4 bg-zinc-800 hover:bg-zinc-700/80 border border-zinc-700 hover:border-cyan-500/50 rounded-xl transition text-left group"
                            >
                                <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition border border-orange-500/20">
                                    <PenTool className="w-5 h-5 text-orange-400" />
                                </div>
                                <div className="font-semibold text-white">Manuscrit</div>
                                <div className="text-xs text-zinc-400 mt-1">Pour les écrivains</div>
                            </button>
                        </div>

                        <button
                            onClick={() => setShowNewDocModal(false)}
                            className="mx-auto block text-zinc-500 hover:text-white text-sm transition relative z-10"
                        >
                            Fermer sans choisir
                        </button>
                    </div>
                </div>
            )}

            {/* Export Modal */}
            {showExportModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-xl">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Download className="w-5 h-5 text-cyan-400" />
                            Exporter le Document
                        </h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => exportDocument('html')}
                                disabled={exportLoading}
                                className="w-full flex items-center justify-between p-4 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition disabled:opacity-50 group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-orange-500/20 flex items-center justify-center">
                                        <FileDown className="w-4 h-4 text-orange-400" />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-medium group-hover:text-white transition-colors">HTML</div>
                                        <div className="text-xs text-zinc-400">Page web stylisée</div>
                                    </div>
                                </div>
                                {exportLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                            </button>
                            <button
                                onClick={() => exportDocument('md')}
                                disabled={exportLoading}
                                className="w-full flex items-center justify-between p-4 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition disabled:opacity-50 group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-purple-500/20 flex items-center justify-center">
                                        <FileDown className="w-4 h-4 text-purple-400" />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-medium group-hover:text-white transition-colors">
                                            Markdown
                                        </div>
                                        <div className="text-xs text-zinc-400">Format universel</div>
                                    </div>
                                </div>
                            </button>
                            <button
                                onClick={() => exportDocument('txt')}
                                disabled={exportLoading}
                                className="w-full flex items-center justify-between p-4 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition disabled:opacity-50 group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-zinc-700/50 flex items-center justify-center">
                                        <FileDown className="w-4 h-4 text-zinc-400" />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-medium group-hover:text-white transition-colors">
                                            Texte brut
                                        </div>
                                        <div className="text-xs text-zinc-400">Sans formatage</div>
                                    </div>
                                </div>
                            </button>

                            <button
                                onClick={exportPDF}
                                disabled={exportLoading}
                                className="w-full flex items-center justify-between p-4 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition disabled:opacity-50 group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-red-500/20 flex items-center justify-center">
                                        <FileDown className="w-4 h-4 text-red-400" />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-medium group-hover:text-white transition-colors">PDF</div>
                                        <div className="text-xs text-zinc-400">Document imprimable</div>
                                    </div>
                                </div>
                            </button>
                        </div>
                        <button
                            onClick={() => setShowExportModal(false)}
                            className="w-full mt-4 py-2 text-zinc-400 hover:text-white transition"
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            )}

            {/* Sidebar */}
            <aside className="w-64 bg-zinc-900/50 border-r border-zinc-800 flex flex-col hidden md:flex">
                <div className="p-6 border-b border-zinc-800">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-semibold text-lg">Aurora AI</span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <button
                        onClick={() => setActiveTab('documents')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${activeTab === 'documents'
                            ? 'bg-zinc-800 text-white'
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                            }`}
                    >
                        <FileText className="w-5 h-5" />
                        Documents Récents
                    </button>
                    <button
                        onClick={() => setActiveTab('templates')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${activeTab === 'templates'
                            ? 'bg-zinc-800 text-white'
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                            }`}
                    >
                        <FolderOpen className="w-5 h-5" />
                        Modèles
                    </button>
                    <button
                        onClick={() => setActiveTab('insights')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${activeTab === 'insights'
                            ? 'bg-zinc-800 text-white'
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                            }`}
                    >
                        <BarChart3 className="w-5 h-5" />
                        Insights IA
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${activeTab === 'settings'
                            ? 'bg-zinc-800 text-white'
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                            }`}
                    >
                        <Settings className="w-5 h-5" />
                        Paramètres
                    </button>
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
                            <button
                                onClick={() => createNewDoc('academic', 'exam')}
                                className="w-full p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-left transition flex items-center gap-2"
                            >
                                <GraduationCap className="w-4 h-4 text-blue-400" /> Sujet d&apos;examen
                            </button>
                            <button
                                onClick={() => createNewDoc('academic', 'notes')}
                                className="w-full p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-left transition flex items-center gap-2"
                            >
                                <BookOpen className="w-4 h-4 text-purple-400" /> Notes de cours
                            </button>
                            <button
                                onClick={() => createNewDoc('business', 'report')}
                                className="w-full p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-left transition flex items-center gap-2"
                            >
                                <Briefcase className="w-4 h-4 text-cyan-400" /> Rapport de Stage
                            </button>
                            <button
                                onClick={() => createNewDoc('letter', 'cover-letter')}
                                className="w-full p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-left transition flex items-center gap-2"
                            >
                                <Mail className="w-4 h-4 text-green-400" /> Lettre de motivation
                            </button>
                            <button
                                onClick={() => createNewDoc('creative', 'manuscript')}
                                className="w-full p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-left transition flex items-center gap-2"
                            >
                                <PenTool className="w-4 h-4 text-orange-400" /> Manuscrit
                            </button>
                        </div>
                    )}
                    {activeTab === 'insights' && (
                        <div className="space-y-3 text-sm">
                            <div className="text-zinc-500 text-xs mb-2">Analyse du document</div>
                            <div className="flex justify-between">
                                <span className="text-zinc-400">Mots</span>
                                <span className="text-cyan-400 font-medium">{wordCount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-400">Caractères</span>
                                <span className="text-cyan-400 font-medium">{charCount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-400">Lecture</span>
                                <span className="text-cyan-400 font-medium">{Math.ceil(wordCount / 200)} min</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-zinc-400">Thème</span>
                                <span className="text-green-400 font-medium capitalize">{docTheme}</span>
                            </div>
                        </div>
                    )}
                    {activeTab === 'settings' && (
                        <div className="space-y-3 text-sm">
                            <div className="text-zinc-500 text-xs mb-2">Préférences</div>
                            <label className="flex items-center justify-between cursor-pointer">
                                <span className="text-zinc-400">Panneau IA</span>
                                <input
                                    type="checkbox"
                                    checked={aiPanelOpen}
                                    onChange={() => setAiPanelOpen(!aiPanelOpen)}
                                    className="w-4 h-4 rounded bg-zinc-800 border-zinc-600 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-zinc-900"
                                />
                            </label>
                            <div className="text-xs text-zinc-500 pt-2">Version: Aurora AI 1.1</div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-zinc-800">
                    <button
                        onClick={() => setShowNewDocModal(true)}
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

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                {/* Top Bar */}
                <header className="h-14 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-950/80 backdrop-blur-sm z-30">
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-zinc-500 hidden sm:inline">Éditeur</span>
                        <ChevronRight className="w-4 h-4 text-zinc-600 hidden sm:inline" />
                        <span className="text-sm flex items-center gap-2 font-medium">
                            {docType === 'exam' && <GraduationCap className="w-4 h-4 text-blue-400" />}
                            {docType === 'notes' && <BookOpen className="w-4 h-4 text-purple-400" />}
                            {docType === 'report' && <Briefcase className="w-4 h-4 text-cyan-400" />}
                            {docType === 'cover-letter' && <Mail className="w-4 h-4 text-green-400" />}
                            {docType === 'manuscript' && <PenTool className="w-4 h-4 text-orange-400" />}
                            {docType === 'document' && <FileText className="w-4 h-4 text-zinc-400" />}
                            {docType === 'blank' && <FileText className="w-4 h-4 text-zinc-400" />}
                            {DOC_TITLES[docType] || 'Document sans titre'}
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-xs text-zinc-500 hidden md:block">
                            {wordCount} mots • {charCount} car.
                        </div>
                        <button
                            onClick={() => setShowExportModal(true)}
                            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm px-4 py-2 rounded-lg font-medium hover:from-cyan-400 hover:to-blue-500 transition shadow-lg shadow-cyan-500/20"
                        >
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">Exporter</span>
                        </button>
                        <button
                            onClick={() => setAiPanelOpen(!aiPanelOpen)}
                            className="md:hidden p-2 text-zinc-400 hover:text-white"
                        >
                            <Sparkles className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                {/* Editor Area */}
                <div className="flex-1 flex overflow-hidden">
                    <div className="flex-1 flex flex-col min-w-0">
                        {/* Toolbar */}
                        <div className="border-b border-zinc-800 px-6 py-3 flex items-center gap-1 flex-wrap bg-zinc-900/30">
                            <ToolbarButton
                                icon={Bold}
                                tooltip="Gras"
                                onClick={() => editor?.chain().focus().toggleBold().run()}
                                active={editor?.isActive('bold')}
                            />
                            <ToolbarButton
                                icon={Italic}
                                tooltip="Italique"
                                onClick={() => editor?.chain().focus().toggleItalic().run()}
                                active={editor?.isActive('italic')}
                            />
                            <ToolbarDivider />
                            <ToolbarButton
                                icon={Heading1}
                                tooltip="Titre 1"
                                onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                                active={editor?.isActive('heading', { level: 1 })}
                            />
                            <ToolbarButton
                                icon={Heading2}
                                tooltip="Titre 2"
                                onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                                active={editor?.isActive('heading', { level: 2 })}
                            />
                            <ToolbarButton
                                icon={Heading3}
                                tooltip="Titre 3"
                                onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                                active={editor?.isActive('heading', { level: 3 })}
                            />
                            <ToolbarDivider />
                            <ToolbarButton
                                icon={AlignLeft}
                                tooltip="Gauche"
                                onClick={() => editor?.chain().focus().setTextAlign('left').run()}
                            />
                            <ToolbarButton
                                icon={AlignCenter}
                                tooltip="Centrer"
                                onClick={() => editor?.chain().focus().setTextAlign('center').run()}
                            />
                            <ToolbarButton
                                icon={AlignRight}
                                tooltip="Droite"
                                onClick={() => editor?.chain().focus().setTextAlign('right').run()}
                            />
                            <ToolbarDivider />
                            <ToolbarButton
                                icon={List}
                                tooltip="Liste"
                                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                            />
                            <ToolbarButton
                                icon={ListOrdered}
                                tooltip="Liste n°"
                                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                            />
                            <ToolbarButton
                                icon={Quote}
                                tooltip="Citation"
                                onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                            />
                            <ToolbarButton
                                icon={Code}
                                tooltip="Code"
                                onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
                            />
                            <ToolbarDivider />
                            <ToolbarButton
                                icon={TableIcon}
                                tooltip="Tableau"
                                onClick={() =>
                                    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
                                }
                            />
                            <ToolbarButton
                                icon={Undo}
                                tooltip="Annuler"
                                onClick={() => editor?.chain().focus().undo().run()}
                            />
                            <ToolbarButton
                                icon={Redo}
                                tooltip="Rétablir"
                                onClick={() => editor?.chain().focus().redo().run()}
                            />
                            <div className="flex-1" />

                            {/* AI Button */}
                            <button
                                onClick={() => callAI('auto-format', 'replace')}
                                disabled={aiLoading === 'auto-format'}
                                className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 transition disabled:opacity-50 shadow-lg shadow-cyan-500/20"
                            >
                                {aiLoading === 'auto-format' ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Wand2 className="w-4 h-4" />
                                )}
                                Auto-Format IA
                            </button>
                        </div>

                        {/* Editor */}
                        <div className="flex-1 overflow-auto p-4 sm:p-8 custom-scrollbar">
                            <div className="max-w-3xl mx-auto bg-zinc-900/30 min-h-[500px] p-8 rounded-xl shadow-inner border border-zinc-800/50">
                                <EditorContent editor={editor} />
                            </div>
                        </div>
                    </div>

                    {/* AI Panel */}
                    <AIPanel
                        isOpen={aiPanelOpen}
                        onClose={() => setAiPanelOpen(false)}
                        aiLoading={aiLoading}
                        callAI={callAI}
                        translation={{
                            language: translationLang,
                            setLanguage: setTranslationLang,
                            onTranslate: handleTranslate,
                        }}
                    />
                </div>
            </main>
        </div>
    )
}

function ToolbarButton({
    icon: Icon,
    tooltip,
    onClick,
    active,
}: {
    icon: any
    tooltip: string
    onClick?: () => void
    active?: boolean
}) {
    return (
        <button
            onClick={onClick}
            title={tooltip}
            className={`p-2 rounded-lg transition ${active ? 'bg-cyan-500/20 text-cyan-400' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}
        >
            <Icon className="w-4 h-4" />
        </button>
    )
}

function ToolbarDivider() {
    return <div className="w-px h-6 bg-zinc-700 mx-1" />
}

function AIButton({
    icon: Icon,
    label,
    loading,
    onClick,
}: {
    icon: any
    label: string
    loading?: boolean
    onClick: () => void
}) {
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
