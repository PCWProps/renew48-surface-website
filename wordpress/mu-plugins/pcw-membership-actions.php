<?php
/**
 * Domain-local CTW membership request adapter.
 *
 * This is deliberately acceptance-gated. It accepts only non-PHI membership
 * intent and never reports success while the CRM write adapter is disabled.
 */
if (!defined('ABSPATH')) { exit; }

function pcw_membership_config() {
    $host = (string) wp_parse_url(home_url('/'), PHP_URL_HOST);
    $domain = preg_replace('/-staging\\..*$/', '', $host);
    $configs = array(
        'chirogoaz' => array('tag' => 'chiro_membership_request', 'jane' => 'https://chirogoaz.janeapp.com'),
        'aromahmt' => array('tag' => 'aroma_membership_request', 'jane' => 'https://aromahmt.janeapp.com'),
        'renew48' => array('tag' => 'renew48_membership_enrollment', 'jane' => ''),
    );
    $cfg = $configs[$domain] ?? $configs['renew48'];
    $cfg['domain'] = $domain;
    return $cfg;
}

function pcw_membership_crm_enabled() {
    // Must be enabled by an authenticated, site-local acceptance action.
    return (bool) get_option('pcw_membership_crm_enabled', false);
}

function pcw_membership_form($notice = '') {
    $cfg = pcw_membership_config();
    $notice_html = $notice ? '<p class="pcw-membership-notice" role="status">'.esc_html($notice).'</p>' : '';
    $jane = $cfg['jane'] ? '<a class="pcw-btn pcw-quiet" data-funnel href="'.esc_url($cfg['jane']).'">Open Jane</a>' : '<a class="pcw-btn pcw-quiet" data-funnel href="'.esc_url(home_url('/contact/')).'">Contact the team</a>';
    return '<section class="pcw-membership-request" aria-labelledby="pcw-membership-request-title"><span class="pcw-kicker">Request your path</span><h2 id="pcw-membership-request-title">Start with a simple membership conversation.</h2><p>Share only your contact details and the path you are considering. Do not include diagnoses, treatment notes, or other health information.</p>'.$notice_html.'<form id="pcw-membership-request" method="post" action="'.esc_url(rest_url('pcw/v1/membership-request')).'" data-flow="ctw_membership_signup" data-crm-tag="'.esc_attr($cfg['tag']).'"><label>Full name<input name="full_name" autocomplete="name" required></label><label>Email<input type="email" name="email" autocomplete="email" required></label><label>Phone<input name="phone" autocomplete="tel" required></label><label>Plan interest<select name="plan_interest" required><option value="">Choose a path</option><option>Essence</option><option>Balance</option><option>Harmony</option><option>Unity</option><option>Not sure yet</option></select></label><input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" class="pcw-honeypot"><input type="hidden" name="source" value="ctw_membership_signup"><button class="pcw-btn pcw-primary" type="submit">Send membership request</button></form><div class="pcw-actions">'.$jane.'</div><p class="pcw-membership-result" role="status" aria-live="polite"></p></section>';
}

add_action('rest_api_init', function () {
    register_rest_route('pcw/v1', '/membership-request', array(
        'methods' => WP_REST_Server::CREATABLE,
        'permission_callback' => '__return_true',
        'callback' => function (WP_REST_Request $request) {
            $params = $request->get_json_params();
            if (!is_array($params) || !$params) { $params = $request->get_body_params(); }
            if (!empty($params['website'])) return new WP_Error('invalid_request', 'Request could not be accepted.', array('status' => 400));
            $name = sanitize_text_field((string) ($params['full_name'] ?? ''));
            $email = sanitize_email((string) ($params['email'] ?? ''));
            $phone = sanitize_text_field((string) ($params['phone'] ?? ''));
            $plan = sanitize_text_field((string) ($params['plan_interest'] ?? ''));
            $allowed_plans = array('Essence', 'Balance', 'Harmony', 'Unity', 'Not sure yet');
            if ($name === '' || !is_email($email) || $phone === '' || !in_array($plan, $allowed_plans, true)) {
                return new WP_Error('invalid_request', 'Provide a name, valid email, phone, and membership path.', array('status' => 422));
            }
            if (!pcw_membership_crm_enabled() || !function_exists('zeroBS_integrations_addOrUpdateCustomer')) {
                return new WP_Error('crm_acceptance_required', 'Membership request path is configured; CRM acceptance is still required.', array('status' => 503));
            }
            $cfg = pcw_membership_config();
            $external_id = hash('sha256', strtolower($email).'|'.$cfg['domain']);
            $fields = array('zbsc_email' => $email, 'zbsc_fname' => $name, 'zbsc_mobtel' => $phone, 'zbsc_status' => 'Lead', 'zbsc_notes' => 'Membership interest: '.$plan.'; source: CTW membership signup; domain: '.$cfg['domain']);
            $customer_id = zeroBS_integrations_addOrUpdateCustomer('pcw_membership', $external_id, $fields, '', 'none', false, false, 'update');
            if (!$customer_id) return new WP_Error('crm_write_failed', 'Membership request could not be accepted by CRM.', array('status' => 502));
            return rest_ensure_response(array('ok' => true, 'redirect' => add_query_arg('membership', 'requested', home_url('/memberships/'))));
        },
    ));
});

add_filter('the_content', function ($content) {
    if (!is_page()) return $content;
    $slug = get_post_field('post_name', get_queried_object_id());
    if ($slug === 'memberships') return $content . pcw_membership_form();
    if ($slug === 'membership-request') return preg_replace('/<form[^>]*id="cga-membership-request".*?<\\/form>/s', pcw_membership_form(), $content);
    return $content;
}, 30);

add_action('template_redirect', function () {
    if (is_admin() || wp_doing_ajax() || is_user_logged_in()) return;
    $path = trim(parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH), '/');
    if (in_array($path, array('membership-request-2', 'membership-request-legacy'), true)) {
        $target = get_page_by_path('membership-request', OBJECT, 'page') ? 'membership-request' : 'memberships';
        wp_safe_redirect(home_url('/'.$target.'/'), 301); exit;
    }
});

// Some installs render the canonical page through a theme template that does
// not pass the content through the normal filter. Keep the form available on
// those separate domains without changing the theme or duplicating AromaHMT's
// already-rendered form.
add_action('wp_footer', function () {
    if (!is_page('memberships')) return;
    $cfg = pcw_membership_config();
    if (!in_array($cfg['domain'], array('chirogoaz', 'renew48'), true)) return;
    echo '<div id="pcw-membership-footer-fallback">'.pcw_membership_form().'</div>';
}, 4);

add_action('wp_head', function () {
    if (!is_page(array('memberships', 'membership-request'))) return;
    echo '<style id="pcw-membership-actions">.pcw-membership-request{width:min(900px,86vw);margin:0 auto 100px;padding:48px;border-radius:32px;background:#fff9;border:1px solid #ffffffb8;box-shadow:0 22px 55px #45534d1b}.pcw-membership-request h2{font-size:clamp(34px,5vw,64px);margin:10px 0 18px}.pcw-membership-request form{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:28px}.pcw-membership-request label{display:grid;gap:8px;font-weight:800;font-size:13px}.pcw-membership-request label:nth-of-type(4){grid-column:1/-1}.pcw-membership-request input,.pcw-membership-request select{padding:14px;border:1px solid #203b3650;border-radius:12px;background:#fff;font:inherit}.pcw-membership-request button{border:0;cursor:pointer}.pcw-membership-request .pcw-honeypot{position:absolute;left:-10000px}.pcw-membership-notice{padding:14px 18px;border-left:4px solid var(--accent);background:#fff3}.pcw-membership-result{min-height:1.4em}@media(max-width:620px){.pcw-membership-request{padding:28px}.pcw-membership-request form{grid-template-columns:1fr}.pcw-membership-request label:nth-of-type(4){grid-column:auto}}</style>';
});

add_action('wp_footer', function () {
    if (!is_page(array('memberships', 'membership-request'))) return;
    echo '<script>(function(){var f=document.getElementById("pcw-membership-request");if(!f)return;f.addEventListener("submit",function(e){e.preventDefault();var result=f.parentNode.querySelector(".pcw-membership-result");var data=Object.fromEntries(new FormData(f).entries());result.textContent="Checking the request path…";fetch(f.action,{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify(data)}).then(function(r){return r.json().then(function(j){return {ok:r.ok,data:j};});}).then(function(x){if(x.ok&&x.data.redirect){window.location.href=x.data.redirect;}else{result.textContent=(x.data&&x.data.message)||"Membership CRM acceptance is still pending; no request was submitted.";}}).catch(function(){result.textContent="Membership CRM acceptance is still pending; no request was submitted.";});});})();</script>';
});
