import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import mammoth from 'mammoth'

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const formData = await req.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
        }

        const buffer = Buffer.from(await file.arrayBuffer())
        let content = ''

        if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const result = await mammoth.convertToHtml({ buffer })
            content = result.value
        } else if (file.type === 'text/plain') {
            content = buffer.toString('utf-8')
        } else {
            return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 })
        }

        return NextResponse.json({ content })
    } catch (error: unknown) {
        console.error('Import error:', error)
        return NextResponse.json({ error: 'Failed to process file' }, { status: 500 })
    }
}
