import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

/**
 * GET /addin/commands.html
 * Serve the Word Add-in commands HTML file with proper CSP headers
 */
export async function GET(req: NextRequest) {
    try {
        const filePath = join(process.cwd(), 'public', 'addin', 'commands.html')
        const htmlContent = await readFile(filePath, 'utf-8')

        return new NextResponse(htmlContent, {
            status: 200,
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
                'X-Content-Type-Options': 'nosniff',
                'Content-Security-Policy': [
                    'default-src \'self\' https://appsforoffice.microsoft.com https://aurora-omega.vercel.app',
                    'script-src \'self\' \'unsafe-inline\' \'unsafe-eval\' https://appsforoffice.microsoft.com',
                    'style-src \'self\' \'unsafe-inline\'',
                    'frame-ancestors \'self\' https: https://aurora-omega.vercel.app https://*.vercel.app https://office.com https://*.office.com https://office365.com https://*.office365.com https://*.office.net https://*.officeapps.live.com https://*.officeapps.live.com:443 https://outlook.office.com https://*.outlook.office.com https://outlook.office365.com https://*.outlook.office365.com https://outlook.live.com https://*.live.com https://*.msocdn.com https://*.sharepoint.com https://*.sharepointonline.com https://*.officeservices.live.com https://*.microsoft.com https://*.microsoftonline.com https://*.msauth.net',
                ].join('; '),
            },
        })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        console.error('Failed to serve commands.html:', message)
        return new NextResponse('Failed to load commands', { status: 500 })
    }
}
