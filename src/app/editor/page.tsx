'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { useSession } from 'next-auth/react'
import {
    FileText,
    Sparkles,
    ChevronRight,
    Loader2,
    Download,
    Check,
    X,
    GraduationCap,
    BookOpen,
    Briefcase,
    Mail,
    PenTool,
} from 'lucide-react'
import { logger } from '@/lib/logger'
import { APP_CONSTANTS } from '@/lib/constants'

// Components
import { AIPanel } from './components/AIPanel'
import { EditorSidebar } from './components/EditorSidebar'
import { EditorToolbar } from './components/EditorToolbar'
import { NewDocModal } from './components/NewDocModal'
import { ExportModal } from './components/ExportModal'
import { useEditorDictation } from '@/hooks/useEditorDictation'

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

    const [headings, setHeadings] = useState<{ level: number; text: string; pos: number }[]>([])

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

            // Extract headings for ToC
            const newHeadings: { level: number; text: string; pos: number }[] = []
            editor.state.doc.descendants((node, pos) => {
                if (node.type.name === 'heading') {
                    newHeadings.push({
                        level: node.attrs.level,
                        text: node.textContent,
                        pos: pos,
                    })
                }
            })
            setHeadings(newHeadings)
        },
    })

    // Navigation Helper
    const scrollToHeading = (pos: number) => {
        if (!editor) return
        editor.chain().focus().setTextSelection(pos).run()
        const dom = editor.view.domAtPos(pos).node as HTMLElement
        if (dom && dom.scrollIntoView) {
            dom.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }

    const scrollPage = (direction: 'up' | 'down') => {
        const scrollAmount = window.innerHeight * 0.8
        window.scrollBy({
            top: direction === 'down' ? scrollAmount : -scrollAmount,
            behavior: 'smooth',
            // @ts-ignore
        })
    }

    useEffect(() => {
        setMounted(true)
        // Show modal only if editor is empty and mounted
        const checkEmpty = setTimeout(() => {
            if (editor && editor.getText().trim().length === 0) {
                setShowNewDocModal(true)
            }
        }, APP_CONSTANTS.TIMEOUTS.DEBOUNCE)
        return () => clearTimeout(checkEmpty)
    }, [editor])

    // Show notification
    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message })
        setTimeout(() => setNotification(null), APP_CONSTANTS.TIMEOUTS.NOTIFICATION)
    }

    // Dictation Hook
    const dictation = useEditorDictation(editor, showNotification)

    // Call AI API with context
    const callAI = useCallback(
        async (action: string, insertMode: 'replace' | 'append' | 'insert' = 'replace', themeOverride?: string) => {
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
                        theme: themeOverride || docTheme,
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
                        }, APP_CONSTANTS.TIMEOUTS.SCROLL)
                    } else {
                        editor.commands.insertContent(data.result)
                        showNotification('success', 'Contenu inséré!')
                    }
                } else {
                    console.error('AI Processing Failed:', data.error)
                    showNotification('error', data.error || 'Une erreur est survenue lors de la génération.')
                }
            } catch (e: any) {
                logger.error('AI error:', e)
                showNotification('error', `Erreur connexion: ${e.message || 'Inconnue'}`)
            } finally {
                setAiLoading(null)
            }
        },
        [editor, docTheme, docType]
    )

    // Handle Translation - pass language directly to callAI
    const handleTranslate = async () => {
        await callAI('translate', 'replace', translationLang)
    }

    const handleTranslateSelection = async () => {
        await callAI('translate-selection', 'replace', translationLang)
    }

    const createNewDoc = (theme: string, type: string, initialContent?: string) => {
        setDocTheme(theme)
        setDocType(type)
        setShowNewDocModal(false)
        showNotification('success', 'Nouveau document créé')

        if (initialContent && editor) {
            editor.commands.setContent(initialContent)
            return
        }

        if (editor) {
            editor.commands.setContent(APP_CONSTANTS.DEFAULT_CONTENT[type as keyof typeof APP_CONSTANTS.DEFAULT_CONTENT] || '')
        }
    }

    // Export document
    const exportDocument = async (format: 'html' | 'txt' | 'md' | 'pdf' | 'pptx') => {
        if (!editor) return
        setExportLoading(true)

        try {
            const fileName = `document.${format}`

            if (format === 'pdf') {
                const element = document.querySelector('.ProseMirror') as HTMLElement
                if (element) {
                    const { exportToPDF } = await import('@/lib/export-utils')
                    await exportToPDF(element, fileName)
                    showNotification('success', 'PDF exporté!')
                }
            }
            else if (format === 'pptx') {
                const element = document.querySelector('.ProseMirror') as HTMLElement
                if (element) {
                    const { exportToPPTX } = await import('@/lib/export-utils')
                    await exportToPPTX(element, fileName)
                    showNotification('success', 'PowerPoint exporté!')
                }
            }
            else {
                // Standard text exports via API
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
                    a.download = fileName
                    document.body.appendChild(a)
                    a.click()
                    document.body.removeChild(a)
                    window.URL.revokeObjectURL(url)
                    showNotification('success', `Exporté en ${format.toUpperCase()}!`)
                } else {
                    showNotification('error', 'Erreur export')
                }
            }
            setShowExportModal(false)
        } catch (e) {
            logger.error('Export error:', e)
            showNotification('error', 'Erreur export')
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
            <NewDocModal
                isOpen={showNewDocModal}
                onClose={() => setShowNewDocModal(false)}
                onCreateDoc={createNewDoc}
            />

            {/* Export Modal */}
            <ExportModal
                isOpen={showExportModal}
                onClose={() => setShowExportModal(false)}
                onExport={exportDocument}
                loading={exportLoading}
            />

            {/* Sidebar */}
            <EditorSidebar
                session={session || null}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onCreateNewDoc={createNewDoc}
                onOpenNewDocModal={() => setShowNewDocModal(true)}
                stats={{ wordCount, charCount }}
                settings={{
                    docTheme,
                    aiPanelOpen,
                    setAiPanelOpen,
                }}
                navigation={{
                    headings,
                    onScrollToHeading: scrollToHeading,
                }}
            />

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
                        <EditorToolbar
                            editor={editor}
                            aiLoading={aiLoading}
                            onCallAI={callAI}
                            dictation={{
                                isListening: dictation.isListening,
                                isSupported: dictation.isSupported,
                                onToggle: dictation.toggleDictation,
                            }}
                        />

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
                            onTranslateSelection: handleTranslateSelection,
                        }}
                    />
                </div>
                {/* Floating Navigation Buttons */}
                <div className="fixed bottom-8 right-8 flex flex-col gap-2 z-50">
                    <button
                        onClick={() => scrollPage('up')}
                        className="p-3 bg-zinc-800/80 hover:bg-zinc-700 backdrop-blur-sm text-zinc-300 rounded-full shadow-lg border border-zinc-700 transition-all hover:scale-110"
                        title="Page précédente"
                    >
                        <ChevronRight className="w-5 h-5 -rotate-90" />
                    </button>
                    <button
                        onClick={() => scrollPage('down')}
                        className="p-3 bg-cyan-600/80 hover:bg-cyan-500 backdrop-blur-sm text-white rounded-full shadow-lg shadow-cyan-500/20 border border-cyan-500/50 transition-all hover:scale-110"
                        title="Page suivante"
                    >
                        <ChevronRight className="w-5 h-5 rotate-90" />
                    </button>
                </div>
            </main>
        </div>
    )
}
