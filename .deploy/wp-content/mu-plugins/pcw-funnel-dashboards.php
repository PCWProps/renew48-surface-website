<?php
/**
 * Domain-local staging operations surfaces for blueprint funnels.
 * No PHI, payment, Jane automation, or outbound messaging is performed here.
 */
if (!defined('ABSPATH')) { exit; }

function pcw_fd_cards() {
    return array(
        'Corporate / Event / Sports' => 'Non-PHI inquiry routing and staff follow-up queue.',
        'Annual Contract' => 'Savings education and request-only membership intent.',
        'Referral' => 'Single/group attribution and reward intent ledger.',
        'Abandoned Booking' => 'Chiro/Aroma recovery messaging state; Jane remains authoritative.',
        'Wellness Path Quiz' => 'Preference-based path recommendation without medical data.',
        'Newsletter / SMS' => 'Consent-gated delivery readiness; sending disabled in staging.',
        'Loyalty' => 'Points ledger surface pending CRM field validation.',
        'Walk-in / Waitlist' => 'Availability-state and waitlist interest queue.',
        'Birthday / Anniversary' => 'Date-only reminder queue and staff review.',
        'Gift Cards' => 'Woo/Jane ownership handoff surface.',
        'VIP / Influencer' => 'Non-PHI attribution and tier review.',
        'Massage Add-ons' => 'Post-booking email intent; not pre-booking checkout.',
        'Insurance Packages' => 'Draft-only package interest; booking connection disabled.',
        'Seasonal / Crisis' => 'Switchable campaign state; broadcast disabled pending approval.',
        'Chatbot' => 'Architecture and lead-intent queue; no PHI and no booking replication.',
    );
}

function pcw_fd_plugin_active($slug) {
    $active = (array) get_option('active_plugins', array());
    return in_array($slug . '/' . $slug . '.php', $active, true) || in_array($slug, $active, true);
}

function pcw_fd_integration_status() {
    $routes = function_exists('rest_get_server') ? rest_get_server()->get_routes() : array();
    $host = wp_parse_url(home_url('/'), PHP_URL_HOST);
    $domain = preg_replace('/-staging\\..*$/', '', (string) $host);
    $jane = array(
        'chirogoaz' => 'https://chirogoaz.janeapp.com',
        'aromahmt' => 'https://aromahmt.janeapp.com',
        'renew48' => '',
    );
    $crm_count = post_type_exists('zerobs_customer') ? (int) wp_count_posts('zerobs_customer')->publish : null;
    $product_count = post_type_exists('product') ? (int) wp_count_posts('product')->publish : null;
    $mail_provider = pcw_fd_plugin_active('mailpoet') || pcw_fd_plugin_active('send-app') || pcw_fd_plugin_active('klaviyo');
    $sms_provider = pcw_fd_plugin_active('send-app');
    $chat_provider = pcw_fd_plugin_active('wp-live-chat-support') ? '3CX live chat' : '';
    return array(
        'domain' => $domain,
        'crm' => array(
            'status' => pcw_fd_plugin_active('zero-bs-crm') && isset($routes['/zbscrm/v1/contacts']) ? 'CONTRACT PRESENT / NO-CONTACT PROBE' : 'BLOCKED',
            'route' => isset($routes['/zbscrm/v1/contacts']),
            'contacts' => $crm_count,
            'write_test' => false,
        ),
        'woocommerce' => array(
            'status' => pcw_fd_plugin_active('woocommerce') ? 'STORE API READ-ONLY' : 'BLOCKED',
            'products' => $product_count,
            'checkout_test' => false,
            'payment_test' => false,
        ),
        'jane' => array(
            'status' => !empty($jane[$domain]) ? 'REDIRECT TARGET CONFIGURED' : 'TARGET REQUIRED',
            'url' => $jane[$domain] ?? '',
            'clinical_write' => false,
        ),
        'email' => array(
            'status' => $mail_provider ? 'PROVIDER PRESENT / DELIVERY NOT TESTED' : 'PROVIDER REQUIRED',
            'provider_present' => $mail_provider,
            'send_test' => false,
        ),
        'sms' => array(
            'status' => $sms_provider ? 'PROVIDER PRESENT / CONSENT TEST REQUIRED' : 'PROVIDER REQUIRED',
            'provider_present' => $sms_provider,
            'send_test' => false,
        ),
        'analytics' => array(
            'status' => 'DOMAIN-LOCAL DATA LAYER',
            'property_receipt' => false,
            'events' => array('cta_click', 'form_submit_intent', 'jane_redirect', 'woo_intent', 'chat_intent'),
        ),
        'chatbot' => array(
            'status' => $chat_provider ? $chat_provider . ' / BOT PROVIDER NOT CONFIGURED' : 'BOT PROVIDER REQUIRED',
            'provider' => $chat_provider,
            'phi' => false,
        ),
        'dashboard' => array(
            'status' => 'LIVE NON-PHI COUNTS / READ-ONLY',
            'data_source' => 'WordPress site-local status and counts',
        ),
    );
}

add_action('rest_api_init', function () {
    register_rest_route('pcw/v1', '/integration-status', array(
        'methods' => WP_REST_Server::READABLE,
        'permission_callback' => function () { return current_user_can('manage_options'); },
        'callback' => function () { return rest_ensure_response(pcw_fd_integration_status()); },
    ));
});

add_action('wp_footer', function () {
    if (is_admin()) { return; }
    $domain = wp_parse_url(home_url('/'), PHP_URL_HOST);
    echo '<script id="pcw-integration-data-layer">window.dataLayer=window.dataLayer||[];window.pcwIntegration={domain:' . wp_json_encode($domain) . ',phi:false};(function(){function push(event_name,detail){window.dataLayer.push({event:event_name,domain:window.pcwIntegration.domain,detail:detail||{}});}document.addEventListener("click",function(e){var a=e.target.closest&&e.target.closest("a");if(!a)return;var href=a.href||"";if(/janeapp\\.com/i.test(href))push("jane_redirect",{path:new URL(href).pathname});else if(/checkout|cart|gift-card|shop/i.test(href))push("woo_intent",{path:new URL(href,location.href).pathname});else if(/chat|intercom|live-chat/i.test(href))push("chat_intent",{});else if(a.matches("[data-funnel],.wp-block-button__link"))push("cta_click",{path:new URL(href,location.href).pathname});},true);document.addEventListener("submit",function(e){var f=e.target;if(f&&f.tagName==="FORM")push("form_submit_intent",{id:f.id||"anonymous-form",action:f.getAttribute("action")||location.pathname});},true);})();</script>';
});

function pcw_fd_render($mode = 'funnel') {
    $cards = pcw_fd_cards();
    $status = pcw_fd_integration_status();
    echo '<div class="wrap"><h1>Blueprint '.esc_html(ucfirst($mode)).' Dashboard</h1><p>Staging operations surface. This screen stores no medical information and does not send contacts, payments, SMS, or Jane actions.</p><h2>Live integration status</h2><table class="widefat striped" style="max-width:1100px"><thead><tr><th>System</th><th>Status</th><th>Safe evidence</th></tr></thead><tbody>';
    foreach (array('crm'=>'CRM','woocommerce'=>'WooCommerce','jane'=>'Jane','email'=>'Email','sms'=>'SMS','analytics'=>'Analytics','chatbot'=>'Chatbot','dashboard'=>'Dashboard') as $key => $label) {
        $item = $status[$key];
        $evidence = $key === 'crm' ? 'route=' . ($item['route'] ? 'present' : 'missing') . '; contacts=' . ($item['contacts'] === null ? 'unknown' : $item['contacts']) : ($key === 'woocommerce' ? 'published products=' . ($item['products'] === null ? 'unknown' : $item['products']) : ($key === 'jane' ? esc_html($item['url'] ?: 'no target') : ($key === 'analytics' ? 'events=' . count($item['events']) . '; receipt not claimed' : 'no outbound test')));
        echo '<tr><th scope="row">' . esc_html($label) . '</th><td>' . esc_html($item['status']) . '</td><td>' . esc_html($evidence) . '</td></tr>';
    }
    echo '</tbody></table><p><a href="' . esc_url(rest_url('pcw/v1/integration-status')) . '">Read-only integration status endpoint</a> (requires an authenticated administrator).</p><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;max-width:1100px">';
    foreach ($cards as $name => $desc) {
        echo '<div style="padding:18px;border:1px solid #dcdcde;border-radius:8px;background:#fff"><h2 style="font-size:16px;margin:0 0 8px">'.esc_html($name).'</h2><p style="margin:0 0 12px">'.esc_html($desc).'</p><span style="display:inline-block;padding:4px 8px;border-radius:99px;background:#fff3cd;color:#6b4d00;font-size:11px">STAGING / PENDING ACCEPTANCE</span></div>';
    }
    echo '</div><hr><h2>System boundaries</h2><ul><li>WordPress stores non-PHI contact and preference data only.</li><li>WooCommerce owns retail checkout and order records.</li><li>Jane owns booking, clinical intake, and service membership state.</li><li>Outbound email/SMS, payment, and Playwright actions require separate authenticated acceptance.</li></ul></div>';
}

add_action('admin_menu', function () {
    add_menu_page('Funnel Dashboard', 'Funnel Dashboard', 'manage_options', 'pcw-funnel-dashboard', function () { pcw_fd_render('funnel'); }, 'dashicons-chart-area', 58);
    add_submenu_page('pcw-funnel-dashboard', 'Staff Dashboard', 'Staff Dashboard', 'manage_options', 'pcw-staff-dashboard', function () { pcw_fd_render('staff'); });
});
