const fs = require('fs-extra');
const path = require('path');

// Configuration
const buildDir = path.join(__dirname, '..', 'build');
const assetsDir = path.join(__dirname, '..', 'assets', 'js');
const languagesDir = path.join(__dirname, '..', 'languages');
const targetDir = 'C:\\inetpub\\wwwroot\\wp_familieplus\\wp-content\\plugins\\flexible-page-navigation';

// Documentation files to copy
const docsToCopy = [
    'README.md',
    'CHANGELOG.md',
    'LICENSE'
];

async function deploy() {
    try {
        console.log('🚀 Starting deployment...');

        // Check if build directory exists
        if (!fs.existsSync(buildDir)) {
            console.error('❌ Build directory not found. Run "npm run build" first.');
            process.exit(1);
        }

        // Create target directory if it doesn't exist
        await fs.ensureDir(targetDir);
        await fs.ensureDir(path.join(targetDir, 'assets', 'js'));

        // Copy build directory (recursively)
        console.log('📁 Copying build directory...');
        await fs.copy(buildDir, path.join(targetDir, 'build'));
        console.log('✅ Copied build/');

        // Copy assets/js
        console.log('📁 Copying assets/js...');
        await fs.copy(assetsDir, path.join(targetDir, 'assets', 'js'));
        console.log('✅ Copied assets/js/');

        // Copy languages directory
        console.log('📁 Copying languages directory...');
        await fs.copy(languagesDir, path.join(targetDir, 'languages'));
        console.log('✅ Copied languages/');

        // Copy documentation files
        console.log('📁 Copying documentation...');
        for (const doc of docsToCopy) {
            const sourcePath = path.join(__dirname, '..', doc);
            const targetPath = path.join(targetDir, doc);
            if (fs.existsSync(sourcePath)) {
                await fs.copy(sourcePath, targetPath);
                console.log(`✅ Copied ${doc}`);
            } else {
                console.warn(`⚠️  Documentation not found: ${doc}`);
            }
        }

        // Copy main PHP file
        const phpSource = path.join(__dirname, '..', 'flexible-page-navigation.php');
        const phpTarget = path.join(targetDir, 'flexible-page-navigation.php');
        if (fs.existsSync(phpSource)) {
            await fs.copy(phpSource, phpTarget);
            console.log('✅ Copied flexible-page-navigation.php');
        } else {
            console.error('❌ Main PHP file not found');
        }

        console.log('🎉 Deployment completed successfully!');
        console.log(`📍 Files deployed to: ${targetDir}`);
        console.log('📋 Deployed files:');
        console.log('   - build/ (all block files)');
        console.log('   - assets/js/ (admin.js, frontend.js)');
        console.log('   - Documentation (README.md, CHANGELOG.md, LICENSE)');
        console.log('   - Main plugin file (flexible-page-navigation.php)');

    } catch (error) {
        console.error('❌ Deployment failed:', error.message);
        process.exit(1);
    }
}

deploy(); 