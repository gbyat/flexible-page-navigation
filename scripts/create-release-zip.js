const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');

// Read version from package.json
const packagePath = path.join(__dirname, '..', 'package.json');
const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const version = packageData.version;

// Configuration
const pluginName = 'flexible-page-navigation';
const releaseDir = path.join(__dirname, '..', 'release');
const zipPath = path.join(releaseDir, `${pluginName}-v${version}.zip`);

// Files and directories to include in the release
const filesToInclude = [
    'flexible-page-navigation.php',
    'README.md',
    'CHANGELOG.md',
    'LICENSE',
    'build/',
    'assets/'
];

// Files and directories to exclude from the release
const filesToExclude = [
    '.gitignore',
    'src/',
    'webpack.config.js',
    'package.json',
    'package-lock.json',
    'node_modules/',
    'scripts/',
    'release/',
    '.git/',
    '.github/'
];

async function createReleaseZip() {
    try {
        console.log(`🚀 Creating release zip v${version}...`);

        // Create release directory if it doesn't exist
        await fs.ensureDir(releaseDir);

        // Create a write stream for the zip file
        const output = fs.createWriteStream(zipPath);
        const archive = archiver('zip', {
            zlib: { level: 9 } // Sets the compression level
        });

        // Listen for all archive data to be written
        output.on('close', () => {
            console.log(`✅ Release zip created successfully!`);
            console.log(`📦 File: ${zipPath}`);
            console.log(`📊 Size: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
        });

        // Good practice to catch warnings
        archive.on('warning', (err) => {
            if (err.code === 'ENOENT') {
                console.warn('⚠️  Warning:', err.message);
            } else {
                throw err;
            }
        });

        // Good practice to catch errors
        archive.on('error', (err) => {
            throw err;
        });

        // Pipe archive data to the file
        archive.pipe(output);

        // Add files to the archive
        for (const item of filesToInclude) {
            const itemPath = path.join(__dirname, '..', item);

            if (fs.existsSync(itemPath)) {
                const stats = fs.statSync(itemPath);

                if (stats.isDirectory()) {
                    console.log(`📁 Adding directory: ${item}`);
                    archive.directory(itemPath, item);
                } else {
                    console.log(`📄 Adding file: ${item}`);
                    archive.file(itemPath, { name: item });
                }
            } else {
                console.warn(`⚠️  File/directory not found: ${item}`);
            }
        }

        // Finalize the archive
        await archive.finalize();

    } catch (error) {
        console.error('❌ Error creating release zip:', error.message);
        process.exit(1);
    }
}

// Check if archiver is installed
try {
    require('archiver');
} catch (error) {
    console.error('❌ The "archiver" package is required. Please install it:');
    console.error('   npm install archiver');
    process.exit(1);
}

createReleaseZip(); 