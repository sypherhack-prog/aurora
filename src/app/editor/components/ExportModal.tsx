import { Download, FileDown, Presentation, Loader2 } from 'lucide-react'

interface ExportModalProps {
    isOpen: boolean
    onClose: () => void
    onExport: (format: 'html' | 'txt' | 'md' | 'pdf' | 'pptx') => void
    loading: boolean
}

export function ExportModal({ isOpen, onClose, onExport, loading }: ExportModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md shadow-xl">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Download className="w-5 h-5 text-cyan-400" />
                    Exporter le Document
                </h3>
                <div className="space-y-3">
                    <ExportButton
                        onClick={() => onExport('html')}
                        loading={loading}
                        label="HTML"
                        description="Page web stylisée"
                        icon={FileDown}
                        iconBg="bg-orange-500/20"
                        iconColor="text-orange-400"
                    />
                    <ExportButton
                        onClick={() => onExport('md')}
                        loading={loading}
                        label="Markdown"
                        description="Format universel"
                        icon={FileDown}
                        iconBg="bg-purple-500/20"
                        iconColor="text-purple-400"
                    />
                    <ExportButton
                        onClick={() => onExport('txt')}
                        loading={loading}
                        label="Texte brut"
                        description="Sans formatage"
                        icon={FileDown}
                        iconBg="bg-zinc-700/50"
                        iconColor="text-zinc-400"
                    />
                    <ExportButton
                        onClick={() => onExport('pdf')}
                        loading={loading}
                        label="PDF"
                        description="Document imprimable"
                        icon={FileDown}
                        iconBg="bg-red-500/20"
                        iconColor="text-red-400"
                    />
                    <ExportButton
                        onClick={() => onExport('pptx')}
                        loading={loading}
                        label="PowerPoint"
                        description="Présentation slides"
                        icon={Presentation}
                        iconBg="bg-orange-500/20"
                        iconColor="text-orange-400"
                    />
                </div>
                <button
                    onClick={onClose}
                    className="w-full mt-4 py-2 text-zinc-400 hover:text-white transition"
                >
                    Annuler
                </button>
            </div>
        </div>
    )
}

function ExportButton({
    onClick,
    loading,
    label,
    description,
    icon: Icon,
    iconBg,
    iconColor,
}: {
    onClick: () => void
    loading: boolean
    label: string
    description: string
    icon: React.ElementType
    iconBg: string
    iconColor: string
}) {
    return (
        <button
            onClick={onClick}
            disabled={loading}
            className="w-full flex items-center justify-between p-4 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition disabled:opacity-50 group"
        >
            <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded ${iconBg} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${iconColor}`} />
                </div>
                <div className="text-left">
                    <div className="font-medium group-hover:text-white transition-colors">{label}</div>
                    <div className="text-xs text-zinc-400">{description}</div>
                </div>
            </div>
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        </button>
    )
}
