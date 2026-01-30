export const formatDate = (date: Date | string | number): string => {
    return new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date(date))
}

export const formatCurrency = (amount: number, currency = 'MGA'): string => {
    return new Intl.NumberFormat('fr-MG', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}

export const truncate = (text: string, maxLength: number, suffix = '...'): string => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength - suffix.length) + suffix
}

export const generateSlug = (text: string): string => {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
}

export const countWords = (text: string): number => {
    return text
        .trim()
        .split(/\s+/)
        .filter((w) => w.length > 0).length
}

export const sanitizeHtml = (input: string): string => {
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
}
