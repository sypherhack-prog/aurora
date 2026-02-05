import { NextRequest } from 'next/server'
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'
import { logger } from '@/lib/logger'

/** Next.js route segment config - do not remove */
export const dynamic = 'force-dynamic'

// Next.js 16 attend un contexte avec `params` asynchrone.
// On tape suffisamment large pour rester compatible tout en loggant les infos utiles.
const handler = async (
    req: NextRequest,
    ctx: { params: Promise<{ nextauth: string[] }> }
) => {
    logger.debug('NextAuth request', {
        method: req.method,
        url: req.url,
        params: ctx.params,
    })
    // NextAuth gère lui-même ses propres types de contexte
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return NextAuth(authOptions)(req, ctx as any)
}

export { handler as GET, handler as POST }
