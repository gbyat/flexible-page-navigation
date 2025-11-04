const wpPot = require('wp-pot');
const fs = require('fs');
const path = require('path');

// Check if languages directory exists, create if not
const languagesDir = path.join(__dirname, '..', 'languages');
if (!fs.existsSync(languagesDir)) {
    fs.mkdirSync(languagesDir, { recursive: true });
}

try {
    // Generate .pot file
    wpPot({
        destFile: path.join(languagesDir, 'flexible-page-navigation.pot'),
        domain: 'flexible-page-navigation',
        package: 'Flexible Page Navigation',
        bugReport: 'https://github.com/gbyat/flexible-page-navigation/issues',
        lastTranslator: 'Gabriele Laesser <gabriele@webentwicklerin.at>',
        team: 'webentwicklerin <gabriele@webentwicklerin.at>',
        src: [
            'flexible-page-navigation.php',
            'src/**/*.js',
            'src/**/*.php',
            'build/**/*.js'
        ],
        exclude: [
            'node_modules/**',
            'languages/**',
            'release/**',
            'scripts/**'
        ],
        headers: {
            'Report-Msgid-Bugs-To': 'https://github.com/gbyat/flexible-page-navigation/issues',
            'Language-Team': 'webentwicklerin <gabriele@webentwicklerin.at>'
        }
    });
    
    console.log('✅ .pot file generated successfully: languages/flexible-page-navigation.pot');
} catch (error) {
    console.error('❌ Error generating .pot file:', error);
    process.exit(1);
}
