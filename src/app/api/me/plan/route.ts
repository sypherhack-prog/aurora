import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getUserPlan } from '@/lib/subscription'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.id) {
            return NextResponse.json({ plan: 'ANONYMOUS' }, { status: 200 })
        }

        const plan = await getUserPlan(session.user.id)
        return NextResponse.json({ plan }, { status: 200 })
    } catch {
        // En cas d'erreur, ne pas bloquer l'éditeur : retourner un plan indéterminé
        return NextResponse.json({ plan: 'UNKNOWN' }, { status: 200 })
    }
}

