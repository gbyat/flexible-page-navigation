<?php

/**
 * Plugin Name: Flexible Page Navigation
 * Plugin URI: https://github.com/gbyat/flexible-page-navigation
 * Description: A flexible page navigation block for WordPress with customizable content types, sorting, depth, and child selection options.
 * Version: 1.1.11
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
define('FPN_VERSION', '1.1.11');
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
                'description' => $this->github_response->body,
            ),
            'download_link' => $this->github_response->zipball_url,
        );

        return (object) $plugin_data;
    }

    public function after_install($response, $hook_extra, $result)
    {
        global $wp_filesystem;
        $install_directory = plugin_dir_path($this->file);
        $wp_filesystem->move($result['destination'], $install_directory);
        $result['destination'] = $install_directory;

        // Clear plugin data cache to force reload of plugin information
        delete_plugins_cache();

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
        add_action('init', array($this, 'init'));
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
        load_plugin_textdomain('flexible-page-navigation', false, dirname(plugin_basename(__FILE__)) . '/languages');

        // Register block
        register_block_type(FPN_PLUGIN_DIR . 'build/block.json', array(
            'render_callback' => array($this, 'render_navigation_block'),
        ));

        // Enqueue block editor assets
        add_action('enqueue_block_editor_assets', array($this, 'enqueue_block_editor_assets'));
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
        $active_tab = isset($_GET['tab']) ? sanitize_text_field($_GET['tab']) : 'settings';
?>
        <div class="wrap">
            <h1><?php _e('Flexible Page Navigation', 'flexible-page-navigation'); ?></h1>

            <nav class="nav-tab-wrapper">
                <a href="?page=flexible-page-navigation&tab=settings" class="nav-tab <?php echo $active_tab === 'settings' ? 'nav-tab-active' : ''; ?>">
                    <?php _e('Settings', 'flexible-page-navigation'); ?>
                </a>
                <a href="?page=flexible-page-navigation&tab=debug" class="nav-tab <?php echo $active_tab === 'debug' ? 'nav-tab-active' : ''; ?>">
                    <?php _e('Debug Info', 'flexible-page-navigation'); ?>
                </a>
            </nav>

            <div class="tab-content">
                <?php
                switch ($active_tab) {
                    case 'settings':
                        $this->settings_tab();
                        break;
                    case 'debug':
                        $this->debug_tab();
                        break;
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

        <h3><?php _e('Actions', 'flexible-page-navigation'); ?></h3>
        <p>
            <button type="button" class="button" id="test-github-api">
                <?php _e('Test GitHub API', 'flexible-page-navigation'); ?>
            </button>
            <button type="button" class="button" id="clear-cache">
                <?php _e('Clear Cache', 'flexible-page-navigation'); ?>
            </button>
            <a href="<?php echo admin_url('admin-post.php?action=fpn_github_updater_delete_transients'); ?>" class="button">
                <?php _e('Delete Transients', 'flexible-page-navigation'); ?>
            </a>
        </p>

        <div id="api-test-result"></div>
<?php
    }

    public function test_github_api()
    {
        $token = get_option('fpn_github_token');
        if (!$token) {
            wp_die(__('GitHub token not set', 'flexible-page-navigation'));
        }

        $args = array(
            'headers' => array(
                'Authorization' => 'token ' . $token,
                'Accept' => 'application/vnd.github.v3+json',
            ),
        );

        $response = wp_remote_get('https://api.github.com/repos/' . FPN_GITHUB_REPO . '/releases/latest', $args);

        if (is_wp_error($response)) {
            wp_send_json_error($response->get_error_message());
        }

        $body = json_decode(wp_remote_retrieve_body($response));
        wp_send_json_success($body);
    }

    public function clear_cache()
    {
        delete_transient('fpn_github_updater_' . plugin_basename(__FILE__));
        wp_send_json_success(__('Cache cleared successfully', 'flexible-page-navigation'));
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
            FPN_PLUGIN_URL . 'build/frontend.js',
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
            FPN_PLUGIN_URL . 'build/admin.js',
            array('jquery'),
            FPN_VERSION,
            true
        );

        wp_localize_script('flexible-page-navigation-admin', 'fpn_ajax', array(
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('fpn_nonce'),
        ));
    }

    public function enqueue_block_editor_assets()
    {
        wp_enqueue_script(
            'flexible-page-navigation-block-editor',
            FPN_PLUGIN_URL . 'build/index.js',
            array('wp-blocks', 'wp-block-editor', 'wp-components', 'wp-element', 'wp-i18n'),
            FPN_VERSION
        );

        wp_enqueue_style(
            'flexible-page-navigation-block-editor',
            FPN_PLUGIN_URL . 'build/index.css',
            array(),
            FPN_VERSION
        );
    }

    public function render_navigation_block($attributes)
    {
        $content_type = isset($attributes['contentType']) ? $attributes['contentType'] : 'pages';
        $sort_by = isset($attributes['sortBy']) ? $attributes['sortBy'] : 'menu_order';
        $sort_order = isset($attributes['sortOrder']) ? $attributes['sortOrder'] : 'ASC';
        $depth = isset($attributes['depth']) ? intval($attributes['depth']) : 2;
        $child_selection = isset($attributes['childSelection']) ? $attributes['childSelection'] : 'current';
        $parent_page_id = isset($attributes['parentPageId']) ? intval($attributes['parentPageId']) : 0;
        $accordion_enabled = isset($attributes['accordionEnabled']) ? $attributes['accordionEnabled'] : true;
        $background_color = isset($attributes['backgroundColor']) ? $attributes['backgroundColor'] : '#f8f9fa';
        $text_color = isset($attributes['textColor']) ? $attributes['textColor'] : '#333333';
        $active_background_color = isset($attributes['activeBackgroundColor']) ? $attributes['activeBackgroundColor'] : '#007cba';
        $active_text_color = isset($attributes['activeTextColor']) ? $attributes['activeTextColor'] : '#ffffff';

        // Get current page ID
        $current_page_id = get_queried_object_id();

        // Determine parent page for navigation
        $nav_parent_id = 0;
        if ($child_selection === 'custom' && $parent_page_id > 0) {
            $nav_parent_id = $parent_page_id;
        } elseif ($child_selection === 'current') {
            $nav_parent_id = $current_page_id;
        }

        // Get pages
        $args = array(
            'post_type' => $content_type,
            'post_status' => 'publish',
            'posts_per_page' => -1,
            'orderby' => $sort_by,
            'order' => $sort_order,
            'hierarchical' => true,
        );

        if ($nav_parent_id > 0) {
            $args['post_parent'] = $nav_parent_id;
        }

        $pages = get_posts($args);

        if (empty($pages)) {
            return '<div class="fpn-navigation fpn-no-pages">' . __('No pages found.', 'flexible-page-navigation') . '</div>';
        }

        // Build navigation HTML
        $output = '<div class="fpn-navigation" data-accordion="' . ($accordion_enabled ? 'true' : 'false') . '">';
        $output .= '<style>';
        $output .= '.fpn-navigation { background-color: ' . esc_attr($background_color) . '; color: ' . esc_attr($text_color) . '; padding: 1rem; }';
        $output .= '.fpn-navigation .fpn-item a { color: ' . esc_attr($text_color) . '; }';
        $output .= '.fpn-navigation .fpn-item.fpn-active > a { background-color: ' . esc_attr($active_background_color) . '; color: ' . esc_attr($active_text_color) . '; }';
        $output .= '.fpn-navigation .fpn-item.fpn-active-parent > a { background-color: ' . esc_attr($active_background_color) . '; color: ' . esc_attr($active_text_color) . '; }';
        $output .= '</style>';

        $output .= $this->build_navigation_tree($pages, $current_page_id, $depth, 0);

        $output .= '</div>';

        return $output;
    }

    private function build_navigation_tree($pages, $current_page_id, $max_depth, $current_depth)
    {
        if ($current_depth >= $max_depth) {
            return '';
        }

        $output = '<ul class="fpn-list fpn-depth-' . $current_depth . '">';

        foreach ($pages as $page) {
            $is_active = ($page->ID == $current_page_id);
            $has_children = $this->has_children($page->ID);
            $is_parent_active = $this->is_parent_active($page->ID, $current_page_id);

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
            $output .= '<a href="' . get_permalink($page->ID) . '">' . esc_html($page->post_title) . '</a>';

            if ($has_children && $current_depth < $max_depth - 1) {
                $children = get_posts(array(
                    'post_type' => $page->post_type,
                    'post_status' => 'publish',
                    'posts_per_page' => -1,
                    'orderby' => 'menu_order',
                    'order' => 'ASC',
                    'post_parent' => $page->ID,
                ));

                if (!empty($children)) {
                    $output .= $this->build_navigation_tree($children, $current_page_id, $max_depth, $current_depth + 1);
                }
            }

            $output .= '</li>';
        }

        $output .= '</ul>';
        return $output;
    }

    private function has_children($page_id)
    {
        $children = get_posts(array(
            'post_type' => 'page',
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
