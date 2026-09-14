<?php
/**
 * Plugin Name: PCW Renew48 Blocks
 * Description: Shared, privacy-safe Gutenberg block system for Renew48, ChiroGoAZ, and AromaHMT.
 * Version: 0.4.0
 * Requires at least: 6.5
 * Requires PHP: 8.1
 * Text Domain: pcw-renew48
 */

defined('ABSPATH') || exit;

final class PCW_Renew48_Blocks {
    private const VERSION = '0.4.0';
    private const UNLEASHED_MIGRATION = 'pcw_renew48_unleashed_standard_blocks_040';
    private const CACHE_GROUP = 'pcw_renew48_public';

    private const BLOCKS = array(
        'container', 'section', 'grid', 'flex-row', 'flex-column', 'spacer', 'divider',
        'hero-primary', 'hero-split', 'hero-video', 'hero-service', 'cta-banner',
        'service-card', 'service-grid', 'service-detail', 'service-comparison', 'service-accordion',
        'membership-tier', 'membership-comparison', 'membership-benefits', 'membership-cta',
        'booking-widget', 'availability-preview', 'lead-form', 'consultation-cta', 'funnel-step',
        'faq-accordion', 'testimonial-slider', 'blog-preview', 'education-grid',
        'glass-panel', 'liquid-glass', 'acrylic-card', 'neon-accent', 'parallax-layer', 'hover-reveal', 'scroll-reveal',
        'header-cta', 'footer-columns', 'navigation-panel', 'breadcrumbs', 'alert-banner', 'unleashed-article',
    );

    public static function boot(): void {
        add_action('init', array(__CLASS__, 'register'));
        add_action('init', array(__CLASS__, 'register_patterns'));
        add_action('rest_api_init', array(__CLASS__, 'register_rest'));
        add_action('admin_init', array(__CLASS__, 'migrate_unleashed_page'));
    }

    public static function register(): void {
        wp_register_script('pcw-renew48-blocks-editor', plugins_url('assets/editor.js', __FILE__), array('wp-blocks', 'wp-element', 'wp-components', 'wp-block-editor', 'wp-i18n', 'wp-server-side-render'), self::VERSION, true);
        wp_register_script('pcw-renew48-blocks-view', plugins_url('assets/view.js', __FILE__), array(), self::VERSION, true);
        wp_register_style('pcw-renew48-blocks', plugins_url('assets/blocks.css', __FILE__), array(), self::VERSION);
        wp_register_style('pcw-renew48-unleashed', plugins_url('assets/unleashed.css', __FILE__), array('pcw-renew48-blocks'), self::VERSION);
        wp_register_style('pcw-renew48-approved-artwork', plugins_url('assets/approved-artwork.css', __FILE__), array('pcw-renew48-unleashed'), self::VERSION);
        wp_register_style('pcw-renew48-unleashed-layered', plugins_url('assets/unleashed-layered.css', __FILE__), array('pcw-renew48-approved-artwork'), self::VERSION);
        wp_register_style('pcw-renew48-unleashed-standard', plugins_url('assets/unleashed-standard.css', __FILE__), array(), self::VERSION);
        wp_enqueue_style('pcw-renew48-unleashed');
        wp_enqueue_style('pcw-renew48-approved-artwork');
        wp_enqueue_style('pcw-renew48-unleashed-layered');
        wp_enqueue_style('pcw-renew48-unleashed-standard');

        foreach (self::BLOCKS as $slug) {
            register_block_type('renew48/' . $slug, array(
                'api_version' => 3,
                'editor_script' => 'pcw-renew48-blocks-editor',
                'style' => 'pcw-renew48-blocks',
                'editor_style' => 'pcw-renew48-unleashed-layered',
                'view_script' => 'pcw-renew48-blocks-view',
                'render_callback' => array(__CLASS__, 'render_block'),
                'attributes' => self::attributes($slug),
                'supports' => array('anchor' => true, 'align' => array('wide', 'full'), 'html' => false, 'color' => array('text' => true, 'background' => true)),
            ));
        }
    }

    private static function attributes(string $slug): array {
        return array(
            'title' => array('type' => 'string', 'default' => self::label($slug)),
            'eyebrow' => array('type' => 'string', 'default' => ''),
            'body' => array('type' => 'string', 'default' => ''),
            'ctaLabel' => array('type' => 'string', 'default' => ''),
            'ctaUrl' => array('type' => 'string', 'default' => ''),
            'source' => array('type' => 'string', 'default' => ''),
            'site' => array('type' => 'string', 'default' => ''),
            'variant' => array('type' => 'string', 'default' => 'default'),
            'items' => array('type' => 'array', 'default' => array()),
            'level' => array('type' => 'integer', 'default' => 2),
        );
    }

    public static function render_block(array $attributes, string $content, $block): string {
        $slug = isset($block->name) ? str_replace('renew48/', '', $block->name) : 'section';
        if ($slug === 'unleashed-article') return self::render_unleashed_article($attributes);
        $tag = in_array($slug, array('container', 'section', 'grid', 'flex-row', 'flex-column', 'spacer', 'divider'), true) ? 'div' : 'section';
        $title = trim((string) ($attributes['title'] ?? ''));
        $body = trim((string) ($attributes['body'] ?? ''));
        $source = sanitize_key((string) ($attributes['source'] ?? ''));
        $data = $source ? self::public_projection($source, sanitize_key((string) ($attributes['site'] ?? ''))) : null;
        if (is_array($data)) {
            $title = $data['title'] ?? $title;
            $body = $data['body'] ?? $body;
        }
        $classes = array('pcw-r48-block', 'pcw-r48-' . sanitize_html_class($slug), 'is-variant-' . sanitize_html_class((string) ($attributes['variant'] ?? 'default')));
        $attrs = get_block_wrapper_attributes(array('class' => implode(' ', $classes), 'data-pcw-reveal' => in_array($slug, array('scroll-reveal', 'hero-primary', 'hero-split', 'cta-banner'), true) ? 'true' : null));
        $heading = min(6, max(2, (int) ($attributes['level'] ?? 2)));
        $out = '<' . $tag . ' ' . $attrs . '>';
        if (!empty($attributes['eyebrow'])) $out .= '<p class="pcw-r48-eyebrow">' . esc_html($attributes['eyebrow']) . '</p>';
        if ($title !== '') $out .= '<h' . $heading . '>' . esc_html($title) . '</h' . $heading . '>';
        if ($body !== '') $out .= '<div class="pcw-r48-body">' . wp_kses_post(wpautop($body)) . '</div>';
        $out .= self::render_items($attributes['items'] ?? array(), $slug);
        if (!empty($attributes['ctaLabel']) && !empty($attributes['ctaUrl'])) $out .= '<a class="pcw-r48-cta" href="' . esc_url($attributes['ctaUrl']) . '">' . esc_html($attributes['ctaLabel']) . '</a>';
        if ($content !== '') $out .= '<div class="pcw-r48-inner">' . $content . '</div>';
        return $out . '</' . $tag . '>';
    }

    private static function render_unleashed_article(array $attributes): string {
        ob_start();
        include __DIR__ . '/templates/unleashed-article.php';
        return (string) ob_get_clean();
    }

    private static function render_items($items, string $slug): string {
        if (!is_array($items) || $items === array()) return '';
        $html = '<div class="pcw-r48-items">';
        foreach ($items as $item) {
            if (!is_array($item)) continue;
            $html .= '<article class="pcw-r48-item"><h3>' . esc_html((string) ($item['title'] ?? '')) . '</h3>';
            if (!empty($item['body'])) $html .= '<p>' . esc_html((string) $item['body']) . '</p>';
            if (!empty($item['url']) && !empty($item['label'])) $html .= '<a href="' . esc_url((string) $item['url']) . '">' . esc_html((string) $item['label']) . '</a>';
            $html .= '</article>';
        }
        return $html . '</div>';
    }

    /** Public, non-PHI API projection; fail closed when no approved API is configured. */
    private static function public_projection(string $source, string $site): ?array {
        $base = rtrim((string) get_option('pcw_renew48_public_api_base', ''), '/');
        if ($base === '') return null;
        $cache_key = 'projection_' . md5($base . '|' . $source . '|' . $site);
        $cached = wp_cache_get($cache_key, self::CACHE_GROUP);
        if (is_array($cached)) return $cached;
        $response = wp_remote_get($base . '/v1/public/' . rawurlencode($source) . '?site=' . rawurlencode($site), array('timeout' => 3, 'redirection' => 0, 'headers' => array('Accept' => 'application/json')));
        if (is_wp_error($response) || wp_remote_retrieve_response_code($response) !== 200) return null;
        $decoded = json_decode((string) wp_remote_retrieve_body($response), true);
        if (!is_array($decoded) || !isset($decoded['data']) || !is_array($decoded['data'])) return null;
        wp_cache_set($cache_key, $decoded['data'], self::CACHE_GROUP, 300);
        return $decoded['data'];
    }

    public static function register_rest(): void {
        register_rest_route('pcw-renew48/v1', '/health', array('methods' => 'GET', 'permission_callback' => '__return_true', 'callback' => static fn() => new WP_REST_Response(array('status' => 'ok', 'version' => self::VERSION), 200)));
    }

    public static function register_patterns(): void {
        register_block_pattern_category('renew48', array('label' => __('Renew48', 'pcw-renew48')));
        $patterns = array(
            'home' => 'Home Page', 'service-landing' => 'Service Landing', 'membership-landing' => 'Membership Landing', 'booking-funnel' => 'Booking Funnel',
            'about' => 'About Page', 'contact' => 'Contact Page', 'blog-archive' => 'Blog Archive', 'blog-single' => 'Blog Single', 'faq' => 'FAQ Page',
            'header-cobranded' => 'CoBranded Header', 'header-chiro' => 'ChiroGoAZ Header', 'header-aroma' => 'AromaHMT Header',
            'footer-cobranded' => 'CoBranded Footer', 'footer-chiro' => 'ChiroGoAZ Footer', 'footer-aroma' => 'AromaHMT Footer', 'booking-privacy-modal' => 'Booking Privacy Modal',
        );
        foreach ($patterns as $slug => $title) {
            register_block_pattern('renew48/' . $slug, array('title' => __($title, 'pcw-renew48'), 'categories' => array('renew48'), 'content' => self::pattern_content($slug)));
        }
    }

    private static function pattern_content(string $slug): string {
        if (str_starts_with($slug, 'header-')) return '<!-- wp:renew48/navigation-panel {"title":"' . esc_attr($slug === 'header-chiro' ? 'ChiroGoAZ' : ($slug === 'header-aroma' ? 'AromaHMT' : 'Renew48')) . '","eyebrow":"Desert Wellness","ctaLabel":"' . esc_attr($slug === 'header-chiro' ? 'Book Chiropractic Evaluation' : ($slug === 'header-aroma' ? 'Book Massage' : 'Book Now')) . '"} /-->';
        if (str_starts_with($slug, 'footer-')) return '<!-- wp:renew48/footer-columns {"title":"' . esc_attr($slug === 'footer-chiro' ? 'ChiroGoAZ' : ($slug === 'footer-aroma' ? 'AromaHMT' : 'Renew48')) . '","body":"Services · Memberships · Booking · Shop · Blog · Legal"} /-->';
        if ($slug === 'booking-privacy-modal') return '<!-- wp:renew48/navigation-panel {"title":"Booking stays secure","body":"Continue to the approved Jane booking experience. Do not include clinical details in this site.","ctaLabel":"Continue to booking"} /-->';
        if ($slug === 'blog-single') return self::unleashed_standard_content();
        $titles = array('home' => 'Whole-person wellness, in one clear next step.', 'service-landing' => 'Care designed around your next step.', 'membership-landing' => 'Choose support that lasts.', 'booking-funnel' => 'Booking stays secure in Jane.', 'about' => 'A more connected kind of care.', 'contact' => 'Start the conversation.', 'blog-archive' => 'Unleashed: Body, Mind, Soul.', 'blog-single' => 'A grounded note for your wellness journey.', 'faq' => 'Questions, answered clearly.');
        return '<!-- wp:renew48/hero-primary {"title":"' . esc_attr($titles[$slug]) . '","eyebrow":"Renew48"} /-->' . "\n" . '<!-- wp:renew48/section {"title":"' . esc_attr($slug === 'booking-funnel' ? 'What happens next' : 'Explore your path') . '"} /-->' . "\n" . '<!-- wp:renew48/cta-banner {"title":"Ready when you are"} /-->';
    }

    private static function label(string $slug): string { return ucwords(str_replace('-', ' ', $slug)); }

    private static function unleashed_standard_content(): string {
        $asset_base = plugins_url('assets/unleashed-v2/', __FILE__);
        return (string) include __DIR__ . '/patterns/unleashed-standard.php';
    }

    /**
     * Replace only the legacy Unleashed custom block. Existing hand-built page
     * content is never overwritten; when no legacy page exists a draft is made.
     */
    public static function migrate_unleashed_page(): void {
        if (get_option(self::UNLEASHED_MIGRATION) === self::VERSION) return;
        if (!current_user_can('edit_pages')) return;

        $legacy = get_posts(array(
            'post_type' => 'page',
            'post_status' => array('publish', 'draft', 'pending', 'private'),
            'posts_per_page' => 20,
            's' => 'Unleashed',
        ));
        foreach ($legacy as $page) {
            if (!has_block('renew48/unleashed-article', $page->post_content)) continue;
            wp_update_post(array(
                'ID' => $page->ID,
                'post_content' => self::unleashed_standard_content(),
            ));
            update_post_meta($page->ID, '_pcw_renew48_unleashed_standard', self::VERSION);
            update_option(self::UNLEASHED_MIGRATION, self::VERSION, false);
            return;
        }

        $page_id = wp_insert_post(array(
            'post_type' => 'page',
            'post_status' => 'draft',
            'post_title' => 'Unleashed — Committed to Wellness',
            'post_name' => 'unleashed-committed-to-wellness-preview',
            'post_content' => self::unleashed_standard_content(),
        ));
        if (!is_wp_error($page_id)) {
            update_post_meta($page_id, '_pcw_renew48_unleashed_standard', self::VERSION);
            update_option(self::UNLEASHED_MIGRATION, self::VERSION, false);
        }
    }
}

PCW_Renew48_Blocks::boot();
