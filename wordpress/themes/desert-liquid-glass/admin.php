<?php
/** Theme administration screens and safe, local onboarding actions. */
defined('ABSPATH') || exit;

function dlg_admin_pages(): array {
    return array(
        'dlg-welcome'  => 'Welcome',
        'dlg-settings' => 'Settings',
        'dlg-starters' => 'Starter Templates',
        'dlg-builder'  => 'Site Builder',
        'dlg-woo'      => 'WooCommerce',
        'dlg-blocks'   => 'Blocks',
        'dlg-learn'    => 'Learn',
    );
}

add_action('admin_menu', static function(): void {
    $pages = dlg_admin_pages();
    add_menu_page('Desert Liquid Glass', 'Desert Liquid Glass', 'manage_options', 'dlg-welcome', 'dlg_admin_page', 'dashicons-admin-customizer', 58);
    foreach ($pages as $slug => $label) {
        add_submenu_page('dlg-welcome', 'Desert Liquid Glass ' . $label, $label, 'manage_options', $slug, 'dlg_admin_page');
    }
});

add_action('admin_enqueue_scripts', static function(string $hook): void {
    if (strpos($hook, 'dlg-') === false) {
        return;
    }
    wp_enqueue_style('dlg-admin', get_stylesheet_directory_uri() . '/assets/admin.css', array(), DLG_VERSION);
});

add_action('admin_post_dlg_save_settings', static function(): void {
    if (!current_user_can('manage_options')) {
        wp_die(esc_html__('You do not have permission to change Desert Liquid Glass settings.', 'desert-liquid-glass'));
    }
    check_admin_referer('dlg_save_settings');
    $themes = dlg_themes();
    $theme = sanitize_key($_POST['default_theme'] ?? 'arizona-sky');
    $mode = sanitize_key($_POST['default_mode'] ?? 'contained');
    update_option('dlg_settings', array(
        'default_theme' => array_key_exists($theme, $themes) ? $theme : 'arizona-sky',
        'default_mode'  => in_array($mode, array('contained', 'masked', 'full'), true) ? $mode : 'contained',
        'reduce_motion' => empty($_POST['reduce_motion']) ? 'respect-system' : 'always-reduce',
        'performance'   => empty($_POST['performance']) ? 'balanced' : 'conserve',
    ));
    wp_safe_redirect(add_query_arg(array('page' => 'dlg-settings', 'dlg_notice' => 'settings-saved'), admin_url('admin.php')));
    exit;
});

add_action('admin_post_dlg_create_starter', static function(): void {
    if (!current_user_can('edit_pages')) {
        wp_die(esc_html__('You do not have permission to create a draft page.', 'desert-liquid-glass'));
    }
    check_admin_referer('dlg_create_starter');
    $starter = sanitize_key($_POST['starter'] ?? 'wellness');
    $content = array(
        'wellness' => '<!-- wp:dlg/hero {"title":"Care shaped around your day","body":"Use this draft as a starting point. Replace every word, image, link, and block with your own approved content."} /--><!-- wp:dlg/grid /--><!-- wp:dlg/cta {"title":"Plan your next step","body":"Add a real destination before publishing this call to action."} /-->',
        'studio'  => '<!-- wp:dlg/hero {"title":"A considered digital home","body":"A composed starter page for a studio, practice, or service business."} /--><!-- wp:dlg/cards {"title":"What matters here","body":"Use cards only where the information benefits from a bounded surface."} /--><!-- wp:dlg/newsletter {"title":"Keep in touch","body":"Connect this section to an approved consented email service before publishing."} /-->',
    );
    $title = $starter === 'studio' ? 'Studio Starter Draft' : 'Wellness Starter Draft';
    $page_id = wp_insert_post(array('post_type' => 'page', 'post_status' => 'draft', 'post_title' => $title, 'post_content' => $content[$starter] ?? $content['wellness']), true);
    if (is_wp_error($page_id)) {
        wp_safe_redirect(add_query_arg(array('page' => 'dlg-starters', 'dlg_notice' => 'starter-failed'), admin_url('admin.php')));
        exit;
    }
    wp_safe_redirect(get_edit_post_link($page_id, 'url'));
    exit;
});

function dlg_admin_link(string $page): string {
    return esc_url(add_query_arg('page', $page, admin_url('admin.php')));
}

function dlg_admin_notice(): void {
    $notice = sanitize_key($_GET['dlg_notice'] ?? '');
    $messages = array(
        'settings-saved' => array('success', 'Desert Liquid Glass defaults were saved.'),
        'starter-failed' => array('error', 'The draft could not be created. Review WordPress permissions and try again.'),
    );
    if (!isset($messages[$notice])) {
        return;
    }
    printf('<div class="notice notice-%1$s is-dismissible"><p>%2$s</p></div>', esc_attr($messages[$notice][0]), esc_html($messages[$notice][1]));
}

function dlg_admin_page(): void {
    $page = sanitize_key($_GET['page'] ?? 'dlg-welcome');
    $pages = dlg_admin_pages();
    $page = array_key_exists($page, $pages) ? $page : 'dlg-welcome';
    echo '<div class="wrap dlg-admin">';
    dlg_admin_notice();
    echo '<nav class="dlg-admin__nav" aria-label="Desert Liquid Glass sections">';
    echo '<a class="dlg-admin__brand" href="' . dlg_admin_link('dlg-welcome') . '"><span class="dlg-admin__mark" aria-hidden="true">◇</span><span>Desert<br><small>LIQUID GLASS</small></span></a>';
    foreach ($pages as $slug => $label) {
        printf('<a class="%1$s" href="%2$s">%3$s</a>', $slug === $page ? 'is-current' : '', dlg_admin_link($slug), esc_html($label));
    }
    echo '</nav><main class="dlg-admin__main">';
    if ($page === 'dlg-welcome') {
        dlg_admin_welcome();
    } elseif ($page === 'dlg-settings') {
        dlg_admin_settings();
    } elseif ($page === 'dlg-starters') {
        dlg_admin_starters();
    } elseif ($page === 'dlg-builder') {
        dlg_admin_builder();
    } elseif ($page === 'dlg-woo') {
        dlg_admin_woo();
    } elseif ($page === 'dlg-blocks') {
        dlg_admin_blocks();
    } else {
        dlg_admin_learn();
    }
    echo '</main></div>';
}

function dlg_admin_heading(string $eyebrow, string $title, string $copy): void {
    printf('<header class="dlg-admin__heading"><p>%1$s</p><h1>%2$s</h1><div>%3$s</div></header>', esc_html($eyebrow), esc_html($title), esc_html($copy));
}

function dlg_admin_welcome(): void {
    dlg_admin_heading('DESERT LIQUID GLASS ' . DLG_VERSION, 'A visual system with real WordPress controls.', 'Set the site foundation, compose pages with purpose, and keep Renew-48 optional.');
    $preview = esc_url(get_stylesheet_directory_uri() . '/screenshot.png');
    $wp_version = esc_html(get_bloginfo('version'));
    $astra = wp_get_theme('astra')->exists();
    $woo = class_exists('WooCommerce');
    $renew = defined('PCW_RENEW48_VERSION') || defined('PCW_RENEW48_BLOCKS_VERSION');
    echo '<section class="dlg-welcome-hero"><div><p class="dlg-kicker">PUBLIC WEBSITE FOUNDATION</p><h2>Build from the canvas outward.</h2><p>Desert Liquid Glass is a standalone Astra child theme. It controls the visual language, page media, composition modes, template chrome, and generic visual blocks.</p><p class="dlg-actions"><a class="button button-primary" href="' . dlg_admin_link('dlg-settings') . '">Set site defaults</a><a class="button" href="' . dlg_admin_link('dlg-starters') . '">Create a draft starter</a></p></div><img src="' . $preview . '" alt="Desert Liquid Glass website preview"></section>';
    echo '<section class="dlg-admin__section"><div class="dlg-section-heading"><div><p class="dlg-kicker">SETUP</p><h2>Choose the next useful action.</h2></div></div><div class="dlg-action-grid">';
    $actions = array(
        array('01', 'Set the foundation', 'Choose a default theme, composition mode, performance preference, and motion behavior.', dlg_admin_link('dlg-settings'), 'Open settings'),
        array('02', 'Start a draft page', 'Create a private starter page. Existing pages, menus, and reading settings stay untouched.', dlg_admin_link('dlg-starters'), 'View starter templates'),
        array('03', 'Shape site chrome', 'Use the real Astra Customizer and WordPress menu manager for site-level header and footer work.', dlg_admin_link('dlg-builder'), 'Open Site Builder'),
    );
    foreach ($actions as $action) {
        printf('<article><span>%1$s</span><h3>%2$s</h3><p>%3$s</p><a href="%4$s">%5$s</a></article>', esc_html($action[0]), esc_html($action[1]), esc_html($action[2]), $action[3], esc_html($action[4]));
    }
    echo '</div></section>';
    echo '<section class="dlg-status"><div><p class="dlg-kicker">COMPATIBILITY</p><h2>Current environment</h2></div><ul>';
    printf('<li><strong>WordPress</strong><span>%s</span></li>', $wp_version);
    printf('<li><strong>Astra parent</strong><span class="%s">%s</span></li>', $astra ? 'is-ready' : 'is-attention', $astra ? 'Available' : 'Not detected');
    printf('<li><strong>WooCommerce</strong><span class="%s">%s</span></li>', $woo ? 'is-ready' : '', $woo ? 'Available' : 'Optional, not detected');
    printf('<li><strong>Renew-48</strong><span class="%s">%s</span></li>', $renew ? 'is-ready' : '', $renew ? 'Detected' : 'Optional, not detected');
    echo '</ul></section>';
}

function dlg_admin_settings(): void {
    $settings = dlg_theme_settings();
    dlg_admin_heading('SETTINGS', 'Set defaults without overriding page decisions.', 'Site defaults are the first layer. Individual pages and explicit block overrides remain in control.');
    echo '<form class="dlg-form" method="post" action="' . esc_url(admin_url('admin-post.php')) . '"><input type="hidden" name="action" value="dlg_save_settings">';
    wp_nonce_field('dlg_save_settings');
    echo '<section><h2>Composition defaults</h2><div class="dlg-field-grid"><label>Default theme<select name="default_theme">';
    foreach (dlg_themes() as $slug => $theme) {
        printf('<option value="%1$s" %2$s>%3$s</option>', esc_attr($slug), selected($settings['default_theme'], $slug, false), esc_html($theme['label']));
    }
    echo '</select><small>Token and material preset. It never supplies page imagery.</small></label><label>Default page mode<select name="default_mode"><option value="contained" ' . selected($settings['default_mode'], 'contained', false) . '>Contained Desert</option><option value="masked" ' . selected($settings['default_mode'], 'masked', false) . '>Masked Parallax</option><option value="full" ' . selected($settings['default_mode'], 'full', false) . '>Full-Bleed Glass</option></select><small>Pages can choose their own media and mode.</small></label></div></section>';
    echo '<section><h2>Accessibility and performance</h2><label class="dlg-check"><input type="checkbox" name="reduce_motion" value="always-reduce" ' . checked($settings['reduce_motion'], 'always-reduce', false) . '> Always reduce non-essential motion</label><label class="dlg-check"><input type="checkbox" name="performance" value="conserve" ' . checked($settings['performance'], 'conserve', false) . '> Prefer lower-cost visual effects</label></section><p><button class="button button-primary button-large" type="submit">Save theme defaults</button></p></form>';
}

function dlg_admin_starters(): void {
    dlg_admin_heading('STARTER TEMPLATES', 'Create drafts, never surprise live content.', 'Each action below creates one new draft page. It does not replace your homepage, menus, pages, or published content.');
    echo '<div class="dlg-template-grid">';
    $templates = array(
        array('wellness', 'Wellness landing page', 'Hero, flexible grid, and CTA composition for a service-led public site.', 'Contained Desert'),
        array('studio', 'Studio landing page', 'Hero, varied information surfaces, and consent-aware newsletter presentation.', 'Full-Bleed Glass'),
    );
    foreach ($templates as $template) {
        echo '<article class="dlg-template"><div class="dlg-template__art dlg-template__art--' . esc_attr($template[0]) . '"><span>DESERT<br>LIQUID GLASS</span><b>' . esc_html($template[3]) . '</b></div><div><h2>' . esc_html($template[1]) . '</h2><p>' . esc_html($template[2]) . '</p><form method="post" action="' . esc_url(admin_url('admin-post.php')) . '"><input type="hidden" name="action" value="dlg_create_starter"><input type="hidden" name="starter" value="' . esc_attr($template[0]) . '">';
        wp_nonce_field('dlg_create_starter');
        echo '<button class="button button-primary" type="submit">Create private draft</button></form></div></article>';
    }
    echo '</div>';
}

function dlg_admin_builder(): void {
    dlg_admin_heading('SITE BUILDER', 'Work with the actual WordPress and Astra surfaces.', 'Desert Liquid Glass does not imitate a builder. These controls open the native surfaces that own site chrome and navigation.');
    $links = array(
        array('Header and navigation', 'Use Astra Customizer controls for logo, header layout, responsive navigation, and global colors.', admin_url('customize.php')),
        array('Menus', 'Manage registered navigation menus and their real destinations in WordPress.', admin_url('nav-menus.php')),
        array('Footer and widgets', 'Configure Astra footer areas and WordPress widgets without injecting a fallback footer.', admin_url('widgets.php')),
        array('Page composition', 'Create or edit a page, then use its Desert Liquid Glass page settings and generic blocks.', admin_url('post-new.php?post_type=page')),
    );
    echo '<div class="dlg-action-grid dlg-action-grid--builder">';
    foreach ($links as $link) {
        printf('<article><h2>%1$s</h2><p>%2$s</p><a class="button" href="%3$s">Open control</a></article>', esc_html($link[0]), esc_html($link[1]), esc_url($link[2]));
    }
    echo '</div>';
}

function dlg_admin_woo(): void {
    $available = class_exists('WooCommerce');
    dlg_admin_heading('WOOCOMMERCE', $available ? 'WooCommerce presentation is available.' : 'WooCommerce is optional and not detected.', $available ? 'Open WooCommerce to configure products, checkout, tax, payment, and orders. This theme only provides presentation support.' : 'Installing WooCommerce is an administrator decision. Desert Liquid Glass does not activate commerce, payment, or checkout behavior.');
    if ($available) {
        echo '<section class="dlg-callout"><h2>Commerce stays in WooCommerce.</h2><p>Products, checkout, tax, payments, customer accounts, and orders remain WooCommerce responsibilities.</p><a class="button button-primary" href="' . esc_url(admin_url('admin.php?page=wc-admin')) . '">Open WooCommerce</a></section>';
    } else {
        echo '<section class="dlg-callout"><h2>No commerce plugin was changed.</h2><p>Install and configure WooCommerce only when your approved processor and product policy are ready.</p><a class="button" href="' . esc_url(admin_url('plugin-install.php?s=woocommerce&tab=search&type=term')) . '">View WooCommerce in Add Plugins</a></section>';
    }
}

function dlg_admin_blocks(): void {
    $file = get_stylesheet_directory() . '/block-capabilities.json';
    $inventory = file_exists($file) ? json_decode((string) file_get_contents($file), true) : array();
    $blocks = is_array($inventory) && isset($inventory['blocks']) && is_array($inventory['blocks']) ? $inventory['blocks'] : array();
    dlg_admin_heading('BLOCK LIBRARY', count($blocks) . ' generic visual blocks are available.', 'These are presentation primitives only. Renew-48-specific business blocks remain in the optional Renew-48 plugin.');
    echo '<section class="dlg-block-list">';
    foreach ($blocks as $slug => $owner) {
        $name = ucwords(str_replace('-', ' ', (string) $slug));
        printf('<article><h2>%1$s</h2><p>Generic theme-owned visual primitive with page-mode inheritance.</p><span>Geometry · Media · Material · Content</span></article>', esc_html($name));
    }
    echo '</section><p><a class="button button-primary" href="' . esc_url(admin_url('post-new.php?post_type=page')) . '">Open the block editor</a></p>';
}

function dlg_admin_learn(): void {
    dlg_admin_heading('LEARN', 'Use the system without flattening its four axes.', 'Theme controls tokens. Mode controls page composition. Media is content controlled. Surface controls block participation.');
    $lessons = array(
        array('Page modes', 'Contained Desert uses a neutral canvas with intentional component media. Masked Parallax makes eligible surfaces windows into one shared page media plane. Full-Bleed Glass keeps geometry and adds translucent material over the same plane.'),
        array('Page media', 'Authors choose page media, focal position, size, mobile media, and overlay per page. A token preset never hard-codes a desert photograph.'),
        array('Block surfaces', 'A block should retain geometry, media, material, and content layers. Use component media only when imagery belongs to that component.'),
        array('Accessibility', 'Visible focus, keyboard operation, 44 pixel targets, responsive reflow, and reduced motion are baseline behavior, not optional decoration.'),
    );
    echo '<section class="dlg-learn-list">';
    foreach ($lessons as $lesson) {
        printf('<details><summary>%1$s</summary><p>%2$s</p></details>', esc_html($lesson[0]), esc_html($lesson[1]));
    }
    echo '</section>';
}
