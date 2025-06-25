const fs = require('fs');
const path = require('path');

// Read package.json
const packagePath = path.join(__dirname, '..', 'package.json');
const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const version = packageData.version;

// Read plugin file
const pluginPath = path.join(__dirname, '..', 'flexible-page-navigation.php');
let pluginContent = fs.readFileSync(pluginPath, 'utf8');

// Update version in plugin file
pluginContent = pluginContent.replace(
    /Version:\s*\d+\.\d+\.\d+/,
    `Version: ${version}`
);

// Update FPN_VERSION constant
pluginContent = pluginContent.replace(
    /define\('FPN_VERSION',\s*'[^']*'\);/,
    `define('FPN_VERSION', '${version}');`
);

// Write updated plugin file
fs.writeFileSync(pluginPath, pluginContent);

console.log(`Version synchronized to ${version}`); 