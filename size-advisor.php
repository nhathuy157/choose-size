<?php
/*
Plugin Name: Size Advisor
Description: Tư vấn chọn Size quần áo
Version: 1.0
Author: Your Name
*/

if (!defined('ABSPATH')) exit;

function size_advisor_enqueue_scripts() {
    wp_enqueue_style('size-advisor-style', plugins_url('styles.css', __FILE__));
    wp_enqueue_script('size-data', plugins_url('sizeData.js', __FILE__), array(), '1.0', true);
    wp_enqueue_script('size-advisor', plugins_url('app.js', __FILE__), array('jquery', 'size-data'), '1.0', true);
}
add_action('wp_enqueue_scripts', 'size_advisor_enqueue_scripts');

function size_advisor_shortcode() {
    ob_start();
    include plugin_dir_path(__FILE__) . 'index.html';
    return ob_get_clean();
}
add_shortcode('size_advisor', 'size_advisor_shortcode');

// Add menu item to WordPress admin
function size_advisor_admin_menu() {
    add_menu_page(
        'Size Advisor Settings',
        'Size Advisor',
        'manage_options',
        'size-advisor',
        'size_advisor_settings_page',
        'dashicons-calculator'
    );
}
add_action('admin_menu', 'size_advisor_admin_menu');

// Create the settings page
function size_advisor_settings_page() {
    ?>
    <div class="wrap">
        <h2>Size Advisor Settings</h2>
        <form method="post" action="options.php">
            <?php
            settings_fields('size-advisor-settings');
            do_settings_sections('size-advisor-settings');
            submit_button();
            ?>
        </form>
    </div>
    <?php
}

// Register settings
function size_advisor_register_settings() {
    register_setting('size-advisor-settings', 'size_advisor_settings');
    
    add_settings_section(
        'size_advisor_main_section',
        'Main Settings',
        null,
        'size-advisor-settings'
    );
    
    add_settings_field(
        'size_advisor_display_mode',
        'Display Mode',
        'size_advisor_display_mode_callback',
        'size-advisor-settings',
        'size_advisor_main_section'
    );
}
add_action('admin_init', 'size_advisor_register_settings');

function size_advisor_display_mode_callback() {
    $options = get_option('size_advisor_settings');
    ?>
    <select name="size_advisor_settings[display_mode]">
        <option value="grid" <?php selected($options['display_mode'], 'grid'); ?>>Grid View</option>
        <option value="list" <?php selected($options['display_mode'], 'list'); ?>>List View</option>
    </select>
    <?php
}
