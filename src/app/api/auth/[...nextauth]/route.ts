import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// Log every request hitting this route
const handler = async (req: any, ctx: any) => {
    console.log(`📥 [NextAuth] Request: ${req.method} ${req.url}`)
    return NextAuth(authOptions)(req, ctx)
}

export { handler as GET, handler as POST }
