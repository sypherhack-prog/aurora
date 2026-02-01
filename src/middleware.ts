import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
    function middleware() {
        return NextResponse.next()
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const path = req.nextUrl.pathname
                console.log(`🛡️ [Middleware] Path: ${path}, Token exists: ${!!token}`)

                // Public Routes - Always allow
                if (
                    path === '/' ||
                    path.startsWith('/auth') ||
                    path.startsWith('/pricing') ||
                    path.startsWith('/subscribe') ||
                    path.startsWith('/api') || // API routes handle their own auth
                    path.startsWith('/_next') ||
                    path.startsWith('/favicon.ico') ||
                    path.startsWith('/images')
                ) {
                    return true
                }

                // Protected Routes require authentication
                if (!token) {
                    return false // Redirect to login
                }

                // Admin Routes Protection
                if (path.startsWith('/admin')) {
                    return token.role === 'ADMIN'
                }

                // Default: Allow authenticated users
                return true
            },
        },
        pages: {
            signIn: '/auth/login',
        },
    }
)

export const config = {
    matcher: [
        /*
         * Match all request paths except for:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico
         * - api routes (they handle their own auth)
         */
        '/((?!_next/static|_next/image|favicon.ico|api).*)',
    ],
}
