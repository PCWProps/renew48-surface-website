<?php
/**
 * Plugin Name: PCW Renew48 Blocks
 * Description: Shared, privacy-safe Gutenberg block system for Renew48, ChiroGoAZ, and AromaHMT.
 * Version: 0.8.0
 * Requires at least: 6.5
 * Requires PHP: 8.1
 * Text Domain: pcw-renew48
 */

defined('ABSPATH') || exit;

require_once __DIR__ . '/includes/class-pcw-renew48-visual-renderers.php';

final class PCW_Renew48_Blocks {
    private const VERSION = '0.8.0';
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
        'header-cta', 'footer-columns', 'navigation-panel', 'breadcrumbs', 'alert-banner',
        'cinematic-hero', 'immersive-service-galaxy', 'service-galaxy-card', 'wellness-path-development',
        'committed-wellness-flow', 'referral-program-flow', 'funnel-flow', 'funnel-choice', 'conversion-carousel',
        'carousel-slide', 'modal-trigger', 'privacy-handoff',
        'collective-header', 'mobile-menu-drawer', 'collective-footer', 'brand-directory', 'directory-filter',
        'service-masonry', 'service-detail-panel', 'benefit-strip', 'promo-banner', 'location-hours', 'pricing-grid',
        'gallery-lightbox', 'tabbed-content', 'newsletter-capture', 'social-proof-strip', 'booking-handoff',
        'commerce-handoff', 'toast-notice', 'back-to-top', 'contract-suite', 'unleashed-article',
    );

    public static function boot(): void {
        add_action('init', array(__CLASS__, 'register'));
        add_action('init', array(__CLASS__, 'register_patterns'));
        add_action('rest_api_init', array(__CLASS__, 'register_rest'));
        add_action('admin_init', array(__CLASS__, 'migrate_unleashed_page'));
        add_action('wp_enqueue_scripts', array(__CLASS__, 'enqueue_public_assets'));
    }

    public static function register(): void {
        wp_register_script('pcw-renew48-blocks-editor', plugins_url('assets/editor.js', __FILE__), array('wp-blocks', 'wp-element', 'wp-components', 'wp-block-editor', 'wp-i18n', 'wp-server-side-render'), self::VERSION, true);
        wp_register_script('pcw-renew48-blocks-view', plugins_url('assets/view.js', __FILE__), array(), self::VERSION, true);
        wp_register_style('pcw-renew48-blocks', plugins_url('assets/blocks.css', __FILE__), array(), self::VERSION);
        wp_register_style('pcw-renew48-unleashed', plugins_url('assets/unleashed.css', __FILE__), array('pcw-renew48-blocks'), self::VERSION);
        wp_register_style('pcw-renew48-approved-artwork', plugins_url('assets/approved-artwork.css', __FILE__), array('pcw-renew48-unleashed'), self::VERSION);
        wp_register_style('pcw-renew48-unleashed-layered', plugins_url('assets/unleashed-layered.css', __FILE__), array('pcw-renew48-approved-artwork'), self::VERSION);
        wp_register_style('pcw-renew48-unleashed-standard', plugins_url('assets/unleashed-standard.css', __FILE__), array(), self::VERSION);
        wp_register_style('pcw-renew48-ui-kit', plugins_url('assets/ui-kit.css', __FILE__), array('pcw-renew48-blocks'), self::VERSION);
        wp_register_style('pcw-renew48-visual-components', plugins_url('assets/visual-components.css', __FILE__), array('pcw-renew48-blocks'), self::VERSION);
        wp_register_style('pcw-renew48-composition', plugins_url('assets/composition.css', __FILE__), array('pcw-renew48-visual-components'), self::VERSION);
        wp_enqueue_style('pcw-renew48-unleashed');
        wp_enqueue_style('pcw-renew48-approved-artwork');
        wp_enqueue_style('pcw-renew48-unleashed-layered');
        wp_enqueue_style('pcw-renew48-unleashed-standard');
        wp_enqueue_style('pcw-renew48-ui-kit');
        wp_enqueue_style('pcw-renew48-visual-components');
        wp_enqueue_style('pcw-renew48-composition');

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

    public static function enqueue_public_assets(): void {
        wp_enqueue_style('pcw-renew48-unleashed-standard');
        wp_enqueue_style('pcw-renew48-ui-kit');
        wp_enqueue_style('pcw-renew48-visual-components');
        wp_enqueue_style('pcw-renew48-composition');
        wp_enqueue_script('pcw-renew48-blocks-view');
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
            'theme' => array('type' => 'string', 'default' => 'cobranded'),
            'mediaUrl' => array('type' => 'string', 'default' => ''),
            'mediaAlt' => array('type' => 'string', 'default' => ''),
            'interaction' => array('type' => 'string', 'default' => 'reveal'),
            'surface' => array('type' => 'string', 'default' => 'solid'),
            'density' => array('type' => 'string', 'default' => 'comfortable'),
            'layout' => array('type' => 'string', 'default' => 'auto'),
            'animation' => array('type' => 'string', 'default' => 'reveal'),
            'funnelId' => array('type' => 'string', 'default' => ''),
            'handoff' => array('type' => 'string', 'default' => ''),
            'formAction' => array('type' => 'string', 'default' => ''),
            'items' => array('type' => 'array', 'default' => array()),
            'level' => array('type' => 'integer', 'default' => 2),
        );
    }

    public static function render_block(array $attributes, string $content, $block): string {
        $slug = isset($block->name) ? str_replace('renew48/', '', $block->name) : 'section';
        if ($slug === 'unleashed-article') return self::render_unleashed_article($attributes);
        $tag = in_array($slug, array('container', 'section', 'grid', 'flex-row', 'flex-column', 'spacer', 'divider', 'service-galaxy-card', 'carousel-slide', 'funnel-choice'), true) ? 'div' : 'section';
        $title = trim((string) ($attributes['title'] ?? ''));
        $body = trim((string) ($attributes['body'] ?? ''));
        $source = sanitize_key((string) ($attributes['source'] ?? ''));
        $data = $source ? self::public_projection($source, sanitize_key((string) ($attributes['site'] ?? ''))) : null;
        if (is_array($data)) {
            $title = $data['title'] ?? $title;
            $body = $data['body'] ?? $body;
        }
        $classes = array('pcw-r48-block', 'pcw-r48-' . sanitize_html_class($slug), 'is-variant-' . sanitize_html_class((string) ($attributes['variant'] ?? 'default')), 'is-theme-' . sanitize_html_class((string) ($attributes['theme'] ?? 'cobranded')), 'is-surface-' . sanitize_html_class((string) ($attributes['surface'] ?? 'solid')), 'is-density-' . sanitize_html_class((string) ($attributes['density'] ?? 'comfortable')), 'is-layout-' . sanitize_html_class((string) ($attributes['layout'] ?? 'auto')), 'is-animation-' . sanitize_html_class((string) ($attributes['animation'] ?? 'reveal')));
        $is_reveal = (string) ($attributes['animation'] ?? 'reveal') !== 'none' && in_array($slug, array('scroll-reveal', 'hero-primary', 'hero-split', 'cta-banner', 'cinematic-hero', 'immersive-service-galaxy', 'wellness-path-development', 'committed-wellness-flow', 'referral-program-flow', 'funnel-flow'), true);
        $is_carousel = in_array($slug, array('testimonial-slider', 'conversion-carousel'), true);
        $funnel_id = sanitize_key((string) ($attributes['funnelId'] ?? self::funnel_id_for_slug($slug)));
        $attrs = get_block_wrapper_attributes(array('class' => implode(' ', $classes), 'data-pcw-reveal' => $is_reveal ? 'true' : null, 'data-pcw-carousel' => $is_carousel ? 'true' : null, 'data-pcw-modal' => $slug === 'modal-trigger' ? 'true' : null, 'data-funnel' => $funnel_id ?: null, 'data-pcw-interaction' => sanitize_key((string) ($attributes['interaction'] ?? 'reveal'))));
        $heading = min(6, max(2, (int) ($attributes['level'] ?? 2)));
        $component = PCW_Renew48_Visual_Renderers::render($slug, $attributes, $attrs, $title, $body, $heading, trim((string) ($attributes['ctaUrl'] ?? '')) ?: self::handoff_url((string) ($attributes['handoff'] ?? ''), $funnel_id));
        if ($component === '') $component = self::render_ui_component($slug, $attributes, $attrs, $title, $body, $heading, $funnel_id);
        if ($component !== '') return self::append_inner_content($component, $content);
        $out = '<' . $tag . ' ' . $attrs . '>';
        if (!empty($attributes['mediaUrl'])) $out .= '<figure class="pcw-r48-media"><img src="' . esc_url($attributes['mediaUrl']) . '" alt="' . esc_attr((string) ($attributes['mediaAlt'] ?? '')) . '" loading="lazy" decoding="async"></figure>';
        if (!empty($attributes['eyebrow'])) $out .= '<p class="pcw-r48-eyebrow">' . esc_html($attributes['eyebrow']) . '</p>';
        if ($title !== '') $out .= '<h' . $heading . '>' . esc_html($title) . '</h' . $heading . '>';
        if ($body !== '') $out .= '<div class="pcw-r48-body">' . wp_kses_post(wpautop($body)) . '</div>';
        $out .= self::render_items($attributes['items'] ?? array(), $slug);
        $cta_url = trim((string) ($attributes['ctaUrl'] ?? '')) ?: self::handoff_url((string) ($attributes['handoff'] ?? ''), $funnel_id);
        if (!empty($attributes['ctaLabel']) && $cta_url !== '') $out .= '<a class="pcw-r48-cta" href="' . esc_url($cta_url) . '"' . (in_array($slug, array('privacy-handoff', 'booking-handoff', 'commerce-handoff'), true) ? ' rel="noopener" target="_blank"' : '') . '>' . esc_html($attributes['ctaLabel']) . '</a>';
        if ($content !== '') $out .= '<div class="pcw-r48-inner">' . $content . '</div>';
        return $out . '</' . $tag . '>';
    }

    private static function render_ui_component(string $slug, array $attributes, string $attrs, string $title, string $body, int $heading, string $funnel_id): string {
        $cta = trim((string) ($attributes['ctaUrl'] ?? '')) ?: self::handoff_url((string) ($attributes['handoff'] ?? ''), $funnel_id);
        $cta_markup = !empty($attributes['ctaLabel']) && $cta !== '' ? '<a class="pcw-r48-cta" href="' . esc_url($cta) . '">' . esc_html($attributes['ctaLabel']) . '</a>' : '';
        $items = self::render_items($attributes['items'] ?? array(), $slug);
        $heading_markup = $title !== '' ? '<h' . $heading . '>' . esc_html($title) . '</h' . $heading . '>' : '';
        $body_markup = $body !== '' ? '<div class="pcw-r48-body">' . wp_kses_post(wpautop($body)) . '</div>' : '';
        if ($slug === 'collective-header') return '<header ' . $attrs . '><div><p class="pcw-r48-eyebrow">' . esc_html((string) ($attributes['eyebrow'] ?? 'Renew48 Wellness Collective')) . '</p>' . $heading_markup . '</div><nav aria-label="Collective navigation"><a href="' . esc_url(home_url('/our-brands/')) . '">Our brands</a><a href="' . esc_url(home_url('/wellness/')) . '">Wellness</a><a href="' . esc_url(home_url('/resources/')) . '">Resources</a><a href="' . esc_url(home_url('/contact/')) . '">Contact</a></nav>' . $cta_markup . '</header>';
        if ($slug === 'mobile-menu-drawer') return '<aside ' . $attrs . ' data-pcw-drawer><button type="button" data-pcw-drawer-toggle aria-expanded="false">Menu</button><nav hidden aria-label="Mobile navigation"><a href="' . esc_url(home_url('/')) . '">Home</a><a href="' . esc_url(home_url('/our-brands/')) . '">Our brands</a><a href="' . esc_url(home_url('/wellness/')) . '">Wellness</a><a href="' . esc_url(home_url('/contact/')) . '">Contact</a>' . $cta_markup . '</nav></aside>';
        if ($slug === 'collective-footer') return '<footer ' . $attrs . '><div>' . $heading_markup . $body_markup . '</div><nav aria-label="Footer"><a href="' . esc_url(home_url('/privacy-policy/')) . '">Privacy</a><a href="' . esc_url(home_url('/terms/')) . '">Terms</a><a href="' . esc_url(home_url('/accessibility/')) . '">Accessibility</a></nav></footer>';
        if ($slug === 'directory-filter') return '<section ' . $attrs . '>' . $heading_markup . $body_markup . '<form class="pcw-r48-filter-form" data-pcw-directory-filter><label>Search brands and services<input type="search" name="q" autocomplete="off"></label><select name="service"><option value="">All services</option><option>Chiropractic</option><option>Massage therapy</option><option>Wellness</option></select><select name="location"><option value="">All locations</option><option>Phoenix, AZ</option></select><button type="submit">Filter</button></form></section>';
        if ($slug === 'newsletter-capture') return '<section ' . $attrs . '>' . $heading_markup . $body_markup . '<form class="pcw-r48-newsletter" action="' . esc_url((string) ($attributes['formAction'] ?? '')) . '" method="post" data-pcw-newsletter><label>Email address<input type="email" name="email" required autocomplete="email"></label><button type="submit">Subscribe</button><p class="pcw-r48-form-status" aria-live="polite">Consent-based updates only.</p></form></section>';
        if ($slug === 'location-hours') return '<section ' . $attrs . '>' . $heading_markup . $body_markup . '<div class="pcw-r48-location-meta"><strong>Location</strong><span>Update address, phone, and hours in the block content.</span><a href="' . esc_url(home_url('/contact/')) . '">Contact the team</a></div></section>';
        if ($slug === 'gallery-lightbox') return '<section ' . $attrs . '>' . $heading_markup . $body_markup . '<div class="pcw-r48-gallery" data-pcw-gallery>' . $items . '</div></section>';
        if ($slug === 'tabbed-content') return '<section ' . $attrs . '>' . $heading_markup . '<div class="pcw-r48-tabs" data-pcw-tabs>' . $items . '</div></section>';
        if ($slug === 'toast-notice') return '<aside ' . $attrs . ' role="status">' . $heading_markup . $body_markup . '</aside>';
        if ($slug === 'back-to-top') return '<div ' . $attrs . '><a class="pcw-r48-cta" href="#top">Back to top</a></div>';
        return '';
    }

    /**
     * Dynamic blocks that provide a specialized shell still need to render their
     * serialized InnerBlocks on the front end. Gutenberg passes that markup as
     * $content to the render callback; without this step, edits made inside a
     * composed Renew48 block only appeared in the editor.
     */
    private static function append_inner_content(string $markup, string $content): string {
        if ($content === '') return $markup;
        $position = strrpos($markup, '</');
        if ($position === false) return $markup . '<div class="pcw-r48-inner">' . $content . '</div>';
        return substr($markup, 0, $position) . '<div class="pcw-r48-inner">' . $content . '</div>' . substr($markup, $position);
    }

    private static function render_unleashed_article(array $attributes): string {
        ob_start();
        include __DIR__ . '/templates/unleashed-article.php';
        return (string) ob_get_clean();
    }

    private static function render_items($items, string $slug): string {
        if (!is_array($items) || $items === array()) return '';
        $html = '<div class="pcw-r48-items"' . (in_array($slug, array('testimonial-slider', 'conversion-carousel'), true) ? ' data-pcw-carousel-track' : '') . '>';
        foreach ($items as $item) {
            if (!is_array($item)) continue;
            $image = !empty($item['image']) ? '<img src="' . esc_url((string) $item['image']) . '" alt="' . esc_attr((string) ($item['alt'] ?? '')) . '" loading="lazy" decoding="async">' : '';
            $html .= '<article class="pcw-r48-item">' . $image . '<h3>' . esc_html((string) ($item['title'] ?? '')) . '</h3>';
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
            'chiropractic-services' => 'Chiropractic Service Galaxy', 'massage-services' => 'Massage Service Galaxy', 'service-detail-flow' => 'Service Detail Flow',
            'committed-wellness' => 'Committed Wellness Flow', 'referral-program' => 'Referral Program Flow', 'corporate-wellness' => 'Corporate, Event & Sports Funnel',
            'contract-savings' => 'Annual Contract Savings Funnel', 'path-quiz' => 'Wellness Path Quiz Funnel', 'walk-in-waitlist' => 'Walk-in & Waitlist Funnel',
            'gift-cards' => 'Gift Cards Funnel', 'seasonal-wellness' => 'Seasonal Wellness Funnel', 'reviews' => 'Reviews & Reputation Funnel', 'insurance-packages-draft' => 'Insurance Packages Draft Funnel',
            'collective-home-ui' => 'Collective Home UI', 'member-services-ui' => 'Member Services UI', 'member-service-detail-ui' => 'Member Service Detail UI',
            'find-care-ui' => 'Find Care Directory UI', 'member-footer-ui' => 'Member Footer UI', 'contract-suite-ui' => 'Contract Suite UI', 'visual-system-showcase' => 'Visual System Showcase',
            'about' => 'About Page', 'contact' => 'Contact Page', 'blog-archive' => 'Blog Archive', 'blog-single' => 'Blog Single', 'faq' => 'FAQ Page',
            'header-cobranded' => 'CoBranded Header', 'header-chiro' => 'ChiroGoAZ Header', 'header-aroma' => 'AromaHMT Header',
            'footer-cobranded' => 'CoBranded Footer', 'footer-chiro' => 'ChiroGoAZ Footer', 'footer-aroma' => 'AromaHMT Footer', 'booking-privacy-modal' => 'Booking Privacy Modal',
        );
        foreach ($patterns as $slug => $title) {
            register_block_pattern('renew48/' . $slug, array('title' => __($title, 'pcw-renew48'), 'categories' => array('renew48'), 'content' => self::pattern_content($slug)));
        }
    }

    private static function pattern_content(string $slug): string {
        if (str_starts_with($slug, 'header-')) return '<!-- wp:renew48/collective-header {"title":"' . esc_attr($slug === 'header-chiro' ? 'ChiroGoAZ' : ($slug === 'header-aroma' ? 'AromaHMT' : 'Renew48')) . '","eyebrow":"Desert Wellness","ctaLabel":"' . esc_attr($slug === 'header-chiro' ? 'Book Chiropractic Evaluation' : ($slug === 'header-aroma' ? 'Book Massage' : 'Book Now')) . '","handoff":"booking","theme":"' . esc_attr($slug === 'header-chiro' ? 'chiro' : ($slug === 'header-aroma' ? 'aroma' : 'cobranded')) . '"} /-->';
        if (str_starts_with($slug, 'footer-')) return '<!-- wp:renew48/footer-columns {"title":"' . esc_attr($slug === 'footer-chiro' ? 'ChiroGoAZ' : ($slug === 'footer-aroma' ? 'AromaHMT' : 'Renew48')) . '","body":"Services · Memberships · Booking · Shop · Blog · Legal"} /-->';
        if ($slug === 'booking-privacy-modal') return '<!-- wp:renew48/privacy-handoff {"title":"Booking stays secure","body":"Continue to the approved Jane booking experience. Do not include clinical details in this site.","ctaLabel":"Continue to booking","handoff":"booking","funnelId":"booking"} /-->';
        if ($slug === 'blog-single') return self::unleashed_standard_content();
        $funnel_patterns = array('corporate-wellness', 'contract-savings', 'path-quiz', 'walk-in-waitlist', 'gift-cards', 'seasonal-wellness', 'reviews', 'insurance-packages-draft');
        if (in_array($slug, $funnel_patterns, true)) return self::funnel_pattern_content($slug);
        if ($slug === 'referral-program') return self::referral_pattern_content();
        if ($slug === 'collective-home-ui') return self::collective_home_ui_content();
        if ($slug === 'member-services-ui') return self::member_services_ui_content();
        if ($slug === 'member-service-detail-ui') return self::member_service_detail_ui_content();
        if ($slug === 'find-care-ui') return self::find_care_ui_content();
        if ($slug === 'member-footer-ui') return self::member_footer_ui_content();
        if ($slug === 'contract-suite-ui') return self::contract_suite_ui_content();
        if ($slug === 'visual-system-showcase') return self::visual_system_showcase_content();
        if ($slug === 'committed-wellness') return self::committed_wellness_content();
        if ($slug === 'chiropractic-services' || $slug === 'massage-services') return self::service_galaxy_content($slug);
        if ($slug === 'service-detail-flow') return self::service_detail_content();
        $titles = array('home' => 'Whole-person wellness, in one clear next step.', 'service-landing' => 'Care designed around your next step.', 'membership-landing' => 'Choose support that lasts.', 'booking-funnel' => 'Booking stays secure in Jane.', 'about' => 'A more connected kind of care.', 'contact' => 'Start the conversation.', 'blog-archive' => 'Unleashed: Body, Mind, Soul.', 'blog-single' => 'A grounded note for your wellness journey.', 'faq' => 'Questions, answered clearly.');
        return '<!-- wp:renew48/hero-primary {"title":"' . esc_attr($titles[$slug]) . '","eyebrow":"Renew48"} /-->' . "\n" . '<!-- wp:renew48/section {"title":"' . esc_attr($slug === 'booking-funnel' ? 'What happens next' : 'Explore your path') . '"} /-->' . "\n" . '<!-- wp:renew48/cta-banner {"title":"Ready when you are"} /-->';
    }

    private static function label(string $slug): string { return ucwords(str_replace('-', ' ', $slug)); }

    private static function funnel_id_for_slug(string $slug): string {
        $map = array('referral-program-flow' => 'referral', 'funnel-flow' => 'campaign', 'booking-handoff' => 'booking', 'commerce-handoff' => 'commerce', 'privacy-handoff' => 'booking', 'contract-suite' => 'contract-suite');
        return $map[$slug] ?? '';
    }

    /** Routes are configurable site options; defaults only target public local pages. */
    private static function handoff_url(string $handoff, string $funnel_id): string {
        $key = sanitize_key($handoff ?: $funnel_id);
        $routes = (array) get_option('pcw_renew48_funnel_routes', array());
        if (!empty($routes[$key]) && is_string($routes[$key])) return $routes[$key];
        $local = array('corporate' => '/corporate-wellness/', 'contract' => '/contract-savings/', 'referral' => '/referrals/', 'quiz' => '/path-quiz/', 'waitlist' => '/walk-in-waitlist/', 'gift' => '/gift-cards/', 'seasonal' => '/seasonal-wellness/', 'reviews' => '/reviews/', 'insurance' => '/insurance-packages/', 'directory' => '/find-care/', 'commerce' => '/shop/', 'contact' => '/contact/', 'booking' => '/booking/');
        return isset($local[$key]) ? home_url($local[$key]) : '';
    }

    private static function block(string $name, array $attributes = array(), string $inner = ''): string {
        $json = $attributes === array() ? '' : ' ' . wp_json_encode($attributes, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        return $inner === '' ? '<!-- wp:renew48/' . $name . $json . ' /-->' : '<!-- wp:renew48/' . $name . $json . ' -->' . $inner . '<!-- /wp:renew48/' . $name . ' -->';
    }

    private static function service_galaxy_content(string $slug): string {
        $is_chiro = $slug === 'chiropractic-services';
        $items = $is_chiro ? array(
            array('title' => 'Adjustments', 'body' => 'Movement and alignment support with a clear next step.'), array('title' => 'Evaluations', 'body' => 'Start with context, goals, and a provider-guided plan.'), array('title' => 'Soft Tissue', 'body' => 'A focused pathway for tension, recovery, and mobility.'), array('title' => 'Functional Movement', 'body' => 'Build a steadier relationship with strength and motion.'),
        ) : array(
            array('title' => 'Therapeutic Massage', 'body' => 'Targeted bodywork shaped around your goals.'), array('title' => 'Reflexology', 'body' => 'A restorative service pathway with grounded expectations.'), array('title' => 'Cupping', 'body' => 'A focused recovery ritual for appropriate clients.'), array('title' => 'Customized Sessions', 'body' => 'A flexible service conversation for the season you are in.'),
        );
        return self::block('cinematic-hero', array('theme' => $is_chiro ? 'chiro' : 'aroma', 'eyebrow' => $is_chiro ? 'ChiroGoAZ' : 'AromaHMT', 'title' => $is_chiro ? 'Move with more confidence.' : 'Make room to restore.', 'body' => 'Explore a service pathway, understand what to expect, then continue to the provider-owned booking experience.')) . self::block('immersive-service-galaxy', array('theme' => $is_chiro ? 'chiro' : 'aroma', 'eyebrow' => 'Service galaxy', 'title' => 'Find the right place to begin.', 'body' => 'Each card is editable. Replace these concise introductions with approved service language.', 'items' => $items, 'interaction' => 'hover-reveal')) . self::block('privacy-handoff', array('title' => 'Booking stays secure with your provider.', 'body' => 'This marketing page does not collect clinical information. Continue through the approved booking destination.', 'ctaLabel' => 'Continue to booking', 'handoff' => 'booking', 'funnelId' => 'booking'));
    }

    private static function service_detail_content(): string {
        return self::block('cinematic-hero', array('eyebrow' => 'Service detail', 'title' => 'Care with a beginning, middle, and next step.', 'body' => 'Use this pattern as the editable base for every service detail page.')) . self::block('wellness-path-development', array('eyebrow' => 'What to expect', 'title' => 'A clear path forward.', 'items' => array(array('title' => 'Start', 'body' => 'Choose the service direction.'), array('title' => 'Understand', 'body' => 'Review what to expect and how to prepare.'), array('title' => 'Continue', 'body' => 'Use the provider-owned booking handoff.')))) . self::block('membership-cta', array('title' => 'Want a steadier rhythm?', 'body' => 'Explore the Wellness Paths before booking.', 'ctaLabel' => 'Explore paths', 'ctaUrl' => '/memberships/'));
    }

    private static function committed_wellness_content(): string {
        return self::block('cinematic-hero', array('eyebrow' => 'Unleashed · Body / Mind / Soul', 'title' => 'Committed to wellness is a practice.', 'body' => 'A long-form education and conversion framework that is editable in the block editor.')) . self::block('committed-wellness-flow', array('title' => 'Small choices compound.', 'items' => array(array('title' => 'Notice', 'body' => 'Learn the signal your body is giving you.'), array('title' => 'Choose', 'body' => 'Select a sustainable next step.'), array('title' => 'Keep going', 'body' => 'Return to the rhythm that supports you.')))) . self::block('conversion-carousel', array('eyebrow' => 'Community stories', 'title' => 'The long view matters.', 'items' => array(array('title' => 'Body', 'body' => 'Movement, recovery, and capability.'), array('title' => 'Mind', 'body' => 'Room to reset and reconnect.'), array('title' => 'Soul', 'body' => 'Rituals that make wellness personal.'))));
    }

    private static function referral_pattern_content(): string {
        return self::block('cinematic-hero', array('eyebrow' => 'Referral & VIP pathway', 'title' => 'Share the care you trust.', 'body' => 'A privacy-safe referral invitation with no clinical details or referral health data collected here.')) . self::block('referral-program-flow', array('title' => 'Three clear steps.', 'funnelId' => 'referral', 'items' => array(array('title' => 'Invite', 'body' => 'Share the approved referral link.'), array('title' => 'Connect', 'body' => 'Your guest chooses their own provider pathway.'), array('title' => 'Celebrate', 'body' => 'Approved, non-PHI referral status is handled by the source system.')))) . self::block('privacy-handoff', array('title' => 'Ready to refer?', 'body' => 'Continue through the approved referral system.', 'ctaLabel' => 'Open referral link', 'handoff' => 'referral', 'funnelId' => 'referral'));
    }

    private static function funnel_pattern_content(string $slug): string {
        $labels = array('corporate-wellness' => 'Corporate, event & sports wellness', 'contract-savings' => 'Annual contract savings', 'path-quiz' => 'Choose your wellness path', 'walk-in-waitlist' => 'Walk-in & waitlist', 'gift-cards' => 'Give a wellness next step', 'seasonal-wellness' => 'Seasonal wellness', 'reviews' => 'Share your experience', 'insurance-packages-draft' => 'Insurance-friendly packages');
        $title = $labels[$slug];
        $draft = $slug === 'insurance-packages-draft' ? ' Draft only. Requires business, payer, and compliance approval before activation.' : '';
        $handoff = str_replace(array('-wellness', '-savings', '-packages-draft'), '', $slug);
        if ($slug === 'gift-cards') $handoff = 'gift';
        if ($slug === 'path-quiz') $handoff = 'quiz';
        if ($slug === 'walk-in-waitlist') $handoff = 'waitlist';
        if ($slug === 'insurance-packages-draft') $handoff = 'insurance';
        return self::block('cinematic-hero', array('eyebrow' => 'Focused funnel', 'title' => $title, 'body' => 'An editable, privacy-safe funnel pattern.' . $draft, 'funnelId' => $handoff)) . self::block('funnel-flow', array('title' => 'Choose a clear next step.', 'funnelId' => $handoff, 'items' => array(array('title' => 'Explore', 'body' => 'Understand the offer and eligibility in plain language.'), array('title' => 'Choose', 'body' => 'Select a non-clinical direction or request a conversation.'), array('title' => 'Continue securely', 'body' => 'Handoff to the approved provider, commerce, or staff workflow.')))) . self::block('privacy-handoff', array('title' => 'Ready when you are.', 'body' => 'Use this editable prompt to explain the privacy boundary before the handoff.', 'ctaLabel' => 'Continue', 'handoff' => $handoff, 'funnelId' => $handoff));
    }

    private static function collective_home_ui_content(): string {
        return self::block('collective-header', array('title' => 'Renew48 Wellness Collective', 'eyebrow' => 'Many brands. One mission.', 'ctaLabel' => 'Find care', 'handoff' => 'directory')) . self::block('cinematic-hero', array('title' => 'Renew. Elevate. Together.', 'body' => 'Uniting exceptional wellness brands to elevate well-being.', 'ctaLabel' => 'Explore our brands', 'ctaUrl' => '/our-brands/', 'variant' => 'glass')) . self::block('brand-directory', array('title' => 'Find trusted care. All in one place.', 'items' => array(array('title' => 'ChiroGoAZ', 'body' => 'Chiropractic care · Phoenix, AZ · In-person & virtual', 'label' => 'View profile', 'url' => '/chirogoaz/'), array('title' => 'AromaHMT', 'body' => 'Massage therapy · Phoenix, AZ · In-person', 'label' => 'View profile', 'url' => '/aromahmt/'), array('title' => 'Future brand', 'body' => 'Specialized wellness · Coming soon', 'label' => 'Stay connected', 'url' => '/contact/')))) . self::block('collective-footer', array('title' => 'Renew48', 'body' => 'Many brands. One mission. Stronger together.'));
    }

    private static function member_services_ui_content(): string {
        return self::block('collective-header', array('theme' => 'chiro', 'title' => 'ChiroGoAZ + AromaHMT', 'ctaLabel' => 'Book now', 'handoff' => 'booking')) . self::block('cinematic-hero', array('theme' => 'chiro', 'eyebrow' => 'Our services', 'title' => 'Healing. Movement. Wellness.', 'body' => 'Personalized care for every stage of your journey.', 'ctaLabel' => 'Book your session', 'handoff' => 'booking')) . self::block('service-masonry', array('theme' => 'chiro', 'title' => 'Explore our services', 'interaction' => 'hover-reveal', 'items' => array(array('title' => 'Chiropractic adjustments', 'body' => 'Relieve discomfort and restore movement.'), array('title' => 'Therapeutic massage', 'body' => 'Reduce stress and promote balance.'), array('title' => 'Deep tissue massage', 'body' => 'Target chronic pain and muscle tension.'), array('title' => 'Aroma therapy', 'body' => 'Essential oils to support relaxation.'), array('title' => 'Pregnancy massage', 'body' => 'Gentle, supportive care.'), array('title' => 'Myofascial release', 'body' => 'Improve mobility and movement.')))) . self::block('promo-banner', array('title' => 'New patient special', 'body' => 'A clear, approved introductory offer.', 'ctaLabel' => 'Claim offer', 'handoff' => 'booking')) . self::block('social-proof-strip', array('title' => 'Care designed for the long view.'));
    }

    private static function member_service_detail_ui_content(): string {
        return self::block('service-detail-panel', array('theme' => 'aroma', 'title' => 'Therapeutic massage', 'body' => 'A clear editable service-detail frame with benefits and approved booking handoff.', 'items' => array(array('title' => 'Reduce stress', 'body' => 'Calms the nervous system.'), array('title' => 'Relieve tension', 'body' => 'Supports movement and comfort.'), array('title' => 'Promote balance', 'body' => 'Supports whole-body wellness.')))) . self::block('faq-accordion', array('title' => 'Questions, answered clearly.', 'items' => array(array('title' => 'What should I expect?', 'body' => 'Provider-specific guidance is confirmed in the secure booking system.'), array('title' => 'How long is a session?', 'body' => 'Review approved service options before booking.')))) . self::block('location-hours', array('title' => 'Visit the team', 'body' => 'Location, phone, hours, and map are editable public information only.')) . self::block('gallery-lightbox', array('title' => 'A closer look', 'body' => 'Use approved media-library images; this block opens images without collecting information.'));
    }

    private static function find_care_ui_content(): string {
        return self::block('directory-filter', array('title' => 'Find trusted care. All in one place.', 'body' => 'Filter public provider and brand information by service or location.')) . self::block('brand-directory', array('title' => 'Member brands', 'items' => array(array('title' => 'ChiroGoAZ', 'body' => 'Chiropractic care · Phoenix, AZ', 'label' => 'View profile', 'url' => '/chirogoaz/'), array('title' => 'AromaHMT', 'body' => 'Massage therapy · Phoenix, AZ', 'label' => 'View profile', 'url' => '/aromahmt/'))));
    }

    private static function member_footer_ui_content(): string {
        return self::block('newsletter-capture', array('title' => 'Stay inspired', 'body' => 'Wellness tips and updates with consent.')) . self::block('collective-footer', array('theme' => 'chiro', 'title' => 'ChiroGoAZ + AromaHMT', 'body' => 'Services · Resources · Contact · Privacy'));
    }

    private static function contract_suite_ui_content(): string {
        return self::block('contract-suite', array('title' => 'Building a stronger, healthier Arizona.', 'eyebrow' => 'Contract & Commercial Suite', 'body' => 'A document-navigation workspace for approved public commercial materials. Never place member or patient records here.', 'items' => array(array('title' => 'Master agreement', 'body' => 'Foundation and terms.'), array('title' => 'Commercial schedule', 'body' => 'Pricing and operations.'), array('title' => 'Implementation statement of work', 'body' => 'Approved scope and delivery.')), 'ctaLabel' => 'Explore the agreements', 'handoff' => 'contract', 'funnelId' => 'contract-suite'));
    }

    /**
     * A staging acceptance composition, built only from editable Gutenberg
     * blocks. It is deliberately a reference surface, not production copy.
     */
    public static function visual_system_showcase_content(): string {
        $asset = plugins_url('assets/unleashed-v2/', __FILE__);
        $desert = plugins_url('assets/r48-desert-glass-oasis.png', __FILE__);
        $healing = plugins_url('assets/r48-desert-wellness-spa.png', __FILE__);
        $movement = $asset . '04-movement-hiker.png';
        $wellness = $asset . '05-wellness-foliage-card.png';
        $gallery = array(
            array('title' => 'Chiropractic care', 'body' => 'A public, editable service introduction.', 'image' => $movement, 'alt' => 'Desert movement scene', 'label' => 'View service', 'url' => '/services/'),
            array('title' => 'Therapeutic massage', 'body' => 'A public, editable service introduction.', 'image' => $healing, 'alt' => 'Wellness still life', 'label' => 'View service', 'url' => '/services/'),
            array('title' => 'Wellness paths', 'body' => 'A public, editable service introduction.', 'image' => $wellness, 'alt' => 'Desert wellness foliage', 'label' => 'View paths', 'url' => '/memberships/'),
        );
        return self::block('collective-header', array('title' => 'Renew48 Wellness Collective', 'eyebrow' => 'Staging visual system', 'ctaLabel' => 'Find care', 'handoff' => 'directory', 'surface' => 'translucent'))
            . self::block('cinematic-hero', array('eyebrow' => 'Many brands. One mission.', 'title' => 'Renew. Elevate. Together.', 'body' => 'A staged, editable interpretation of the supplied Renew48 reference composition.', 'ctaLabel' => 'Explore brands', 'ctaUrl' => '/our-brands/', 'mediaUrl' => $desert, 'mediaAlt' => 'Sonoran desert at sunset', 'surface' => 'gradient-glass', 'animation' => 'guided'))
            . self::block('brand-directory', array('eyebrow' => 'Find care', 'title' => 'Trusted wellness, all in one place.', 'body' => 'Directory records carry only public provider and brand information.', 'items' => array(array('title' => 'ChiroGoAZ', 'body' => 'Chiropractic care, Phoenix, Arizona.', 'label' => 'View profile', 'url' => '/chirogoaz/'), array('title' => 'AromaHMT', 'body' => 'Massage therapy, Phoenix, Arizona.', 'label' => 'View profile', 'url' => '/aromahmt/')), 'surface' => 'translucent'))
            . self::block('service-masonry', array('eyebrow' => 'Service mosaic', 'title' => 'Explore your next step.', 'body' => 'Hover and touch reveal use the same readable service content.', 'items' => $gallery, 'interaction' => 'hover-reveal', 'layout' => 'masonry', 'surface' => 'gradient-glass'))
            . self::block('service-detail-panel', array('eyebrow' => 'Service detail', 'title' => 'Therapeutic massage', 'body' => 'A focused public service frame with a secure booking handoff.', 'mediaUrl' => $healing, 'mediaAlt' => 'Wellness still life', 'items' => array(array('title' => 'Reduce stress', 'body' => 'Public service information.'), array('title' => 'Relieve tension', 'body' => 'Public service information.'), array('title' => 'Promote balance', 'body' => 'Public service information.')), 'ctaLabel' => 'Continue to booking', 'handoff' => 'booking', 'surface' => 'solid'))
            . self::block('booking-handoff', array('eyebrow' => 'Booking handoff', 'title' => 'Continue in the provider system.', 'body' => 'No booking or health data is collected on this marketing surface.', 'ctaLabel' => 'Open booking', 'handoff' => 'booking', 'surface' => 'gradient-glass'))
            . self::block('pricing-grid', array('eyebrow' => 'Packages', 'title' => 'Compare public options.', 'items' => array(array('title' => 'Chiropractic care', 'body' => 'Owner-approved pricing goes here.'), array('title' => 'Massage therapy', 'body' => 'Owner-approved pricing goes here.'), array('title' => 'Wellness packages', 'body' => 'Owner-approved pricing goes here.')), 'surface' => 'translucent'))
            . self::block('gallery-lightbox', array('eyebrow' => 'Gallery', 'title' => 'Desert wellness imagery.', 'items' => $gallery, 'surface' => 'solid'))
            . self::block('tabbed-content', array('eyebrow' => 'What to expect', 'title' => 'Choose the information you need.', 'items' => array(array('title' => 'Overview', 'body' => 'Public overview copy.'), array('title' => 'Benefits', 'body' => 'Owner-approved public benefits.'), array('title' => 'FAQs', 'body' => 'Use provider-approved answers.')), 'surface' => 'translucent'))
            . self::block('newsletter-capture', array('eyebrow' => 'Stay inspired', 'title' => 'Wellness notes, when approved.', 'body' => 'The form remains inactive until consent and delivery are approved.', 'surface' => 'gradient-glass'))
            . self::block('committed-wellness-flow', array('eyebrow' => 'Wellness flow', 'title' => 'A clear next step.', 'items' => array(array('title' => 'Explore', 'body' => 'Understand public options.'), array('title' => 'Choose', 'body' => 'Select a non-clinical direction.'), array('title' => 'Continue', 'body' => 'Hand off to the approved system.')), 'surface' => 'solid'))
            . self::block('conversion-carousel', array('eyebrow' => 'Wellness experiences', 'title' => 'Browse the public pathways.', 'items' => $gallery, 'surface' => 'translucent'))
            . self::block('contract-suite', array('eyebrow' => 'Commercial suite', 'title' => 'One mission. Many brands.', 'body' => 'Public commercial material only. Never member or patient records.', 'mediaUrl' => $desert, 'mediaAlt' => 'Arizona desert landscape', 'items' => array(array('title' => 'Master agreement', 'body' => 'Approved document scope.'), array('title' => 'Commercial schedule', 'body' => 'Approved document scope.'), array('title' => 'Implementation', 'body' => 'Approved document scope.')), 'ctaLabel' => 'View documents', 'handoff' => 'contract', 'surface' => 'gradient-glass'))
            . self::block('collective-footer', array('title' => 'Renew48', 'body' => 'Many brands. One mission. Stronger together.', 'surface' => 'gradient-glass'));
    }

    private static function unleashed_standard_content(): string {
        $asset_base = plugins_url('assets/unleashed-v2/', __FILE__);
        return (string) include __DIR__ . '/patterns/unleashed-standard.php';
    }

    /**
     * Replace only the legacy Unleashed custom block. Existing hand-built page
     * content is never overwritten; when no legacy page exists a draft is made.
     */
    public static function migrate_unleashed_page(): void {
        if (get_option(self::UNLEASHED_MIGRATION)) return;
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
