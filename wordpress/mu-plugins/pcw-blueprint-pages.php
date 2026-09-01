<?php
/**
 * Blueprint page system for the three independent staging domains.
 * Content is domain-local, non-PHI, and uses WordPress pages/menus only.
 */
if (!defined('ABSPATH')) { exit; }

function pcw_bp_config() {
    $host = (string) wp_parse_url(home_url('/'), PHP_URL_HOST);
    $domain = preg_replace('/-staging\\..*$/', '', $host);
    $base = array(
        'chirogoaz' => array('name'=>'ChiroGoAZ','mode'=>'chiro','eyebrow'=>'Corrective care · Phoenix','jane'=>'https://chirogoaz.janeapp.com','front'=>'rebuild-home','primary'=>'#1f3550','accent'=>'#e8a35b','soft'=>'#e7edf1','services'=>'Chiropractic Services','service_slug'=>'chiropractic-services'),
        'aromahmt' => array('name'=>'AromaHMT','mode'=>'aroma','eyebrow'=>'Massage · Ritual · Recovery','jane'=>'https://aromahmt.janeapp.com','front'=>'aromahmt','primary'=>'#304b43','accent'=>'#bc7356','soft'=>'#e9e0d0','services'=>'Massage Services','service_slug'=>'massage-services'),
        'renew48' => array('name'=>'Renew48','mode'=>'cobranded','eyebrow'=>'Whole-person wellness · Phoenix','jane'=>'','front'=>'renew48','primary'=>'#314b68','accent'=>'#b95c43','soft'=>'#f0e3d3','services'=>'Unified Services','service_slug'=>'services'),
    );
    $cfg = $base[$domain] ?? $base['renew48'];
    $cfg['domain'] = $domain;
    return $cfg;
}

function pcw_bp_pages($cfg) {
    $pages = array(
        array('slug'=>$cfg['front'],'title'=>$cfg['name'].' Home','type'=>'home'),
        array('slug'=>$cfg['service_slug'],'title'=>$cfg['services'],'type'=>'services'),
        array('slug'=>'memberships','title'=>'The Wellness Paths','type'=>'memberships'),
        array('slug'=>'booking','title'=>'How Booking Works','type'=>'booking'),
        array('slug'=>'blog','title'=>'Unleashed Journal','type'=>'blog'),
        array('slug'=>'shop','title'=>'Unearthed Treasures','type'=>'shop'),
        array('slug'=>'about','title'=>'About '.$cfg['name'],'type'=>'about'),
        array('slug'=>'providers','title'=>'Meet the Providers','type'=>'providers'),
        array('slug'=>'locations','title'=>'Locations & Hours','type'=>'locations'),
        array('slug'=>'faq','title'=>'Frequently Asked Questions','type'=>'faq'),
        array('slug'=>'contact','title'=>'Contact '.$cfg['name'],'type'=>'contact'),
        array('slug'=>'privacy-policy','title'=>'Privacy Policy','type'=>'legal'),
        array('slug'=>'hipaa-privacy','title'=>'HIPAA & Privacy Notices','type'=>'legal'),
        array('slug'=>'terms','title'=>'Terms of Use','type'=>'legal'),
        array('slug'=>'404-page','title'=>'Page Not Found','type'=>'system-404'),
        array('slug'=>'maintenance','title'=>'We Are Refreshing the Space','type'=>'maintenance'),
        array('slug'=>'account','title'=>'Your Wellness Account','type'=>'account'),
        array('slug'=>'corporate-wellness','title'=>'Corporate, Event & Sports Wellness','type'=>'funnel'),
        array('slug'=>'contract-savings','title'=>'Annual Contract Savings','type'=>'funnel'),
        array('slug'=>'referrals','title'=>'Referral & VIP Pathway','type'=>'funnel'),
        array('slug'=>'path-quiz','title'=>'Wellness Path Quiz','type'=>'funnel'),
        array('slug'=>'walk-in-waitlist','title'=>'Walk-in & Waitlist','type'=>'funnel'),
        array('slug'=>'gift-cards','title'=>'Gift Cards','type'=>'funnel'),
        array('slug'=>'seasonal-wellness','title'=>'Seasonal Wellness','type'=>'funnel'),
        array('slug'=>'reviews','title'=>'Reviews & Reputation','type'=>'funnel'),
        array('slug'=>'insurance-packages','title'=>'Insurance-Friendly Packages','type'=>'draft-funnel'),
        array('slug'=>'chatbot','title'=>'Wellness Guide','type'=>'chatbot'),
    );
    // Preserve the familiar /services/ entry point on the single-brand installs
    // while keeping the canonical blueprint page domain-local.
    if ($cfg['mode'] !== 'cobranded' && $cfg['service_slug'] !== 'services') {
        $pages[] = array('slug'=>'services','title'=>$cfg['services'],'type'=>'services');
    }
    if ($cfg['mode'] === 'chiro') {
        $pages[] = array('slug'=>'chiropractic-adjustments','title'=>'Chiropractic Adjustments','type'=>'detail');
        $pages[] = array('slug'=>'chiropractic-evaluations','title'=>'New Patient Evaluations','type'=>'detail');
        $pages[] = array('slug'=>'soft-tissue','title'=>'Soft Tissue Therapy','type'=>'detail');
        $pages[] = array('slug'=>'functional-movement','title'=>'Functional Movement','type'=>'detail');
    } elseif ($cfg['mode'] === 'aroma') {
        foreach (array('therapeutic-massage'=>'Therapeutic Massage','reflexology'=>'Reflexology','cupping'=>'Cupping & Specialty Therapies','aromatouch'=>'AromaTouch','hot-stone'=>'Hot Stone Ritual','customized-massage'=>'Customized Sessions') as $slug=>$title) {
            $pages[] = array('slug'=>$slug,'title'=>$title,'type'=>'detail');
        }
    }
    return $pages;
}

function pcw_bp_link($text, $href, $kind='primary') {
    return '<a class="pcw-btn pcw-'.$kind.'" data-funnel href="'.esc_url($href).'">'.esc_html($text).' <span aria-hidden="true">↗</span></a>';
}

function pcw_bp_layout($cfg, $kicker, $title, $intro, $inner) {
    $jane = $cfg['jane'] ? pcw_bp_link('Open Jane to book', $cfg['jane'], 'primary') : pcw_bp_link('Start a conversation', home_url('/contact/'), 'primary');
    return '<div class="pcw-bp pcw-'.$cfg['mode'].'"><section class="pcw-hero"><div class="pcw-hero-copy"><span class="pcw-kicker">'.esc_html($kicker).'</span><h1>'.esc_html($title).'</h1><p>'.esc_html($intro).'</p><div class="pcw-actions">'.$jane.' '.pcw_bp_link('Explore memberships', home_url('/memberships/'), 'quiet').'</div></div><div class="pcw-orbit" aria-hidden="true"><span></span><span></span><span></span></div></section>'.$inner.'</div>';
}

function pcw_bp_home($cfg) {
    $split = $cfg['mode']==='cobranded' ? '<section class="pcw-split"><article><span class="pcw-kicker">Twilight care</span><h2>Move with more confidence.</h2><p>Chiropractic care built around clear next steps, better movement, and a body that feels more at home.</p>'.pcw_bp_link('Explore chiropractic', home_url('/services/'), 'quiet').'</article><article><span class="pcw-kicker">Daylight ritual</span><h2>Make room to soften.</h2><p>Massage and restorative rituals that help you reconnect with the pace your body is asking for.</p>'.pcw_bp_link('Explore massage', home_url('/services/'), 'quiet').'</article></section>' : '<section class="pcw-feature"><span class="pcw-kicker">'.$cfg['eyebrow'].'</span><h2>Care that meets you where you are.</h2><p>From your first conversation to the next appointment, every step is designed to feel clear, human, and easy to continue.</p></section>';
    $services = $cfg['mode']==='chiro' ? array('Adjustments','Evaluations','Soft tissue','Functional movement') : ($cfg['mode']==='aroma' ? array('Therapeutic massage','Reflexology','Cupping','AromaTouch') : array('Chiropractic care','Massage rituals','Wellness paths','Retail essentials'));
    $cards=''; foreach($services as $i=>$s){$cards.='<article class="pcw-card pcw-card-'.$i.'"><span class="pcw-index">0'.($i+1).'</span><h3>'.esc_html($s).'</h3><p>Thoughtful care, explained simply, with a next step that belongs to you.</p>'.pcw_bp_link('View pathway', home_url('/'.$cfg['service_slug'].'/'), 'text').'</article>';}
    $paths=''; foreach(array('Essence','Balance','Harmony','Unity') as $i=>$p){$paths.='<article class="pcw-path"><span>Path '.($i+1).'</span><h3>'.$p.'</h3><p>A steady rhythm of care, savings, and support.</p></article>';}
    $inner = $split.'<section class="pcw-section"><div class="pcw-section-head"><div><span class="pcw-kicker">Featured pathways</span><h2>Start with the kind of care you can keep.</h2></div><p>Every service has a clear explanation, a provider context, and a Jane-compliant booking path.</p></div><div class="pcw-grid">'.$cards.'</div></section><section class="pcw-section pcw-paths"><div class="pcw-section-head"><div><span class="pcw-kicker">The Wellness Paths</span><h2>Consistency makes the difference.</h2></div><p>Membership is a request-led conversation, not an impulse checkout.</p></div><div class="pcw-grid pcw-path-grid">'.$paths.'</div>'.pcw_bp_link('Explore all paths', home_url('/memberships/'), 'primary').'</section><section class="pcw-editorial"><article><span class="pcw-kicker">Unleashed · Body / Mind / Soul</span><h2>Ideas for the way you live in your body.</h2><p>Read practical, grounded notes on movement, recovery, ritual, and the small choices that compound.</p>'.pcw_bp_link('Explore the journal', home_url('/blog/'), 'quiet').'</article><article><span class="pcw-kicker">Unearthed Treasures</span><h2>Bring the ritual home.</h2><p>Shop approved wellness essentials through WooCommerce. Service and clinical state remain in Jane.</p>'.pcw_bp_link('Visit the shop', home_url('/shop/'), 'quiet').'</article></section><section class="pcw-contact-band"><div><span class="pcw-kicker">Ready when you are</span><h2>There is no wrong place to begin.</h2><p>Ask a question, open Jane, or explore a path that fits the season you are in.</p></div><div class="pcw-actions">'.$jane.' '.pcw_bp_link('Contact the team', home_url('/contact/'), 'quiet').'</div></section>';
    return '<div class="pcw-bp pcw-'.$cfg['mode'].'"><section class="pcw-hero pcw-home-hero"><div class="pcw-hero-copy"><span class="pcw-kicker">'.esc_html($cfg['eyebrow']).'</span><h1>Feel more at home in your body.</h1><p>One clear next step at a time: chiropractic, massage, membership paths, and a more grounded way to keep going.</p><div class="pcw-actions">'.($cfg['jane'] ? pcw_bp_link('Book chiropractic', $cfg['jane'], 'primary') : pcw_bp_link('Explore services', home_url('/services/'), 'primary')).' '.pcw_bp_link('Choose your path', home_url('/memberships/'), 'quiet').'</div></div><div class="pcw-orbit pcw-sunrise" aria-hidden="true"><span></span><span></span><span></span><b>Sunrise<br>Evolution</b></div></section>'.$inner.'</div>';
}

function pcw_bp_content($cfg, $page) {
    $type=$page['type']; $title=$page['title'];
    if ($type==='home') return pcw_bp_home($cfg);
    if ($type==='services') {
        $items=$cfg['mode']==='chiro'?array('Adjustments','Evaluations','Soft Tissue Therapy','Functional Movement'):($cfg['mode']==='aroma'?array('Therapeutic Massage','Reflexology','Cupping','AromaTouch','Hot Stone','Customized Sessions'):array('Chiropractic Care','Massage Rituals','Wellness Paths','Retail Essentials'));
        $slugs=$cfg['mode']==='chiro'?array('chiropractic-adjustments','chiropractic-evaluations','soft-tissue','functional-movement'):($cfg['mode']==='aroma'?array('therapeutic-massage','reflexology','cupping','aromatouch','hot-stone','customized-massage'):array('services','services','memberships','shop'));
        $grid=''; foreach($items as $i=>$item){$slug=$slugs[$i]??sanitize_title($item);$grid.='<article class="pcw-card"><span class="pcw-kicker">'.($cfg['mode']==='chiro'?'Chiro':'Aroma').' pathway</span><h2>'.esc_html($item).'</h2><p>Understand what to expect, who it is for, and how membership benefits apply.</p>'.pcw_bp_link('View details',home_url('/'.$slug.'/'),'text').'</article>';}
        return pcw_bp_layout($cfg,$cfg['eyebrow'],$title,'A focused menu of care, organized so the right next step is easy to see.','<section class="pcw-section"><div class="pcw-grid">'.$grid.'</div></section><section class="pcw-note"><strong>Booking stays in Jane.</strong> This site explains the pathway and sends you to the approved booking destination without mirroring clinical records.</section>');
    }
    if ($type==='detail') return pcw_bp_layout($cfg,'Service detail',$title,'A clear, grounded explanation of this pathway, including what to expect and how to begin.','<section class="pcw-section pcw-detail"><div><span class="pcw-kicker">What to expect</span><h2>Care with a beginning, middle, and next step.</h2><p>Your provider will meet you with context, conversation, and a plan that respects your pace. Clinical intake and service records remain in Jane.</p><ul><li>Conversation and context first</li><li>Personalized care plan</li><li>Simple next-step guidance</li></ul></div><aside><span class="pcw-kicker">Membership</span><h2>Included or discounted by path.</h2><p>Review the four Wellness Paths before booking.</p>'.pcw_bp_link('Explore memberships',home_url('/memberships/'),'quiet').'</aside></section>');
    if ($type==='memberships') { $paths=''; foreach(array('Essence'=>'A steady beginning with included care.','Balance'=>'More support, savings, and earlier access.','Harmony'=>'Higher discounts and loyalty multipliers.','Unity'=>'Our most connected path for families and high-engagement care.') as $p=>$d){$paths.='<article class="pcw-path"><span>The Wellness Paths</span><h2>'.esc_html($p).'</h2><p>'.esc_html($d).'</p><strong>Monthly + annual options</strong></article>'; } return pcw_bp_layout($cfg,'Memberships',$title,'Choose the level of support that makes care easier to keep.','<section class="pcw-section"><div class="pcw-grid pcw-path-grid">'.$paths.'</div></section><section class="pcw-note"><strong>Begin your path.</strong> Request-only membership flows collect only non-PHI intent here; fulfillment and service membership state remain in Jane.</section>'); }
    if ($type==='booking') return pcw_bp_layout($cfg,'Jane-compliant booking',$title,'Booking happens securely in Jane. This page explains the handoff without an iframe or mirrored clinical system.','<section class="pcw-section pcw-detail"><div><span class="pcw-kicker">01 · Choose</span><h2>Pick the care you are looking for.</h2><p>Start from services, memberships, or the direct booking button below.</p></div><div><span class="pcw-kicker">02 · Open</span><h2>Continue in Jane.</h2><p>Use the approved domain in a new tab so Jane remains the source of truth.</p>'.($cfg['jane']?pcw_bp_link('Open Jane to book',$cfg['jane'],'primary'):pcw_bp_link('Contact for booking link',home_url('/contact/'),'primary')).'</div></section>');
    if ($type==='blog') return pcw_bp_layout($cfg,'Unleashed · Body / Mind / Soul',$title,'A living journal for movement, recovery, ritual, and the ideas that help wellness become a practice.','<section class="pcw-section"><div class="pcw-grid"><article class="pcw-card"><span class="pcw-kicker">Body</span><h2>Move with more ease.</h2><p>Practical guidance for strength, mobility, and recovery.</p></article><article class="pcw-card"><span class="pcw-kicker">Mind</span><h2>Make space to reset.</h2><p>Simple ways to make a calmer rhythm possible.</p></article><article class="pcw-card"><span class="pcw-kicker">Soul</span><h2>Rituals that stay with you.</h2><p>Thoughtful notes for living well beyond the appointment.</p></article></div></section>');
    if ($type==='shop') return pcw_bp_layout($cfg,'Unearthed Treasures',$title,'Approved retail essentials live in WooCommerce. Membership and clinical service state stay in their systems of record.','<section class="pcw-section"><div class="pcw-grid"><article class="pcw-card"><span class="pcw-kicker">Retail</span><h2>Curated essentials.</h2><p>Product catalog, price, taxes, checkout, and order records belong to WooCommerce.</p>'.pcw_bp_link('Browse the catalog',home_url('/shop/'),'quiet').'</article><article class="pcw-card"><span class="pcw-kicker">Gift cards</span><h2>Give a next step.</h2><p>Choose a retail gift or ask the team about treatment gifting through Jane.</p>'.pcw_bp_link('Explore gifting',home_url('/gift-cards/'),'quiet').'</article></div></section>');
    if ($type==='account') return pcw_bp_layout($cfg,'Account dashboard',$title,'A future member view for consent, path progress, loyalty, and referrals. Sensitive clinical records remain outside WordPress.','<section class="pcw-section"><div class="pcw-grid"><article class="pcw-card"><h2>Membership status</h2><p>Entitlement and path state will be read from the approved source system.</p></article><article class="pcw-card"><h2>Loyalty & referrals</h2><p>Non-PHI points and attribution summaries only.</p></article><article class="pcw-card"><h2>Notifications</h2><p>Consent-gated updates with unsubscribe controls.</p></article></div></section>');
    if ($type==='system-404' || $type==='maintenance') return '<div class="pcw-bp pcw-'.$cfg['mode'].'"><section class="pcw-empty"><span class="pcw-kicker">'.$cfg['name'].'</span><h1>'.esc_html($title).'</h1><p>Let’s get you back to a clear next step.</p><div class="pcw-actions">'.pcw_bp_link('Return home',home_url('/'),'primary').' '.pcw_bp_link('Open booking',home_url('/booking/'),'quiet').'</div></section></div>';
    if ($type==='funnel' || $type==='draft-funnel' || $type==='chatbot') return pcw_bp_layout($cfg,'Blueprint pathway',$title,'A focused, non-PHI starting point with the right handoff, consent boundary, and staff follow-up context.','<section class="pcw-section pcw-detail"><div><span class="pcw-kicker">Start here</span><h2>Tell us the direction, not the diagnosis.</h2><p>Choose a pathway, review the next step, and continue through the approved system of record. No medical notes are collected on this page.</p>'.pcw_bp_link('Contact the team',home_url('/contact/'),'primary').'</div><aside><span class="pcw-kicker">Workflow boundary</span><h2>Human review stays in the loop.</h2><p>CRM, email/SMS, Jane, WooCommerce, chatbot, and staff actions require the provider-specific acceptance gate.</p></aside></section>');
    if ($type==='contact') return pcw_bp_layout($cfg,'Connect with the team',$title,'Ask a question, request a pathway conversation, or get help choosing the right next step.','<section class="pcw-section pcw-detail"><div><h2>Reach out without oversharing.</h2><p>Use the approved contact channel for general questions. Do not include diagnoses, clinical notes, or intake details.</p><p><strong>Phone / text:</strong> Contact the location directly.</p><p><strong>Email:</strong> Use the approved business inbox.</p></div><div><h2>Prefer to book?</h2><p>Open Jane when you are ready for scheduling.</p>'.($cfg['jane']?pcw_bp_link('Open Jane',$cfg['jane'],'primary'):'').'</div></section>');
    return pcw_bp_layout($cfg,'About '.$cfg['name'],$title,'A clear, human explanation of the care philosophy, people, and places behind this domain.','<section class="pcw-section pcw-detail"><div><h2>Grounded care, clearly explained.</h2><p>We make the journey easier to understand, preserve the right boundaries between systems, and keep the next step human.</p></div><aside><h2>Need a specific answer?</h2><p>Visit the FAQ, meet the providers, or contact the team.</p>'.pcw_bp_link('Visit the FAQ',home_url('/faq/'),'quiet').'</aside></section>');
}

function pcw_bp_css() {
    echo '<style id="pcw-blueprint-page-system">#masthead,#colophon,.site-header,.entry-header,.page-header,.ast-header-break-point .main-header-bar,.ast-primary-header-bar,.ast-main-header-wrap,.main-header-bar,.ast-footer-wrap,.elementor-location-header,.elementor-location-footer,.sharedaddy,.sd-content,.jp-sharing-input-copy{display:none!important}.pcw-chrome{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:18px 5vw;border-bottom:1px solid #203b3630;background:#fffaf1;position:relative;z-index:20;font-family:Raleway,Quicksand,system-ui,sans-serif}.pcw-floating-head{position:fixed!important;top:0;left:0;right:0;z-index:9999}.pcw-site-footer{margin-top:0;border-top:1px solid #203b3630}.pcw-chrome-brand{font-family:Quicksand,Raleway,sans-serif;font-weight:800;letter-spacing:-.03em;color:#203b36;text-decoration:none}.pcw-chrome-nav{display:flex;gap:18px;align-items:center;flex-wrap:wrap}.pcw-chrome-nav a{color:#203b36;text-decoration:none;font-size:13px;font-weight:700}.pcw-chrome-nav a:last-child{padding:10px 16px;border-radius:999px;background:#b95c43;color:#fff}.pcw-chrome-menu{display:none}.pcw-bp{--ink:#203b36;--muted:#65736d;--cream:#fffaf1;--line:#ffffffb8;--accent:#b95c43;--primary:#314b68;font-family:Raleway,Quicksand,system-ui,sans-serif;color:var(--ink);background:linear-gradient(145deg,#f7eee1,#e6eee9 68%,#f0d4c0);padding:0 0 1px}.pcw-bp *{box-sizing:border-box}.pcw-bp a{text-decoration:none}.pcw-bp h1,.pcw-bp h2,.pcw-bp h3{font-family:Quicksand,Raleway,sans-serif;line-height:1.02;letter-spacing:-.045em}.pcw-hero{min-height:560px;display:grid;grid-template-columns:minmax(0,1.08fr) minmax(280px,.92fr);gap:7%;align-items:center;padding:clamp(60px,9vw,120px) 7%;position:relative;overflow:hidden}.pcw-home-hero{min-height:720px}.pcw-hero-copy{position:relative;z-index:2;max-width:720px}.pcw-kicker{display:block;text-transform:uppercase;letter-spacing:.18em;font-size:11px;font-weight:800;color:var(--accent);margin-bottom:16px}.pcw-hero h1{font-size:clamp(52px,8vw,106px);margin:0 0 24px;color:var(--primary)}.pcw-hero p{font-size:18px;line-height:1.7;max-width:580px;color:var(--muted)}.pcw-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:30px}.pcw-btn{display:inline-flex;align-items:center;gap:12px;padding:14px 20px;border-radius:999px;font-weight:800;font-size:13px;transition:transform .2s ease,box-shadow .2s ease}.pcw-btn:hover,.pcw-btn:focus-visible{transform:translateY(-2px);box-shadow:0 14px 24px #203b3630}.pcw-primary{background:var(--accent);color:white}.pcw-quiet{border:1px solid #203b3650;background:#ffffff70;color:var(--primary)}.pcw-text{padding:0;color:var(--primary);border-radius:0}.pcw-orbit{min-height:390px;position:relative;display:grid;place-items:center}.pcw-orbit:before{content:"";position:absolute;width:92%;aspect-ratio:1;border-radius:48% 52% 40% 60%;border:1px solid #ffffffc8;transform:rotate(-12deg);box-shadow:25px 30px 70px #45534d30;background:radial-gradient(circle at 35% 25%,#fff9 0 7%,transparent 24%),linear-gradient(145deg,#e6b36b,#879d91 65%,#314b68)}.pcw-orbit span{position:absolute;border:1px solid #fff9;border-radius:50%;width:58%;aspect-ratio:1;transform:rotate(28deg)}.pcw-orbit span:nth-child(2){width:74%;transform:rotate(-38deg)}.pcw-orbit span:nth-child(3){width:43%;transform:rotate(72deg)}.pcw-orbit b{position:relative;z-index:1;text-align:center;color:white;font-size:22px;letter-spacing:.05em}.pcw-section,.pcw-split,.pcw-editorial,.pcw-contact-band,.pcw-feature,.pcw-note{width:min(1180px,86vw);margin:0 auto;padding:100px 0}.pcw-section-head{display:flex;justify-content:space-between;gap:30px;align-items:end;margin-bottom:36px}.pcw-section-head h2,.pcw-feature h2,.pcw-contact-band h2{font-size:clamp(38px,5vw,70px);max-width:720px;margin:0}.pcw-section-head p{max-width:390px;color:var(--muted);line-height:1.7}.pcw-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:15px}.pcw-card{min-height:245px;padding:28px;border-radius:28px;background:#fff9;border:1px solid var(--line);box-shadow:0 20px 50px #45534d1c;display:flex;flex-direction:column;justify-content:space-between}.pcw-card:nth-child(2){transform:translateY(24px);background:#d7e4dbb8}.pcw-card:nth-child(3){transform:translateY(-14px);background:#efd2c0c0}.pcw-card h2,.pcw-card h3{font-size:29px;margin:12px 0}.pcw-card p,.pcw-path p,.pcw-detail p{color:var(--muted);line-height:1.7}.pcw-index{font-size:12px;color:var(--accent);font-weight:800;letter-spacing:.14em}.pcw-split,.pcw-editorial{display:grid;grid-template-columns:1fr 1fr;gap:18px}.pcw-split article,.pcw-editorial article,.pcw-detail>div,.pcw-detail>aside{padding:44px;border-radius:32px;background:#fff9;box-shadow:0 22px 55px #45534d1b;min-height:300px}.pcw-split article:nth-child(1){background:linear-gradient(145deg,#314b68,#6e8593);color:white}.pcw-split article:nth-child(1) p{color:#e5edf0}.pcw-split article:nth-child(2){background:linear-gradient(145deg,#d9bf98,#a8c3ae)}.pcw-split h2,.pcw-editorial h2{font-size:clamp(36px,4vw,60px);margin:12px 0 18px}.pcw-paths{background:#314b68;color:white;width:100%;padding-left:7%;padding-right:7%;max-width:none}.pcw-paths .pcw-section-head p{color:#dbe4e7}.pcw-path-grid{grid-template-columns:repeat(4,1fr)}.pcw-path{min-height:220px;padding:27px;border-radius:25px;border:1px solid #ffffff40;background:#ffffff10}.pcw-path:nth-child(2){transform:translateY(20px);background:#d2a34a2c}.pcw-path:nth-child(3){transform:translateY(-12px);background:#e6a67a28}.pcw-path:nth-child(4){transform:translateY(28px);background:#d9e5dc1f}.pcw-path span{font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:#f2ca76;font-weight:800}.pcw-path h2,.pcw-path h3{font-size:31px;margin:30px 0 12px}.pcw-path p{color:#dbe4e7}.pcw-path strong{font-size:12px}.pcw-detail{display:grid;grid-template-columns:1.1fr .9fr;gap:18px;width:min(1180px,86vw);margin:auto;padding:90px 0}.pcw-detail ul{padding-left:20px;line-height:2}.pcw-note{border-left:4px solid var(--accent);padding:20px 24px;margin-bottom:80px;background:#fff9;line-height:1.7}.pcw-contact-band{display:flex;justify-content:space-between;gap:30px;align-items:center}.pcw-empty{min-height:70vh;display:grid;place-items:center;text-align:center;padding:100px 7%}.pcw-empty h1{font-size:clamp(48px,8vw,100px);color:var(--primary)}.pcw-chiro{--primary:#263d5a;--accent:#d68b49;background:linear-gradient(145deg,#ecf0f2,#dae5e7 55%,#edd2bb)}.pcw-aroma{--primary:#304b43;--accent:#b9684e;background:linear-gradient(145deg,#fbf5e9,#dce8dc 58%,#efd2bc)}.pcw-cobranded{--primary:#314b68;--accent:#b95c43}@media(max-width:900px){.pcw-hero,.pcw-detail{grid-template-columns:1fr}.pcw-grid{grid-template-columns:repeat(2,1fr)}.pcw-path-grid{grid-template-columns:repeat(2,1fr)}.pcw-section-head,.pcw-contact-band{display:block}.pcw-contact-band .pcw-actions{margin-top:25px}}@media(max-width:620px){.pcw-chrome{padding:16px 6vw}.pcw-chrome-nav{display:none}.pcw-chrome-menu{display:inline-flex;color:#203b36;font-size:12px;font-weight:800}.pcw-hero{padding:64px 6%;min-height:0}.pcw-home-hero{min-height:680px}.pcw-orbit{min-height:290px}.pcw-section,.pcw-split,.pcw-editorial,.pcw-detail,.pcw-contact-band,.pcw-feature{width:88vw;padding:70px 0;grid-template-columns:1fr}.pcw-grid,.pcw-path-grid{grid-template-columns:1fr}.pcw-card:nth-child(2),.pcw-card:nth-child(3),.pcw-path:nth-child(2),.pcw-path:nth-child(3),.pcw-path:nth-child(4){transform:none}.pcw-split article,.pcw-editorial article,.pcw-detail>div,.pcw-detail>aside{padding:30px}.pcw-section-head h2,.pcw-feature h2,.pcw-contact-band h2{font-size:44px}}@media(prefers-reduced-motion:reduce){.pcw-btn{transition:none}.pcw-btn:hover,.pcw-btn:focus-visible{transform:none}}</style>';
}

function pcw_bp_chrome() {
    $c=pcw_bp_config();
    echo '<nav class="pcw-chrome" aria-label="Primary navigation"><a class="pcw-chrome-brand" href="'.esc_url(home_url('/')).'">'.esc_html($c['name']).'</a><div class="pcw-chrome-nav"><a href="'.esc_url(home_url('/'.$c['service_slug'].'/')).'">Services</a><a href="'.esc_url(home_url('/memberships/')).'">Memberships</a><a href="'.esc_url(home_url('/blog/')).'">Journal</a><a href="'.esc_url(home_url('/shop/')).'">Shop</a><a href="'.esc_url(home_url('/about/')).'">About</a><a href="'.esc_url(home_url('/booking/')).'">Book</a></div><span class="pcw-chrome-menu" aria-hidden="true">Menu</span></nav>';
}
add_action('wp_body_open','pcw_bp_chrome',5);
add_action('wp_footer',function(){ $c=pcw_bp_config(); echo '<footer class="pcw-chrome pcw-site-footer"><span>'.esc_html($c['name']).' · Desert wellness, clearly explained.</span><div class="pcw-chrome-nav"><a href="'.esc_url(home_url('/privacy-policy/')).'">Privacy</a><a href="'.esc_url(home_url('/hipaa-privacy/')).'">HIPAA & Privacy</a><a href="'.esc_url(home_url('/terms/')).'">Terms</a><a href="'.esc_url(home_url('/contact/')).'">Contact</a></div></footer>'; },5);

add_action('wp_head', 'pcw_bp_css', 20);

add_action('init', function () {
    if (get_option('pcw_blueprint_pages_version') === '2026-08-14-v3') { return; }
    $cfg=pcw_bp_config(); $ids=array();
    foreach (pcw_bp_pages($cfg) as $page) {
        $existing=get_page_by_path($page['slug'], OBJECT, 'page');
        $content=pcw_bp_content($cfg,$page);
        $post=array('post_title'=>$page['title'],'post_name'=>$page['slug'],'post_content'=>$content,'post_excerpt'=>'Blueprint page for '.$cfg['name'],'post_status'=>'publish','post_type'=>'page');
        if ($existing) {$post['ID']=$existing->ID; $id=wp_update_post($post,true);} else {$id=wp_insert_post($post,true);}
        if (!is_wp_error($id)) {$ids[$page['slug']]=(int)$id;}
    }
    $front=$ids[$cfg['front']]??0; if($front){update_option('show_on_front','page');update_option('page_on_front',$front);}
    if(isset($ids['blog'])){update_option('page_for_posts',$ids['blog']);}
    $menu_name=$cfg['name'].' Blueprint Primary'; $menu=wp_get_nav_menus(); $primary=0;
    foreach($menu as $m){if($m->name===$menu_name){$primary=$m->term_id;break;}}
    if(!$primary){$primary=wp_create_nav_menu($menu_name);}
    if(!is_wp_error($primary)){
        $items=array($cfg['front']=>'Home',$cfg['service_slug']=>$cfg['services'],'memberships'=>'Memberships','booking'=>'Booking','blog'=>'Journal','shop'=>'Shop','about'=>'About','contact'=>'Contact');
        $old=wp_get_nav_menu_items($primary); foreach((array)$old as $item){wp_delete_post($item->ID,true);}
        foreach($items as $slug=>$label){if(isset($ids[$slug]))wp_update_nav_menu_item($primary,0,array('menu-item-title'=>$label,'menu-item-object'=>'page','menu-item-object-id'=>$ids[$slug],'menu-item-type'=>'post_type','menu-item-status'=>'publish'));}
        $locations=get_theme_mod('nav_menu_locations',array()); $locations['primary']=$primary; set_theme_mod('nav_menu_locations',$locations);
    }
    $footer_name=$cfg['name'].' Blueprint Footer'; $footer=0;
    foreach(wp_get_nav_menus() as $m){if($m->name===$footer_name){$footer=$m->term_id;break;}}
    if(!$footer){$footer=wp_create_nav_menu($footer_name);}
    if(!is_wp_error($footer)){
        foreach((array)wp_get_nav_menu_items($footer) as $item){wp_delete_post($item->ID,true);}
        foreach(array('privacy-policy'=>'Privacy','hipaa-privacy'=>'HIPAA & Privacy','terms'=>'Terms','contact'=>'Contact','booking'=>'Booking') as $slug=>$label){
            if(isset($ids[$slug])) wp_update_nav_menu_item($footer,0,array('menu-item-title'=>$label,'menu-item-object'=>'page','menu-item-object-id'=>$ids[$slug],'menu-item-type'=>'post_type','menu-item-status'=>'publish'));
        }
        $locations=get_theme_mod('nav_menu_locations',array());
        foreach(array('footer','footer_menu') as $location){if(array_key_exists($location,get_registered_nav_menus())){$locations[$location]=$footer;}}
        set_theme_mod('nav_menu_locations',$locations);
    }
    update_option('pcw_blueprint_pages_version','2026-08-14-v3');
}, 20);

add_action('template_redirect', function () {
    if (is_admin() || wp_doing_ajax() || is_user_logged_in()) return;
    $path = trim(parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH), '/');
    $cfg = pcw_bp_config(); $target = '';
    if ($path === 'services' && $cfg['service_slug'] !== 'services') $target = $cfg['service_slug'];
    elseif (in_array($path, array('membership-plans','memberships-2'), true)) $target = 'memberships';
    elseif (in_array($path, array('booking-explanation','booking-explanation-2'), true)) $target = 'booking';
    elseif (in_array($path, array('contact-2','contact-3'), true)) $target = 'contact';
    elseif (in_array($path, array('about-2','about-3'), true)) $target = 'about';
    if ($target && get_page_by_path($target, OBJECT, 'page')) { wp_safe_redirect(home_url('/'.$target.'/'), 301); exit; }
});
