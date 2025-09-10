<?php

/**
 * Plugin Name: Flexible Page Navigation
 * Plugin URI: https://github.com/gbyat/flexible-page-navigation
 * Description: A flexible page navigation block for WordPress with customizable content types, sorting, depth, and child selection options.
 * Version: 1.6.2
 * Requires at least: 5.0
 * Tested up to: 6.4
 * Author: Gabriele Laesser
 * License: GPL v2 or later
 * Text Domain: flexible-page-navigation
 * Domain Path: /languages
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Plugin constants
define('FPN_VERSION', '1.6.2');
define('FPN_PLUGIN_FILE', __FILE__);
define('FPN_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('FPN_PLUGIN_URL', plugin_dir_url(__FILE__));
define('FPN_PLUGIN_VERSION', '1.5.2');
define('FPN_GITHUB_REPO', 'gbyat/flexible-page-navigation');

// GitHub Update System
class FPN_GitHub_Updater
{
    private $file;
    private $plugin;
    private $basename;
    private $active;
    private $github_response;
    private $access_token;
    private $plugin_headers;

    public function __construct($file)
    {
        add_action('admin_init', array($this, 'set_plugin_properties'));
        add_filter('pre_set_site_transient_update_plugins', array($this, 'modify_transient'), 10, 1);
        add_filter('plugins_api', array($this, 'plugin_popup'), 10, 3);
        add_filter('upgrader_post_install', array($this, 'after_install'), 10, 3);
        add_action('upgrader_process_complete', array($this, 'purge'), 10, 2);
        add_action('admin_init', array($this, 'get_github_response'));
        add_action('admin_post_fpn_github_updater_delete_transients', array($this, 'delete_transients'));

        $this->file = $file;
        $this->basename = plugin_basename($this->file);
        $this->active = is_plugin_active($this->basename);
    }

    public function set_plugin_properties()
    {
        $this->plugin = get_plugin_data($this->file);
        $this->plugin_headers = array(
            'Name' => $this->plugin['Name'],
            'Version' => $this->plugin['Version'],
            'TextDomain' => $this->plugin['TextDomain'],
        );
    }

    public function get_github_response()
    {
        $this->access_token = get_option('fpn_github_token');
        if (!$this->access_token) {
            return;
        }

        $args = array(
            'headers' => array(
                'Authorization' => 'token ' . $this->access_token,
                'Accept' => 'application/vnd.github.v3+json',
            ),
        );

        $response = wp_remote_get('https://api.github.com/repos/' . FPN_GITHUB_REPO . '/releases/latest', $args);
        if (is_wp_error($response)) {
            return;
        }

        $this->github_response = json_decode(wp_remote_retrieve_body($response));
    }

    public function modify_transient($transient)
    {
        if (!$this->github_response || !$this->active) {
            return $transient;
        }

        // Get current version and new version
        $current_version = $this->plugin['Version'];
        $new_version = ltrim($this->github_response->tag_name, 'v'); // Remove 'v' prefix if present

        // Only show update if new version is actually newer
        if (version_compare($current_version, $new_version, '>=')) {
            return $transient;
        }

        $plugin_data = array(
            'slug' => $this->basename,
            'new_version' => $new_version,
            'url' => $this->plugin['PluginURI'],
            'package' => $this->github_response->zipball_url,
        );

        $transient->response[$this->basename] = (object) $plugin_data;
        return $transient;
    }

    public function plugin_popup($result, $action, $args)
    {
        if ($action !== 'plugin_information') {
            return $result;
        }

        if (!isset($args->slug) || $args->slug !== $this->basename) {
            return $result;
        }

        if (!$this->github_response) {
            return $result;
        }

        // Get changelog from CHANGELOG.md if available
        $changelog = '';
        $changelog_file = FPN_PLUGIN_DIR . 'CHANGELOG.md';
        if (file_exists($changelog_file)) {
            $changelog_content = file_get_contents($changelog_file);
            if ($changelog_content) {
                // Parse changelog and format for WordPress
                $changelog = $this->format_changelog_for_popup($changelog_content);
            }
        }

        // If no changelog from file, use GitHub release body
        if (empty($changelog)) {
            $changelog = $this->github_response->body ?: __('No changelog available.', 'flexible-page-navigation');
        }

        // Get README content for description
        $description = $this->plugin['Description'];
        $readme_file = FPN_PLUGIN_DIR . 'README.md';
        if (file_exists($readme_file)) {
            $readme_content = file_get_contents($readme_file);
            if ($readme_content) {
                $description = $this->format_readme_for_popup($readme_content);
            }
        }

        $plugin_data = array(
            'name' => $this->plugin['Name'],
            'slug' => $this->basename,
            'version' => $this->github_response->tag_name,
            'author' => $this->plugin['AuthorName'],
            'author_profile' => $this->plugin['AuthorURI'],
            'last_updated' => $this->github_response->published_at,
            'homepage' => $this->plugin['PluginURI'],
            'short_description' => $this->plugin['Description'],
            'sections' => array(
                'description' => $description,
                'changelog' => $changelog,
                'installation' => $this->get_installation_instructions(),
                'screenshots' => $this->get_screenshots_section(),
            ),
            'download_link' => $this->github_response->zipball_url,
            'requires' => '5.0',
            'tested' => '6.4',
            'requires_php' => '7.4',
        );

        return (object) $plugin_data;
    }

    /**
     * Format changelog content for WordPress plugin popup
     */
    private function format_changelog_for_popup($changelog_content)
    {
        // Convert markdown to HTML for WordPress
        $changelog = $changelog_content;

        // Convert headers - only keep H3, remove H1 and H2
        $changelog = preg_replace('/^### (.*)$/m', '<strong>$1</strong>', $changelog);
        $changelog = preg_replace('/^## (.*)$/m', '<strong>$1</strong>', $changelog);
        $changelog = preg_replace('/^# (.*)$/m', '<strong>$1</strong>', $changelog);

        // Convert lists
        $changelog = preg_replace('/^- (.*)$/m', '<li>$1</li>', $changelog);
        $changelog = preg_replace('/^\* (.*)$/m', '<li>$1</li>', $changelog);

        // Wrap lists in ul tags
        $changelog = preg_replace('/(<li>.*<\/li>)/s', '<ul>$1</ul>', $changelog);

        // Convert bold text
        $changelog = preg_replace('/\*\*(.*?)\*\*/', '<strong>$1</strong>', $changelog);

        // Convert code
        $changelog = preg_replace('/`(.*?)`/', '<code>$1</code>', $changelog);

        // Remove "Changed files" lines
        $changelog = preg_replace('/.*changed files.*\n?/i', '', $changelog);

        // Limit line breaks to maximum 2 consecutive
        $changelog = preg_replace('/\n{3,}/', "\n\n", $changelog);

        // Add extra line break after version descriptions (after </ul>)
        $changelog = preg_replace('/(<\/ul>)\n/', "$1\n\n", $changelog);

        // Convert line breaks
        $changelog = nl2br($changelog);

        return $changelog;
    }

    /**
     * Format README content for WordPress plugin popup
     */
    private function format_readme_for_popup($readme_content)
    {
        // Convert markdown to HTML for WordPress
        $readme = $readme_content;

        // Convert headers to strong tags
        $readme = preg_replace('/^### (.*)$/m', '<strong>$1</strong>', $readme);
        $readme = preg_replace('/^## (.*)$/m', '<strong>$1</strong>', $readme);
        $readme = preg_replace('/^# (.*)$/m', '<strong>$1</strong>', $readme);

        // Convert lists
        $readme = preg_replace('/^- (.*)$/m', '<li>$1</li>', $readme);
        $readme = preg_replace('/^\* (.*)$/m', '<li>$1</li>', $readme);

        // Wrap lists in ul tags
        $readme = preg_replace('/(<li>.*<\/li>)/s', '<ul>$1</ul>', $readme);

        // Convert bold text
        $readme = preg_replace('/\*\*(.*?)\*\*/', '<strong>$1</strong>', $readme);

        // Convert code
        $readme = preg_replace('/`(.*?)`/', '<code>$1</code>', $readme);

        // Limit line breaks to maximum 2 consecutive
        $readme = preg_replace('/\n{3,}/', "\n\n", $readme);

        // Convert line breaks
        $readme = nl2br($readme);

        return $readme;
    }

    /**
     * Get installation instructions
     */
    private function get_installation_instructions()
    {
        return '<strong>' . __('Installation', 'flexible-page-navigation') . '</strong><br><br>
        <ol>
            <li>' . __('Upload the plugin files to the /wp-content/plugins/flexible-page-navigation directory, or install the plugin through the WordPress plugins screen directly.', 'flexible-page-navigation') . '</li>
            <li>' . __('Activate the plugin through the \'Plugins\' screen in WordPress.', 'flexible-page-navigation') . '</li>
            <li>' . __('Use the Settings->Flexible Page Navigation screen to configure the plugin.', 'flexible-page-navigation') . '</li>
            <li>' . __('Add the Flexible Page Navigation block to your pages or posts.', 'flexible-page-navigation') . '</li>
        </ol>';
    }

    /**
     * Get screenshots section
     */
    private function get_screenshots_section()
    {
        return '<strong>' . __('Features', 'flexible-page-navigation') . '</strong><br><br>
        <ul>
            <li><strong>' . __('Flexible Navigation Block', 'flexible-page-navigation') . '</strong> - ' . __('Gutenberg block for creating custom navigation menus.', 'flexible-page-navigation') . '</li>
            <li><strong>' . __('Content Type Selection', 'flexible-page-navigation') . '</strong> - ' . __('Choose between Pages, Posts, or Custom Post Types.', 'flexible-page-navigation') . '</li>
            <li><strong>' . __('Accordion Functionality', 'flexible-page-navigation') . '</strong> - ' . __('Expandable/collapsible submenu items.', 'flexible-page-navigation') . '</li>
            <li><strong>' . __('Custom Styling', 'flexible-page-navigation') . '</strong> - ' . __('Full control over colors, fonts, and layout.', 'flexible-page-navigation') . '</li>
            <li><strong>' . __('Accessibility', 'flexible-page-navigation') . '</strong> - ' . __('WCAG compliant with ARIA attributes and keyboard navigation.', 'flexible-page-navigation') . '</li>
            <li><strong>' . __('Responsive Design', 'flexible-page-navigation') . '</strong> - ' . __('Works perfectly on all devices.', 'flexible-page-navigation') . '</li>
        </ul>';
    }

    public function after_install($response, $hook_extra, $result)
    {
        global $wp_filesystem;
        $install_directory = plugin_dir_path($this->file);
        $wp_filesystem->move($result['destination'], $install_directory);
        $result['destination'] = $install_directory;

        // Refresh plugin data
        $this->set_plugin_properties();

        if ($this->active) {
            $activate = activate_plugin($this->basename);
        }

        return $result;
    }

    public function purge()
    {
        if ($this->active) {
            delete_transient('fpn_github_updater_' . $this->basename);
        }
    }

    public function delete_transients()
    {
        delete_transient('fpn_github_updater_' . $this->basename);
        wp_redirect(admin_url('admin.php?page=flexible-page-navigation&tab=debug&transients_deleted=1'));
        exit;
    }
}

// Initialize GitHub Updater
new FPN_GitHub_Updater(__FILE__);

// Main Plugin Class
class Flexible_Page_Navigation
{
    private static $instance = null;

    public static function get_instance()
    {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct()
    {
        add_action('plugins_loaded', array($this, 'init'));
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_frontend_scripts'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_scripts'));

        add_action('wp_ajax_fpn_test_github_api', array($this, 'test_github_api'));
        add_action('wp_ajax_fpn_clear_cache', array($this, 'clear_cache'));
        add_action('wp_ajax_nopriv_fpn_test_github_api', array($this, 'test_github_api'));
        add_action('wp_ajax_nopriv_fpn_clear_cache', array($this, 'clear_cache'));
        register_activation_hook(__FILE__, array($this, 'activate'));
        register_deactivation_hook(__FILE__, array($this, 'deactivate'));
    }

    public function init()
    {
        // Check WordPress version
        if (version_compare(get_bloginfo('version'), '5.0', '<')) {
            error_log('Flexible Page Navigation: WordPress 5.0+ required');
            return;
        }

        // Register blocks in the proper hook to avoid script/style warnings
        add_action('init', array($this, 'register_blocks'));
    }

    /**
     * Register blocks in the proper hook
     */
    public function register_blocks()
    {
        // Register Flexible Nav Block using block.json
        $nav_block_json_path = FPN_PLUGIN_DIR . 'build/flexible-nav/block.json';

        if (!file_exists($nav_block_json_path)) {
            error_log('Flexible Page Navigation: flexible-nav block.json not found at ' . $nav_block_json_path);
        } else {
            // Register Flexible Nav Block using block.json
            $nav_result = register_block_type($nav_block_json_path, array(
                'render_callback' => array($this, 'render_navigation_block'),
            ));

            if (!$nav_result) {
                error_log('Flexible Page Navigation: Failed to register flexible-nav block');
            } else {
                error_log('Flexible Page Navigation: Flexible Nav block registered successfully');
            }
        }

        // Register Flexible Breadcrumb Block using block.json
        $breadcrumb_block_json_path = FPN_PLUGIN_DIR . 'build/flexible-breadcrumb/block.json';

        if (!file_exists($breadcrumb_block_json_path)) {
            error_log('Flexible Page Navigation: flexible-breadcrumb block.json not found at ' . $breadcrumb_block_json_path);
        } else {
            // Register Flexible Breadcrumb Block using block.json
            $breadcrumb_result = register_block_type($breadcrumb_block_json_path, array(
                'render_callback' => array($this, 'render_breadcrumb_block'),
            ));

            if (!$breadcrumb_result) {
                error_log('Flexible Page Navigation: Failed to register flexible-breadcrumb block');
            } else {
                error_log('Flexible Page Navigation: Flexible Breadcrumb block registered successfully');
            }
        }

        // Debug: Check if blocks are available (WordPress 5.0+ compatible)
        if (function_exists('get_block_types')) {
            $blocks = get_block_types();
            if (isset($blocks['flexible-page-navigation/flexible-nav'])) {
                error_log('Flexible Page Navigation: Flexible Nav block found in registry');
            } else {
                error_log('Flexible Page Navigation: Flexible Nav block NOT found in registry');
            }
            if (isset($blocks['flexible-page-navigation/flexible-breadcrumb'])) {
                error_log('Flexible Page Navigation: Flexible Breadcrumb block found in registry');
            } else {
                error_log('Flexible Page Navigation: Flexible Breadcrumb block NOT found in registry');
            }
        } else {
            error_log('Flexible Page Navigation: get_block_types() not available (WordPress < 5.0)');
        }

        // Debug: Check if WordPress can find our block.json files
        error_log('Flexible Page Navigation: Checking block.json files...');
        error_log('Flexible Page Navigation: Nav block.json exists: ' . (file_exists($nav_block_json_path) ? 'YES' : 'NO'));
        error_log('Flexible Page Navigation: Breadcrumb block.json exists: ' . (file_exists($breadcrumb_block_json_path) ? 'YES' : 'NO'));

        // Debug: Check if WordPress auto-detects blocks
        $auto_detected_blocks = array();
        if (function_exists('get_block_types')) {
            $all_blocks = get_block_types();
            foreach ($all_blocks as $block_name => $block_data) {
                if (strpos($block_name, 'flexible-page-navigation') === 0) {
                    $auto_detected_blocks[] = $block_name;
                }
            }
            error_log('Flexible Page Navigation: Auto-detected blocks: ' . implode(', ', $auto_detected_blocks));
        }

        // Debug: Check if blocks are available in the editor context
        add_action('admin_footer', array($this, 'debug_blocks_in_footer'));

        // Fallback: Manually register blocks if block.json method fails
        add_action('enqueue_block_editor_assets', array($this, 'enqueue_block_assets'));
    }

    /**
     * Enqueue block assets as fallback
     */
    public function enqueue_block_assets()
    {
        // Enqueue Flexible Nav Block assets
        $nav_script_path = FPN_PLUGIN_URL . 'build/flexible-nav/index.js';
        $nav_style_path = FPN_PLUGIN_URL . 'build/flexible-nav/index.css';

        if (file_exists(FPN_PLUGIN_DIR . 'build/flexible-nav/index.js')) {
            wp_enqueue_script(
                'flexible-nav-block',
                $nav_script_path,
                array('wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-i18n'),
                FPN_VERSION,
                true
            );
            wp_enqueue_style(
                'flexible-nav-block-editor',
                $nav_style_path,
                array(),
                FPN_VERSION
            );
        }

        // Enqueue Flexible Breadcrumb Block assets
        $breadcrumb_script_path = FPN_PLUGIN_URL . 'build/flexible-breadcrumb/index.js';
        $breadcrumb_style_path = FPN_PLUGIN_URL . 'build/flexible-breadcrumb/index.css';

        if (file_exists(FPN_PLUGIN_DIR . 'build/flexible-breadcrumb/index.js')) {
            wp_enqueue_script(
                'flexible-breadcrumb-block',
                $breadcrumb_script_path,
                array('wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-i18n'),
                FPN_VERSION,
                true
            );
            wp_enqueue_style(
                'flexible-breadcrumb-block-editor',
                $breadcrumb_style_path,
                array(),
                FPN_VERSION
            );
        }
    }

    public function add_admin_menu()
    {
        add_options_page(
            __('Flexible Page Navigation', 'flexible-page-navigation'),
            __('Flexible Page Navigation', 'flexible-page-navigation'),
            'manage_options',
            'flexible-page-navigation',
            array($this, 'admin_page')
        );
    }

    public function admin_page()
    {
        // Check user permissions
        if (!current_user_can('manage_options')) {
            wp_die(__('Insufficient permissions', 'flexible-page-navigation'));
        }

        $active_tab = isset($_GET['tab']) ? sanitize_text_field($_GET['tab']) : 'settings';
?>
        <div class="wrap">
            <h1><?php _e('Flexible Page Navigation', 'flexible-page-navigation'); ?></h1>

            <nav class="nav-tab-wrapper">
                <a href="?page=flexible-page-navigation&tab=settings" class="nav-tab <?php echo $active_tab === 'settings' ? 'nav-tab-active' : ''; ?>">
                    <?php _e('Settings', 'flexible-page-navigation'); ?>
                </a>
                <a href="?page=flexible-page-navigation&tab=debug" class="nav-tab <?php echo $active_tab === 'debug' ? 'nav-tab-active' : ''; ?>">
                    <?php _e('Debug', 'flexible-page-navigation'); ?>
                </a>
            </nav>

            <div class="tab-content">
                <?php
                if ($active_tab === 'settings') {
                    $this->settings_tab();
                } elseif ($active_tab === 'debug') {
                    $this->debug_tab();
                }
                ?>
            </div>
        </div>
    <?php
    }

    private function settings_tab()
    {
        // Handle form submission
        if (isset($_POST['submit']) && isset($_POST['github_token'])) {
            // Verify nonce for security
            if (!wp_verify_nonce($_POST['fpn_nonce'], 'fpn_settings')) {
                wp_die(__('Security check failed', 'flexible-page-navigation'));
            }

            // Check user permissions
            if (!current_user_can('manage_options')) {
                wp_die(__('Insufficient permissions', 'flexible-page-navigation'));
            }

            $token = sanitize_text_field($_POST['github_token']);
            update_option('fpn_github_token', $token);
            echo '<div class="notice notice-success is-dismissible"><p>' . __('GitHub token saved successfully!', 'flexible-page-navigation') . '</p></div>';
        }

        // Get current token
        $github_token = get_option('fpn_github_token', '');
    ?>
        <h2><?php _e('GitHub Settings', 'flexible-page-navigation'); ?></h2>
        <form method="post" action="">
            <?php wp_nonce_field('fpn_settings', 'fpn_nonce'); ?>
            <table class="form-table">
                <tr>
                    <th scope="row">
                        <label for="github_token"><?php _e('GitHub Personal Access Token', 'flexible-page-navigation'); ?></label>
                    </th>
                    <td>
                        <input type="password" id="github_token" name="github_token" value="<?php echo esc_attr($github_token); ?>" class="regular-text" />
                        <button type="button" id="show-github-token" class="button"><?php _e('Show Token', 'flexible-page-navigation'); ?></button>
                        <p class="description">
                            <?php _e('Enter your GitHub personal access token for automatic updates. The token should have "repo" permissions.', 'flexible-page-navigation'); ?>
                        </p>
                        <?php if ($github_token): ?>
                            <p class="description">
                                <span style="color: green;">✓ <?php _e('Token is set', 'flexible-page-navigation'); ?></span>
                            </p>
                        <?php else: ?>
                            <p class="description">
                                <span style="color: red;">✗ <?php _e('Token is not set', 'flexible-page-navigation'); ?></span>
                            </p>
                        <?php endif; ?>
                    </td>
                </tr>
            </table>
            <?php submit_button(__('Save Settings', 'flexible-page-navigation')); ?>
        </form>
    <?php
    }

    private function debug_tab()
    {
        // Check block registration status for both blocks (WordPress 5.0+ compatible)
        $nav_block_registered = false;
        $breadcrumb_block_registered = false;
        if (function_exists('is_block_registered')) {
            $nav_block_registered = is_block_registered('flexible-page-navigation/flexible-nav');
            $breadcrumb_block_registered = is_block_registered('flexible-page-navigation/flexible-breadcrumb');
        } else {
            // For older WordPress versions, assume blocks are registered if files exist
            $nav_block_registered = file_exists(FPN_PLUGIN_DIR . 'build/flexible-nav/block.json');
            $breadcrumb_block_registered = file_exists(FPN_PLUGIN_DIR . 'build/flexible-breadcrumb/block.json');
        }

        // Check if build files exist for Flexible Nav Block
        $nav_block_json_exists = file_exists(FPN_PLUGIN_DIR . 'build/flexible-nav/block.json');
        $nav_index_js_exists = file_exists(FPN_PLUGIN_DIR . 'build/flexible-nav/index.js');
        $nav_index_css_exists = file_exists(FPN_PLUGIN_DIR . 'build/flexible-nav/index.css');
        $nav_style_css_exists = file_exists(FPN_PLUGIN_DIR . 'build/flexible-nav/style.css');

        // Get file sizes for Flexible Nav Block
        $nav_block_json_size = $nav_block_json_exists ? filesize(FPN_PLUGIN_DIR . 'build/flexible-nav/block.json') : 0;
        $nav_index_js_size = $nav_index_js_exists ? filesize(FPN_PLUGIN_DIR . 'build/flexible-nav/index.js') : 0;
        $nav_index_css_size = $nav_index_css_exists ? filesize(FPN_PLUGIN_DIR . 'build/flexible-nav/index.css') : 0;
        $nav_style_css_size = $nav_style_css_exists ? filesize(FPN_PLUGIN_DIR . 'build/flexible-nav/style.css') : 0;

        // Check if build files exist for Flexible Breadcrumb Block
        $breadcrumb_block_json_exists = file_exists(FPN_PLUGIN_DIR . 'build/flexible-breadcrumb/block.json');
        $breadcrumb_index_js_exists = file_exists(FPN_PLUGIN_DIR . 'build/flexible-breadcrumb/index.js');
        $breadcrumb_index_css_exists = file_exists(FPN_PLUGIN_DIR . 'build/flexible-breadcrumb/index.css');
        $breadcrumb_style_css_exists = file_exists(FPN_PLUGIN_DIR . 'build/flexible-breadcrumb/style.css');

        // Get file sizes for Flexible Breadcrumb Block
        $breadcrumb_block_json_size = $breadcrumb_block_json_exists ? filesize(FPN_PLUGIN_DIR . 'build/flexible-breadcrumb/block.json') : 0;
        $breadcrumb_index_js_size = $breadcrumb_index_js_exists ? filesize(FPN_PLUGIN_DIR . 'build/flexible-breadcrumb/index.js') : 0;
        $breadcrumb_index_css_size = $breadcrumb_index_css_exists ? filesize(FPN_PLUGIN_DIR . 'build/flexible-breadcrumb/index.css') : 0;
        $breadcrumb_style_css_size = $breadcrumb_style_css_exists ? filesize(FPN_PLUGIN_DIR . 'build/flexible-breadcrumb/style.css') : 0;
    ?>
        <h2><?php _e('Debug Information', 'flexible-page-navigation'); ?></h2>

        <h3><?php _e('Plugin Information', 'flexible-page-navigation'); ?></h3>
        <table class="widefat">
            <tr>
                <td><strong><?php _e('Version', 'flexible-page-navigation'); ?></strong></td>
                <td><?php echo FPN_VERSION; ?></td>
            </tr>
            <tr>
                <td><strong><?php _e('GitHub Repository', 'flexible-page-navigation'); ?></strong></td>
                <td><?php echo FPN_GITHUB_REPO; ?></td>
            </tr>
            <tr>
                <td><strong><?php _e('GitHub Token', 'flexible-page-navigation'); ?></strong></td>
                <td><?php echo get_option('fpn_github_token') ? __('Set', 'flexible-page-navigation') : __('Not set', 'flexible-page-navigation'); ?></td>
            </tr>
        </table>

        <h3><?php _e('Block Registration Status', 'flexible-page-navigation'); ?></h3>
        <table class="widefat">
            <tr>
                <td><strong><?php _e('Flexible Nav Block', 'flexible-page-navigation'); ?></strong></td>
                <td><?php echo $nav_block_registered ? '<span style="color: green;">✓ Registered</span>' : '<span style="color: red;">✗ Not Registered</span>'; ?></td>
            </tr>
            <tr>
                <td><strong><?php _e('Flexible Breadcrumb Block', 'flexible-page-navigation'); ?></strong></td>
                <td><?php echo $breadcrumb_block_registered ? '<span style="color: green;">✓ Registered</span>' : '<span style="color: red;">✗ Not Registered</span>'; ?></td>
            </tr>
        </table>

        <h3><?php _e('Build Files Status', 'flexible-page-navigation'); ?></h3>

        <h4><?php _e('Flexible Nav Block', 'flexible-page-navigation'); ?></h4>
        <table class="widefat">
            <tr>
                <td><strong>build/flexible-nav/block.json</strong></td>
                <td><?php echo $nav_block_json_exists ? '<span style="color: green;">✓ Exists</span> (' . $nav_block_json_size . ' bytes)' : '<span style="color: red;">✗ Missing</span>'; ?></td>
            </tr>
            <tr>
                <td><strong>build/flexible-nav/index.js</strong></td>
                <td><?php echo $nav_index_js_exists ? '<span style="color: green;">✓ Exists</span> (' . $nav_index_js_size . ' bytes)' : '<span style="color: red;">✗ Missing</span>'; ?></td>
            </tr>
            <tr>
                <td><strong>build/flexible-nav/index.css</strong></td>
                <td><?php echo $nav_index_css_exists ? '<span style="color: green;">✓ Exists</span> (' . $nav_index_css_size . ' bytes)' : '<span style="color: red;">✗ Missing</span>'; ?></td>
            </tr>
            <tr>
                <td><strong>build/flexible-nav/style.css</strong></td>
                <td><?php echo $nav_style_css_exists ? '<span style="color: green;">✓ Exists</span> (' . $nav_style_css_size . ' bytes)' : '<span style="color: red;">✗ Missing</span>'; ?></td>
            </tr>
        </table>

        <h4><?php _e('Flexible Breadcrumb Block', 'flexible-page-navigation'); ?></h4>
        <table class="widefat">
            <tr>
                <td><strong>build/flexible-breadcrumb/block.json</strong></td>
                <td><?php echo $breadcrumb_block_json_exists ? '<span style="color: green;">✓ Exists</span> (' . $breadcrumb_block_json_size . ' bytes)' : '<span style="color: red;">✗ Missing</span>'; ?></td>
            </tr>
            <tr>
                <td><strong>build/flexible-breadcrumb/index.js</strong></td>
                <td><?php echo $breadcrumb_index_js_exists ? '<span style="color: green;">✓ Exists</span> (' . $breadcrumb_index_js_size . ' bytes)' : '<span style="color: red;">✗ Missing</span>'; ?></td>
            </tr>
            <tr>
                <td><strong>build/flexible-breadcrumb/index.css</strong></td>
                <td><?php echo $breadcrumb_index_css_exists ? '<span style="color: green;">✓ Exists</span> (' . $breadcrumb_index_css_size . ' bytes)' : '<span style="color: red;">✗ Missing</span>'; ?></td>
            </tr>
            <tr>
                <td><strong>build/flexible-breadcrumb/style.css</strong></td>
                <td><?php echo $breadcrumb_style_css_exists ? '<span style="color: green;">✓ Exists</span> (' . $breadcrumb_style_css_size . ' bytes)' : '<span style="color: red;">✗ Missing</span>'; ?></td>
            </tr>
        </table>

        <h3><?php _e('Actions', 'flexible-page-navigation'); ?></h3>
        <p>
            <button type="button" class="button" id="test-github-api">
                <?php _e('Test GitHub API', 'flexible-page-navigation'); ?>
            </button>
            <button type="button" class="button" id="clear-cache">
                <?php _e('Clear Cache', 'flexible-page-navigation'); ?>
            </button>
        </p>

        <div id="api-test-result"></div>
<?php
    }

    public function test_github_api()
    {
        // Check if user has permissions
        if (!current_user_can('manage_options')) {
            wp_send_json_error(__('Insufficient permissions', 'flexible-page-navigation'));
        }

        // Verify nonce
        if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'fpn_nonce')) {
            wp_send_json_error(__('Security check failed', 'flexible-page-navigation'));
        }

        $token = get_option('fpn_github_token');
        if (!$token) {
            wp_send_json_error(__('GitHub token not set', 'flexible-page-navigation'));
        }

        $args = array(
            'headers' => array(
                'Authorization' => 'token ' . $token,
                'Accept' => 'application/vnd.github.v3+json',
            ),
            'timeout' => 30,
        );

        $response = wp_remote_get('https://api.github.com/repos/' . FPN_GITHUB_REPO . '/releases/latest', $args);

        if (is_wp_error($response)) {
            wp_send_json_error('HTTP Error: ' . $response->get_error_message());
        }

        $response_code = wp_remote_retrieve_response_code($response);
        if ($response_code !== 200) {
            wp_send_json_error('GitHub API returned error code: ' . $response_code);
        }

        $body = json_decode(wp_remote_retrieve_body($response));
        if (!$body) {
            wp_send_json_error('Invalid response from GitHub API');
        }

        wp_send_json_success($body);
    }

    public function clear_cache()
    {
        // Check if user has permissions
        if (!current_user_can('manage_options')) {
            wp_send_json_error(__('Insufficient permissions', 'flexible-page-navigation'));
        }

        // Verify nonce
        if (!isset($_POST['nonce']) || !wp_verify_nonce($_POST['nonce'], 'fpn_nonce')) {
            wp_send_json_error(__('Security check failed', 'flexible-page-navigation'));
        }

        // Delete the GitHub updater transient
        $transient_name = 'fpn_github_updater_' . plugin_basename(__FILE__);
        $deleted = delete_transient($transient_name);

        if ($deleted) {
            wp_send_json_success(__('Cache cleared successfully', 'flexible-page-navigation'));
        } else {
            wp_send_json_success(__('Cache was already empty', 'flexible-page-navigation'));
        }
    }

    public function enqueue_frontend_scripts()
    {
        wp_enqueue_style(
            'flexible-page-navigation-style',
            FPN_PLUGIN_URL . 'build/style.css',
            array(),
            FPN_VERSION
        );

        wp_enqueue_script(
            'flexible-page-navigation-frontend',
            FPN_PLUGIN_URL . 'assets/js/frontend.js',
            array(),
            FPN_VERSION,
            true
        );
    }



    public function enqueue_admin_scripts($hook)
    {
        if ($hook !== 'settings_page_flexible-page-navigation') {
            return;
        }

        wp_enqueue_script(
            'flexible-page-navigation-admin',
            FPN_PLUGIN_URL . 'assets/js/admin.js',
            array('jquery'),
            FPN_PLUGIN_VERSION,
            true
        );

        wp_localize_script('flexible-page-navigation-admin', 'fpn_ajax', array(
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('fpn_nonce'),
        ));
    }

    /**
     * Debug function to check blocks in admin footer
     */
    public function debug_blocks_in_footer()
    {
        if (function_exists('get_block_types')) {
            $blocks = get_block_types();
            error_log('Flexible Page Navigation: Blocks in admin_footer: ' . implode(', ', array_keys($blocks)));
        }
    }



    public function render_breadcrumb_block($attributes)
    {
        // Get current page/post
        $current_page_id = get_the_ID();
        if (!$current_page_id) {
            return '';
        }

        // Extract attributes with defaults
        $start_page_id = isset($attributes['startPageId']) ? intval($attributes['startPageId']) : 0;
        $start_page_text = isset($attributes['startPageText']) ? $attributes['startPageText'] : 'Home';
        $start_page_url = isset($attributes['startPageUrl']) ? $attributes['startPageUrl'] : '';
        $show_start_link = isset($attributes['showStartLink']) ? $attributes['showStartLink'] : true;
        $separator = isset($attributes['separator']) ? $attributes['separator'] : '>';
        $separator_color = isset($attributes['separatorColor']) ? $attributes['separatorColor'] : '#666666';
        $separator_margin = isset($attributes['separatorMargin']) ? intval($attributes['separatorMargin']) : 8;
        $text_color = isset($attributes['textColor']) ? $attributes['textColor'] : '#333333';
        $link_color = isset($attributes['linkColor']) ? $attributes['linkColor'] : '#007cba';
        $active_color = isset($attributes['activeColor']) ? $attributes['activeColor'] : '#666666';
        $font_size = isset($attributes['fontSize']) ? intval($attributes['fontSize']) : 14;
        $font_weight = isset($attributes['fontWeight']) ? $attributes['fontWeight'] : '400';
        $padding = isset($attributes['padding']) ? intval($attributes['padding']) : 10;
        $background_color = isset($attributes['backgroundColor']) ? $attributes['backgroundColor'] : 'transparent';
        $border_radius = isset($attributes['borderRadius']) ? intval($attributes['borderRadius']) : 0;
        $show_current_page = isset($attributes['showCurrentPage']) ? $attributes['showCurrentPage'] : true;
        $max_depth = isset($attributes['maxDepth']) ? intval($attributes['maxDepth']) : 5;

        // Build breadcrumb trail
        $breadcrumb_items = array();

        // Add start page if enabled
        if ($show_start_link) {
            if ($start_page_id === -1 && !empty($start_page_url)) {
                // Custom URL
                $breadcrumb_items[] = array(
                    'title' => $start_page_text,
                    'url' => esc_url($start_page_url),
                    'is_current' => false
                );
            } elseif ($start_page_id > 0) {
                // Specific page
                $start_page = get_post($start_page_id);
                if ($start_page && $start_page->post_status === 'publish') {
                    $breadcrumb_items[] = array(
                        'title' => $start_page_text,
                        'url' => get_permalink($start_page_id),
                        'is_current' => false
                    );
                }
            } else {
                // Default home link
                $breadcrumb_items[] = array(
                    'title' => $start_page_text,
                    'url' => home_url('/'),
                    'is_current' => false
                );
            }
        }

        // Build hierarchy trail
        $current_page = get_post($current_page_id);
        $trail = array();

        if ($current_page) {
            $trail[] = $current_page;

            // Get parent pages
            $parent_id = $current_page->post_parent;
            $depth = 0;

            while ($parent_id > 0 && $depth < $max_depth) {
                $parent = get_post($parent_id);
                if ($parent && $parent->post_status === 'publish') {
                    array_unshift($trail, $parent);
                    $parent_id = $parent->post_parent;
                    $depth++;
                } else {
                    break;
                }
            }
        }

        // Add trail items to breadcrumb (excluding current page if not showing)
        foreach ($trail as $index => $item) {
            if ($index === count($trail) - 1 && !$show_current_page) {
                continue; // Skip current page
            }

            $breadcrumb_items[] = array(
                'title' => $item->post_title,
                'url' => get_permalink($item->ID),
                'is_current' => ($item->ID === $current_page_id)
            );
        }

        // Build HTML
        $container_style = sprintf(
            'font-size: %dpx; font-weight: %s; padding: %dpx; background-color: %s; border-radius: %dpx; color: %s;',
            $font_size,
            $font_weight,
            $padding,
            $background_color,
            $border_radius,
            $text_color
        );

        $separator_style = sprintf('color: %s; margin: 0 %dpx;', $separator_color, $separator_margin);

        $html = '<nav class="wp-block-flexible-page-navigation-flexible-breadcrumb" aria-label="' . esc_attr__('Breadcrumb', 'flexible-page-navigation') . '">';
        $html .= '<div class="breadcrumb-container" style="' . esc_attr($container_style) . '">';

        foreach ($breadcrumb_items as $index => $item) {
            if ($index > 0) {
                $html .= '<span class="breadcrumb-separator" style="' . esc_attr($separator_style) . '">' . esc_html($separator) . '</span>';
            }

            if ($item['is_current']) {
                $html .= '<span class="breadcrumb-current" style="color: ' . esc_attr($active_color) . ';">' . esc_html($item['title']) . '</span>';
            } else {
                $html .= '<a href="' . esc_url($item['url']) . '" class="breadcrumb-link" style="color: ' . esc_attr($link_color) . ';">' . esc_html($item['title']) . '</a>';
            }
        }

        $html .= '</div></nav>';

        return $html;
    }

    public function render_navigation_block($attributes)
    {
        $content_type = isset($attributes['contentType']) ? $attributes['contentType'] : 'pages';
        $sort_by = isset($attributes['sortBy']) ? $attributes['sortBy'] : 'menu_order';
        $sort_order = isset($attributes['sortOrder']) ? $attributes['sortOrder'] : 'ASC';
        $depth = isset($attributes['depth']) ? intval($attributes['depth']) : 3;
        $child_selection = isset($attributes['childSelection']) ? $attributes['childSelection'] : 'current';
        $menu_display_mode = isset($attributes['menuDisplayMode']) ? $attributes['menuDisplayMode'] : 'children';
        $parent_page_id = isset($attributes['parentPageId']) ? intval($attributes['parentPageId']) : 0;
        $accordion_enabled = $attributes['accordionEnabled'] ?? true;
        $column_layout = $attributes['columnLayout'] ?? 'single';
        $background_color = isset($attributes['backgroundColor']) ? $attributes['backgroundColor'] : '#f8f9fa';
        $text_color = isset($attributes['textColor']) ? $attributes['textColor'] : '#333333';
        $active_background_color = isset($attributes['activeBackgroundColor']) ? $attributes['activeBackgroundColor'] : '#007cba';
        $active_text_color = isset($attributes['activeTextColor']) ? $attributes['activeTextColor'] : '#ffffff';
        $active_padding = $attributes['activePadding'] ?? 8;
        $child_active_background_color = isset($attributes['childActiveBackgroundColor']) ? $attributes['childActiveBackgroundColor'] : '#e8f4fd';
        $child_active_text_color = isset($attributes['childActiveTextColor']) ? $attributes['childActiveTextColor'] : '#333333';
        $separator_enabled = $attributes['separatorEnabled'] ?? true;
        $separator_width = $attributes['separatorWidth'] ?? 2;
        $separator_color = isset($attributes['separatorColor']) ? $attributes['separatorColor'] : '#e0e0e0';
        $separator_padding = $attributes['separatorPadding'] ?? 20;
        $hover_effect = isset($attributes['hoverEffect']) ? $attributes['hoverEffect'] : 'underline';
        $hover_background_color = isset($attributes['hoverBackgroundColor']) ? $attributes['hoverBackgroundColor'] : 'rgba(0, 0, 0, 0.1)';
        $main_item_font_weight = isset($attributes['mainItemFontWeight']) ? $attributes['mainItemFontWeight'] : '600';
        $main_item_font_size = isset($attributes['mainItemFontSize']) ? intval($attributes['mainItemFontSize']) : 16;
        $main_item_text_color = isset($attributes['mainItemTextColor']) ? $attributes['mainItemTextColor'] : '#333333';
        $dropdown_max_width = isset($attributes['dropdownMaxWidth']) ? intval($attributes['dropdownMaxWidth']) : 280;
        $menu_orientation = isset($attributes['menuOrientation']) ? $attributes['menuOrientation'] : 'vertical';
        $mobile_menu_animation = isset($attributes['mobileMenuAnimation']) ? $attributes['mobileMenuAnimation'] : 'slide';
        $mobile_breakpoint = isset($attributes['mobileBreakpoint']) ? intval($attributes['mobileBreakpoint']) : 768;
        $mobile_accordion = isset($attributes['submenuBehavior']) ? (bool)$attributes['submenuBehavior'] : false;

        // Get current page ID
        $current_page_id = get_queried_object_id();

        // Get pages based on menu display mode
        $pages = array();
        if ($menu_display_mode === 'children') {
            // Show children only
            $nav_parent_id = 0;
            if ($child_selection === 'custom' && $parent_page_id > 0) {
                $nav_parent_id = $parent_page_id;
            } elseif ($child_selection === 'current') {
                $nav_parent_id = $current_page_id;
            }

            if ($nav_parent_id > 0) {
                $pages = get_posts(array(
                    'post_type' => $content_type,
                    'post_status' => 'publish',
                    'posts_per_page' => -1,
                    'orderby' => $sort_by,
                    'order' => $sort_order,
                    'hierarchical' => true,
                    'post_parent' => $nav_parent_id,
                ));
            }
        } else {
            // Show all items - get only top-level items to avoid duplicates
            $pages = get_posts(array(
                'post_type' => $content_type,
                'post_status' => 'publish',
                'posts_per_page' => -1,
                'orderby' => $sort_by,
                'order' => $sort_order,
                'hierarchical' => true,
                'post_parent' => 0, // Only top-level items
            ));
        }

        if (empty($pages)) {
            return '<div class="fpn-navigation fpn-no-pages">' . __('No pages found.', 'flexible-page-navigation') . '</div>';
        }

        // Build navigation HTML with unique block ID
        $block_id = 'fpn-block-' . uniqid() . '-v3';
        $orientation_class = $menu_orientation === 'horizontal' ? 'fpn-orientation-horizontal' : 'fpn-orientation-vertical';
        $output = '<nav id="' . esc_attr($block_id) . '" class="fpn-navigation ' . esc_attr($orientation_class) . ' fpn-layout-' . esc_attr($column_layout) . '" role="navigation" aria-label="' . esc_attr__('Page Navigation', 'flexible-page-navigation') . '"'
            . ' data-orientation="' . esc_attr($menu_orientation) . '"'
            . ' data-mobile-animation="' . esc_attr($mobile_menu_animation) . '"'
            . ' data-mobile-breakpoint="' . intval($mobile_breakpoint) . '"'
            . ' data-mobile-accordion="' . ($mobile_accordion ? 'true' : 'false') . '"'
            . ' data-accordion="' . ($accordion_enabled ? 'true' : 'false') . '"'
            . ' data-columns="' . esc_attr($column_layout) . '"'
            . ' data-hover="' . esc_attr($hover_effect) . '">';

        // Burger-Icon für horizontales Menü im Mobile-Modus
        if ($menu_orientation === 'horizontal') {
            $output .= '<button class="fpn-burger" aria-label="' . esc_attr__('Menu open / close', 'flexible-page-navigation') . '" aria-expanded="false" aria-controls="' . esc_attr($block_id) . '-menu">'
                . '<span class="fpn-burger-bar"></span>'
                . '<span class="fpn-burger-bar"></span>'
                . '<span class="fpn-burger-bar"></span>'
                . '</button>';
        }

        // Add inline styles including recursive accordion functionality
        $output .= '<style>';

        // Recursive accordion CSS - force this to load
        if ($accordion_enabled) {
            // Depth 0 and 1 are always visible, only hide depth 2+ by default
            $output .= '#' . esc_attr($block_id) . ' .fpn-item .fpn-depth-2, #' . esc_attr($block_id) . ' .fpn-item .fpn-depth-3, #' . esc_attr($block_id) . ' .fpn-item .fpn-depth-4 { display: none !important; }';
            // Show sublevels when parent is expanded - more specific selectors
            $output .= '#' . esc_attr($block_id) . ' .fpn-item.fpn-expanded > .fpn-depth-2, #' . esc_attr($block_id) . ' .fpn-item.fpn-expanded > .fpn-depth-3, #' . esc_attr($block_id) . ' .fpn-item.fpn-expanded > .fpn-depth-4 { display: block !important; }';
            // Also handle nested expanded items
            $output .= '#' . esc_attr($block_id) . ' .fpn-item.fpn-expanded .fpn-item.fpn-expanded > .fpn-depth-3, #' . esc_attr($block_id) . ' .fpn-item.fpn-expanded .fpn-item.fpn-expanded > .fpn-depth-4 { display: block !important; }';
        } else {
            // Non-accordion mode: show all items, but hide children of non-active parents
            $output .= '#' . esc_attr($block_id) . ' .fpn-item .fpn-depth-1, #' . esc_attr($block_id) . ' .fpn-item .fpn-depth-2, #' . esc_attr($block_id) . ' .fpn-item .fpn-depth-3, #' . esc_attr($block_id) . ' .fpn-item .fpn-depth-4 { display: none; }';
            // Show children of active parents
            $output .= '#' . esc_attr($block_id) . ' .fpn-item.fpn-active > .fpn-depth-1, #' . esc_attr($block_id) . ' .fpn-item.fpn-active > .fpn-depth-2, #' . esc_attr($block_id) . ' .fpn-item.fpn-active > .fpn-depth-3, #' . esc_attr($block_id) . ' .fpn-item.fpn-active > .fpn-depth-4 { display: block; }';
            $output .= '#' . esc_attr($block_id) . ' .fpn-item.fpn-active-parent > .fpn-depth-1, #' . esc_attr($block_id) . ' .fpn-item.fpn-active-parent > .fpn-depth-2, #' . esc_attr($block_id) . ' .fpn-item.fpn-active-parent > .fpn-depth-3, #' . esc_attr($block_id) . ' .fpn-item.fpn-active-parent > .fpn-depth-4 { display: block; }';
            // Show children of active children (nested active items)
            $output .= '#' . esc_attr($block_id) . ' .fpn-item.fpn-active .fpn-item.fpn-active > .fpn-depth-2, #' . esc_attr($block_id) . ' .fpn-item.fpn-active .fpn-item.fpn-active > .fpn-depth-3, #' . esc_attr($block_id) . ' .fpn-item.fpn-active .fpn-item.fpn-active > .fpn-depth-4 { display: block; }';
            $output .= '#' . esc_attr($block_id) . ' .fpn-item.fpn-active-parent .fpn-item.fpn-active > .fpn-depth-2, #' . esc_attr($block_id) . ' .fpn-item.fpn-active-parent .fpn-item.fpn-active > .fpn-depth-3, #' . esc_attr($block_id) . ' .fpn-item.fpn-active-parent .fpn-item.fpn-active > .fpn-depth-4 { display: block; }';
        }

        // Only add color styles if they are set (not default)
        if ($background_color !== '#f8f9fa' || $text_color !== '#333333' || $active_background_color !== '#007cba' || $active_text_color !== '#ffffff' || $child_active_background_color !== '#e8f4fd' || $child_active_text_color !== '#333333' || $hover_background_color !== 'rgba(0, 0, 0, 0.1)') {
            if ($background_color !== '#f8f9fa') {
                $output .= '#' . esc_attr($block_id) . ' { background-color: ' . esc_attr($background_color) . '; }';
            }
            if ($text_color !== '#333333') {
                $output .= '#' . esc_attr($block_id) . ' .fpn-item a { color: ' . esc_attr($text_color) . '; }';
            }
            if ($active_background_color !== '#007cba' || $active_text_color !== '#ffffff') {
                $output .= '#' . esc_attr($block_id) . ' .fpn-depth-0 > .fpn-item.fpn-active > a { background-color: ' . esc_attr($active_background_color) . '; color: ' . esc_attr($active_text_color) . '; }';
                $output .= '#' . esc_attr($block_id) . ' .fpn-depth-0 > .fpn-item.fpn-active-parent > a { background-color: ' . esc_attr($active_background_color) . '; color: ' . esc_attr($active_text_color) . '; }';
            }
            if ($child_active_background_color !== '#e8f4fd' || $child_active_text_color !== '#333333') {
                $output .= '#' . esc_attr($block_id) . ' .fpn-depth-1 > .fpn-item.fpn-active > a, #' . esc_attr($block_id) . ' .fpn-depth-2 > .fpn-item.fpn-active > a, #' . esc_attr($block_id) . ' .fpn-depth-3 > .fpn-item.fpn-active > a, #' . esc_attr($block_id) . ' .fpn-depth-4 > .fpn-item.fpn-active > a { background-color: ' . esc_attr($child_active_background_color) . '; color: ' . esc_attr($child_active_text_color) . '; }';
                $output .= '#' . esc_attr($block_id) . ' .fpn-depth-1 > .fpn-item.fpn-active-parent > a, #' . esc_attr($block_id) . ' .fpn-depth-2 > .fpn-item.fpn-active-parent > a, #' . esc_attr($block_id) . ' .fpn-depth-3 > .fpn-item.fpn-active-parent > a, #' . esc_attr($block_id) . ' .fpn-depth-4 > .fpn-item.fpn-active-parent > a { background-color: ' . esc_attr($child_active_background_color) . '; color: ' . esc_attr($child_active_text_color) . '; }';
            }
            if ($hover_background_color !== 'rgba(0, 0, 0, 0.1)') {
                $output .= '#' . esc_attr($block_id) . ' { --fpn-hover-bg: ' . esc_attr($hover_background_color) . '; }';
            }
        }

        // Main menu items (depth-0) styling
        if ($main_item_font_weight !== '600' || $main_item_font_size !== 16 || $main_item_text_color !== '#333333') {
            $output .= '#' . esc_attr($block_id) . ' .fpn-depth-0 > .fpn-item > a {';
            if ($main_item_font_weight !== '600') {
                $output .= ' font-weight: ' . esc_attr($main_item_font_weight) . ';';
            }
            if ($main_item_font_size !== 16) {
                $output .= ' font-size: ' . intval($main_item_font_size) . 'px;';
            }
            if ($main_item_text_color !== '#333333') {
                $output .= ' color: ' . esc_attr($main_item_text_color) . ';';
            }
            $output .= ' }';
        }

        // Always apply separator and padding styles
        $output .= '#' . esc_attr($block_id) . ' .fpn-depth-1 > .fpn-item > a { padding-left: ' . intval($separator_padding) . 'px; }';
        $output .= '#' . esc_attr($block_id) . ' .fpn-depth-2 > .fpn-item > a { padding-left: ' . intval($separator_padding * 2) . 'px; }';
        $output .= '#' . esc_attr($block_id) . ' .fpn-depth-3 > .fpn-item > a { padding-left: ' . intval($separator_padding * 3) . 'px; }';
        $output .= '#' . esc_attr($block_id) . ' .fpn-depth-4 > .fpn-item > a { padding-left: ' . intval($separator_padding * 4) . 'px; }';

        // Apply dropdown max width for horizontal orientation
        if ($menu_orientation === 'horizontal' && $dropdown_max_width !== 280) {
            $output .= '#' . esc_attr($block_id) . ' .fpn-list ul, #' . esc_attr($block_id) . ' .fpn-depth-1, #' . esc_attr($block_id) . ' .fpn-depth-2, #' . esc_attr($block_id) . ' .fpn-depth-3, #' . esc_attr($block_id) . ' .fpn-depth-4 { max-width: ' . intval($dropdown_max_width) . 'px; }';
        }

        // Apply border-left only if separator is enabled
        if ($separator_enabled) {
            $output .= '#' . esc_attr($block_id) . ' .fpn-depth-1 > .fpn-item > a { border-left: ' . intval($separator_width) . 'px solid ' . esc_attr($separator_color) . '; }';
            $output .= '#' . esc_attr($block_id) . ' .fpn-depth-2 > .fpn-item > a { border-left: ' . intval($separator_width) . 'px solid ' . esc_attr($separator_color) . '; }';
            $output .= '#' . esc_attr($block_id) . ' .fpn-depth-3 > .fpn-item > a { border-left: ' . intval($separator_width) . 'px solid ' . esc_attr($separator_color) . '; }';
            $output .= '#' . esc_attr($block_id) . ' .fpn-depth-4 > .fpn-item > a { border-left: ' . intval($separator_width) . 'px solid ' . esc_attr($separator_color) . '; }';
        } else {
            $output .= '#' . esc_attr($block_id) . ' .fpn-depth-1 > .fpn-item > a, #' . esc_attr($block_id) . ' .fpn-depth-2 > .fpn-item > a, #' . esc_attr($block_id) . ' .fpn-depth-3 > .fpn-item > a, #' . esc_attr($block_id) . ' .fpn-depth-4 > .fpn-item > a { border-left: none; }';
        }

        // Accordion-Toggle-Buttons: Sichtbarkeit abhängig vom Modus
        $toggle_selector = '#' . esc_attr($block_id) . ' .fpn-depth-1 .fpn-item.fpn-has-children .fpn-toggle, '
            . '#' . esc_attr($block_id) . ' .fpn-depth-2 .fpn-item.fpn-has-children .fpn-toggle, '
            . '#' . esc_attr($block_id) . ' .fpn-depth-3 .fpn-item.fpn-has-children .fpn-toggle, '
            . '#' . esc_attr($block_id) . ' .fpn-depth-4 .fpn-item.fpn-has-children .fpn-toggle';
        if ($menu_orientation === 'horizontal' && $mobile_accordion) {
            // Nur im Mobile-Breakpoint anzeigen
            $output .= '@media (max-width: ' . intval($mobile_breakpoint) . 'px) {' . $toggle_selector . ' { display: flex !important; } }';
            $output .= '@media (min-width: ' . intval($mobile_breakpoint + 1) . 'px) {' . $toggle_selector . ' { display: none !important; } }';
        } else {
            // Immer ausblenden
            $output .= $toggle_selector . ' { display: none !important; }';
        }

        $output .= '</style>';

        $output .= $this->build_navigation_tree($pages, $current_page_id, $depth, 0, $accordion_enabled, $active_padding);

        $output .= '</nav>';

        return $output;
    }

    private function build_navigation_tree($pages, $current_page_id, $max_depth, $current_depth, $accordion_enabled = true, $active_padding = 8, $parent_id = 0)
    {
        if ($current_depth >= $max_depth) {
            return '';
        }

        $list_id = $parent_id > 0 ? 'fpn-submenu-' . $parent_id : '';
        $list_attributes = array('class="fpn-list fpn-depth-' . $current_depth . '"');

        if ($list_id) {
            $list_attributes[] = 'id="' . esc_attr($list_id) . '"';
        }

        if ($current_depth > 0) {
            $list_attributes[] = 'role="group"';
            $list_attributes[] = 'aria-label="' . esc_attr__('Submenu', 'flexible-page-navigation') . '"';
        }

        $output = '<ul ' . implode(' ', $list_attributes) . '>';

        foreach ($pages as $page) {
            $is_active = ($page->ID == $current_page_id);
            $is_parent_active = $this->is_parent_active($page->ID, $current_page_id);
            $has_children = $this->has_children($page->ID, $page->post_type);

            // Only apply active class to level 0 items when on the page or its children
            $active_class = '';
            if ($current_depth === 0 && ($is_active || $is_parent_active)) {
                $active_class = ' fpn-active';
            }

            // Apply active padding as inline style
            $active_style = '';
            if ($current_depth === 0 && ($is_active || $is_parent_active)) {
                $active_style = ' style="padding: ' . intval($active_padding) . 'px;"';
            }

            $classes = array('fpn-item');
            if ($is_active) {
                $classes[] = 'fpn-active';
            }
            if ($is_parent_active) {
                $classes[] = 'fpn-active-parent';
            }
            if ($has_children) {
                $classes[] = 'fpn-has-children';
            }

            $output .= '<li class="' . implode(' ', $classes) . '">';

            // Build link with proper ARIA attributes
            $link_attributes = array();
            $link_attributes[] = 'href="' . get_permalink($page->ID) . '"';

            // Add aria-current for current page
            if ($is_active) {
                $link_attributes[] = 'aria-current="page"';
            }

            // Add aria-expanded for items with children
            if ($has_children) {
                $link_attributes[] = 'aria-expanded="false"';
                $link_attributes[] = 'aria-haspopup="true"';
            }

            // Add active class and style
            if ($active_class) {
                $link_attributes[] = 'class="' . trim($active_class) . '"';
            }
            if ($active_style) {
                $link_attributes[] = 'style="' . trim($active_style) . '"';
            }

            $output .= '<a ' . implode(' ', $link_attributes) . '>' . esc_html($page->post_title) . '</a>';

            // Add toggle button for items with children when accordion is enabled, but only for depth 1 and above
            // AND only if the children will actually be displayed (within depth limit)
            if ($this->has_children($page->ID, $page->post_type) && $accordion_enabled && $current_depth >= 1 && $current_depth < $max_depth - 1) {
                $toggle_label = sprintf(
                    __('Toggle submenu for %s', 'flexible-page-navigation'),
                    esc_attr($page->post_title)
                );
                $output .= '<button class="fpn-toggle" aria-label="' . $toggle_label . '" aria-expanded="false" aria-controls="fpn-submenu-' . $page->ID . '">';
                $output .= '<span class="fpn-toggle-icon fpn-toggle-plus" aria-hidden="true">+</span>';
                $output .= '<span class="fpn-toggle-icon fpn-toggle-minus" aria-hidden="true">×</span>';
                $output .= '</button>';
            }

            if ($this->has_children($page->ID, $page->post_type) && $current_depth < $max_depth - 1) {
                $children = get_posts(array(
                    'post_type' => $page->post_type,
                    'post_status' => 'publish',
                    'posts_per_page' => -1,
                    'orderby' => 'menu_order',
                    'order' => 'ASC',
                    'post_parent' => $page->ID,
                ));

                if (!empty($children)) {
                    $output .= $this->build_navigation_tree($children, $current_page_id, $max_depth, $current_depth + 1, $accordion_enabled, $active_padding, $page->ID);
                }
            }

            $output .= '</li>';
        }

        $output .= '</ul>';
        return $output;
    }

    private function has_children($page_id, $post_type = 'page')
    {
        $children = get_posts(array(
            'post_type' => $post_type,
            'post_status' => 'publish',
            'posts_per_page' => 1,
            'post_parent' => $page_id,
        ));
        return !empty($children);
    }

    private function is_parent_active($page_id, $current_page_id)
    {
        $ancestors = get_post_ancestors($current_page_id);
        return in_array($page_id, $ancestors);
    }

    public function activate()
    {
        // Activation tasks
    }

    public function deactivate()
    {
        // Cleanup tasks
        delete_option('fpn_github_token');
    }
}

// Initialize the plugin
Flexible_Page_Navigation::get_instance();
