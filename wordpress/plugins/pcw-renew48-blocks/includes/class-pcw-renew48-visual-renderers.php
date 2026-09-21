<?php
/**
 * Dedicated public renderers for the Renew48 Gutenberg visual vocabulary.
 *
 * These render semantic component shells. The block attributes remain the
 * editable source of content, while the Astra child theme supplies page context.
 */
defined('ABSPATH') || exit;

final class PCW_Renew48_Visual_Renderers {
    public static function render(string $slug, array $attributes, string $wrapper, string $title, string $body, int $level, string $cta): string {
        $heading = $title === '' ? '' : '<h' . $level . '>' . esc_html($title) . '</h' . $level . '>';
        $eyebrow = empty($attributes['eyebrow']) ? '' : '<p class="pcw-r48-eyebrow">' . esc_html((string) $attributes['eyebrow']) . '</p>';
        $copy = $body === '' ? '' : '<div class="pcw-r48-body">' . wp_kses_post(wpautop($body)) . '</div>';
        $action = empty($attributes['ctaLabel']) || $cta === '' ? '' : '<a class="pcw-r48-cta" href="' . esc_url($cta) . '">' . esc_html((string) $attributes['ctaLabel']) . '</a>';
        $items = self::items($attributes['items'] ?? array());
        $media = self::media($attributes);

        if ($slug === 'cinematic-hero') {
            return '<section ' . $wrapper . '><div class="pcw-r48-scene-media">' . $media . '</div><div class="pcw-r48-scene-overlay"></div><div class="pcw-r48-scene-copy">' . $eyebrow . $heading . $copy . $action . '</div></section>';
        }
        if (in_array($slug, array('service-masonry', 'immersive-service-galaxy'), true)) {
            return '<section ' . $wrapper . '><header class="pcw-r48-component-heading">' . $eyebrow . $heading . $copy . '</header><ul class="pcw-r48-masonry-grid" data-pcw-hover-reveal>' . $items . '</ul>' . $action . '</section>';
        }
        if ($slug === 'service-detail-panel') {
            return '<section ' . $wrapper . '><div class="pcw-r48-detail-media">' . $media . '</div><div class="pcw-r48-detail-copy">' . $eyebrow . $heading . $copy . '</div><ul class="pcw-r48-detail-benefits">' . $items . '</ul>' . $action . '</section>';
        }
        if (in_array($slug, array('booking-widget', 'booking-handoff', 'consultation-cta'), true)) {
            return '<section ' . $wrapper . '><div class="pcw-r48-handoff-copy">' . $eyebrow . $heading . $copy . '<p class="pcw-r48-boundary">Booking continues in the provider-owned system.</p>' . $action . '</div><div class="pcw-r48-handoff-steps" aria-label="Booking handoff steps"><span>Choose service</span><span>Choose a time</span><span>Continue securely</span></div></section>';
        }
        if ($slug === 'brand-directory') {
            return '<section ' . $wrapper . '><header class="pcw-r48-component-heading">' . $eyebrow . $heading . $copy . '</header><ul class="pcw-r48-directory-list">' . $items . '</ul>' . $action . '</section>';
        }
        if ($slug === 'pricing-grid') {
            return '<section ' . $wrapper . '><header class="pcw-r48-component-heading">' . $eyebrow . $heading . $copy . '</header><ul class="pcw-r48-pricing-cards">' . $items . '</ul>' . $action . '</section>';
        }
        if ($slug === 'gallery-lightbox') {
            return '<section ' . $wrapper . '><header class="pcw-r48-component-heading">' . $eyebrow . $heading . $copy . '</header><ul class="pcw-r48-gallery" data-pcw-gallery>' . $items . '</ul></section>';
        }
        if ($slug === 'tabbed-content') {
            return '<section ' . $wrapper . '><header class="pcw-r48-component-heading">' . $eyebrow . $heading . $copy . '</header><div class="pcw-r48-tabs" data-pcw-tabs><ul class="pcw-r48-tab-panels">' . $items . '</ul></div></section>';
        }
        if ($slug === 'newsletter-capture') {
            return '<section ' . $wrapper . '><div><header class="pcw-r48-component-heading">' . $eyebrow . $heading . $copy . '</header><p class="pcw-r48-consent">Consent-based updates only. Delivery remains inactive until approved.</p></div><form class="pcw-r48-newsletter" data-pcw-newsletter><label>Email address<input type="email" name="email" autocomplete="email" required></label><button type="submit">Subscribe</button><p class="pcw-r48-form-status" aria-live="polite"></p></form></section>';
        }
        if ($slug === 'modal-trigger') {
            return '<section ' . $wrapper . '><div class="pcw-r48-modal-card">' . $eyebrow . $heading . $copy . '<button class="pcw-r48-modal-open" type="button">' . esc_html((string) ($attributes['ctaLabel'] ?: 'Open details')) . '</button></div></section>';
        }
        if (in_array($slug, array('wellness-path-development', 'committed-wellness-flow', 'referral-program-flow', 'funnel-flow'), true)) {
            return '<section ' . $wrapper . '><header class="pcw-r48-component-heading">' . $eyebrow . $heading . $copy . '</header><ol class="pcw-r48-flow-steps">' . $items . '</ol>' . $action . '</section>';
        }
        if (in_array($slug, array('testimonial-slider', 'conversion-carousel'), true)) {
            return '<section ' . $wrapper . '><header class="pcw-r48-component-heading">' . $eyebrow . $heading . $copy . '</header><ul class="pcw-r48-carousel-window" data-pcw-carousel-track>' . $items . '</ul></section>';
        }
        if ($slug === 'contract-suite') {
            return '<section ' . $wrapper . '><ul class="pcw-r48-contract-menu" aria-label="Contract suite sections">' . $items . '</ul><div class="pcw-r48-contract-hero">' . $eyebrow . $heading . $copy . $action . '</div></section>';
        }
        if ($slug === 'collective-footer') {
            return '<footer ' . $wrapper . '><div>' . $heading . $copy . '</div><nav aria-label="Collective footer"><a href="' . esc_url(home_url('/our-brands/')) . '">Our brands</a><a href="' . esc_url(home_url('/wellness/')) . '">Wellness</a><a href="' . esc_url(home_url('/privacy-policy/')) . '">Privacy</a><a href="' . esc_url(home_url('/terms/')) . '">Terms</a></nav></footer>';
        }
        if ($slug === 'social-proof-strip') {
            return '<section ' . $wrapper . '><div class="pcw-r48-component-heading">' . $eyebrow . $heading . $copy . '</div>' . ($items === '' ? '<p class="pcw-r48-proof-note">Add only verified public proof.</p>' : '<ul class="pcw-r48-proof-items">' . $items . '</ul>') . '</section>';
        }
        return '';
    }

    private static function media(array $attributes): string {
        $url = trim((string) ($attributes['mediaUrl'] ?? ''));
        $alt = (string) ($attributes['mediaAlt'] ?? '');
        if ($url === '') return '<div class="pcw-r48-media-fallback" aria-hidden="true"></div>';
        return '<img src="' . esc_url($url) . '" alt="' . esc_attr($alt) . '" loading="eager" decoding="async">';
    }

    private static function items($items): string {
        if (!is_array($items) || $items === array()) return '';
        $out = '';
        foreach ($items as $item) {
            if (!is_array($item)) continue;
            $image = empty($item['image']) ? '' : '<img src="' . esc_url((string) $item['image']) . '" alt="' . esc_attr((string) ($item['alt'] ?? '')) . '" loading="lazy" decoding="async">';
            $link = empty($item['url']) || empty($item['label']) ? '' : '<a href="' . esc_url((string) $item['url']) . '">' . esc_html((string) $item['label']) . '</a>';
            $out .= '<li class="pcw-r48-item">' . $image . '<h3>' . esc_html((string) ($item['title'] ?? '')) . '</h3>' . (empty($item['body']) ? '' : '<p>' . esc_html((string) $item['body']) . '</p>') . $link . '</li>';
        }
        return $out;
    }
}
