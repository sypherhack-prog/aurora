import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

/**
 * GET /addin/taskpane.html
 * Serve the Word Add-in taskpane HTML file with proper CSP headers
 */
export async function GET(req: NextRequest) {
    try {
        // Read the static HTML file from public directory
        const filePath = join(process.cwd(), 'public', 'addin', 'taskpane.html')
        const htmlContent = await readFile(filePath, 'utf-8')

        // Return with proper headers for Office Add-in
        return new NextResponse(htmlContent, {
            status: 200,
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
                'X-Content-Type-Options': 'nosniff',
                'Content-Security-Policy': [
                    'default-src \'self\' https://appsforoffice.microsoft.com https://aurora-omega.vercel.app',
                    'script-src \'self\' \'unsafe-inline\' \'unsafe-eval\' https://appsforoffice.microsoft.com https://ajax.aspnetcdn.com',
                    'style-src \'self\' \'unsafe-inline\'',
                    'img-src \'self\' data: blob: https:',
                    'font-src \'self\' data:',
                    'connect-src \'self\' https://aurora-omega.vercel.app https://*.office.com https://*.office365.com https://*.office.net https://*.officeapps.live.com https://*.sharepoint.com https://*.cdn.office.net https://eu-mobile.events.data.microsoft.com https://common.online.office.com https://api.groq.com https://openrouter.ai',
                    'frame-ancestors \'self\' https: https://aurora-omega.vercel.app https://*.vercel.app https://office.com https://*.office.com https://office365.com https://*.office365.com https://*.office.net https://*.officeapps.live.com https://*.officeapps.live.com:443 https://outlook.office.com https://*.outlook.office.com https://outlook.office365.com https://*.outlook.office365.com https://outlook.live.com https://*.live.com https://*.msocdn.com https://*.sharepoint.com https://*.sharepointonline.com https://*.officeservices.live.com https://*.microsoft.com https://*.microsoftonline.com https://*.msauth.net',
                    'base-uri \'self\'',
                    'form-action \'self\'',
                ].join('; '),
            },
        })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        console.error('Failed to serve taskpane.html:', message)
        return new NextResponse('Failed to load taskpane', { status: 500 })
    }
}
