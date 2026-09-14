<?php
defined('ABSPATH') || exit;

$background = esc_url($asset_base . '00-full-height-background-864x1821.png');
$hero = esc_url($asset_base . '01-hero-desert-organic.png');
$question = esc_url($asset_base . '02-question-agave-panel.png');
$healing = esc_url($asset_base . '03-healing-still-life.png');
$movement = esc_url($asset_base . '04-movement-hiker.png');
$wellness = esc_url($asset_base . '05-wellness-foliage-card.png');
$personal = esc_url($asset_base . '06-personal-care-interior.png');
$eucalyptus = esc_url($asset_base . '07-eucalyptus-sprig.png');
$botanical = esc_url($asset_base . '08-botanical-line-art.png');
$footer = esc_url($asset_base . '09-footer-desert-landscape.png');
$fabric = esc_url($asset_base . '10-sheer-fabric-overlay.png');
$dots = esc_url($asset_base . '11-dotted-ornament.png');
$glass_wide = esc_url($asset_base . 'glass-01-wide-copy-panel.png');
$glass_portrait = esc_url($asset_base . 'glass-02-portrait-copy-card.png');
$glass_large = esc_url($asset_base . 'glass-03-large-section-panel.png');
$glass_service = esc_url($asset_base . 'glass-04-service-card.png');
$glass_light = esc_url($asset_base . 'glass-05-action-card-light.png');
$glass_dark = esc_url($asset_base . 'glass-06-action-card-dark.png');
$glass_seo = esc_url($asset_base . 'glass-07-seo-wide-panel.png');
$icon_healing = esc_url($asset_base . 'icon-healing-lotus.png');
$icon_movement = esc_url($asset_base . 'icon-movement-runner.png');
$icon_wellness = esc_url($asset_base . 'icon-wellness-meditation.png');
$icon_question = esc_url($asset_base . 'icon-question.png');
$icon_listen = esc_url($asset_base . 'icon-listen-heart.png');
$icon_community = esc_url($asset_base . 'icon-community.png');

return <<<HTML
<!-- wp:group {"align":"full","className":"r48-unleashed-standard","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull r48-unleashed-standard">
<!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"r48-page-background"} -->
<figure class="wp-block-image size-full r48-page-background"><img src="{$background}" alt=""/></figure>
<!-- /wp:image -->

<!-- wp:group {"className":"r48-live-rail","layout":{"type":"constrained"}} -->
<div class="wp-block-group r48-live-rail">
<!-- wp:paragraph {"className":"r48-rail-brand"} --><p class="r48-rail-brand"><strong>RENEW48</strong><br><small>WELLNESS COLLECTIVE</small></p><!-- /wp:paragraph -->
<!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"r48-rail-icon"} --><figure class="wp-block-image size-full r48-rail-icon"><img src="{$icon_healing}" alt=""/></figure><!-- /wp:image -->
<!-- wp:paragraph --><p><a href="#healing">HEALING</a></p><!-- /wp:paragraph -->
<!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"r48-rail-icon"} --><figure class="wp-block-image size-full r48-rail-icon"><img src="{$icon_movement}" alt=""/></figure><!-- /wp:image -->
<!-- wp:paragraph --><p><a href="#movement">MOVEMENT</a></p><!-- /wp:paragraph -->
<!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"r48-rail-icon"} --><figure class="wp-block-image size-full r48-rail-icon"><img src="{$icon_wellness}" alt=""/></figure><!-- /wp:image -->
<!-- wp:paragraph --><p><a href="#wellness">WELLNESS</a></p><!-- /wp:paragraph -->
<!-- wp:paragraph {"className":"r48-rail-menu"} --><p class="r48-rail-menu">MENU</p><!-- /wp:paragraph -->
<!-- wp:paragraph {"className":"r48-rail-quote"} --><p class="r48-rail-quote"><em>Rooted in the desert.<br>Elevated by care.<br>Inspired by movement.</em></p><!-- /wp:paragraph -->
</div>
<!-- /wp:group -->

<!-- wp:group {"className":"r48-article-canvas","layout":{"type":"constrained"}} -->
<div class="wp-block-group r48-article-canvas">
<!-- wp:group {"className":"r48-masthead r48-animate","layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"space-between"}} -->
<div class="wp-block-group r48-masthead r48-animate">
<!-- wp:group {"layout":{"type":"constrained"}} --><div class="wp-block-group"><!-- wp:heading {"level":1} --><h1 class="wp-block-heading">UNLEASHED</h1><!-- /wp:heading --><!-- wp:paragraph --><p>THE OFFICIAL BLOG OF RENEW48</p><!-- /wp:paragraph --></div><!-- /wp:group -->
<!-- wp:paragraph {"className":"r48-mind-body-soul"} --><p class="r48-mind-body-soul">MIND&nbsp;&nbsp;|&nbsp;&nbsp;BODY&nbsp;&nbsp;|&nbsp;&nbsp;SOUL</p><!-- /wp:paragraph -->
<!-- wp:paragraph {"className":"r48-partners"} --><p class="r48-partners"><em>ChiroGoAZ</em>&nbsp;&nbsp; | &nbsp;&nbsp;<em>Aroma HMT</em></p><!-- /wp:paragraph -->
</div>
<!-- /wp:group -->

<!-- wp:group {"className":"r48-hero r48-animate","layout":{"type":"grid","columnCount":2,"minimumColumnWidth":null}} -->
<div class="wp-block-group r48-hero r48-animate">
<!-- wp:group {"className":"r48-hero-copy","layout":{"type":"constrained"}} --><div class="wp-block-group r48-hero-copy">
<!-- wp:paragraph {"className":"r48-post-meta"} --><p class="r48-post-meta"><strong>POST 01</strong>&nbsp;&nbsp;&nbsp; TUESDAY, AUGUST 18, 2026 &nbsp; • &nbsp; BY RENEW48</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":2} --><h2 class="wp-block-heading">Committed to Wellness:<br>A Better Approach to<br>Whole-Person Care</h2><!-- /wp:heading -->
<!-- wp:separator {"className":"r48-gold-rule"} --><hr class="wp-block-separator has-alpha-channel-opacity r48-gold-rule"/><!-- /wp:separator -->
<!-- wp:paragraph {"className":"r48-tagline"} --><p class="r48-tagline"><em>HEALING. MOVEMENT. WELLNESS. — HERE FOR YOU.</em></p><!-- /wp:paragraph -->
<!-- wp:paragraph {"className":"r48-share"} --><p class="r48-share"><strong>SHARE:</strong>&nbsp;&nbsp; FACEBOOK &nbsp; INSTAGRAM &nbsp; LINKEDIN &nbsp; COPY LINK</p><!-- /wp:paragraph -->
</div><!-- /wp:group -->
<!-- wp:group {"className":"r48-hero-art","layout":{"type":"constrained"}} --><div class="wp-block-group r48-hero-art">
<!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"r48-hero-image r48-float"} --><figure class="wp-block-image size-full r48-hero-image r48-float"><img src="{$hero}" alt="Sonoran desert at sunrise with saguaro cactus"/></figure><!-- /wp:image -->
<!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"r48-hero-botanical r48-sway"} --><figure class="wp-block-image size-full r48-hero-botanical r48-sway"><img src="{$botanical}" alt=""/></figure><!-- /wp:image -->
</div><!-- /wp:group -->
</div>
<!-- /wp:group -->

<!-- wp:group {"className":"r48-glass r48-big-idea r48-animate","layout":{"type":"constrained"}} -->
<div class="wp-block-group r48-glass r48-big-idea r48-animate">
<!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"r48-glass-shell"} --><figure class="wp-block-image size-full r48-glass-shell"><img src="{$glass_wide}" alt=""/></figure><!-- /wp:image -->
<!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"r48-round-icon"} --><figure class="wp-block-image size-full r48-round-icon"><img src="{$icon_healing}" alt=""/></figure><!-- /wp:image -->
<!-- wp:group {"className":"r48-glass-copy","layout":{"type":"constrained"}} --><div class="wp-block-group r48-glass-copy"><!-- wp:heading {"level":3} --><h3 class="wp-block-heading">THE BIG IDEA</h3><!-- /wp:heading --><!-- wp:paragraph --><p>Whole-person wellness is not about adding more to your checklist. It is about understanding how movement, recovery, stress, rest, connection, and care work together—and creating support around the whole you.</p><!-- /wp:paragraph --></div><!-- /wp:group -->
<!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"r48-idea-eucalyptus r48-sway"} --><figure class="wp-block-image size-full r48-idea-eucalyptus r48-sway"><img src="{$eucalyptus}" alt=""/></figure><!-- /wp:image -->
</div>
<!-- /wp:group -->

<!-- wp:group {"className":"r48-intro r48-animate","layout":{"type":"grid","columnCount":2,"minimumColumnWidth":null}} -->
<div class="wp-block-group r48-intro r48-animate">
<!-- wp:group {"className":"r48-intro-copy","layout":{"type":"constrained"}} --><div class="wp-block-group r48-intro-copy">
<!-- wp:paragraph --><p>If you live in the Phoenix Valley, you probably know what it means to push through heat. Whether you are navigating the intense summer heat, recovering from an active weekend on the trails, or managing the daily hustle, it’s all too easy to view our health as a mere checklist—seeking a quick fix for a sore back or an hour of relief from stress.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p>But true whole-person wellness goes beyond a single appointment, habit, or product. It’s about freeing yourself from the pain you didn’t know you had—whether that pain is physical, mental, or emotional. It is about how the pieces of your life work together: how you move, recover, manage stress, rest, connect, and make choices that support the person you want to be.</p><!-- /wp:paragraph -->
<!-- wp:paragraph --><p>Recognizing the need for a more connected approach right here in our community is the foundation of Committed to Wellness, a shared direction from Renew48 and our collective members.</p><!-- /wp:paragraph -->
</div><!-- /wp:group -->
<!-- wp:group {"className":"r48-glass r48-question-card","layout":{"type":"constrained"}} --><div class="wp-block-group r48-glass r48-question-card">
<!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"r48-card-photo"} --><figure class="wp-block-image size-full r48-card-photo"><img src="{$question}" alt="Agave in the Sonoran desert"/></figure><!-- /wp:image -->
<!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"r48-glass-shell"} --><figure class="wp-block-image size-full r48-glass-shell"><img src="{$glass_portrait}" alt=""/></figure><!-- /wp:image -->
<!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"r48-round-icon"} --><figure class="wp-block-image size-full r48-round-icon"><img src="{$icon_question}" alt=""/></figure><!-- /wp:image -->
<!-- wp:heading {"level":3} --><h3 class="wp-block-heading">A BETTER QUESTION</h3><!-- /wp:heading -->
<!-- wp:paragraph --><p>Instead of asking only, “What is bothering you today?” whole-person care also asks: “What are you trying to get back to?”</p><!-- /wp:paragraph -->
</div><!-- /wp:group -->
</div>
<!-- /wp:group -->

<!-- wp:paragraph {"align":"center","className":"r48-pullquote r48-animate"} --><p class="has-text-align-center r48-pullquote r48-animate">Maybe that is moving comfortably, returning to a favorite activity, creating space to recover, or finally releasing tension you’ve been carrying for years without realizing it.</p><!-- /wp:paragraph -->

<!-- wp:group {"anchor":"healing","className":"r48-glass r48-angle-section r48-animate","layout":{"type":"constrained"}} -->
<div id="healing" class="wp-block-group r48-glass r48-angle-section r48-animate">
<!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"r48-glass-shell"} --><figure class="wp-block-image size-full r48-glass-shell"><img src="{$glass_large}" alt=""/></figure><!-- /wp:image -->
<!-- wp:paragraph {"className":"r48-section-number"} --><p class="r48-section-number">02</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":2} --><h2 class="wp-block-heading">Wellness from Every Angle</h2><!-- /wp:heading -->
<!-- wp:paragraph {"className":"r48-section-intro"} --><p class="r48-section-intro">Committed to Wellness brings together complementary perspectives across the Renew48 collective to help you uncover and address those hidden roadblocks:</p><!-- /wp:paragraph -->
<!-- wp:group {"className":"r48-service-grid","layout":{"type":"grid","columnCount":3,"minimumColumnWidth":null}} --><div class="wp-block-group r48-service-grid">
<!-- wp:group {"className":"r48-glass r48-service-card","layout":{"type":"constrained"}} --><div class="wp-block-group r48-glass r48-service-card"><!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"r48-card-photo"} --><figure class="wp-block-image size-full r48-card-photo"><img src="{$healing}" alt="Massage and restorative-care still life"/></figure><!-- /wp:image --><!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"r48-glass-shell"} --><figure class="wp-block-image size-full r48-glass-shell"><img src="{$glass_service}" alt=""/></figure><!-- /wp:image --><!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"r48-round-icon"} --><figure class="wp-block-image size-full r48-round-icon"><img src="{$icon_healing}" alt=""/></figure><!-- /wp:image --><!-- wp:heading {"level":3} --><h3 class="wp-block-heading">HEALING</h3><!-- /wp:heading --><!-- wp:paragraph --><p>Therapeutic massage and restorative care create space for recovery, relaxation, and mindful self-care.</p><!-- /wp:paragraph --></div><!-- /wp:group -->
<!-- wp:group {"anchor":"movement","className":"r48-glass r48-service-card","layout":{"type":"constrained"}} --><div id="movement" class="wp-block-group r48-glass r48-service-card"><!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"r48-card-photo"} --><figure class="wp-block-image size-full r48-card-photo"><img src="{$movement}" alt="Hiker moving through a desert mountain landscape"/></figure><!-- /wp:image --><!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"r48-glass-shell"} --><figure class="wp-block-image size-full r48-glass-shell"><img src="{$glass_service}" alt=""/></figure><!-- /wp:image --><!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"r48-round-icon"} --><figure class="wp-block-image size-full r48-round-icon"><img src="{$icon_movement}" alt=""/></figure><!-- /wp:image --><!-- wp:heading {"level":3} --><h3 class="wp-block-heading">MOVEMENT</h3><!-- /wp:heading --><!-- wp:paragraph --><p>A movement-focused approach helps people better understand how their bodies move and function.</p><!-- /wp:paragraph --></div><!-- /wp:group -->
<!-- wp:group {"anchor":"wellness","className":"r48-glass r48-service-card","layout":{"type":"constrained"}} --><div id="wellness" class="wp-block-group r48-glass r48-service-card"><!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"r48-card-photo"} --><figure class="wp-block-image size-full r48-card-photo"><img src="{$wellness}" alt="Soft desert wellness foliage"/></figure><!-- /wp:image --><!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"r48-glass-shell"} --><figure class="wp-block-image size-full r48-glass-shell"><img src="{$glass_service}" alt=""/></figure><!-- /wp:image --><!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"r48-round-icon"} --><figure class="wp-block-image size-full r48-round-icon"><img src="{$icon_wellness}" alt=""/></figure><!-- /wp:image --><!-- wp:heading {"level":3} --><h3 class="wp-block-heading">WELLNESS</h3><!-- /wp:heading --><!-- wp:paragraph --><p>Together, we connect everyday choices with a more purposeful approach to your well-being.</p><!-- /wp:paragraph --></div><!-- /wp:group -->
</div><!-- /wp:group -->
<!-- wp:paragraph {"align":"center","className":"r48-bottom-note"} --><p class="has-text-align-center r48-bottom-note">The goal is not to force everyone into the same path. It is to create a clearer, more coordinated experience where you can discover services, ask better questions, and choose the support that makes sense for you.</p><!-- /wp:paragraph -->
</div>
<!-- /wp:group -->

<!-- wp:group {"className":"r48-personal-section r48-animate","layout":{"type":"grid","columnCount":4,"minimumColumnWidth":null}} -->
<div class="wp-block-group r48-personal-section r48-animate">
<!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"r48-personal-photo"} --><figure class="wp-block-image size-full r48-personal-photo"><img src="{$personal}" alt="Calm personal-care interior"/></figure><!-- /wp:image -->
<!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"r48-personal-fabric r48-float"} --><figure class="wp-block-image size-full r48-personal-fabric r48-float"><img src="{$fabric}" alt=""/></figure><!-- /wp:image -->
<!-- wp:paragraph {"className":"r48-section-number"} --><p class="r48-section-number">03</p><!-- /wp:paragraph -->
<!-- wp:heading {"level":2} --><h2 class="wp-block-heading">Care Should Feel<br>Personal, Not<br>Transactional</h2><!-- /wp:heading -->
<!-- wp:group {"className":"r48-glass r48-listen-card","layout":{"type":"constrained"}} --><div class="wp-block-group r48-glass r48-listen-card"><!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"r48-glass-shell"} --><figure class="wp-block-image size-full r48-glass-shell"><img src="{$glass_portrait}" alt=""/></figure><!-- /wp:image --><!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"r48-round-icon"} --><figure class="wp-block-image size-full r48-round-icon"><img src="{$icon_listen}" alt=""/></figure><!-- /wp:image --><!-- wp:heading {"level":3} --><h3 class="wp-block-heading">LISTEN FIRST</h3><!-- /wp:heading --><!-- wp:paragraph --><p>Your goals, preferences, schedule, comfort level, and lived experiences matter. Care should create room for conversation, clarity, and informed choice—not a one-size-fits-all checklist.</p><!-- /wp:paragraph --></div><!-- /wp:group -->
<!-- wp:group {"className":"r48-personal-copy","layout":{"type":"constrained"}} --><div class="wp-block-group r48-personal-copy"><!-- wp:paragraph --><p>Renew48 is built around the idea that stronger wellness ecosystems are local and relational. When trusted providers, practitioners, and community members share knowledge and support one another, wellness becomes easier to navigate—and undeniably more human.</p><!-- /wp:paragraph --><!-- wp:paragraph --><p>For us, “committed” means showing up with consistency: creating welcoming experiences, collaborating where it adds value, and continuing to improve how our collective supports the community.</p><!-- /wp:paragraph --><!-- wp:paragraph --><p>Over the coming weeks, UNLEASHED will explore movement, therapeutic care, body awareness, recovery, referrals, and the practical habits that can help you build a more mindful relationship with your well-being.</p><!-- /wp:paragraph --></div><!-- /wp:group -->
</div>
<!-- /wp:group -->

<!-- wp:group {"className":"r48-glass r48-next-section r48-animate","layout":{"type":"grid","columnCount":4,"minimumColumnWidth":null}} -->
<div class="wp-block-group r48-glass r48-next-section r48-animate">
<!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"r48-glass-shell"} --><figure class="wp-block-image size-full r48-glass-shell"><img src="{$glass_large}" alt=""/></figure><!-- /wp:image -->
<!-- wp:paragraph {"className":"r48-section-number"} --><p class="r48-section-number">04</p><!-- /wp:paragraph -->
<!-- wp:group {"className":"r48-next-copy","layout":{"type":"constrained"}} --><div class="wp-block-group r48-next-copy"><!-- wp:heading {"level":2} --><h2 class="wp-block-heading">Your Next Step</h2><!-- /wp:heading --><!-- wp:paragraph --><p>Start with the question that matters most to you. Explore the Renew48 collective, learn about available services, and choose the next step that aligns with your goals.</p><!-- /wp:paragraph --></div><!-- /wp:group -->
<!-- wp:group {"className":"r48-glass r48-action-card r48-action-dark","layout":{"type":"constrained"}} --><div class="wp-block-group r48-glass r48-action-card r48-action-dark"><!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"r48-glass-shell"} --><figure class="wp-block-image size-full r48-glass-shell"><img src="{$glass_dark}" alt=""/></figure><!-- /wp:image --><!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"r48-round-icon"} --><figure class="wp-block-image size-full r48-round-icon"><img src="{$icon_community}" alt=""/></figure><!-- /wp:image --><!-- wp:heading {"level":3} --><h3 class="wp-block-heading"><a href="#collective">EXPLORE THE COLLECTIVE</a></h3><!-- /wp:heading --><!-- wp:paragraph --><p>Discover Renew48, ChiroGoAZ, and Aroma HMT.</p><!-- /wp:paragraph --></div><!-- /wp:group -->
<!-- wp:group {"className":"r48-glass r48-action-card","layout":{"type":"constrained"}} --><div class="wp-block-group r48-glass r48-action-card"><!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"r48-glass-shell"} --><figure class="wp-block-image size-full r48-glass-shell"><img src="{$glass_light}" alt=""/></figure><!-- /wp:image --><!-- wp:heading {"level":3} --><h3 class="wp-block-heading"><a href="#unleashed">CONTINUE UNLEASHED</a></h3><!-- /wp:heading --><!-- wp:paragraph --><p>New insight every Tuesday.</p><!-- /wp:paragraph --></div><!-- /wp:group -->
</div>
<!-- /wp:group -->

<!-- wp:group {"className":"r48-glass r48-seo-panel r48-animate","layout":{"type":"constrained"}} -->
<div class="wp-block-group r48-glass r48-seo-panel r48-animate">
<!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"r48-glass-shell"} --><figure class="wp-block-image size-full r48-glass-shell"><img src="{$glass_seo}" alt=""/></figure><!-- /wp:image -->
<!-- wp:heading {"level":3} --><h3 class="wp-block-heading">SEO &amp; PUBLISHING</h3><!-- /wp:heading -->
<!-- wp:columns {"className":"r48-seo-columns"} --><div class="wp-block-columns r48-seo-columns">
<!-- wp:column --><div class="wp-block-column"><!-- wp:paragraph --><p><strong>SEO TITLE</strong><br>Committed to Wellness: A Better Approach to Whole-Person Care | Renew48</p><!-- /wp:paragraph --></div><!-- /wp:column -->
<!-- wp:column --><div class="wp-block-column"><!-- wp:paragraph --><p><strong>DESCRIPTION</strong><br>Discover Renew48’s whole-person approach to wellness and how healing, movement, restorative care, and community come together.</p><!-- /wp:paragraph --></div><!-- /wp:column -->
<!-- wp:column --><div class="wp-block-column"><!-- wp:paragraph --><p><strong>SUGGESTED SLUG</strong><br>/unleashed/committed-to-wellness/</p><!-- /wp:paragraph --></div><!-- /wp:column -->
<!-- wp:column --><div class="wp-block-column"><!-- wp:paragraph --><p><strong>PRIMARY KEYPHRASE</strong><br>whole-person wellness</p><!-- /wp:paragraph --></div><!-- /wp:column -->
<!-- wp:column --><div class="wp-block-column"><!-- wp:paragraph --><p><strong>SOCIAL EXCERPT</strong><br>Wellness is bigger than a single appointment. Discover how Renew48 brings healing, movement, restorative care, and community together.</p><!-- /wp:paragraph --></div><!-- /wp:column -->
</div><!-- /wp:columns -->
</div>
<!-- /wp:group -->

<!-- wp:group {"className":"r48-page-footer r48-animate","layout":{"type":"constrained"}} -->
<div class="wp-block-group r48-page-footer r48-animate">
<!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"r48-footer-landscape"} --><figure class="wp-block-image size-full r48-footer-landscape"><img src="{$footer}" alt="Sonoran desert mountain landscape"/></figure><!-- /wp:image -->
<!-- wp:image {"sizeSlug":"full","linkDestination":"none","className":"r48-footer-dots"} --><figure class="wp-block-image size-full r48-footer-dots"><img src="{$dots}" alt=""/></figure><!-- /wp:image -->
<!-- wp:paragraph {"align":"center"} --><p class="has-text-align-center">ROOTED IN THE DESERT &nbsp; • &nbsp; ELEVATED BY CARE &nbsp; • &nbsp; INSPIRED BY MOVEMENT.</p><!-- /wp:paragraph -->
<!-- wp:paragraph {"align":"center","className":"r48-footer-small"} --><p class="has-text-align-center r48-footer-small">UNLEASHED &nbsp; • &nbsp; MIND | BODY | SOUL &nbsp; • &nbsp; PUBLISHED BY RENEW48 &nbsp; • &nbsp; FEATURING CONTRIBUTING AUTHORS FROM OUR COLLECTIVE MEMBERS</p><!-- /wp:paragraph -->
</div>
<!-- /wp:group -->
</div>
<!-- /wp:group -->
</div>
<!-- /wp:group -->
HTML;
