import { NextRequest } from 'next/server'
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'
import { logger } from '@/lib/logger'

/** Next.js route segment config - do not remove */
export const dynamic = 'force-dynamic'

type NextAuthRouteContext = {
    params: {
        nextauth: string[]
    }
}

const handler = async (req: NextRequest, ctx: NextAuthRouteContext) => {
    logger.debug('NextAuth request', { method: req.method, url: req.url, params: ctx.params })
    return NextAuth(authOptions)(req, ctx)
}

export { handler as GET, handler as POST }
