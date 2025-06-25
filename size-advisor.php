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

// Đăng ký widget
class Size_Advisor_Widget extends WP_Widget {
    function __construct() {
        parent::__construct(
            'size_advisor_widget',
            'Size Advisor Widget',
            array('description' => 'Công cụ tư vấn chọn size quần áo')
        );
    }

    public function widget($args, $instance) {
        echo $args['before_widget'];
        echo '<div class="size-advisor-widget">';
        echo do_shortcode('[size_advisor]');
        echo '</div>';
        echo $args['after_widget'];
    }
}

function register_size_advisor_widget() {
    register_widget('Size_Advisor_Widget');
}
add_action('widgets_init', 'register_size_advisor_widget');

// Thêm nút tư vấn size vào trang sản phẩm
function add_size_advisor_button() {
    echo '<button class="size-advisor-btn" onclick="openSizeAdvisor()">
        <span class="dashicons dashicons-editor-help"></span>
        Tư vấn chọn size
    </button>';
    
    echo '<div class="size-advisor-overlay" id="sizeAdvisorOverlay" onclick="closeSizeAdvisor()"></div>';
    
    echo '<div class="size-advisor-popup" id="sizeAdvisorPopup">
        <button class="close-popup" onclick="closeSizeAdvisor()">&times;</button>
        ' . do_shortcode('[size_advisor]') . '
    </div>';
}
add_action('woocommerce_after_add_to_cart_form', 'add_size_advisor_button');

// Thêm CSS và JS cho nút và popup
function add_size_advisor_button_styles() {
    if (!is_product()) return;
    ?>
    <style>    .size-advisor-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        margin: 10px 0;
        padding: 12px 25px;
        background: #e31837;
        color: white !important;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        font-size: 15px;
        width: 100%;
        justify-content: center;
        text-transform: uppercase;
        transition: all 0.3s ease;
    }

    .size-advisor-btn:hover {
        background: #c41230;
    }

    .size-advisor-popup {
        display: none;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 1000;
        width: 90%;
        max-width: 600px;
        max-height: 90vh;
        overflow-y: auto;
    }

    .size-advisor-popup.active {
        display: block;
    }

    .size-advisor-overlay {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        z-index: 999;
    }

    .size-advisor-overlay.active {
        display: block;
    }

    .close-popup {
        position: absolute;
        right: 10px;
        top: 10px;
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
    }

    @media (max-width: 768px) {
        .size-advisor-popup {
            width: 95%;
            margin: 10px;
        }
    }
    </style>

    <script>
    function openSizeAdvisor() {
        document.getElementById("sizeAdvisorOverlay").classList.add("active");
        document.getElementById("sizeAdvisorPopup").classList.add("active");
    }
    
    function closeSizeAdvisor() {
        document.getElementById("sizeAdvisorOverlay").classList.remove("active");
        document.getElementById("sizeAdvisorPopup").classList.remove("active");
    }
    </script>
    <?php
}
add_action('wp_footer', 'add_size_advisor_button_styles');
