import { NextResponse } from 'next/server'

/**
 * GET /api/health
 * Vérifier la config (NEXTAUTH_URL doit correspondre à l’URL du site).
 */
export async function GET() {
    const nextAuthUrl = process.env.NEXTAUTH_URL ?? null
    const hasSecret = Boolean(process.env.NEXTAUTH_SECRET)
    return NextResponse.json({
        ok: true,
        nextAuthUrl,
        hasAuthSecret: hasSecret,
        hint: nextAuthUrl
            ? 'Assurez-vous que NEXTAUTH_URL est exactement l’URL affichée dans la barre d’adresse du navigateur.'
            : 'Définissez NEXTAUTH_URL (ex: https://votre-site.vercel.app) dans les variables d’environnement.',
    })
}
