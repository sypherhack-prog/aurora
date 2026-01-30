import { NextRequest, NextResponse } from 'next/server'

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
            const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title || 'Document Aurora AI'}</title>
  <style>
    :root { color-scheme: light; }
    body {
      font-family: 'Segoe UI', system-ui, sans-serif;
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
      line-height: 1.6;
      color: #1a1a1a;
    }
    h1 { color: #0891b2; margin-bottom: 16px; }
    h2 { color: #2563eb; margin-top: 32px; }
    blockquote {
      border-left: 4px solid #06b6d4;
      background: #f0f9ff;
      padding: 16px 24px;
      margin: 24px 0;
      border-radius: 0 8px 8px 0;
    }
    ul, ol { padding-left: 24px; }
    li { margin-bottom: 8px; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 24px 0;
    }
    th, td {
      border: 1px solid #e5e7eb;
      padding: 12px;
      text-align: left;
    }
    th { background: #f9fafb; font-weight: 600; }
    code {
      background: #f3f4f6;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.9em;
    }
    .footer {
      margin-top: 48px;
      padding-top: 16px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #9ca3af;
      font-size: 12px;
    }
  </style>
</head>
<body>
  ${content}
  <div class="footer">
    Créé avec Aurora AI — auroraai.com
  </div>
</body>
</html>`

            return new NextResponse(htmlContent, {
                headers: {
                    'Content-Type': 'text/html',
                    'Content-Disposition': `attachment; filename="${fileName}.html"`,
                },
            })
        }

        if (exportFormat === 'txt') {
            // Strip HTML tags for plain text
            const plainText = content
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

            return new NextResponse(plainText, {
                headers: {
                    'Content-Type': 'text/plain; charset=utf-8',
                    'Content-Disposition': `attachment; filename="${fileName}.txt"`,
                },
            })
        }

        if (exportFormat === 'md') {
            // Convert to Markdown
            const markdown = content
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

            return new NextResponse(markdown, {
                headers: {
                    'Content-Type': 'text/markdown; charset=utf-8',
                    'Content-Disposition': `attachment; filename="${fileName}.md"`,
                },
            })
        }

        return NextResponse.json({ error: 'Format non supporté' }, { status: 400 })
    } catch (error) {
        console.error('Export error:', error)
        return NextResponse.json({ error: 'Erreur lors de l\'export' }, { status: 500 })
    }
}
