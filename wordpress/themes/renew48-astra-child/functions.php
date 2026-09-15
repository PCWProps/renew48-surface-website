<?php
/**
 * Renew48 Astra child theme page-shell contract.
 *
 * The theme owns tokens, page canvas, shell, and accessibility defaults.
 * Gutenberg blocks own editable component content and never choose a page canvas.
 */
defined('ABSPATH') || exit;

const RENEW48_ASTRA_CHILD_VERSION = '0.7.0';
const RENEW48_PRESENTATION_META = '_pcw_presentation_mode';

function renew48_presentation_modes(): array {
    return array('contained-desert', 'masked-parallax', 'full-bleed-glass');
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
});

add_action('wp_enqueue_scripts', static function (): void {
    wp_enqueue_style('renew48-astra-child', get_stylesheet_uri(), array('astra-theme-css'), RENEW48_ASTRA_CHILD_VERSION);
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
    $classes[] = 'pcw-canvas-' . sanitize_html_class(in_array($mode, renew48_presentation_modes(), true) ? $mode : 'contained-desert');
    return $classes;
});
