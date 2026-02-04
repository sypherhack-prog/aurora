import { Editor } from '@tiptap/react'
import {
    Bold,
    Italic,
    Heading1,
    Heading2,
    Heading3,
    AlignLeft,
    AlignCenter,
    AlignRight,
    List,
    ListOrdered,
    Quote,
    Code,
    Table as TableIcon,
    Undo,
    Redo,
    Loader2,
    Wand2,
    Mic,
    MicOff,
} from 'lucide-react'

interface EditorToolbarProps {
    editor: Editor | null
    aiLoading: string | null
    onCallAI: (action: string, insertMode: 'replace' | 'append' | 'insert') => void
    dictation: {
        isListening: boolean
        isSupported: boolean
        onToggle: () => void
    }
}

export function EditorToolbar({ editor, aiLoading, onCallAI, dictation }: EditorToolbarProps) {
    if (!editor) return null

    return (
        <div className="border-b border-zinc-800 px-6 py-3 flex items-center gap-1 flex-wrap bg-zinc-900/30">
            <ToolbarButton
                icon={Bold}
                tooltip="Gras"
                onClick={() => editor.chain().focus().toggleBold().run()}
                active={editor.isActive('bold')}
            />
            <ToolbarButton
                icon={Italic}
                tooltip="Italique"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                active={editor.isActive('italic')}
            />
            <ToolbarDivider />
            <ToolbarButton
                icon={Heading1}
                tooltip="Titre 1"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                active={editor.isActive('heading', { level: 1 })}
            />
            <ToolbarButton
                icon={Heading2}
                tooltip="Titre 2"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                active={editor.isActive('heading', { level: 2 })}
            />
            <ToolbarButton
                icon={Heading3}
                tooltip="Titre 3"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                active={editor.isActive('heading', { level: 3 })}
            />
            <ToolbarDivider />
            <ToolbarButton
                icon={AlignLeft}
                tooltip="Gauche"
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
            />
            <ToolbarButton
                icon={AlignCenter}
                tooltip="Centrer"
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
            />
            <ToolbarButton
                icon={AlignRight}
                tooltip="Droite"
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
            />
            <ToolbarDivider />
            <ToolbarButton
                icon={List}
                tooltip="Liste"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
            />
            <ToolbarButton
                icon={ListOrdered}
                tooltip="Liste n°"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
            />
            <ToolbarButton
                icon={Quote}
                tooltip="Citation"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
            />
            <ToolbarButton
                icon={Code}
                tooltip="Code"
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            />
            <ToolbarDivider />
            <ToolbarButton
                icon={TableIcon}
                tooltip="Tableau"
                onClick={() =>
                    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
                }
            />
            <ToolbarButton
                icon={Undo}
                tooltip="Annuler"
                onClick={() => editor.chain().focus().undo().run()}
            />
            <ToolbarButton
                icon={Redo}
                tooltip="Rétablir"
                onClick={() => editor.chain().focus().redo().run()}
            />
            {dictation.isSupported && (
                <>
                    <ToolbarDivider />
                    <ToolbarButton
                        icon={dictation.isListening ? MicOff : Mic}
                        tooltip={dictation.isListening ? "Arrêter dictée" : "Dicter"}
                        onClick={dictation.onToggle}
                        active={dictation.isListening}
                    />
                </>
            )}
            <div className="flex-1" />

            {/* AI Button */}
            <button
                onClick={() => onCallAI('auto-format', 'replace')}
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
    )
}

function ToolbarButton({
    icon: Icon,
    tooltip,
    onClick,
    active,
}: {
    icon: React.ElementType
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
