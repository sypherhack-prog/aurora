'use client'

import { Copy } from 'lucide-react'
import { useState } from 'react'

export function CopyUrlButton({ url }: { url: string }) {
    const [copied, setCopied] = useState(false)

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            /* ignore */
        }
    }

    return (
        <button
            onClick={copy}
            className="inline-flex items-center gap-2 px-4 py-3 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg font-medium transition shrink-0"
        >
            <Copy className="w-4 h-4" />
            {copied ? 'Copié !' : 'Copier'}
        </button>
    )
}
