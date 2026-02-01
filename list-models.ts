
import { GoogleGenerativeAI } from '@google/generative-ai'
import fs from 'fs'
import path from 'path'

// Load .env manually
function loadEnv() {
    try {
        const envPath = path.join(process.cwd(), '.env')
        if (fs.existsSync(envPath)) {
            const envContent = fs.readFileSync(envPath, 'utf-8')
            envContent.split('\n').forEach(line => {
                const parts = line.split('=')
                if (parts.length >= 2 && !line.startsWith('#')) {
                    const key = parts[0].trim()
                    const value = parts.slice(1).join('=').trim().replace(/(^"|"$)/g, '')
                    process.env[key] = value
                }
            })
        }
    } catch (e) {
        console.error('Error loading .env:', e)
    }
}
loadEnv()

async function main() {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) return

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
        const response = await fetch(url)
        const data = await response.json()

        if (data.models) {
            const modelNames = data.models.map((m: any) => m.name.replace('models/', ''))
            console.log('ALL MODELS:', modelNames)

            const candidates = [
                'gemini-1.5-flash',
                'gemini-1.5-flash-001',
                'gemini-1.5-flash-002',
                'gemini-2.0-flash-exp',
                'gemini-pro',
                'gemini-1.0-pro'
            ]

            console.log('\n--- CHECK ---')
            candidates.forEach(c => {
                const found = modelNames.includes(c)
                console.log(`${c}: ${found ? '✅ FOUND' : '❌ MISSING'}`)
            })

            // Try to test the FIRST found candidate
            const best = candidates.find(c => modelNames.includes(c))
            if (best) {
                console.log(`\nTesting ${best}...`)
                const genAI = new GoogleGenerativeAI(apiKey)
                const model = genAI.getGenerativeModel({ model: best })
                const res = await model.generateContent('Hello')
                await res.response
                console.log(`🎉 SUCCESS with ${best}!`)
            }

        }

    } catch (error: any) {
        console.error('Error:', error.message)
    }
}

main()
