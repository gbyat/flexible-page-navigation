<?php

/**
 * Plugin Name: Flexible Page Navigation
 * Plugin URI: https://github.com/gbyat/flexible-page-navigation
 * Description: A flexible page navigation block for WordPress with customizable content types, sorting, depth, and child selection options.
 * Version: 1.4.9
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
define('FPN_VERSION', '1.4.9');
define('FPN_PLUGIN_FILE', __FILE__);
define('FPN_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('FPN_PLUGIN_URL', plugin_dir_url(__FILE__));
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
                'description' => $this->plugin['Description'],
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

        // Convert headers
        $changelog = preg_replace('/^### (.*)$/m', '<h3>$1</h3>', $changelog);
        $changelog = preg_replace('/^## (.*)$/m', '<h2>$1</h2>', $changelog);
        $changelog = preg_replace('/^# (.*)$/m', '<h1>$1</h1>', $changelog);

        // Convert lists
        $changelog = preg_replace('/^- (.*)$/m', '<li>$1</li>', $changelog);
        $changelog = preg_replace('/^\* (.*)$/m', '<li>$1</li>', $changelog);

        // Wrap lists in ul tags
        $changelog = preg_replace('/(<li>.*<\/li>)/s', '<ul>$1</ul>', $changelog);

        // Convert bold text
        $changelog = preg_replace('/\*\*(.*?)\*\*/', '<strong>$1</strong>', $changelog);

        // Convert code
        $changelog = preg_replace('/`(.*?)`/', '<code>$1</code>', $changelog);

        // Convert line breaks
        $changelog = nl2br($changelog);

        return $changelog;
    }

    /**
     * Get installation instructions
     */
    private function get_installation_instructions()
    {
        return '<h3>' . __('Installation', 'flexible-page-navigation') . '</h3>
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
        return '<h3>' . __('Features', 'flexible-page-navigation') . '</h3>
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

        load_plugin_textdomain('flexible-page-navigation', false, dirname(plugin_basename(__FILE__)) . '/languages');

        // Debug: Check if block.json exists
        $block_json_path = FPN_PLUGIN_DIR . 'build/block.json';
        if (!file_exists($block_json_path)) {
            error_log('Flexible Page Navigation: block.json not found at ' . $block_json_path);
            return;
        }

        // Debug: Check if index.js exists
        $index_js_path = FPN_PLUGIN_DIR . 'build/index.js';
        if (!file_exists($index_js_path)) {
            error_log('Flexible Page Navigation: index.js not found at ' . $index_js_path);
            return;
        }

        // Debug: Check if index.css exists
        $index_css_path = FPN_PLUGIN_DIR . 'build/index.css';
        if (!file_exists($index_css_path)) {
            error_log('Flexible Page Navigation: index.css not found at ' . $index_css_path);
            return;
        }

        // Debug: Check if style.css exists
        $style_css_path = FPN_PLUGIN_DIR . 'build/style.css';
        if (!file_exists($style_css_path)) {
            error_log('Flexible Page Navigation: style.css not found at ' . $style_css_path);
            return;
        }

        // Debug: Log file sizes
        error_log('Flexible Page Navigation: block.json size: ' . filesize($block_json_path));
        error_log('Flexible Page Navigation: index.js size: ' . filesize($index_js_path));
        error_log('Flexible Page Navigation: index.css size: ' . filesize($index_css_path));
        error_log('Flexible Page Navigation: style.css size: ' . filesize($style_css_path));

        // Register block
        $result = register_block_type($block_json_path, array(
            'render_callback' => array($this, 'render_navigation_block'),
        ));

        // Debug: Check if block registration was successful
        if (!$result) {
            error_log('Flexible Page Navigation: Failed to register block');
        } else {
            error_log('Flexible Page Navigation: Block registered successfully');

            // Debug: Check if block is available (WordPress 5.0+ compatible)
            if (function_exists('get_block_types')) {
                $blocks = get_block_types();
                if (isset($blocks['flexible-page-navigation/flexible-nav'])) {
                    error_log('Flexible Page Navigation: Block found in registry');
                } else {
                    error_log('Flexible Page Navigation: Block NOT found in registry');
                }
            } else {
                error_log('Flexible Page Navigation: get_block_types() not available (WordPress < 5.0)');
            }
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
        // Check block registration status (WordPress 5.0+ compatible)
        $block_registered = false;
        if (function_exists('get_block_types')) {
            $blocks = get_block_types();
            $block_registered = isset($blocks['flexible-page-navigation/flexible-nav']);
        }

        // Check if build files exist
        $block_json_exists = file_exists(FPN_PLUGIN_DIR . 'build/block.json');
        $index_js_exists = file_exists(FPN_PLUGIN_DIR . 'build/index.js');
        $index_css_exists = file_exists(FPN_PLUGIN_DIR . 'build/index.css');
        $style_css_exists = file_exists(FPN_PLUGIN_DIR . 'build/style.css');

        // Get file sizes
        $block_json_size = $block_json_exists ? filesize(FPN_PLUGIN_DIR . 'build/block.json') : 0;
        $index_js_size = $index_js_exists ? filesize(FPN_PLUGIN_DIR . 'build/index.js') : 0;
        $index_css_size = $index_css_exists ? filesize(FPN_PLUGIN_DIR . 'build/index.css') : 0;
        $style_css_size = $style_css_exists ? filesize(FPN_PLUGIN_DIR . 'build/style.css') : 0;
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
                <td><strong><?php _e('Block Registered', 'flexible-page-navigation'); ?></strong></td>
                <td><?php echo $block_registered ? '<span style="color: green;">✓ Yes</span>' : '<span style="color: red;">✗ No</span>'; ?></td>
            </tr>
            <tr>
                <td><strong><?php _e('Block Name', 'flexible-page-navigation'); ?></strong></td>
                <td>flexible-page-navigation/flexible-nav</td>
            </tr>
        </table>

        <h3><?php _e('Build Files Status', 'flexible-page-navigation'); ?></h3>
        <table class="widefat">
            <tr>
                <td><strong>build/block.json</strong></td>
                <td><?php echo $block_json_exists ? '<span style="color: green;">✓ Exists</span> (' . $block_json_size . ' bytes)' : '<span style="color: red;">✗ Missing</span>'; ?></td>
            </tr>
            <tr>
                <td><strong>build/index.js</strong></td>
                <td><?php echo $index_js_exists ? '<span style="color: green;">✓ Exists</span> (' . $index_js_size . ' bytes)' : '<span style="color: red;">✗ Missing</span>'; ?></td>
            </tr>
            <tr>
                <td><strong>build/index.css</strong></td>
                <td><?php echo $index_css_exists ? '<span style="color: green;">✓ Exists</span> (' . $index_css_size . ' bytes)' : '<span style="color: red;">✗ Missing</span>'; ?></td>
            </tr>
            <tr>
                <td><strong>build/style.css</strong></td>
                <td><?php echo $style_css_exists ? '<span style="color: green;">✓ Exists</span> (' . $style_css_size . ' bytes)' : '<span style="color: red;">✗ Missing</span>'; ?></td>
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
            FPN_VERSION,
            true
        );

        wp_localize_script('flexible-page-navigation-admin', 'fpn_ajax', array(
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('fpn_nonce'),
        ));
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
        $output = '<nav id="' . $block_id . '" class="fpn-navigation fpn-layout-' . esc_attr($column_layout) . '" role="navigation" aria-label="' . __('Page Navigation', 'flexible-page-navigation') . '" data-accordion="' . ($accordion_enabled ? 'true' : 'false') . '" data-columns="' . esc_attr($column_layout) . '" data-hover="' . esc_attr($hover_effect) . '">';

        // Add inline styles including recursive accordion functionality
        $output .= '<style>';

        // Recursive accordion CSS - force this to load
        if ($accordion_enabled) {
            // Depth 0 and 1 are always visible, only hide depth 2+ by default
            $output .= '#' . $block_id . ' .fpn-item .fpn-depth-2, #' . $block_id . ' .fpn-item .fpn-depth-3, #' . $block_id . ' .fpn-item .fpn-depth-4 { display: none !important; }';
            // Show sublevels when parent is expanded - more specific selectors
            $output .= '#' . $block_id . ' .fpn-item.fpn-expanded > .fpn-depth-2, #' . $block_id . ' .fpn-item.fpn-expanded > .fpn-depth-3, #' . $block_id . ' .fpn-item.fpn-expanded > .fpn-depth-4 { display: block !important; }';
            // Also handle nested expanded items
            $output .= '#' . $block_id . ' .fpn-item.fpn-expanded .fpn-item.fpn-expanded > .fpn-depth-3, #' . $block_id . ' .fpn-item.fpn-expanded .fpn-item.fpn-expanded > .fpn-depth-4 { display: block !important; }';
        } else {
            // Non-accordion mode: show all items, but hide children of non-active parents
            $output .= '#' . $block_id . ' .fpn-item .fpn-depth-1, #' . $block_id . ' .fpn-item .fpn-depth-2, #' . $block_id . ' .fpn-item .fpn-depth-3, #' . $block_id . ' .fpn-item .fpn-depth-4 { display: none; }';
            // Show children of active parents
            $output .= '#' . $block_id . ' .fpn-item.fpn-active > .fpn-depth-1, #' . $block_id . ' .fpn-item.fpn-active > .fpn-depth-2, #' . $block_id . ' .fpn-item.fpn-active > .fpn-depth-3, #' . $block_id . ' .fpn-item.fpn-active > .fpn-depth-4 { display: block; }';
            $output .= '#' . $block_id . ' .fpn-item.fpn-active-parent > .fpn-depth-1, #' . $block_id . ' .fpn-item.fpn-active-parent > .fpn-depth-2, #' . $block_id . ' .fpn-item.fpn-active-parent > .fpn-depth-3, #' . $block_id . ' .fpn-item.fpn-active-parent > .fpn-depth-4 { display: block; }';
            // Show children of active children (nested active items)
            $output .= '#' . $block_id . ' .fpn-item.fpn-active .fpn-item.fpn-active > .fpn-depth-2, #' . $block_id . ' .fpn-item.fpn-active .fpn-item.fpn-active > .fpn-depth-3, #' . $block_id . ' .fpn-item.fpn-active .fpn-item.fpn-active > .fpn-depth-4 { display: block; }';
            $output .= '#' . $block_id . ' .fpn-item.fpn-active-parent .fpn-item.fpn-active > .fpn-depth-2, #' . $block_id . ' .fpn-item.fpn-active-parent .fpn-item.fpn-active > .fpn-depth-3, #' . $block_id . ' .fpn-item.fpn-active-parent .fpn-item.fpn-active > .fpn-depth-4 { display: block; }';
        }

        // Toggle button visibility - only for depth 1 and above
        $output .= '#' . $block_id . ' .fpn-depth-1 .fpn-item.fpn-has-children .fpn-toggle, #' . $block_id . ' .fpn-depth-2 .fpn-item.fpn-has-children .fpn-toggle, #' . $block_id . ' .fpn-depth-3 .fpn-item.fpn-has-children .fpn-toggle, #' . $block_id . ' .fpn-depth-4 .fpn-item.fpn-has-children .fpn-toggle { display: flex !important; }';

        // Only add color styles if they are set (not default)
        if ($background_color !== '#f8f9fa' || $text_color !== '#333333' || $active_background_color !== '#007cba' || $active_text_color !== '#ffffff' || $child_active_background_color !== '#e8f4fd' || $child_active_text_color !== '#333333' || $hover_background_color !== 'rgba(0, 0, 0, 0.1)') {
            if ($background_color !== '#f8f9fa') {
                $output .= '#' . $block_id . ' { background-color: ' . esc_attr($background_color) . '; }';
            }
            if ($text_color !== '#333333') {
                $output .= '#' . $block_id . ' .fpn-item a { color: ' . esc_attr($text_color) . '; }';
            }
            if ($active_background_color !== '#007cba' || $active_text_color !== '#ffffff') {
                $output .= '#' . $block_id . ' .fpn-depth-0 > .fpn-item.fpn-active > a { background-color: ' . esc_attr($active_background_color) . '; color: ' . esc_attr($active_text_color) . '; }';
                $output .= '#' . $block_id . ' .fpn-depth-0 > .fpn-item.fpn-active-parent > a { background-color: ' . esc_attr($active_background_color) . '; color: ' . esc_attr($active_text_color) . '; }';
            }
            if ($child_active_background_color !== '#e8f4fd' || $child_active_text_color !== '#333333') {
                $output .= '#' . $block_id . ' .fpn-depth-1 > .fpn-item.fpn-active > a, #' . $block_id . ' .fpn-depth-2 > .fpn-item.fpn-active > a, #' . $block_id . ' .fpn-depth-3 > .fpn-item.fpn-active > a, #' . $block_id . ' .fpn-depth-4 > .fpn-item.fpn-active > a { background-color: ' . esc_attr($child_active_background_color) . '; color: ' . esc_attr($child_active_text_color) . '; }';
                $output .= '#' . $block_id . ' .fpn-depth-1 > .fpn-item.fpn-active-parent > a, #' . $block_id . ' .fpn-depth-2 > .fpn-item.fpn-active-parent > a, #' . $block_id . ' .fpn-depth-3 > .fpn-item.fpn-active-parent > a, #' . $block_id . ' .fpn-depth-4 > .fpn-item.fpn-active-parent > a { background-color: ' . esc_attr($child_active_background_color) . '; color: ' . esc_attr($child_active_text_color) . '; }';
            }
            if ($hover_background_color !== 'rgba(0, 0, 0, 0.1)') {
                $output .= '#' . $block_id . ' { --fpn-hover-bg: ' . esc_attr($hover_background_color) . '; }';
            }
        }

        // Main menu items (depth-0) styling
        if ($main_item_font_weight !== '600' || $main_item_font_size !== 16 || $main_item_text_color !== '#333333') {
            $output .= '#' . $block_id . ' .fpn-depth-0 > .fpn-item > a {';
            if ($main_item_font_weight !== '600') {
                $output .= ' font-weight: ' . esc_attr($main_item_font_weight) . ';';
            }
            if ($main_item_font_size !== 16) {
                $output .= ' font-size: ' . $main_item_font_size . 'px;';
            }
            if ($main_item_text_color !== '#333333') {
                $output .= ' color: ' . esc_attr($main_item_text_color) . ';';
            }
            $output .= ' }';
        }

        // Always apply separator and padding styles
        $output .= '#' . $block_id . ' .fpn-depth-1 > .fpn-item > a { padding-left: ' . $separator_padding . 'px; }';
        $output .= '#' . $block_id . ' .fpn-depth-2 > .fpn-item > a { padding-left: ' . ($separator_padding * 2) . 'px; }';
        $output .= '#' . $block_id . ' .fpn-depth-3 > .fpn-item > a { padding-left: ' . ($separator_padding * 3) . 'px; }';
        $output .= '#' . $block_id . ' .fpn-depth-4 > .fpn-item > a { padding-left: ' . ($separator_padding * 4) . 'px; }';

        // Apply border-left only if separator is enabled
        if ($separator_enabled) {
            $output .= '#' . $block_id . ' .fpn-depth-1 > .fpn-item > a { border-left: ' . $separator_width . 'px solid ' . esc_attr($separator_color) . '; }';
            $output .= '#' . $block_id . ' .fpn-depth-2 > .fpn-item > a { border-left: ' . $separator_width . 'px solid ' . esc_attr($separator_color) . '; }';
            $output .= '#' . $block_id . ' .fpn-depth-3 > .fpn-item > a { border-left: ' . $separator_width . 'px solid ' . esc_attr($separator_color) . '; }';
            $output .= '#' . $block_id . ' .fpn-depth-4 > .fpn-item > a { border-left: ' . $separator_width . 'px solid ' . esc_attr($separator_color) . '; }';
        } else {
            $output .= '#' . $block_id . ' .fpn-depth-1 > .fpn-item > a, #' . $block_id . ' .fpn-depth-2 > .fpn-item > a, #' . $block_id . ' .fpn-depth-3 > .fpn-item > a, #' . $block_id . ' .fpn-depth-4 > .fpn-item > a { border-left: none; }';
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
            $list_attributes[] = 'id="' . $list_id . '"';
        }

        if ($current_depth > 0) {
            $list_attributes[] = 'role="group"';
            $list_attributes[] = 'aria-label="' . __('Submenu', 'flexible-page-navigation') . '"';
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
                $active_style = ' style="padding: ' . $active_padding . 'px;"';
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
