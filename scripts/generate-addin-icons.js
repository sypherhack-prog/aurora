/**
 * Generate Aurora AI add-in icons from SVG source.
 * Run: node scripts/generate-addin-icons.js
 * Requires: npm install sharp --save-dev
 */
const fs = require('fs')
const path = require('path')

const sizes = [16, 32, 64, 80, 128]
const svgPath = path.join(__dirname, '../word-addin/assets/aurora-icon.svg')
const outDir = path.join(__dirname, '../word-addin/assets')

async function main() {
  let sharp
  try {
    sharp = require('sharp')
  } catch {
    console.error('Installez sharp : npm install sharp --save-dev')
    process.exit(1)
  }

  const svg = fs.readFileSync(svgPath)
  for (const size of sizes) {
    await sharp(svg)
      .resize(size, size)
      .png()
      .toFile(path.join(outDir, `icon-${size}.png`))
    console.log(`Generated icon-${size}.png`)
  }
  console.log('Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
