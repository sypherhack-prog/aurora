import { NextRequest } from 'next/server'
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'
import { logger } from '@/lib/logger'

/** Next.js route segment config - do not remove */
export const dynamic = 'force-dynamic'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handler = async (req: NextRequest, ctx: any) => {
    logger.debug('NextAuth request', req.method, req.url)
    return NextAuth(authOptions)(req, ctx)
}

export { handler as GET, handler as POST }
