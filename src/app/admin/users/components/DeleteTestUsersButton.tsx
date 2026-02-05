'use client'

import { useState } from 'react'
import { Trash2, Loader2, Check, X } from 'lucide-react'

export function DeleteTestUsersButton() {
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

    const handleDelete = async () => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer tous les comptes de test ? Cette action est irréversible.')) {
            return
        }

        setLoading(true)
        setResult(null)

        try {
            const res = await fetch('/api/admin/delete-test-users', {
                method: 'POST',
            })

            const data = await res.json()

            if (res.ok) {
                setResult({ success: true, message: data.message || 'Comptes supprimés avec succès' })
                // Reload page after 2 seconds to refresh user list
                setTimeout(() => {
                    window.location.reload()
                }, 2000)
            } else {
                setResult({ success: false, message: data.error || 'Erreur lors de la suppression' })
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue'
            setResult({ success: false, message: `Erreur: ${message}` })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center gap-3">
            {result && (
                <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
                        result.success
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}
                >
                    {result.success ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    {result.message}
                </div>
            )}
            <button
                onClick={handleDelete}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Suppression...
                    </>
                ) : (
                    <>
                        <Trash2 className="w-4 h-4" />
                        Supprimer comptes de test
                    </>
                )}
            </button>
        </div>
    )
}
