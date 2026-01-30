import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { getHtmlTemplate } from '@/lib/templates'

// Export document in various formats
export async function POST(req: NextRequest) {
    try {
        const { content, format, title } = await req.json()

        if (!content) {
            return NextResponse.json({ error: 'Contenu requis' }, { status: 400 })
        }

        const exportFormat = format || 'html'
        const fileName = title ? title.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'document'

        if (exportFormat === 'html') {
            const htmlContent = getHtmlTemplate(title, content)

            return new NextResponse(htmlContent, {
                headers: {
                    'Content-Type': 'text/html',
                    'Content-Disposition': `attachment; filename="${fileName}.html"`,
                },
            })
        }

        if (exportFormat === 'txt') {
            const plainText = convertToPlainText(content)

            return new NextResponse(plainText, {
                headers: {
                    'Content-Type': 'text/plain; charset=utf-8',
                    'Content-Disposition': `attachment; filename="${fileName}.txt"`,
                },
            })
        }

        if (exportFormat === 'md') {
            const markdown = convertToMarkdown(content)

            return new NextResponse(markdown, {
                headers: {
                    'Content-Type': 'text/markdown; charset=utf-8',
                    'Content-Disposition': `attachment; filename="${fileName}.md"`,
                },
            })
        }

        return NextResponse.json({ error: 'Format non supporté' }, { status: 400 })
    } catch (error) {
        logger.error('Export error:', error)
        return NextResponse.json({ error: "Erreur lors de l'export" }, { status: 500 })
    }
}

function convertToPlainText(content: string): string {
    return content
        .replace(/<h1[^>]*>/g, '\n\n# ')
        .replace(/<h2[^>]*>/g, '\n\n## ')
        .replace(/<h3[^>]*>/g, '\n\n### ')
        .replace(/<\/h[1-6]>/g, '\n')
        .replace(/<li[^>]*>/g, '\n• ')
        .replace(/<br\s*\/?>/g, '\n')
        .replace(/<p[^>]*>/g, '\n\n')
        .replace(/<\/p>/g, '')
        .replace(/<blockquote[^>]*>/g, '\n\n> ')
        .replace(/<\/blockquote>/g, '\n')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/\n{3,}/g, '\n\n')
        .trim()
}

function convertToMarkdown(content: string): string {
    return content
        .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '\n\n# $1\n')
        .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '\n\n## $1\n')
        .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '\n\n### $1\n')
        .replace(/<strong>(.*?)<\/strong>/gi, '**$1**')
        .replace(/<b>(.*?)<\/b>/gi, '**$1**')
        .replace(/<em>(.*?)<\/em>/gi, '*$1*')
        .replace(/<i>(.*?)<\/i>/gi, '*$1*')
        .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
        .replace(/<ul[^>]*>/gi, '\n')
        .replace(/<\/ul>/gi, '\n')
        .replace(/<ol[^>]*>/gi, '\n')
        .replace(/<\/ol>/gi, '\n')
        .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gis, '\n> $1\n')
        .replace(/<p[^>]*>(.*?)<\/p>/gi, '\n$1\n')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<code>(.*?)<\/code>/gi, '`$1`')
        .replace(/<[^>]+>/g, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim()
}
