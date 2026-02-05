import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// CSP pour autoriser le framing depuis Office
const ADDIN_CSP = [
    'default-src \'self\' https://appsforoffice.microsoft.com https://aurora-omega.vercel.app',
    'script-src \'self\' \'unsafe-inline\' \'unsafe-eval\' https://appsforoffice.microsoft.com https://ajax.aspnetcdn.com',
    'style-src \'self\' \'unsafe-inline\'',
    'img-src \'self\' data: blob: https:',
    'font-src \'self\' data:',
    'connect-src \'self\' https://aurora-omega.vercel.app https://*.office.com https://*.office365.com https://*.office.net https://*.officeapps.live.com https://*.sharepoint.com https://*.cdn.office.net https://eu-mobile.events.data.microsoft.com https://common.online.office.com https://api.groq.com',
    'frame-ancestors \'self\' https://aurora-omega.vercel.app https://*.office.com https://*.office365.com https://*.office.net https://*.officeapps.live.com https://*.officeapps.live.com:443 https://*.outlook.office.com https://*.outlook.office365.com https://*.msocdn.com https://*.sharepoint.com https://*.officeservices.live.com',
    'base-uri \'self\'',
    'form-action \'self\'',
].join('; ')

export default withAuth(
    function middleware(req: NextRequest) {
        // Si c'est la racine, appliquer les headers CSP add-in pour permettre le framing depuis Office
        // Word peut charger la racine pour le SupportUrl ou d'autres raisons
        if (req.nextUrl.pathname === '/') {
            const response = NextResponse.next()
            // Remplacer le CSP par défaut par celui qui autorise Office
            response.headers.set('Content-Security-Policy', ADDIN_CSP)
            return response
        }
        
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
                    path.startsWith('/subscribe') ||
                    path.startsWith('/api') || // API routes handle their own auth
                    path.startsWith('/addin') || // Word Add-in taskpane (auth via Bearer token)
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
         * - addin static assets (JS, CSS, images, XML) - served by Next.js static file handler
         */
        '/((?!_next/static|_next/image|favicon\\.ico|api|addin/.*\\.(js|css|png|jpg|jpeg|gif|ico|svg|map|xml)).*)',
    ],
}
