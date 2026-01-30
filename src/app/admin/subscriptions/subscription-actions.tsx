'use client'

import { useState } from 'react'
import { Check, X, Loader2 } from 'lucide-react'
import { verifyPayment, blockSubscription } from '@/lib/actions'
import { logger } from '@/lib/logger'

export default function SubscriptionActions({ subscriptionId, status }: { subscriptionId: string; status: string }) {
    const [loading, setLoading] = useState<string | null>(null)

    const handleVerify = async () => {
        setLoading('verify')
        try {
            await verifyPayment(subscriptionId)
        } catch (e) {
            logger.error('Verify error', e)
        } finally {
            setLoading(null)
        }
    }

    const handleBlock = async () => {
        setLoading('block')
        try {
            await blockSubscription(subscriptionId)
        } catch (e) {
            logger.error('Block error', e)
        } finally {
            setLoading(null)
        }
    }

    if (status !== 'PENDING') {
        return <span className="text-xs text-zinc-400">—</span>
    }

    return (
        <div className="flex justify-end gap-2">
            <button
                onClick={handleVerify}
                disabled={loading !== null}
                title="Valider le paiement"
                className="p-2 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 text-green-600 transition disabled:opacity-50"
            >
                {loading === 'verify' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            </button>
            <button
                onClick={handleBlock}
                disabled={loading !== null}
                title="Rejeter / Bloquer"
                className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 transition disabled:opacity-50"
            >
                {loading === 'block' ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
            </button>
        </div>
    )
}
