'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Smartphone, ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { APP_CONSTANTS } from '@/lib/constants'

const formatPrice = (n: number) => n.toLocaleString('en-US')

const planDetails: Record<string, { name: string; price: string; period: string; amount: number }> = {
    BASIC: { name: 'Basic', price: formatPrice(APP_CONSTANTS.PRICING.BASIC), period: '1 mois', amount: APP_CONSTANTS.PRICING.BASIC },
    ANNUAL: { name: 'Annuel', price: formatPrice(APP_CONSTANTS.PRICING.ANNUAL), period: '12 mois', amount: APP_CONSTANTS.PRICING.ANNUAL },
}

function SubscribeContent() {
    const searchParams = useSearchParams()
    const planCode = searchParams.get('plan') || 'BASIC'
    const plan = planDetails[planCode] || planDetails.BASIC

    const [mvolaRef, setMvolaRef] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    plan: planCode,
                    mvolaRef,
                    phoneNumber,
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Une erreur est survenue')
            }

            setSuccess(true)
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
                <div className="max-w-md w-full bg-white dark:bg-zinc-800 rounded-2xl p-8 text-center shadow-lg border border-zinc-200 dark:border-zinc-700">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg
                            className="w-8 h-8 text-green-600 dark:text-green-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">Demande envoyée !</h2>
                    <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                        Votre demande d&apos;abonnement <strong>{plan.name}</strong> a été enregistrée. Nous vérifierons
                        votre paiement MVola et activerons votre compte sous 24h.
                    </p>
                    <Link
                        href="/"
                        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                    >
                        Retour à l&apos;accueil
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white dark:bg-zinc-800 rounded-2xl p-8 shadow-lg border border-zinc-200 dark:border-zinc-700">
            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-zinc-200 dark:border-zinc-700">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <Smartphone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-zinc-900 dark:text-white">Souscrire au plan {plan.name}</h1>
                    <p className="text-zinc-500">
                        {plan.price} Ar / {plan.period}
                    </p>
                </div>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 mb-8">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white mb-2">Instructions de paiement MVOLA</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3 block">
                    Pour effectuer le paiement, tapez le code suivant sur votre téléphone :
                </p>
                <div className="bg-zinc-100 dark:bg-zinc-950 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 font-mono text-center text-blue-600 dark:text-blue-400 font-bold select-all">
                    #111*1*2*0388670296*{plan.amount}*CODE_SECRET#
                </div>
                <p className="text-xs text-zinc-500 mt-2 text-center">
                    Remplacez <strong>CODE_SECRET</strong> par votre code secret MVOLA
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label
                        htmlFor="phoneNumber"
                        className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                    >
                        Numéro MVola utilisé pour le paiement
                    </label>
                    <input
                        type="tel"
                        id="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="034 00 000 00"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div>
                    <label
                        htmlFor="mvolaRef"
                        className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                    >
                        Référence MVola (du SMS de confirmation)
                    </label>
                    <input
                        type="text"
                        id="mvolaRef"
                        value={mvolaRef}
                        onChange={(e) => setMvolaRef(e.target.value)}
                        placeholder="Ex: TRX123456789"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {loading ? 'Envoi en cours...' : 'Soumettre ma demande'}
                </button>
            </form>

            <p className="text-xs text-zinc-500 mt-6 text-center">
                En soumettant, vous confirmez avoir effectué le paiement MVola. Votre abonnement sera activé après
                vérification manuelle.
            </p>
        </div>
    )
}

export default function SubscribePage() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4">
            <div className="max-w-lg mx-auto">
                <Link
                    href="/pricing"
                    className="inline-flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white mb-8"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Retour aux tarifs
                </Link>
                <Suspense
                    fallback={
                        <div className="flex justify-center p-12">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                        </div>
                    }
                >
                    <SubscribeContent />
                </Suspense>
            </div>
        </div>
    )
}
