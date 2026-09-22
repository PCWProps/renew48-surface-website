<?php
defined('ABSPATH') || exit;
if (!defined('PCW_RENEW48_VERSION')) define('PCW_RENEW48_VERSION', '0.9.2');

function pcw_renew48_admin_pages(): array {
    return array('renew48-overview'=>'Overview','renew48-setup'=>'Setup Guide','renew48-activation'=>'Activation','renew48-blocks'=>'Blocks','renew48-funnels'=>'Funnels','renew48-attribution'=>'Attribution','renew48-sync'=>'Platform Sync','renew48-integrations'=>'Integrations','renew48-diagnostics'=>'Diagnostics','renew48-status'=>'System Status','renew48-docs'=>'Documentation','renew48-compatibility'=>'Compatibility');
}

add_action('admin_menu', static function(): void {
    add_menu_page('Renew-48', 'Renew-48', 'manage_options', 'renew48-overview', 'pcw_renew48_admin_page', 'dashicons-admin-site-alt3', 59);
    foreach (pcw_renew48_admin_pages() as $slug => $label) add_submenu_page('renew48-overview', $label, $label, 'manage_options', $slug, 'pcw_renew48_admin_page');
});

function pcw_renew48_admin_link(string $page): string { return esc_url(add_query_arg('page', $page, admin_url('admin.php'))); }
function pcw_renew48_admin_card(string $title, string $copy, string $action = '', string $href = ''): void {
    echo '<section class="card" style="max-width:980px;padding:20px;margin:16px 0"><h2>' . esc_html($title) . '</h2><p>' . esc_html($copy) . '</p>';
    if ($action && $href) echo '<p><a class="button button-primary" href="' . esc_url($href) . '">' . esc_html($action) . '</a></p>';
    echo '</section>';
}

function pcw_renew48_admin_page(): void {
    $page = sanitize_key($_GET['page'] ?? 'renew48-overview');
    $pages = pcw_renew48_admin_pages();
    $page = array_key_exists($page, $pages) ? $page : 'renew48-overview';
    $theme_active = wp_get_theme()->get('TextDomain') === 'desert-liquid-glass';
    echo '<div class="wrap"><h1>Renew-48 · ' . esc_html($pages[$page]) . '</h1><p>Optional Renew48 Collective business layer. Desert Liquid Glass stays independently installable and owns visual presentation.</p>';
    if ($page === 'renew48-overview') {
        pcw_renew48_admin_card('System boundaries', 'WordPress stores approved non-PHI content only. Jane owns booking and clinical intake. WooCommerce owns checkout, payment, tax, and orders. Renew-48 owns approved organization, funnel, attribution, and platform workflows.', 'Open Setup Guide', pcw_renew48_admin_link('renew48-setup'));
        pcw_renew48_admin_card('Activation state: unconfigured', 'No official activation endpoint, key format, tenant identifier, or credentials are available. Membership-only functions and platform synchronization stay fail-closed.', 'Review activation boundary', pcw_renew48_admin_link('renew48-activation'));
    } elseif ($page === 'renew48-setup') {
        pcw_renew48_admin_card('1. Install Desert Liquid Glass', $theme_active ? 'Desert Liquid Glass is active.' : 'The theme is optional but not active. Renew-48 blocks remain editable without it, while full visual presentation requires the theme.', 'Open compatibility', pcw_renew48_admin_link('renew48-compatibility'));
        pcw_renew48_admin_card('2. Review blocks and funnels', 'Edit local content and route handoffs only. No CRM, Jane write, payment, SMS, email, or platform action is enabled by this plugin.', 'Open Blocks', pcw_renew48_admin_link('renew48-blocks'));
    } elseif ($page === 'renew48-activation') {
        pcw_renew48_admin_card('Activation is intentionally unavailable', 'There is no approved authenticated contract in this checkout. No activation key is collected, logged, or stored. The local block library and documentation remain available.');
    } elseif ($page === 'renew48-blocks') {
        $inventory = json_decode((string) file_get_contents(dirname(__DIR__) . '/block-capabilities.json'), true);
        $blocks = is_array($inventory['blocks'] ?? null) ? $inventory['blocks'] : array();
        echo '<div class="card" style="max-width:980px;padding:20px"><h2>' . esc_html((string) count($blocks)) . ' Renew48 semantic blocks</h2><ul>';
        foreach (array_keys($blocks) as $block) echo '<li><code>renew48/' . esc_html($block) . '</code></li>';
        echo '</ul><p><a class="button button-primary" href="' . esc_url(admin_url('post-new.php?post_type=page')) . '">Open block editor</a></p></div>';
    } elseif ($page === 'renew48-funnels') {
        pcw_renew48_admin_card('Funnel definitions are local and inactive', 'Booking, directory, referral, corporate wellness, contract savings, path quiz, waitlist, gift cards, seasonal wellness, reviews, and insurance/package drafts are presentation patterns. Their downstream actions remain disabled until separately approved.');
    } elseif ($page === 'renew48-attribution') {
        pcw_renew48_admin_card('Non-PHI attribution only', 'The approved event boundary excludes name, email, phone, provider identity, appointment details, and free text. There is no active external event transport in this build.');
    } elseif ($page === 'renew48-sync' || $page === 'renew48-integrations') {
        pcw_renew48_admin_card('No external connection is configured', 'Platform sync, CRM, email, SMS, Jane writes, payment actions, and membership acceptance are disabled. An approved authenticated contract is required before this screen can enable a connection.');
    } elseif ($page === 'renew48-diagnostics') {
        pcw_renew48_admin_card('Diagnostics', 'No background job or integration activity is running. Use System Status to inspect the local plugin and theme relationship.', 'Open System Status', pcw_renew48_admin_link('renew48-status'));
    } elseif ($page === 'renew48-status' || $page === 'renew48-compatibility') {
        $theme = wp_get_theme();
        echo '<div class="card" style="max-width:980px;padding:20px"><h2>Local status</h2><ul><li>Renew-48 version: ' . esc_html(PCW_RENEW48_VERSION) . '</li><li>Active theme: ' . esc_html($theme->get('Name')) . '</li><li>Desert Liquid Glass active: ' . esc_html($theme_active ? 'yes' : 'no') . '</li><li>Activation: unconfigured, fail-closed</li><li>External integrations: disabled</li></ul></div>';
    } else {
        pcw_renew48_admin_card('Documentation', 'Use the same capability inventory for block documentation, editor awareness, and migration review. This keeps public documentation aligned with the registered semantic block boundary.', 'Open Blocks', pcw_renew48_admin_link('renew48-blocks'));
    }
    echo '</div>';
}
