import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
    function middleware(req) {
        // authorized() callback below handles the logic, 
        // but we can add custom logic here if needed.
        // For example, additional headers or logging.
        return NextResponse.next()
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const path = req.nextUrl.pathname

                // Public Routes - Always allow
                if (
                    path === '/' ||
                    path.startsWith('/auth') ||
                    path.startsWith('/pricing') ||
                    path.startsWith('/api/auth') ||
                    path.startsWith('/_next') ||
                    path.startsWith('/favicon.ico') ||
                    path.startsWith('/images')
                ) {
                    return true
                }

                // Protected Routes verification
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
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}
