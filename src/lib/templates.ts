/**
 * HTML entity escaping for XSS prevention
 */
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * Sanitize HTML content - allows safe tags but escapes dangerous ones
 * For more robust sanitization, consider using DOMPurify
 */
export function sanitizeHtmlContent(html: string): string {
  // Remove script tags and their content
  let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')

  // Remove event handlers (onclick, onerror, etc.)
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '')

  // Remove javascript: URLs
  sanitized = sanitized.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, 'href="#"')

  // Remove data: URLs in src (can be used for XSS)
  sanitized = sanitized.replace(/src\s*=\s*["']data:[^"']*["']/gi, 'src=""')

  return sanitized
}

export const getHtmlTemplate = (title: string, content: string) => {
  // Escape the title to prevent XSS
  const safeTitle = escapeHtml(title || 'Document Aurora AI')

  // Sanitize the content (allows HTML but removes dangerous elements)
  const safeContent = sanitizeHtmlContent(content || '')

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'unsafe-inline'; img-src 'self' data:;">
  <title>${safeTitle}</title>
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
  ${safeContent}
  <div class="footer">
    Créé avec Aurora AI — auroraai.com
  </div>
</body>
</html>`
}
