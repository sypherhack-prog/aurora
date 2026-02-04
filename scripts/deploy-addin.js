const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Word Add-in Build & Deploy...');

const addinDir = path.join(__dirname, '../word-addin');
const publicDir = path.join(__dirname, '../public/addin');

// 1. Install & Build Add-in
try {
    console.log('📦 Installing add-in dependencies...');
    // Use --production=false to ensure devDependencies (webpack, etc.) are installed
    // even if the main Vercel process sets NODE_ENV=production
    execSync('npm install --no-audit --production=false', { cwd: addinDir, stdio: 'inherit' });

    console.log('🛠️ Building add-in...');
    execSync('npm run build', { cwd: addinDir, stdio: 'inherit' });
} catch (e) {
    console.error('❌ Failed to build add-in:', e);
    // Determine if we should fail the build or just warn
    // For now, fail so we know something is wrong
    process.exit(1);
}

// 2. Copy to public/addin
console.log('📂 Copying files to public/addin...');

// Function to copy directory recursively
function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();

    if (isDirectory) {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

        fs.readdirSync(src).forEach(function (childItemName) {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else {
        // Ensure destination folder exists (for nested files)
        const destDir = path.dirname(dest);
        if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

        fs.copyFileSync(src, dest);
    }
}

// Clear existing public/addin directory if it implies a clean state
if (fs.existsSync(publicDir)) {
    console.log('   Cleaning previous build...');
    fs.rmSync(publicDir, { recursive: true, force: true });
}

const distDir = path.join(addinDir, 'dist');
if (fs.existsSync(distDir)) {
    copyRecursiveSync(distDir, publicDir);
    console.log(`✅ Add-in copied from ${distDir} to ${publicDir}`);
} else {
    console.error(`❌ Dist directory not found at ${distDir}`);
    process.exit(1);
}

console.log('✅ Add-in deployed successfully!');
