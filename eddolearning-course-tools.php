<?php
/**
 * Plugin Name:       Eddo Learning Course Tools
 * Description:       WordPress blocks for Eddo Learning platform integration - chat and slides embedding for courses
 * Requires at least: 6.6
 * Requires PHP:      7.2
 * Version: 0.0.9
 * Author:           Eddo Learning
 * License:          GPL-2.0-or-later
 * License URI:      https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:      eddolearning
 *
 * @package          eddolearning
 */

namespace EddoLearning;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Registers the blocks and their assets.
 */
function init()
{
    // Register the chat block
    register_block_type(
        __DIR__ . '/build/chat'
    );

    // Register the slides block
    register_block_type(
        __DIR__ . '/build/slides'
    );

    // Register settings
    register_setting('chat_iframe_settings_group', 'chat_iframe_src_url', array(
        'type' => 'string',
        'description' => 'Default Chat Iframe Source URL',
        'sanitize_callback' => 'esc_url_raw',
        'default' => 'https://chat.livelyplant-e406dec0.eastus.azurecontainerapps.io',
    ));
}
add_action('init', __NAMESPACE__ . '\\init');

/**
 * Adds the settings field to the Reading page.
 */
function admin_init()
{
    add_settings_section(
        'chat_iframe_main_section',
        'Chat Iframe Settings',
        null,
        'reading'
    );

    add_settings_field(
        'chat_iframe_src_url_field',
        'Default Chat Iframe Source URL',
        __NAMESPACE__ . '\\render_chat_settings_field',
        'reading',
        'chat_iframe_main_section'
    );
}
add_action('admin_init', __NAMESPACE__ . '\\admin_init');

/**
 * Renders the chat settings field.
 */
function render_chat_settings_field()
{
    $value = get_option('chat_iframe_src_url', 'https://chat.livelyplant-e406dec0.eastus.azurecontainerapps.io');
    printf(
        '<input type="url" id="chat_iframe_src_url" name="chat_iframe_src_url" value="%s" size="50" />',
        esc_attr($value)
    );
}

/**
 * Renders the chat block on the frontend.
 */
function render_chat_block($attributes)
{
    $chat_src = !empty($attributes['chatSrc'])
    ? $attributes['chatSrc']
    : get_option('chat_iframe_src_url', 'https://chat.livelyplant-e406dec0.eastus.azurecontainerapps.io');

    return sprintf(
        '<div class="wp-block-eddo-chat"><iframe src="%s" width="100%%" height="600" frameborder="0" title="Chat Interface"></iframe></div>',
        esc_url($chat_src)
    );
}

/**
 * Renders the slides block on the frontend.
 */
function render_slides_block($attributes)
{
    if (empty($attributes['slidesSrc'])) {
        return '';
    }

    $slides_src = $attributes['slidesSrc'];
    $start_slide = !empty($attributes['startSlide']) ? $attributes['startSlide'] : '1';

    if (strpos($slides_src, 'docs.google.com/presentation') !== false) {
        if (preg_match('/\/d\/([a-zA-Z0-9-_]+)/', $slides_src, $matches)) {
            $presentation_id = $matches[1];
            $slides_src = "https://docs.google.com/presentation/d/{$presentation_id}/embed";
        }
        $separator = strpos($slides_src, '?') !== false ? '&' : '?';
        $iframe_src = $slides_src . $separator . 'start=false&loop=false&delayms=3000';
        if ($start_slide !== '1') {
            $iframe_src .= '&slide=' . urlencode($start_slide);
        }
    } else {
        $separator = strpos($slides_src, '?') !== false ? '&' : '?';
        $iframe_src = $slides_src . $separator . 'start=' . urlencode($start_slide);
    }

    return sprintf(
        '<div class="wp-block-eddo-slides"><iframe src="%s" width="100%%" height="600" frameborder="0" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true" title="Presentation Slides"></iframe></div>',
        esc_url($iframe_src)
    );
}
