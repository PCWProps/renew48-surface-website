<?php
/**
 * Renew48 Astra child theme page-shell contract.
 *
 * The theme owns tokens, page canvas, shell, and accessibility defaults.
 * Gutenberg blocks own editable component content and never choose a page canvas.
 */
defined('ABSPATH') || exit;

const RENEW48_ASTRA_CHILD_VERSION = '0.9.0';
const RENEW48_PRESENTATION_META = '_pcw_presentation_mode';
const RENEW48_THEME_META = '_pcw_liquid_glass_theme';
const RENEW48_MEDIA_META = '_pcw_page_media';

function renew48_presentation_modes(): array {
    return array('contained-desert', 'masked-parallax', 'full-bleed-glass');
}

function renew48_liquid_glass_themes(): array {
    return array(
        'arizona-sky' => array('label' => 'Arizona Sky', 'canvas' => '#edf2f1', 'surface' => '#f5f7f3', 'elevated' => '#dfe9e7', 'glass' => 'rgba(238,246,245,.70)', 'text' => '#173a38', 'muted' => '#526865', 'inverse' => '#fff', 'primary' => '#1f635e', 'secondary' => '#7aa7a0', 'accent' => '#d48745', 'border' => 'rgba(31,99,94,.24)', 'highlight' => 'rgba(255,255,255,.82)', 'glow' => 'rgba(255,193,104,.48)', 'cta' => '#1f635e', 'focus' => '#d48745', 'blur' => '18px', 'opacity' => '.70', 'saturation' => '1.12', 'shadow' => '0 1.5rem 4rem rgba(18,54,51,.18)'),
        'endless-skies' => array('label' => 'Endless Skies', 'canvas' => '#e8eef2', 'surface' => '#f5f8fa', 'elevated' => '#d9e4ec', 'glass' => 'rgba(235,244,250,.68)', 'text' => '#16384d', 'muted' => '#536b79', 'inverse' => '#fff', 'primary' => '#245c7d', 'secondary' => '#6f9ab4', 'accent' => '#d78d46', 'border' => 'rgba(36,92,125,.24)', 'highlight' => 'rgba(255,255,255,.84)', 'glow' => 'rgba(148,210,255,.44)', 'cta' => '#245c7d', 'focus' => '#d78d46', 'blur' => '18px', 'opacity' => '.68', 'saturation' => '1.1', 'shadow' => '0 1.5rem 4rem rgba(20,57,78,.18)'),
        'first-light' => array('label' => 'First Light', 'canvas' => '#fbf2e8', 'surface' => '#fff9f2', 'elevated' => '#f2dfd0', 'glass' => 'rgba(255,248,240,.72)', 'text' => '#423126', 'muted' => '#766356', 'inverse' => '#fff', 'primary' => '#76503c', 'secondary' => '#bd8060', 'accent' => '#d06a3f', 'border' => 'rgba(118,80,60,.22)', 'highlight' => 'rgba(255,255,255,.86)', 'glow' => 'rgba(255,190,119,.46)', 'cta' => '#76503c', 'focus' => '#d06a3f', 'blur' => '17px', 'opacity' => '.72', 'saturation' => '1.08', 'shadow' => '0 1.5rem 4rem rgba(92,58,40,.16)'),
        'jane-aire-dark' => array('label' => 'Jane-Aire Dark', 'canvas' => '#101619', 'surface' => '#1c2528', 'elevated' => '#283438', 'glass' => 'rgba(25,36,40,.72)', 'text' => '#f7f1e8', 'muted' => '#c7c1b6', 'inverse' => '#102023', 'primary' => '#b9d1c1', 'secondary' => '#6f9892', 'accent' => '#e0ad63', 'border' => 'rgba(255,255,255,.25)', 'highlight' => 'rgba(255,255,255,.46)', 'glow' => 'rgba(224,173,99,.46)', 'cta' => '#e0ad63', 'focus' => '#f6d58f', 'blur' => '20px', 'opacity' => '.72', 'saturation' => '1.18', 'shadow' => '0 1.7rem 4rem rgba(0,0,0,.38)'),
        'morning-haze' => array('label' => 'Morning Haze', 'canvas' => '#f1eee9', 'surface' => '#faf9f6', 'elevated' => '#e7e0d7', 'glass' => 'rgba(250,248,243,.73)', 'text' => '#39443f', 'muted' => '#6f756e', 'inverse' => '#fff', 'primary' => '#596b60', 'secondary' => '#a9b4a8', 'accent' => '#be7753', 'border' => 'rgba(89,107,96,.23)', 'highlight' => 'rgba(255,255,255,.86)', 'glow' => 'rgba(255,214,168,.42)', 'cta' => '#596b60', 'focus' => '#be7753', 'blur' => '17px', 'opacity' => '.73', 'saturation' => '1.05', 'shadow' => '0 1.5rem 4rem rgba(65,75,68,.15)'),
        'neon-nights' => array('label' => 'Neon Nights', 'canvas' => '#0b1422', 'surface' => '#17243a', 'elevated' => '#203657', 'glass' => 'rgba(16,34,59,.74)', 'text' => '#f6f8ff', 'muted' => '#b6c6e4', 'inverse' => '#09111e', 'primary' => '#4cb7ff', 'secondary' => '#4269c5', 'accent' => '#f3bb62', 'border' => 'rgba(107,193,255,.34)', 'highlight' => 'rgba(164,221,255,.65)', 'glow' => 'rgba(63,153,255,.54)', 'cta' => '#2a79cb', 'focus' => '#f4d487', 'blur' => '22px', 'opacity' => '.74', 'saturation' => '1.28', 'shadow' => '0 1.8rem 4.5rem rgba(0,10,30,.5)'),
        'red-rocks' => array('label' => 'Red Rocks', 'canvas' => '#f3e9df', 'surface' => '#fbf3eb', 'elevated' => '#e7cabb', 'glass' => 'rgba(250,239,229,.70)', 'text' => '#492f2a', 'muted' => '#795f56', 'inverse' => '#fff', 'primary' => '#8a4d3d', 'secondary' => '#ba7760', 'accent' => '#cf7a3d', 'border' => 'rgba(138,77,61,.25)', 'highlight' => 'rgba(255,255,255,.84)', 'glow' => 'rgba(251,174,107,.44)', 'cta' => '#8a4d3d', 'focus' => '#cf7a3d', 'blur' => '18px', 'opacity' => '.70', 'saturation' => '1.12', 'shadow' => '0 1.5rem 4rem rgba(95,49,34,.17)'),
        'tropical-oasis' => array('label' => 'Tropical Oasis', 'canvas' => '#e7f1eb', 'surface' => '#f3faf5', 'elevated' => '#d0e4d8', 'glass' => 'rgba(235,248,239,.69)', 'text' => '#174339', 'muted' => '#5b756a', 'inverse' => '#fff', 'primary' => '#23705c', 'secondary' => '#65a48b', 'accent' => '#d48c4d', 'border' => 'rgba(35,112,92,.24)', 'highlight' => 'rgba(255,255,255,.84)', 'glow' => 'rgba(147,228,184,.42)', 'cta' => '#23705c', 'focus' => '#d48c4d', 'blur' => '18px', 'opacity' => '.69', 'saturation' => '1.14', 'shadow' => '0 1.5rem 4rem rgba(24,87,68,.17)'),
        'pcwprops' => array('label' => 'PCWProps', 'canvas' => '#06152c', 'surface' => '#0f2343', 'elevated' => '#173b6a', 'glass' => 'rgba(10,28,57,.75)', 'text' => '#f5f8ff', 'muted' => '#c2d1eb', 'inverse' => '#071225', 'primary' => '#1e9bd7', 'secondary' => '#0057d9', 'accent' => '#f2c76b', 'border' => 'rgba(242,199,107,.36)', 'highlight' => 'rgba(255,255,255,.62)', 'glow' => 'rgba(44,147,255,.55)', 'cta' => '#0057d9', 'focus' => '#f2c76b', 'blur' => '22px', 'opacity' => '.75', 'saturation' => '1.3', 'shadow' => '0 1.8rem 4.5rem rgba(0,6,25,.52)'),
    );
}

function renew48_sanitize_media_meta($value): array {
    $value = is_array($value) ? $value : array();
    $position = preg_match('/^(left|center|right)\s+(top|center|bottom)$/', (string) ($value['position'] ?? 'center center')) ? (string) $value['position'] : 'center center';
    $mobile_position = preg_match('/^(left|center|right)\s+(top|center|bottom)$/', (string) ($value['mobilePosition'] ?? $position)) ? (string) ($value['mobilePosition'] ?? $position) : $position;
    $size = in_array(($value['size'] ?? 'cover'), array('cover', 'contain', 'auto'), true) ? $value['size'] : 'cover';
    $overlay = in_array(($value['overlay'] ?? 'medium'), array('none', 'low', 'medium', 'high'), true) ? $value['overlay'] : 'medium';
    return array('url' => esc_url_raw((string) ($value['url'] ?? '')), 'mobileUrl' => esc_url_raw((string) ($value['mobileUrl'] ?? '')), 'position' => $position, 'mobilePosition' => $mobile_position, 'size' => $size, 'overlay' => $overlay, 'alt' => sanitize_text_field((string) ($value['alt'] ?? '')));
}

add_action('after_setup_theme', static function (): void {
    add_theme_support('align-wide');
    add_theme_support('responsive-embeds');
});

add_action('init', static function (): void {
    register_post_meta('page', RENEW48_PRESENTATION_META, array(
        'type' => 'string',
        'single' => true,
        'show_in_rest' => array('schema' => array('type' => 'string', 'enum' => renew48_presentation_modes())),
        'sanitize_callback' => static function ($value): string {
            return in_array($value, renew48_presentation_modes(), true) ? $value : 'contained-desert';
        },
        'auth_callback' => static function (): bool { return current_user_can('edit_pages'); },
        'default' => 'contained-desert',
    ));
    register_post_meta('page', RENEW48_THEME_META, array('type' => 'string', 'single' => true, 'show_in_rest' => array('schema' => array('type' => 'string', 'enum' => array_keys(renew48_liquid_glass_themes()))), 'sanitize_callback' => static function ($value): string { return array_key_exists($value, renew48_liquid_glass_themes()) ? $value : 'arizona-sky'; }, 'auth_callback' => static function (): bool { return current_user_can('edit_pages'); }, 'default' => 'arizona-sky'));
    register_post_meta('page', RENEW48_MEDIA_META, array('type' => 'object', 'single' => true, 'show_in_rest' => true, 'sanitize_callback' => 'renew48_sanitize_media_meta', 'auth_callback' => static function (): bool { return current_user_can('edit_pages'); }, 'default' => array()));
});

add_action('wp_enqueue_scripts', static function (): void {
    wp_enqueue_style('renew48-astra-child', get_stylesheet_uri(), array('astra-theme-css'), RENEW48_ASTRA_CHILD_VERSION);
    wp_enqueue_style('renew48-page-modes', get_stylesheet_directory_uri() . '/assets/page-modes.css', array('renew48-astra-child'), RENEW48_ASTRA_CHILD_VERSION);
    if (!is_singular('page')) return;
    $id = get_queried_object_id();
    $theme = get_post_meta($id, RENEW48_THEME_META, true);
    $theme = array_key_exists($theme, renew48_liquid_glass_themes()) ? $theme : 'arizona-sky';
    $media = renew48_sanitize_media_meta(get_post_meta($id, RENEW48_MEDIA_META, true));
    $theme_tokens = renew48_liquid_glass_themes()[$theme];
    $vars = array('--pcw-page-media' => $media['url'] ? 'url("' . esc_url($media['url']) . '")' : 'none', '--pcw-page-media-mobile' => $media['mobileUrl'] ? 'url("' . esc_url($media['mobileUrl']) . '")' : ($media['url'] ? 'url("' . esc_url($media['url']) . '")' : 'none'), '--pcw-media-position' => $media['position'], '--pcw-media-mobile-position' => $media['mobilePosition'], '--pcw-media-size' => $media['size'], '--pcw-media-overlay' => $media['overlay'] === 'high' ? '76%' : ($media['overlay'] === 'low' ? '30%' : ($media['overlay'] === 'none' ? '0%' : '52%')));
    foreach ($theme_tokens as $key => $value) $vars['--pcw-' . $key] = $value;
    $inline = 'body.pcw-page-shell{' . implode(';', array_map(static fn($key, $value): string => $key . ':' . $value, array_keys($vars), array_values($vars))) . '}';
    wp_add_inline_style('renew48-page-modes', $inline);
});

add_action('enqueue_block_editor_assets', static function (): void {
    wp_enqueue_script(
        'renew48-page-presentation-settings',
        get_stylesheet_directory_uri() . '/assets/page-settings.js',
        array('wp-plugins', 'wp-edit-post', 'wp-element', 'wp-components', 'wp-data', 'wp-i18n'),
        RENEW48_ASTRA_CHILD_VERSION,
        true
    );
});

add_filter('body_class', static function (array $classes): array {
    if (!is_singular('page')) return $classes;
    $mode = get_post_meta(get_queried_object_id(), RENEW48_PRESENTATION_META, true);
    $theme = get_post_meta(get_queried_object_id(), RENEW48_THEME_META, true);
    $classes[] = 'pcw-page-shell';
    $classes[] = 'pcw-canvas-' . sanitize_html_class(in_array($mode, renew48_presentation_modes(), true) ? $mode : 'contained-desert');
    $classes[] = 'pcw-theme-' . sanitize_html_class(array_key_exists($theme, renew48_liquid_glass_themes()) ? $theme : 'arizona-sky');
    return $classes;
});
