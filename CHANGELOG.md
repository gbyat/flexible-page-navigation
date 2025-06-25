## 2025-06-25 12:15:56 - Enhance GitHub token settings: Added token visibility toggle, improved success message, and updated descriptions for better user guidance.

### Changed Files:
- `package-lock.json`
- `package.json`

## 2025-06-25 12:15:34 - Release v1.1.0

### Changed Files:
- `flexible-page-navigation.php`

## 2025-06-25 12:12:48 - 1.1.0

### Changed Files:
- `flexible-page-navigation.php`

## 2025-06-25 12:12:46 - Add copy-webpack-plugin to package.json and webpack.config.js for asset copying

### Changed Files:
- `package-lock.json`
- `package.json`

## 2025-06-25 12:12:32 - Release v1.0.6

### Changed Files:
- `package-lock.json`
- `package.json`
- `webpack.config.js`

## 2025-06-25 11:57:49 - 1.0.6

### Changed Files:
- `flexible-page-navigation.php`

## 2025-06-25 11:57:47 - Enhance release script to remove existing tags before creating new ones, ensuring clean versioning.

### Changed Files:
- `package-lock.json`
- `package.json`

## 2025-06-25 11:57:37 - Release v1.0.5

### Changed Files:
- `scripts/release.js`

## 2025-06-25 11:56:33 - 1.0.5

### Changed Files:
- `flexible-page-navigation.php`

## 2025-06-25 11:56:32 - Refactor release scripts in package.json to call an external script for versioning and tagging, improving maintainability.

### Changed Files:
- `package-lock.json`
- `package.json`

## 2025-06-25 11:56:22 - Release v$(node -e console.log(require('./package.json').version))

### Changed Files:
- `package.json`
- `scripts/release.js`

## 2025-06-25 11:55:25 - 1.0.4

### Changed Files:
- `flexible-page-navigation.php`

## 2025-06-25 11:55:24 - Refactor release scripts in package.json to use console.log for version retrieval and add annotated tags for releases.

### Changed Files:
- `package-lock.json`
- `package.json`

## 2025-06-25 11:55:14 - Release v$(node -p require('./package.json').version)

### Changed Files:
- `package.json`

## 2025-06-25 11:53:57 - 1.0.3

### Changed Files:
- `flexible-page-navigation.php`

## 2025-06-25 11:53:55 - Enhance release scripts in package.json to automatically push changes and tags to the main branch after versioning.

### Changed Files:
- `package-lock.json`
- `package.json`

## 2025-06-25 11:53:46 - Release v$(node -p require('./package.json').version)

### Changed Files:
- `package.json`

## 2025-06-25 11:52:01 - 1.0.2

### Changed Files:
- `flexible-page-navigation.php`

## 2025-06-25 11:52:00 - Update release script in package.json to use the current version from package.json instead of npm run version --silent

### Changed Files:
- `package-lock.json`
- `package.json`

## 2025-06-25 11:51:47 - Release v$(npm run version --silent)

### Changed Files:
- `package.json`

## 2025-06-25 11:49:13 - 1.0.1

### Changed Files:
- `flexible-page-navigation.php`

## 2025-06-25 11:49:11 - Test pre-commit hook from Zimm-Woo-Catalogue

### Changed Files:
- `package-lock.json`
- `package.json`

## 2025-06-25 11:48:02 - Test pre-commit hook from Zimm-Woo-Catalogue

### Changed Files:
- `CHANGELOG.md`

## 2025-06-25 11:47:37 - Update CHANGELOG.md to include additional entry for changelog generation test

### Changed Files:
- `CHANGELOG.md`

## 2025-06-25 11:47:20 - Update CHANGELOG.md to include additional entry for changelog generation test

### Changed Files:
- `CHANGELOG.md`

## 2025-06-25 11:46:56 - Update CHANGELOG.md to include entry for changelog generation test

### Changed Files:
- `CHANGELOG.md`

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

- Update CHANGELOG.md to include entry for changelog generation test - 2025-06-25 11:43:50

- Update CHANGELOG.md to include entry for changelog generation test - 2025-06-25 11:43:27

- Test changelog generation with improved hook - 2025-06-25 11:42:52

## [1.0.0] - 2025-06-25 10:30:00

### Added

- Initial release of Flexible Page Navigation plugin
- Flexible navigation block with customizable content types
- Support for pages, posts, and custom post types
- Configurable sorting (menu order, title, date, ID)
- Configurable depth (1-5 levels)
- Child selection options (current page or custom page)
- Accordion functionality for top-level items
- Active state highlighting (current page and parent pages)
- Color customization (background, text, active states)
- Responsive design with mobile optimization
- GitHub update system integration
- Admin interface with settings and debug tabs
- Automatic version synchronization
- CI/CD pipeline with GitHub Actions
- Webpack build system
- Translation support
- Accessibility features
- Print styles
- High contrast mode support
- Reduced motion support

### Features

- **Navigation Block**: Full-featured Gutenberg block with sidebar controls
- **Dynamic Rendering**: Server-side rendering with PHP
- **Update System**: Automatic updates via GitHub releases
- **Admin Interface**: Professional settings page with tabs
- **Build System**: Modern webpack-based development workflow
- **Version Management**: Automated version bumping and release creation

### Technical

- WordPress 5.0+ compatibility
- Gutenberg block editor support
- Modern JavaScript (ES6+)
- CSS3 with advanced features
- PHP 7.4+ compatibility
- GPL v2 license
