## 2025-06-28 09:16:54 - Release v1.4.4

### Changed Files:
- `build/block.json`
- `build/index.js`
- `flexible-page-navigation.php`
- `src/block/block.json`
- `src/block/index.js`

## 2025-06-27 09:55:27 - 1.4.4

### Changed Files:
- `flexible-page-navigation.php`

## 2025-06-27 09:55:25 - Prepare for release: add build directory and all changes

### Changed Files:
- `package-lock.json`
- `package.json`

## 2025-06-27 09:55:18 - Fix release script: Force add build directory for consistent releases

### Changed Files:
- `build/block.json`
- `build/index.css`
- `build/index.js`
- `build/style.css`
- `flexible-page-navigation.php`

## 2025-06-27 09:54:18 - Release v1.4.3

### Changed Files:
- `scripts/release.js`

## 2025-06-27 09:28:11 - 1.4.3

### Changed Files:
- `flexible-page-navigation.php`

## 2025-06-27 09:28:10 - Release v1.4.2: Patch - ensure correct version in main plugin file

### Changed Files:
- `package-lock.json`
- `package.json`

## 2025-06-27 09:23:14 - Synchronize release workflow with deploy script for consistency

### Changed Files:
- `flexible-page-navigation.php`
- `package-lock.json`
- `package.json`

## 2025-06-27 09:14:18 - Fix release workflow: Add debugging and ensure build directory is included

### Changed Files:
- `.github/workflows/release.yml`

## 2025-06-27 09:09:56 - Release v1.4.0: Recursive Accordion and UI Improvements

### Changed Files:
- `.github/workflows/release.yml`

## 2025-06-27 09:01:28 - Update README: Remove 'professionell' and declare as learning project

### Changed Files:
- `CHANGELOG.md`
- `assets/js/frontend.js`
- `flexible-page-navigation.php`
- `package.json`
- `src/block/block.json`
- `src/block/index.js`
- `src/block/style.css`

## 2025-06-27 - Release v1.4.0: Recursive Accordion and UI Improvements

### New Features:

- **Recursive Accordion**: Toggle buttons now work on all levels (depth 1+) with proper recursive functionality
- **Smart Toggle Button Logic**: Toggle buttons only appear when children can actually be displayed (within depth limit)
- **Improved Toggle Button Icons**: Plus (+) and X (×) icons now correctly reflect the actual visibility state
- **Enhanced UI Labels**: Renamed "Separator Lines" to "Left Border Lines" for clarity
- **Logical UI Grouping**: Active Item Padding now only appears when Show Active Indicator is enabled

### Bug Fixes:

- **Fixed Separator Lines**: Left border lines now properly apply when enabled
- **Corrected CSS Selectors**: Direct child selectors for better performance and accuracy
- **Toggle Button Visibility**: Fixed icon display issues on nested accordion levels
- **Accordion State Management**: Improved JavaScript logic for expand/collapse states

### Technical Improvements:

- **CSS Optimization**: More specific selectors for better performance
- **JavaScript Enhancement**: Added `updateToggleButtonStates()` function for accurate state management
- **Inline CSS**: Separator and padding styles now always apply correctly
- **Block ID Versioning**: Added version suffix to prevent cache conflicts

### Changed Files:

- `src/block/index.js` - UI improvements and logical grouping
- `src/block/style.css` - Recursive accordion CSS and toggle button fixes
- `assets/js/frontend.js` - Enhanced accordion functionality and state management
- `flexible-page-navigation.php` - Fixed separator logic and inline CSS
- `package.json` - Version bump to 1.4.0

## 2025-06-26 13:54:32 - Release v1.3.0: Major improvements to navigation block

### Changed Files:

- `README.md`

## 2025-06-26 13:34:20 - Restructure project: separate block, admin, and frontend assets - version 1.2.0

### Changed Files:

- `.github/workflows/release.yml`
- `CHANGELOG.md`
- `assets/js/frontend.js`
- `flexible-page-navigation.php`
- `package-lock.json`
- `package.json`
- `scripts/deploy.js`
- `src/block/block.json`
- `src/block/index.js`
- `src/block/style.css`

## 2025-06-26 10:02:57 - Release v1.1.15

### Changed Files:

- `flexible-page-navigation.php`
- `package.json`
- `webpack.config.js`

## 2025-06-26 09:35:56 - 1.1.15

### Changed Files:

- `flexible-page-navigation.php`

## 2025-06-26 09:35:55 - Remove obsolete delete_plugins_cache() call, fix fatal error, bump version to 1.1.14

### Changed Files:

- `package-lock.json`
- `package.json`

## 2025-06-26 09:33:23 - Fix critical error - simplify AJAX handlers and debug tab - version 1.1.13

### Changed Files:

- `CHANGELOG.md`
- `flexible-page-navigation.php`
- `package.json`

## 2025-06-26 09:29:55 - Fix critical error - simplify AJAX handlers and debug tab - version 1.1.13

### Changed Files:

## 2025-06-26 09:29:47 - Fix AJAX handlers and improve debug tab - version 1.1.12

### Changed Files:

- `flexible-page-navigation.php`
- `package.json`

## 2025-06-26 08:24:37 - Fix AJAX handlers and improve debug tab - version 1.1.12

### Changed Files:

- `CHANGELOG.md`

## 2025-06-26 08:24:31 - Release v1.1.12

### Changed Files:

## 2025-06-26 08:18:13 - 1.1.12

### Changed Files:

- `flexible-page-navigation.php`

## 2025-06-26 08:18:12 - Add success message for deleted transients and enhance cache information display in debug tab

### Changed Files:

- `package-lock.json`
- `package.json`

## 2025-06-26 08:18:04 - Release v1.1.11

### Changed Files:

- `flexible-page-navigation.php`

## 2025-06-26 08:14:19 - 1.1.11

### Changed Files:

- `flexible-page-navigation.php`

## 2025-06-26 08:14:17 - Release v1.1.10

### Changed Files:

- `package-lock.json`
- `package.json`

## 2025-06-25 13:02:46 - 1.1.10

### Changed Files:

- `flexible-page-navigation.php`

## 2025-06-25 13:02:45 - Add AJAX actions for non-privileged users to test GitHub API and clear cache

### Changed Files:

- `package-lock.json`
- `package.json`

## 2025-06-25 13:01:58 - Release v1.1.9

### Changed Files:

- `flexible-page-navigation.php`

## 2025-06-25 12:57:34 - 1.1.9

### Changed Files:

- `flexible-page-navigation.php`

## 2025-06-25 12:57:33 - Clear plugin data cache and refresh plugin properties after update installation

### Changed Files:

- `package-lock.json`
- `package.json`

## 2025-06-25 12:57:21 - Release v1.1.8

### Changed Files:

- `flexible-page-navigation.php`

## 2025-06-25 12:53:55 - 1.1.8

### Changed Files:

- `flexible-page-navigation.php`

## 2025-06-25 12:53:53 - Enhance version comparison logic to ensure updates are only shown for newer versions by stripping 'v' prefix from version tags.

### Changed Files:

- `package-lock.json`
- `package.json`

## 2025-06-25 12:53:43 - Release v1.1.7

### Changed Files:

- `flexible-page-navigation.php`

## 2025-06-25 12:49:11 - 1.1.7

### Changed Files:

- `flexible-page-navigation.php`

## 2025-06-25 12:49:10 - Release v1.1.6

### Changed Files:

- `package-lock.json`
- `package.json`

## 2025-06-25 12:46:37 - 1.1.6

### Changed Files:

- `flexible-page-navigation.php`

## 2025-06-25 12:46:36 - Add block editor asset enqueueing for flexible page navigation

### Changed Files:

- `package-lock.json`
- `package.json`

## 2025-06-25 12:46:28 - Release v1.1.5

### Changed Files:

- `flexible-page-navigation.php`

## 2025-06-25 12:41:24 - 1.1.5

### Changed Files:

- `flexible-page-navigation.php`

## 2025-06-25 12:41:22 - Rename block registration from "navigation" to "flexible-nav" for consistency in block naming.

### Changed Files:

- `package-lock.json`
- `package.json`

## 2025-06-25 12:41:10 - Release v1.1.4

### Changed Files:

- `src/index.js`

## 2025-06-25 12:37:03 - 1.1.4

### Changed Files:

- `flexible-page-navigation.php`

## 2025-06-25 12:37:02 - Rename block in JSON configuration from "page-navigation" to "flexible-nav" for improved clarity.

### Changed Files:

- `package-lock.json`
- `package.json`

## 2025-06-25 12:36:53 - Release v1.1.3

### Changed Files:

- `src/block.json`

## 2025-06-25 12:31:51 - 1.1.3

### Changed Files:

- `flexible-page-navigation.php`

## 2025-06-25 12:31:49 - Update block registration and rename block in JSON configuration for flexible page navigation

### Changed Files:

- `package-lock.json`
- `package.json`

## 2025-06-25 12:31:39 - Release v1.1.2

### Changed Files:

- `flexible-page-navigation.php`
- `src/block.json`

## 2025-06-25 12:23:59 - 1.1.2

### Changed Files:

- `flexible-page-navigation.php`

## 2025-06-25 12:23:57 - Remove GitHub token format validation to accept all token formats

### Changed Files:

- `package-lock.json`
- `package.json`

## 2025-06-25 12:23:48 - Release v1.1.1

### Changed Files:

- `src/admin.js`

## 2025-06-25 12:15:58 - 1.1.1

### Changed Files:

- `flexible-page-navigation.php`

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

## [1.3.0] - 2024-01-XX

### Added

- **Child Active Colors**: Separate background and text colors for active items on level 1+ (Ebene 1 und darunter)
- **Hover Effects**: Configurable hover effects (None, Underline, Background, Scale)
- **Hover Background Color**: Customizable hover background color when Background effect is selected
- **Separator System**: Configurable separator lines for submenu items with width, color, and padding controls
- **Active Item Padding**: Configurable padding for active navigation items
- **Unique Block IDs**: Each block gets a unique ID to prevent CSS conflicts between multiple blocks
- **Block-specific Styling**: Each block can have its own colors and styles without affecting others

### Changed

- **Active Formatting**: Active formatting now only applies to level 0 items (Hauptmenüpunkte)
- **Container Styling**: Removed default container background and padding, allowing theme integration
- **Separator Controls**: Moved from unused separator style to functional separator line system
- **Hover Background Color**: Moved from Colors panel to Navigation Settings panel (only visible when Background effect is selected)
- **CSS Structure**: Improved CSS specificity and removed unnecessary pseudo-elements

### Fixed

- **CSS Conflicts**: Multiple blocks on the same page no longer override each other's styles
- **Active Parent Styling**: Active parent formatting only applies to level 0 items
- **Hover Effects**: Scale and Background hover effects no longer show underline
- **Separator Padding**: Padding remains configurable even when separator lines are disabled

### Technical

- **Dynamic CSS Generation**: Inline styles are only generated when values differ from defaults
- **CSS Custom Properties**: Used for hover background color to allow dynamic changes
- **Block Attributes**: Added new attributes for child active colors, hover effects, and separator controls
- **Editor Controls**: Improved UI with conditional controls and better grouping

## [1.2.0] - 2024-01-XX

### Added

- **Custom Post Type Support**: Automatic detection and support for custom post types
- **Parent Post ID Input**: Text input for custom parent post ID instead of dropdown
- **Accordion Toggle Buttons**: Separate toggle buttons outside of links to avoid click conflicts
- **Column Layout Options**: Support for 2, 3, and 4 column layouts
- **Accordion Behavior**: Special behavior when accordion is disabled (only active items and parents are open)
- **Color Controls**: Background, text, active background, and active text color controls
- **Deploy Script**: Quick deployment script for local development

### Changed

- **Accordion Start Level**: Accordion now starts from second level (depth 1)
- **Toggle Icons**: Changed from arrows to + and × symbols
- **Indentation**: Left indentation with fine gray lines for submenu items
- **Active State Logic**: Improved active state detection and styling

### Fixed

- **Custom Post Type Detection**: Fixed REST API response handling for custom post types
- **Toggle Button Positioning**: Fixed vertical positioning of toggle buttons
- **Accordion Behavior**: Fixed display logic for accordion disabled mode

## [1.1.14] - 2024-01-XX

### Fixed

- **Plugin Update Error**: Removed obsolete `delete_plugins_cache()` function call
- **Nonce Validation**: Fixed AJAX nonce validation for admin functions

## [1.1.0] - 2024-01-XX

### Added

- **GitHub Update System**: Automatic updates from GitHub repository
- **Admin Interface**: Settings page with GitHub token management
- **Debug Tools**: API test and cache clearing functions
- **Changelog Generation**: Automatic changelog generation via pre-commit hook

### Changed

- **Project Structure**: Reorganized files with separate build and source directories
- **Asset Management**: Separated block assets from admin/frontend assets

## [1.0.0] - 2024-01-XX

### Added

- **Initial Release**: Complete WordPress plugin with Gutenberg block
- **Flexible Navigation**: Content type selection, sorting, depth, and child selection
- **Translation Support**: Full internationalization support
- **GitHub Integration**: Repository setup with Actions workflow
