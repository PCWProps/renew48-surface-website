# Three-Site Page and Funnel Implementation Checklist

**Last updated:** 2026-09-01  
**Purpose:** live checklist for the next implementation pass and release gate.  
**Source of truth:** the supplied `blueprint.md` and `Full_Scope_For_ELEMENTOR 2` corpus, with approved creative mapped in [`approved-creative-map.md`](./approved-creative-map.md).

**Current pass:** `IN PROGRESS — ChiroGoAZ Home/Services visual rebuild → route-spine QA`  
**Next exact action:** capture ChiroGoAZ Home and Services renders at desktop/tablet/mobile, classify every section, and correct the first remaining visual mismatch.

## Status rules

- `[x]` = evidence-backed complete for the stated scope.
- `[-]` = implemented or inspected, but not yet validated against rendered output and/or functional acceptance.
- `[ ]` = not yet complete.
- `[!]` = blocked by an external/HITL dependency.

“Complete” requires blueprint, brand, UI-reference, approved-asset, desktop/tablet/mobile, accessibility, CTA/flow, and functional QA evidence. A plugin/theme install, DOM inspection, CSS inspection, or asynchronous WP-CLI job is not completion evidence.

## Implementation contract

- [x] Three independent WordPress installs are the delivery targets: ChiroGoAZ, AromaHMT, and Renew48.
- [x] Elementor and Elementor Pro are removed from the current staging inventories; implementation target is Astra + Gutenberg blocks + Spectra.
- [x] Supplied blueprint page names, section order, CTA labels, and funnel intent are preserved; legacy Phase 7 Elementor build instructions are treated as historical notes, not implementation instructions.
- [x] Native foundation/generator source is syntax-checked and deployed as the current v6 staging package to all three staging installs; rendered page validation remains open.
- [x] Approved creative map exists; ChiroGoAZ logo and AromaTouch photo are copied into the canonical local asset workflow.
- [ ] Every major section has a recorded blueprint requirement, brand treatment, UI-reference treatment, approved image/icon, and rendered comparison result.
- [ ] All current baseline pages are reworked where they are generic, wireframe-like, renamed, or visually divergent.

## ChiroGoAZ — page inventory

### Global systems

- [ ] Chiro header variant: navigation, logo, primary booking CTA, mobile menu, focus states.
- [ ] Chiro footer variant: contact/location, legal/support links, social/share cleanup, responsive layout.
- [ ] Global booking popup: explanation, no-PHI notice, Jane CTA, booking-process secondary CTA, keyboard and escape behavior.
- [ ] Membership upgrade, newsletter, promo, and urgent-banner popup states.
- [ ] Global styles, motion, reduced-motion behavior, color tokens, typography, spacing, surfaces, shadows, and responsive rules.

### Core and service pages

- [-] Home — v6 composition now includes the sunrise immersive hero; brand integration; Chiro/Massage pathways; membership overview; featured services; immersive story; testimonials; location/contact; final CTA. Rendered visual, responsive, asset, and CTA validation remains open.
- [ ] Chiropractic Services Overview — exact blueprint headline, categories, service cards, CTAs, and Chiro header/footer.
- [ ] Chiropractic Therapy detail.
- [ ] Chiropractic Referred Massage detail.
- [ ] Personal Injury detail.
- [ ] Insurance-only Therapy detail.
- [ ] Massage Services Overview — exact blueprint headline, categories, specialty treatment sections, CTAs, and Aroma header/footer treatment where specified.
- [ ] Service-detail template preserves the five-step “What to Expect” sequence, benefits, membership tie-in, and bottom CTA.

### Membership, information, and utility pages

- [ ] Unified Services Overview — exact “Your Wellness. Your Path.” structure and four tabs: Massage & Bodywork, Chiropractic Care, Cupping & Specialty, Insurance & Medical.
- [ ] Benefits Combined.
- [ ] Membership Overview.
- [ ] Essence membership page.
- [ ] Balance membership page.
- [ ] Harmony membership page.
- [ ] Unity membership page.
- [ ] Providers/Team.
- [ ] Locations.
- [ ] FAQ & Education Index.
- [ ] Article/Education template.
- [ ] Blog Index.
- [ ] Blog Single.
- [ ] Contact.
- [ ] About.
- [ ] Jane Booking Explanation.
- [ ] HIPAA + Safety Notices, if enabled by the supplied blueprint.
- [ ] Terms.
- [ ] Privacy Policy.
- [ ] 404.

### ChiroGoAZ routing and funnels

- [ ] Header/footer/menu route audit and canonical slugs.
- [ ] Book Now → global booking popup → approved Jane target.
- [ ] Choose Your Path → chiropractic or massage pathway.
- [ ] Service CTA → correct service detail or Jane route.
- [ ] Membership CTA → overview/tier page → approved CTW/CRM membership action.
- [ ] Contact Us → Contact page and validated contact workflow.
- [ ] CTW/CRM membership recovery: action, redirect, confirmation, tags/tasks/notifications, with no real test contact creation.
- [ ] Path/intent quiz or guided path funnel, if present in inherited implementation.
- [ ] Corporate/events/sports funnel, if present in inherited implementation.
- [ ] Contract savings funnel, referral/VIP funnel, walk-in/waitlist funnel, gift-card/seasonal/review routes, preserving inherited names and behavior where present.
- [ ] WooCommerce shop/product/cart/checkout route audit where ChiroGoAZ owns commerce.
- [ ] Redirect map and 404 recovery verified without changing canonical content names.

## AromaHMT — page inventory

### Global systems

- [ ] Aroma header variant and responsive mobile navigation.
- [ ] Aroma footer variant and inherited share-widget/header cleanup.
- [ ] Shared booking, membership, newsletter, promo, and urgent-banner popup behavior.
- [ ] Aroma-specific brand tokens, imagery treatment, motion, accessibility, and responsive rules.

### Pages and service details

- [ ] Home / Aroma landing page as defined by the authoritative blueprint.
- [ ] Massage Services Overview.
- [ ] Deep Tissue — 30/60/90.
- [ ] Swedish — 60/90.
- [ ] Hot Stone — 60/90.
- [ ] Prenatal 60.
- [ ] 90-Min Customized.
- [ ] Cupping Zone.
- [ ] Cupping Treatment.
- [ ] Facial Cupping.
- [ ] Cellulite Cupping.
- [ ] Biomagnetic Cupping.
- [ ] Digestive Cupping.
- [ ] AromaTouch.
- [ ] Reflexology.
- [ ] About, Providers/Team, Locations, FAQ/Education, Contact, Blog Index, Blog Single.
- [ ] Membership Overview and applicable tier pages.
- [ ] Jane Booking Explanation, Terms, Privacy, HIPAA/Safety, and 404.

### AromaHMT funnels

- [ ] Book Now → global popup → approved Jane target.
- [ ] Massage/service CTA → exact detail route and Jane handoff.
- [ ] Membership CTA → approved membership route/action.
- [ ] Contact/newsletter/promo flows.
- [ ] Inherited CRM, email/SMS, analytics, chatbot, WooCommerce, and redirect workflows recovered or explicitly excluded by blueprint.

## Renew48 — page inventory

### Global systems

- [ ] Renew48 header and footer, including mobile navigation and share-widget cleanup.
- [ ] Renew48 global style/motion system and reduced-motion behavior.
- [ ] Booking, membership, newsletter, promo, and urgent-banner global states where applicable.

### Pages

- [ ] Home / Renew48 landing page.
- [ ] Unified Services Overview.
- [ ] Benefits Combined.
- [ ] Providers/Team.
- [ ] Locations.
- [ ] FAQ & Education Index.
- [ ] Article/Education template.
- [ ] Membership Overview.
- [ ] Essence, Balance, Harmony, and Unity pages where included in the Renew48 blueprint.
- [ ] Contact and About.
- [ ] Blog Index and Blog Single.
- [ ] Jane Booking Explanation.
- [ ] Terms, Privacy, HIPAA/Safety, and 404.

### Renew48 funnels

- [ ] Primary wellness path → service/membership choice → approved Jane target.
- [ ] Membership upgrade/CTW/CRM action and redirect.
- [ ] Approved Jane account-level booking target validation, especially Renew48.
- [ ] Inherited onboarding, referral/VIP, corporate, campaign, and recovery funnels reconciled to the blueprint.
- [ ] Cross-domain links keep each site’s domain, analytics property, CRM tags, and canonical ownership isolated.

## Cross-site integration and admin gates

- [ ] Authenticated CRM acceptance using non-creating/read-only or sandbox-safe probes; do not submit real contacts.
- [ ] Jane account/booking target validation for all approved locations and especially Renew48.
- [ ] WooCommerce product, cart, checkout, payment, confirmation, and order-admin validation using approved test data only.
- [ ] Email/SMS provider, consent, sender identity, unsubscribe, and non-production mailbox testing.
- [ ] Analytics property and event receipt verification per domain.
- [ ] Approved chatbot provider, non-PHI intent handling, and escalation route.
- [ ] Authenticated WordPress/Astra admin review of dashboard counts, permissions, menus, forms, WooCommerce, CRM, and plugin ownership.
- [ ] Cross-domain privacy, consent, PHI, and tracking boundaries verified.

## Visual, accessibility, and functional quality gate

- [ ] ChiroGoAZ desktop render captured and compared to blueprint/reference boards.
- [ ] ChiroGoAZ tablet render captured and compared.
- [ ] ChiroGoAZ mobile render captured and compared.
- [ ] AromaHMT desktop/tablet/mobile renders captured and compared.
- [ ] Renew48 desktop/tablet/mobile renders captured and compared.
- [ ] Keyboard-only navigation and visible focus verified on all primary templates/popups/forms.
- [ ] Reduced-motion mode verified; no essential content depends on animation.
- [ ] No horizontal overflow, clipped media, broken responsive grids, or inherited share widgets.
- [ ] CTA routes, popup open/close, forms, Jane handoff, Woo flows, redirects, and 404 behavior verified.
- [ ] Primary screenshot method succeeds; if it fails, a second materially different browser/render method is attempted and recorded.
- [ ] No site is marked validated until blueprint, brand, reference, asset, responsive, accessibility, and functional gates all pass.

## Explicit exceptions / HITL queue

- [!] Membership pricing conflict requires owner decision before publishing prices: Phase 3 master pricing lists M2M Single $79 / group rates, while Phase 5 tier files list Balance $129, Harmony $149, Unity $199.
- [!] Any provider credentials, Jane account permissions, payment test credentials, email/SMS sender verification, chatbot credentials, or authenticated dashboard access must be supplied/approved through the authorized HITL path.
- [!] A staging page cannot be called visually validated until the rendered browser evidence is available; asynchronous deployment output alone is insufficient.

## Next pass execution order

1. Re-render current ChiroGoAZ Home and Services to classify every section against the blueprint.
2. Rebuild the first failing sections natively in Astra/Gutenberg/Spectra using mapped approved assets.
3. Validate the ChiroGoAZ global header/footer/popup and route spine before expanding detail pages.
4. Continue through the ChiroGoAZ page inventory and funnels, updating this file after each evidence-backed checkpoint.
5. Move directly into AromaHMT and Renew48 page passes; do not treat a site checkpoint as project completion.
