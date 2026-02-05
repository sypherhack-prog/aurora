import { AuroraIcon } from '@/components/AuroraIcon'
import {
    Plus,
    GraduationCap,
    BookOpen,
    Briefcase,
    Mail,
    PenTool,
} from 'lucide-react'

interface NewDocModalProps {
    isOpen: boolean
    onClose: () => void
    onCreateDoc: (theme: string, type: string) => void
}

export function NewDocModal({ isOpen, onClose, onCreateDoc }: NewDocModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 w-full max-w-3xl shadow-2xl relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <h2 className="text-2xl font-bold mb-2 flex items-center gap-3 relative z-10">
                    <AuroraIcon className="w-6 h-6 text-cyan-400" />
                    Nouveau Document
                </h2>
                <p className="text-zinc-400 mb-8 relative z-10">
                    Choisissez un modèle pour optimiser l&apos;assistance IA selon votre besoin.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8 relative z-10">
                    <TemplateCard
                        onClick={() => onCreateDoc('general', 'blank')}
                        icon={Plus}
                        label="Document Vierge"
                        description="Partir de zéro"
                        iconBg="bg-zinc-900"
                        iconColor="text-white"
                        borderColor="border-zinc-700"
                    />

                    <TemplateCard
                        onClick={() => onCreateDoc('academic', 'exam')}
                        icon={GraduationCap}
                        label="Sujet d'Examen"
                        description="Structure académique"
                        iconBg="bg-blue-500/10"
                        iconColor="text-blue-400"
                        borderColor="border-blue-500/20"
                    />

                    <TemplateCard
                        onClick={() => onCreateDoc('academic', 'notes')}
                        icon={BookOpen}
                        label="Notes de Cours"
                        description="Organisation claire"
                        iconBg="bg-purple-500/10"
                        iconColor="text-purple-400"
                        borderColor="border-purple-500/20"
                    />

                    <TemplateCard
                        onClick={() => onCreateDoc('business', 'report')}
                        icon={Briefcase}
                        label="Rapport de Stage"
                        description="Structure professionnelle"
                        iconBg="bg-cyan-500/10"
                        iconColor="text-cyan-400"
                        borderColor="border-cyan-500/20"
                    />

                    <TemplateCard
                        onClick={() => onCreateDoc('letter', 'cover-letter')}
                        icon={Mail}
                        label="Lettre de Motiv."
                        description="Format professionnel"
                        iconBg="bg-green-500/10"
                        iconColor="text-green-400"
                        borderColor="border-green-500/20"
                    />

                    <TemplateCard
                        onClick={() => onCreateDoc('creative', 'manuscript')}
                        icon={PenTool}
                        label="Manuscrit"
                        description="Pour les écrivains"
                        iconBg="bg-orange-500/10"
                        iconColor="text-orange-400"
                        borderColor="border-orange-500/20"
                    />
                </div>

                <button
                    onClick={onClose}
                    className="mx-auto block text-zinc-500 hover:text-white text-sm transition relative z-10"
                >
                    Fermer sans choisir
                </button>
            </div>
        </div>
    )
}

function TemplateCard({
    onClick,
    icon: Icon,
    label,
    description,
    iconBg,
    iconColor,
    borderColor,
}: {
    onClick: () => void
    icon: React.ElementType
    label: string
    description: string
    iconBg: string
    iconColor: string
    borderColor: string
}) {
    return (
        <button
            onClick={onClick}
            className="p-4 bg-zinc-800 hover:bg-zinc-700/80 border border-zinc-700 hover:border-cyan-500/50 rounded-xl transition text-left group"
        >
            <div
                className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition border ${borderColor}`}
            >
                <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
            <div className="font-semibold text-white">{label}</div>
            <div className="text-xs text-zinc-400 mt-1">{description}</div>
        </button>
    )
}
