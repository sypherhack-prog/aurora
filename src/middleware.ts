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
    'frame-ancestors \'self\' https: https://aurora-omega.vercel.app https://*.vercel.app https://office.com https://*.office.com https://office365.com https://*.office365.com https://*.office.net https://*.officeapps.live.com https://*.officeapps.live.com:443 https://outlook.office.com https://*.outlook.office.com https://outlook.office365.com https://*.outlook.office365.com https://outlook.live.com https://*.live.com https://*.msocdn.com https://*.sharepoint.com https://*.sharepointonline.com https://*.officeservices.live.com https://*.microsoft.com https://*.microsoftonline.com https://*.msauth.net',
    'base-uri \'self\'',
    'form-action \'self\'',
].join('; ')

export default withAuth(
    function middleware(req: NextRequest) {
        // Si c'est la racine, créer une réponse avec les headers CSP add-in
        // Word peut charger la racine pour le SupportUrl ou d'autres raisons
        if (req.nextUrl.pathname === '/') {
            const response = NextResponse.next()
            // Supprimer tous les headers CSP existants et appliquer celui pour Office
            response.headers.delete('Content-Security-Policy')
            response.headers.set('Content-Security-Policy', ADDIN_CSP)
            // S'assurer que les autres headers sont aussi présents
            response.headers.set('X-Content-Type-Options', 'nosniff')
            response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
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
         * Note: Exclusions for addin static assets are handled in the authorized callback
         */
        '/((?!_next/static|_next/image|favicon\\.ico|api).*)',
    ],
}
