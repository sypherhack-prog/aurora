
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
            fs.writeFileSync('models.json', JSON.stringify(modelNames, null, 2))
            console.log('Saved models.json')
        }
    } catch (error: any) {
        console.error('Error:', error.message)
    }
}

main()
