# Gutenberg staging release record

Date: 2026-09-15  
Scope: Renew48, ChiroGoAZ, and AromaHMT staging only

## Delivered foundation

| Surface | Evidence |
| --- | --- |
| Shared blocks | `pcw-renew48-blocks` 0.7.0 is active on all three staging sites. |
| Renew48 page shell | `renew48-astra-child` 0.7.0 is active on Renew48 staging with page presentation modes: Contained Desert, Masked Parallax, and Full-Bleed Glass. |
| Visual components | Dedicated public renderers are available for cinematic hero, service masonry, service detail, booking handoff, pricing, flows, carousel, contract suite, and social-proof strip. |
| Editor controls | Page canvas mode, media, surface, density, layout, motion, card items, and CTA/handoff controls are editable in Gutenberg. |
| Content authority | Old Elementor archives remain the authoritative source. Current staging may fill documented gaps only. |

## Pressable validation

| Site | Package evidence | Runtime evidence |
| --- | --- | --- |
| Renew48 staging `1755808` | Blocks 0.7.0; child theme 0.7.0; renderer loaded. | Existing operation record 630871 confirms the plugin version; operation 630906 confirms child-theme activation. |
| ChiroGoAZ staging `1580746` | Blocks 0.7.0. | Operations 631112 and 631113 confirm package version and CRM disabled. Operations 631140 and 631157 confirm funnel adapter load and one allowed event. |
| AromaHMT staging `1755812` | Blocks 0.7.0. | Operations 631115 and 631116 confirm package version and CRM disabled. Operations 631142 and 631156 confirm funnel adapter load and one allowed event. |

The clinic must-use plugin deployment used only `wp-content/mu-plugins`, completed as Git deploys 150892 and 150891, then restored each site to its original `wp-content` deployment target.

## Security and boundary state

- Membership CRM writes are hard-disabled. The staging surface displays a notice and non-data handoff only.
- Analytics allowlist contains only `pcw_outbound_handoff` with a short-lived click token. It excludes name, email, phone, provider identity, appointment details, free text, URL path, and form payload.
- Booking, Jane, commerce, CRM, email, SMS, webhook, and payment activations remain off. No production routing, Cloudflare, TLS, cache, DNS, or payment configuration changed.

## Consolidation gate

### Completed retirement

| Site | Source page | Disposition | Verified result |
| --- | --- | --- | --- |
| AromaHMT staging | ID 2, `/sample-page/` | Stock WordPress sample content with no menu or inbound content references. Redirected to the site homepage and moved to Trash. | `/sample-page/` returns a direct 301 to `/`; `/` returns 200; published page count changed from 82 to 81. |

No other pages have been deleted, unpublished, redirected, or bulk-modified in this release. No other redirect map has been applied.

### Canonical Gutenberg review draft

| Site | Review draft | Source pages | State | Evidence |
| --- | --- | --- | --- | --- |
| AromaHMT staging | ID 2691, `/massage-services-gutenberg-review/` | IDs 275 (`/massage-services/`), 53 (`/services/`), and 206 (`/services-2/`) | Draft only; no public route, redirect, or retirement changed. | Operations 633000 and 633001 confirm draft/source state; 633079 confirms the cinematic hero and service masonry render server-side. |

The draft preserves the unique service/session information from the prior mapping and uses the shared editable header, hero, service-masonry, privacy-handoff, and footer blocks. It cannot replace the live service page until desktop/mobile rendered comparison is resolved.

For each canonical page, the next release must attach:

1. Elementor source URL or archive evidence.
2. Gap list for any approved staging-only copy or media.
3. Canonical Gutenberg URL and rendered desktop/mobile captures.
4. Updated menu and internal-link evidence.
5. One-hop 301 result for each approved retirement.
6. Confirmation that legal, clinical, WooCommerce, Jane, account, cart, checkout, payment, HIPAA, and system routes are unchanged.

## Acceptance status

Foundation deployment and security boundary checks: complete.  
Canonical content consolidation, funnel content assembly, redirect application, visual-reference comparison, accessibility QA, and clinical/legal owner review: pending staging acceptance.
