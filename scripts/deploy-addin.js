const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const fsp = fs.promises

const addinDir = path.join(__dirname, '../word-addin')
const publicDir = path.join(__dirname, '../public/addin')
const distDir = path.join(addinDir, 'dist')

async function pathExists(filePath) {
    try {
        await fsp.access(filePath)
        return true
    } catch {
        return false
    }
}

async function copyRecursive(src, dest) {
    const stat = await fsp.stat(src).catch(() => null)
    if (!stat) return

    if (stat.isDirectory()) {
        await fsp.mkdir(dest, { recursive: true })
        const entries = await fsp.readdir(src, { withFileTypes: true })
        for (const entry of entries) {
            await copyRecursive(path.join(src, entry.name), path.join(dest, entry.name))
        }
    } else {
        const destDir = path.dirname(dest)
        await fsp.mkdir(destDir, { recursive: true })
        await fsp.copyFile(src, dest)
    }
}

async function main() {
    const env = { ...process.env }
    if (!env.SITE_URL && env.VERCEL_URL) {
        env.SITE_URL = 'https://' + env.VERCEL_URL
    }
    try {
        execSync('npm install --no-audit --production=false', { cwd: addinDir, stdio: 'inherit' })
        execSync('npm run build', { cwd: addinDir, stdio: 'inherit', env })
    } catch (err) {
        process.exit(1)
    }

    if (await pathExists(publicDir)) {
        await fsp.rm(publicDir, { recursive: true, force: true })
    }

    if (!(await pathExists(distDir))) {
        process.exit(1)
    }

    await copyRecursive(distDir, publicDir)
}

main().catch(() => process.exit(1))
