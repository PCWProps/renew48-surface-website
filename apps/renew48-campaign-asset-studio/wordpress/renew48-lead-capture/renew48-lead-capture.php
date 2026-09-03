<?php
/**
 * Plugin Name: Renew48 First to Know Capture
 * Description: Branded Committed to Wellness signup form with stored lead capture and thank-you email.
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) { exit; }

function renew48_register_lead_post_type() {
    register_post_type('renew48_lead', array(
        'labels' => array('name' => 'Renew48 Leads', 'singular_name' => 'Renew48 Lead'),
        'public' => false,
        'show_ui' => true,
        'show_in_menu' => true,
        'supports' => array('title', 'custom-fields'),
        'menu_icon' => 'dashicons-groups',
    ));
}
add_action('init', 'renew48_register_lead_post_type');

function renew48_first_to_know_shortcode() {
    $success = isset($_GET['r48_signup']) && $_GET['r48_signup'] === 'success';
    ob_start(); ?>
    <div class="renew48-first-to-know" style="max-width:720px;margin:0 auto;background:#fbf7f0;color:#1f2f20;box-shadow:0 18px 60px rgba(31,47,32,.14);">
      <section style="padding:28px 24px;text-align:center;background:#1f2f20;"><img src="<?php echo esc_url(plugins_url('assets/founding-member-lockup.png', __FILE__)); ?>" alt="ChiroGoAZ and AromaHMT from Renew48" style="max-width:100%;height:auto;max-height:110px;"></section>
      <section style="padding:52px 30px;text-align:center;background:linear-gradient(rgba(251,247,240,.24),rgba(251,247,240,.4)),url('<?php echo esc_url(plugins_url('assets/committed-to-wellness-desert-dawn.png', __FILE__)); ?>') center/cover;">
        <p style="margin:0;color:#c96f43;font-size:12px;font-weight:700;letter-spacing:3px;">A NEW CHAPTER IS TAKING ROOT</p>
        <h1 style="margin:18px auto 12px;max-width:560px;font:italic 48px/1.05 Georgia,serif;">Something Beautiful<br>is Growing</h1>
        <p style="max-width:480px;margin:0 auto;color:#273328;font:18px/1.6 Georgia,serif;">Whole-person wellness is coming to the desert—with trusted care, healing support, and a more connected way to feel your best.</p>
      </section>
      <?php if ($success) : ?>
        <section style="padding:52px 34px;text-align:center;"><p style="margin:0;color:#c96f43;font:700 12px Arial,sans-serif;letter-spacing:2px;">YOU’RE ON THE LIST</p><h2 style="margin:14px 0;color:#1f2f20;font:italic 34px Georgia,serif;">Something beautiful is growing.</h2><p style="max-width:480px;margin:0 auto;color:#57604c;font-size:17px;line-height:1.65;">Thanks for raising your hand. We’ll keep you close as the Renew48 Wellness Collective takes root.</p></section>
      <?php else : ?>
        <section style="padding:44px 34px 52px;text-align:center;"><p style="margin:0 auto 20px;max-width:530px;color:#57604c;font-size:17px;line-height:1.65;">ChiroGoAZ and AromaHMT are preparing something special through the Renew48 Wellness Collective. Get an early look at what’s next, plus launch updates and first-to-know invitations.</p>
          <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" style="max-width:460px;margin:0 auto;text-align:left;"><?php wp_nonce_field('renew48_first_to_know','renew48_nonce'); ?><input type="hidden" name="action" value="renew48_first_to_know"><input type="hidden" name="campaign" value="committed-to-wellness-teaser"><input type="hidden" name="source" value="launch-post">
            <label style="display:block;margin:0 0 7px;font-size:13px;font-weight:700;">First name</label><input required name="first_name" type="text" autocomplete="given-name" style="box-sizing:border-box;width:100%;padding:14px;border:1px solid #cfc2b2;border-radius:4px;margin-bottom:16px;font-size:16px;">
            <label style="display:block;margin:0 0 7px;font-size:13px;font-weight:700;">Email address</label><input required name="email" type="email" autocomplete="email" style="box-sizing:border-box;width:100%;padding:14px;border:1px solid #cfc2b2;border-radius:4px;margin-bottom:16px;font-size:16px;">
            <label style="display:flex;gap:9px;align-items:flex-start;margin:0 0 20px;color:#57604c;font-size:13px;line-height:1.45;"><input required name="consent" type="checkbox" value="yes" style="margin-top:3px;">Yes, send me Renew48 launch updates. I can unsubscribe anytime.</label>
            <button type="submit" style="width:100%;padding:15px;border:0;border-radius:4px;background:#2f4630;color:#fbf7f0;font-weight:700;letter-spacing:1.2px;">BE THE FIRST TO KNOW</button>
          </form><p style="margin:22px auto 0;max-width:460px;color:#899080;font-size:12px;line-height:1.5;">Your information is used for Renew48 campaign updates and will not be sold.</p>
        </section>
      <?php endif; ?>
      <footer style="padding:22px;text-align:center;background:#1f2f20;color:#d9a441;font-size:11px;letter-spacing:2px;">ROOTED IN THE DESERT · ELEVATED BY CARE · INSPIRED BY MOVEMENT</footer>
    </div>
    <?php return ob_get_clean();
}
add_shortcode('renew48_first_to_know', 'renew48_first_to_know_shortcode');

function renew48_handle_first_to_know() {
    if (!isset($_POST['renew48_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['renew48_nonce'])), 'renew48_first_to_know')) { wp_die('Security check failed.', 'Renew48 signup', array('response' => 403)); }
    $first_name = sanitize_text_field(wp_unslash($_POST['first_name'] ?? ''));
    $email = sanitize_email(wp_unslash($_POST['email'] ?? ''));
    $campaign = sanitize_key(wp_unslash($_POST['campaign'] ?? 'committed-to-wellness-teaser'));
    $source = sanitize_key(wp_unslash($_POST['source'] ?? 'unknown'));
    if (!$first_name || !is_email($email) || ($_POST['consent'] ?? '') !== 'yes') { wp_die('Please complete the required fields.', 'Renew48 signup', array('response' => 400)); }

    $lead_id = wp_insert_post(array('post_type' => 'renew48_lead', 'post_status' => 'private', 'post_title' => $first_name . ' — ' . $email, 'meta_input' => array('email' => $email, 'first_name' => $first_name, 'campaign' => $campaign, 'source' => $source, 'consent_at' => current_time('mysql'), 'referrer' => esc_url_raw(wp_get_referer()))));
    $subject = 'You’re on the list — Renew48';
    $body = '<!doctype html><html><body style="margin:0;padding:24px;background:#eee5d9;font-family:Arial,sans-serif;color:#273328;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center"><table role="presentation" width="600" style="max-width:600px;background:#fbf7f0;"><tr><td style="padding:24px;text-align:center;background:#1f2f20;color:#d9a441;letter-spacing:2px;">RENEW48 WELLNESS COLLECTIVE</td></tr><tr><td style="padding:40px;text-align:center;"><p style="color:#c96f43;font-weight:bold;letter-spacing:2px;">YOU’RE ON THE LIST</p><h1 style="font:italic 34px Georgia,serif;">Something beautiful is growing.</h1><p style="font-size:16px;line-height:1.65;">Thanks for raising your hand. We’ll keep you close with early news, launch details, and invitations to be part of what’s next.</p><p style="font-size:16px;line-height:1.65;">Until then, remember: wellness starts within.</p></td></tr><tr><td style="padding:20px;text-align:center;background:#1f2f20;color:#d9a441;font-size:11px;letter-spacing:2px;">ROOTED IN THE DESERT · ELEVATED BY CARE · INSPIRED BY MOVEMENT</td></tr></table></td></tr></table></body></html>';
    wp_mail($email, $subject, $body, array('Content-Type: text/html; charset=UTF-8', 'From: Renew48 <wordpress@' . wp_parse_url(home_url(), PHP_URL_HOST) . '>'));
    wp_safe_redirect(add_query_arg('r48_signup', 'success', wp_get_referer() ?: home_url('/'))); exit;
}
add_action('admin_post_nopriv_renew48_first_to_know', 'renew48_handle_first_to_know');
add_action('admin_post_renew48_first_to_know', 'renew48_handle_first_to_know');
