# Plan: Campaign Asset Studio (Renew48 · ChiroGoAZ × AromaHMT)

## Context

The user wants a **production application** — a "Campaign Asset Studio" — built in this React/Vite + Tailwind (Figma Make) environment. It is *not* a gallery or a pixel recreation of the reference image. The reference image (`src/imports/Marketing_Campaign_examples.png`) and the brief (`src/imports/pasted_text/campaign-asset-plan.md`) are the **creative and content source of truth** for two campaigns:

1. **Committed to Wellness** — a 7-stage launch series
2. **Referral Program** — a 6-stage share-and-earn series

The app must let a user manage those campaigns end-to-end: reconstruct every asset shown, organize them by **Campaign → Phase → Asset → Platform**, generate correct native formats per platform, edit campaign content through structured fields, preview at true platform dimensions, export (PNG/JPG/SVG/PDF) individually or as campaign packages, run a **Draft → Review → Approved → Ready → Published** workflow, and share/publish via Web Share plus an architecture ready for authenticated social APIs. A reusable Asset Library + Figma Buzz template strategy underpins future campaigns.

The scaffold is empty, so this is a greenfield build. This document is the Plan-Mode deliverable only — no implementation code is written here.

**Content-preservation note:** All copy below is transcribed from the reference. Anything that could not be read with confidence is marked `⚑ REVIEW` rather than invented (per brief §7).

---

## 1. Core architectural principle: assets are *data + template*, not hand-built frames

The single most important decision. Rather than manually building ~2 campaigns × ~13 phases × ~10 platforms of static frames (hundreds), the app models:

- **Campaign content** (headlines, copy, CTA, offer, dates, rewards, imagery refs) as editable data.
- **Asset templates** (React render components) that accept content + a **platform format spec** and lay themselves out for that spec's dimensions, safe areas, and content density.
- A **rendering engine** that composes `template × content × platformFormat` into a live, true-dimension preview, which is also the export source.

Consequences: editing a headline once propagates to every platform variant; a new platform = one format spec + template responsiveness rules; a new campaign = new content records reusing existing templates. This directly satisfies "generate native format per platform rather than resizing one master" and "preserve approved composition while content changes."

---

## 2. Brand / design foundation (from reference)

Applied via `aesthetic-stance` at build time; captured here as the contract.

- **Palette:** warm cream/ivory canvas, deep forest green (headers/dark cards/footers), orange–gold/terracotta accent (offers, CTAs), sage green, warm taupe neutrals.
- **Typography:** editorial serif for headlines (Playfair Display–class), a handwritten **script** for accent headlines/eyebrows (Dancing Script / Sacramento–class), clean sans for body/UI (Inter / Nunito Sans–class). Final pairing chosen via `aesthetic-stance`; wired in `src/index.css` per AGENTS.md (Google Fonts `@import` first).
- **Design elements:** liquid-glass buttons, desert/oasis imagery, soft gradients & neutrals, script accents, rounded cards, wellness iconography, editorial composition.
- **Logo lockups:** driven by the **linked R48 Brand Kit assets** (see §2a) — never traced, typeset, or regenerated. A `BrandLogo` / `LogoLockup` component *composes the supplied authoritative image assets* and auto-selects the correct variant (primary / avatar / badge, light/dark) by background + platform + format.
- **Motifs:** cactus/saguaro line art, botanical sprigs, sunrise-desert photography, step indicators, icon rows.
- **Tagline band:** "ROOTED IN THE DESERT. ELEVATED BY CARE. INSPIRED BY MOVEMENT." (ChiroGoAZ sub-tagline: "MOVE BETTER. LIVE BETTER."; AromaHMT: "HEALING MASSAGE THERAPY").

Design tokens (color, spacing, radius, semantic roles) live as CSS variables in `src/index.css` and a `src/design/tokens.ts` mirror so both Tailwind classes and the render/export engine read one source.

---

## 2a. Brand assets — linked R48 Brand Kit (authoritative source of truth)

The **R48 Brand Kit** Figma file (`fileKey PwVSRYXliJtl6eSgIOvv27`, node `13:25`) is the authoritative source for all brand identity. Assets are **downloaded and committed to `public/assets/`** (done) and must be **used directly** — do NOT recreate, trace, typeset, approximate, or generate replacement logos. The system spans **three brands**, with **Renew48 Wellness Collective** as the umbrella identity over **ChiroGoAZ** and **AromaHMT**.

### Canonical asset manifest (`src/data/brandAssets.ts`, prefix `/assets`)

| File | Brand | Variant | Usage |
|---|---|---|---|
| `3e8fa.png` | Renew48 | Primary logo (flame mark + "Renew48 Wellness Collective") | headers, hero, co-brand parent |
| `7bb3d.png` | Renew48 | Botanical cactus lockup | feature/hero, photo backgrounds |
| `3db6b.png` | Renew48 | Ornate gold "Wellness Collective" badge | seals, loyalty, print-style collateral |
| `e2056.png` | Renew48 | Ornate gold "Collective Member" badge | member/loyalty, testimonial trust marks |
| `bdd21.png` | ChiroGoAZ **+ AromaHMT** | Wide sheet holding **both** horizontal wordmarks | primary horizontal logos |
| `aea4b.png` | ChiroGoAZ | "CG" dark-green square avatar | social profile mark (dark) |
| `56a13.png` | ChiroGoAZ | Cactus light square avatar | social profile mark (light) |
| `47622.png` | ChiroGoAZ | "CG" green circular avatar | round social avatar |
| `8bc17.png` | ChiroGoAZ | Desert circular avatar | round social avatar |
| `508cc.png` | AromaHMT | "AH" purple square avatar | social profile mark (dark) |
| `846f2.png` | AromaHMT | "AH" lotus/cream square avatar | social profile mark (light) |
| `0ae97.png` | AromaHMT | "AH" circular avatar | round social avatar |
| `349fd.png` | AromaHMT | "AH" circular avatar (stones) | round social avatar |

### Build-time asset gaps to resolve (`⚑ REVIEW`)
- **Isolated horizontal wordmarks:** GDC returned ChiroGoAZ and AromaHMT (nodes `13:32`, `13:35`) as crops of the shared `bdd21.png` sheet. Before wiring `BrandLogo`, **re-request nodes `13:32` and `13:35` individually** via `get_design_context` to obtain clean, isolated ChiroGoAZ and AromaHMT logo files (or crop the sheet). Do not ship the substituted/overflow-cropped reference.
- Confirm whether a **Renew48 × ChiroGoAZ × AromaHMT co-brand lockup** exists in the kit beyond node `13:25`; if a dedicated lockup node exists, use it rather than composing one (§ requirement 5).

### Variant auto-selection rules (`BrandLogo` component)
- **Background-aware:** dark asset surface → light/knockout variant; light surface → dark variant.
- **Format/platform-aware:** square social formats & profile contexts → **square/circular avatar**; round avatar slots → circular avatar; wide/email/banner → **horizontal primary wordmark**; hero/seal → badge or botanical lockup.
- **Social accounts:** when an asset represents a specific social account, use that brand's **supplied social avatar/profile mark** (per-brand table above), never the horizontal logo (§ requirement 8).
- **Co-branding:** when multiple brands appear, use the **established Brand Kit co-brand treatment** (Renew48 as parent + participating brand), not an invented lockup (§ requirement 5). Preserve each brand's proportions, clear space, colors, and lockup rules (§ requirement 3).

---

## 3. Data model (`src/data/` + `src/types/`)

TypeScript types + seed content transcribed from the reference. Persisted to `localStorage` (MVP) behind a repository interface so a real backend/Supabase can drop in later.

```
Brand            { id, name, role: umbrella|participating, subTagline, assetIds[], colorRole }
                                                                  // Renew48 (umbrella), ChiroGoAZ, AromaHMT
BrandAsset       { id, brandId, file, variant: primary|wordmark|badge|lockup|
                   squareAvatar|circleAvatar, tone: light|dark, path }   // seeds from §2a manifest
Campaign         { id, name, theme, brands[], tagline, status, phases[] }
Phase            { id, campaignId, name, sequence, dayOffset, purpose, goals[], assets[] }
Asset            { id, phaseId, name, type, purpose, content, platformTargets[], status, buzzTemplateId }
AssetContent     { eyebrow, headline, subhead, body, bullets[], cta{label,url},
                   offer{value,code,expiry}, reward{amount,tier}, referralUrl,
                   testimonial{quote,attribution}, imageRef, logoLockup, disclaimer, hashtags[] }
PlatformFormat   { id, platform, surface, width, height, aspect, safeArea, densityProfile, exportTypes[] }
AssetVariant     { assetId, platformFormatId, overrides?, status, exportState }
Template         { id, family, name, supportedTypes[], fields[], variants[], specs }
BuzzTemplateSpec { family, editableFields[], variants[], platformSpecs[], notes }
LibraryItem      { id, kind: logo|photo|icon|colorStyle|textStyle|component, meta }
WorkflowEvent    { assetId|campaignId, from, to, actor, note, timestamp }
```

Status enum (asset + campaign): `Draft → Review → Approved → Ready → Published` (+ `Changes Requested`).

### Seed content (source of truth — abbreviated; full copy transcribed at build)

**Brands:** *Renew48 Wellness Collective* (umbrella identity, present where appropriate across both campaigns), *ChiroGoAZ* ("Move Better. Live Better."), *AromaHMT* ("Healing Massage Therapy"). Co-branded assets use the Brand Kit's Renew48-parent co-brand treatment.

**Campaign 1 — Committed to Wellness** (theme: *Committed to Wellness Launch Series*)
Phases: Teaser (Day −7, "Something Beautiful is Growing") · Announcement (Day 0, "Introducing Committed to Wellness") · Education (Day +3, "True Wellness Starts Within" — Chiropractic / Massage / Essential Oils / Holistic; MOVE·HEAL·LIVE Better) · Offer/Launch Special (Day +7, "Celebrate Wellness With Us — 20% OFF first service, code `WELLNESS20`") · Testimonial (Day +10, "Real Stories. Real Wellness." — Jessica M.) · Reminder/Nurture (Day +14, "You Deserve to Feel Your Best") · Loyalty (Day +21, "Your Wellness. Our Commitment. Always.").
Hashtags: `#CommittedToWellness #WellnessStartsWithin #MoveBetterHealDeeperLiveBetter #WholePersonCare #ChiroGoAZ #AromaHMT #Renew48` (reference image showed `#AromaHeat`; corrected to brand-kit `#AromaHMT` — `⚑ REVIEW`).

**Campaign 2 — Referral Program** (theme: *Share Wellness. Earn Rewards. Grow Together.*)
Phases: Launch (Day 0, "Wellness is Better Together") · How It Works (Day +2, Refer → They Book → You Earn) · Share Your Link (Day +4, `chirogoaz.com/ref/yourname`) · Reminder/Nudge (Day +10, "Just a Friendly Reminder") · Celebrate Success (Day +15, "You Did It! — $25 CREDIT added") · Ongoing (Day +30, "Wellness is a journey. Let's keep growing together.").
Reward tiers: 1 friend $25 · 2 friends $60 · 3 friends $100 credit. CTA URL: `chirogoaz.com/refer`.

---

## 4. Asset inventory & template families (from reference)

Detected asset *types*, each backed by one reusable template family, rendered across platform formats:

| Template family | Reference source | Used by |
|---|---|---|
| `EmailStage` | 6–7 email columns per campaign | every phase (Email surface) |
| `FeedPost` | Instagram feed rows | every phase (square/portrait) |
| `StoryReel` | Stories/Reels rows | every phase (9:16) |
| `PlatformVariation` | IG/FB/Pinterest/LinkedIn/TikTok/YouTube cards | announcement/awareness |
| `OfferCard` | 20% OFF / launch special | offer phase |
| `TestimonialCard` | quote + attribution | testimonial phases |
| `PromoBanner` / `CoverImage` | banners & cover images | both campaigns |
| `StepIndicator` / `HowItWorks` | Refer→Book→Earn | referral |
| `RewardCard` / `RewardTiers` | $25 / tiers preview | referral |
| `ShareLinkCard` | unique referral link + share row | referral |
| `FAQAccordion` | 5 referral FAQs | referral |
| `IconRow` | benefit/approach icon rows | education, referral |
| `HashtagBlock` / `CTAStrip` / `TaglineBand` | campaign hashtags, CTA strips, footer | both |

Which are **master template families** (reused across campaigns): EmailStage, FeedPost, StoryReel, OfferCard, TestimonialCard, PromoBanner, StepIndicator, RewardCard, ShareLinkCard, IconRow, CTAStrip, TaglineBand. **Campaign-specific**: FAQAccordion + RewardTiers (referral only), Education approach grid (wellness only).

---

## 5. Platform format matrix (`src/data/platformFormats.ts`)

Native specs the render engine targets (w×h px, safe areas per platform):

- **Email** 600 (desktop) / 375 (mobile) — HTML modules
- **Instagram** Feed 1080×1080 & 1080×1350 · Story/Reel 1080×1920
- **Facebook** Feed 1200×630 & 1080×1080 · Story 1080×1920
- **X/Twitter** 1600×900
- **TikTok** 1080×1920
- **YouTube** Thumbnail 1280×720 · Cover 2560×1440 · Shorts 1080×1920
- **Google Business Profile** 1200×900 / 720×720
- **Yelp** ~1200×800
- **Snapchat** 1080×1920
- **LinkedIn** Feed 1200×627 · Square 1200×1200

Each format carries `densityProfile` (copy length limits, font scale) and `exportTypes`. The matrix also encodes **applicability** — e.g. multi-module Email ≠ a single Story frame; a long FAQ isn't forced into 9:16 — surfacing "not applicable" instead of a bad crop (brief §2).

---

## 6. Component system (`src/components/`)

- **Primitives:** `Button` (liquid-glass + solid variants), `Card`, `Eyebrow`, `ScriptHeadline`, `SerifHeadline`, `IconTile`, `Chip`, `SafeAreaGuide`, `PlatformFrame` (draws true-dimension canvas + safe-area overlay), `TaglineBand`, `Disclaimer`, and **`BrandLogo` / `LogoLockup`** — image-composing components that render the linked R48 Brand Kit assets (§2a) with background/platform/format-aware variant auto-selection and Brand-Kit co-brand rules. No logo is drawn with markup or fonts.
- **Template components:** one per family in §4 under `src/components/templates/`, each `(content, format) => JSX` and export-safe.
- **Studio UI:** `AppShell` (sidebar nav + top bar), `CampaignTree` (Campaign→Phase→Asset→Platform navigator), `AssetEditor` (field forms), `PreviewCanvas` (zoom, platform switcher, device toggle), `StatusBadge`, `WorkflowBar`, `ExportPanel`, `ShareSheet`, `LibraryGrid`, `TemplateInspector`.
- Prefer composition + tokens over inline styles; no unlayered CSS resets (AGENTS.md).

---

## 7. Screens & user flows

1. **Dashboard** — campaign cards, phase/asset counts, status rollups, quick actions.
2. **Campaign Workspace** — left `CampaignTree`; center `PreviewCanvas`; right `AssetEditor`/`ExportPanel`. Core loop: pick asset → pick platform → edit fields (live preview) → set status → export/share/publish.
3. **Asset Detail** — all platform variants of one asset in a responsive grid at true aspect; per-variant status + export.
4. **Editor** — structured fields (headline, eyebrow, body, CTA, offer, promo code, date, testimonial, attribution, URL, referral link, reward amount, image, logo/participating brand, platform); validation against platform density limits.
5. **Asset Library** — seeded with the **canonical R48 Brand Kit assets** (§2a) as first-class library items (Renew48 / ChiroGoAZ / AromaHMT logos, badges, avatars) plus photos, icons, color/text styles, saved components; drag/apply into assets so templates and future campaigns reference the same authoritative brand assets (§ requirement 7).
6. **Template Studio** — browse template families, their editable fields/variants/specs; **Buzz template inspector** (§10) with export of the Buzz spec.
7. **Export Center** — select scope (asset / phase / campaign / platform); choose format(s); batch export → ZIP.
8. **Publish & Share** — per asset: review platform-specific copy + creative, then **Download / Share (Web Share) / Publish (integration)**; campaign-level batch publish queue.
9. **Workflow/Approvals** — Kanban across `Draft → Review → Approved → Ready → Published`; comments/notes via `WorkflowEvent`.
10. **New Campaign wizard** — start from existing campaign or template families; clone content structure, swap brand/offer/reward.

---

## 8. Rendering & export architecture (`src/render/`, `src/export/`)

- **Preview = export source.** Templates render into `PlatformFrame` at exact px (scaled for screen via CSS transform; exported at 1:1 / configurable @2x).
- **Raster (PNG/JPG):** DOM-to-canvas via `html-to-image` (or `dom-to-image-more`) → PNG/JPG at target dimensions. Chosen for fidelity with web fonts + gradients; confirm import from package exports before use.
- **Vector (SVG):** templates authored so their exportable layer is SVG-serializable; `SvgExport` path for logo/lockup/icon and flat-composition assets. Complex photo assets: SVG wraps embedded raster.
- **PDF:** `jspdf` — email proofs + campaign package sheets (asset + specs + copy), one asset per page.
- **Email HTML:** `EmailStage` also serializes to inline-styled, table-based responsive HTML (600/mobile) for real send tools — separate from the raster preview.
- **Packages:** `jszip` bundles selected exports into `Campaign / Phase / Platform / asset.ext` folder structure with a manifest JSON (brief §6 naming convention).
- Deterministic naming: `{campaign}-{phase}-{assetType}-{platform}-{w}x{h}.{ext}`.

---

## 9. Sharing & publishing architecture (`src/publish/`)

Three clearly separated tiers (per user direction):

1. **Download** — always available; raster/vector/PDF to disk.
2. **Web Share** — `navigator.share` / `navigator.canShare` with `files` (generated image) + `text` (platform-specific post copy) + `url`. Feature-detected; graceful fallback to copy-copy + download when unsupported. This is the "hand off to compatible apps" path.
3. **Direct authenticated publishing** — architected, not fully wired at MVP: a `PublishProvider` interface (`authenticate`, `capabilities`, `publish(assetVariant, copy)`) with per-platform adapters (LinkedIn, Facebook/IG Graph, YouTube, X). Adapters declare capability + auth requirements; UI shows "Connect" state and disables unsupported actions. Clearly labeled distinct from Web Share. Real OAuth/token exchange requires a backend (Supabase Edge Functions / server) — flagged as a later phase and as `⚑ REVIEW` for credentials/scopes.
- **Publish queue:** campaign- and asset-level; each item = variant + resolved copy + target + status; respects workflow gate (only `Ready`/`Approved` publishable).

---

## 10. Figma Buzz template strategy (`src/buzz/`)

Since the runtime is web, Buzz templates are represented as **structured specs** (the app's own template families map 1:1 to Buzz template families) that document editable fields, variants, and platform specs, and can be **exported as a Buzz-template spec** (JSON/MD) for later recreation or connection where technically possible.

Each Buzz family spec defines editable fields drawn from brief §4: campaign name, phase, headline, eyebrow, supporting copy, CTA, offer, promo code, date, testimonial, attribution, URL, referral link, reward amount, image, logo/participating brand, platform. Variants = platform formats + light/dark/photo backgrounds. The `TemplateInspector`/Buzz panel renders these and exports the spec; a compatibility note documents what maps cleanly to Buzz vs. web-only behavior. Master vs. campaign-specific split per §4.

---

## 11. File architecture (mirrors brief §6, adapted to React)

```
src/
  App.tsx                     // router + AppShell
  index.css                   // tokens, fonts, tailwind
  design/tokens.ts
  types/
  data/ (campaigns.ts, platformFormats.ts, templates.ts, seed content)
  store/ (repository + localStorage impl, context/hooks)
  components/ (primitives, templates/, studio UI)
  render/  export/  publish/  buzz/
  screens/ (Dashboard, Workspace, AssetDetail, Library, TemplateStudio, ExportCenter, Publish, Workflow, NewCampaign)
```
"00 Campaign System / 01 Wellness / 02 Referral / 03 Buzz Templates / 04 Export" from the brief become the Library/Template/Campaign/Export sections of the app.

---

## 12. Implementation phases (post-approval)

0. **Brand assets:** verify `public/assets/` (done); re-request isolated ChiroGoAZ/AromaHMT wordmark nodes `13:32`/`13:35` (§2a gap); build `brandAssets.ts` manifest, `BrandLogo`/`LogoLockup`, and seed the Asset Library.
1. **Foundation:** tokens, fonts, AppShell/router, types, seed data + repository, platform-format matrix.
2. **Render core:** `PlatformFrame`, primitives, first 3 template families (EmailStage, FeedPost, StoryReel), live PreviewCanvas.
3. **Content & editing:** CampaignTree, AssetEditor with all fields + density validation; full seed content for both campaigns.
4. **Remaining templates:** OfferCard, Testimonial, PromoBanner/Cover, StepIndicator/HowItWorks, RewardCard/Tiers, ShareLinkCard, FAQ, IconRow, CTAStrip.
5. **Export:** PNG/JPG → SVG → PDF → ZIP packages + email HTML.
6. **Workflow:** status model + Kanban + WorkflowEvents.
7. **Share/Publish:** Download + Web Share, then PublishProvider scaffolding + queue.
8. **Library + Template/Buzz Studio + New Campaign wizard.**
9. **Polish:** motion, empty states, responsive studio chrome, a11y.

---

## 13. Dependencies (install as reached; confirm import names from package exports)

`react-router-dom` (routing), `html-to-image` (raster export), `jspdf` (PDF), `jszip` (packages), `zustand` *or* React context (state), `lucide-react` (UI icons; wellness motifs bespoke SVG). Desert/lifestyle photography via `unsplash` skill at build (with attribution) as image placeholders standing in for the reference's art direction.

---

## 14. QA & approval criteria

- **Content fidelity:** every headline/CTA/offer/reward/testimonial matches the reference; no generic substitutions; `⚑ REVIEW` items surfaced in-app.
- **Brand-asset fidelity:** every logo/badge/avatar is a **linked R48 Brand Kit asset** (Renew48 / ChiroGoAZ / AromaHMT) — none traced, typeset, or regenerated; correct variant auto-selected per background/platform/format; social contexts use supplied avatars, not horizontal logos; co-brand uses the Brand-Kit treatment; clear space/proportions preserved; no references to expiring Figma URLs (all under `public/assets/`); no remaining "Aroma Heat" strings.
- **Format correctness:** each variant renders at exact native dimensions with safe areas honored; non-applicable combos flagged, not force-cropped.
- **Editing:** field change propagates live to all variants; density validation warns on overflow.
- **Export:** PNG/JPG/SVG/PDF produce correct pixel dimensions; ZIP package has correct folder/naming + manifest; email HTML renders in a mail client at 600/mobile.
- **Workflow:** status transitions enforce order; publish gated to Approved/Ready; events logged.
- **Share/Publish:** Web Share works on supported devices with file+copy; unsupported → clean fallback; direct-publish adapters clearly labeled and disabled until connected.
- **Both campaigns** fully navigable Campaign→Phase→Asset→Platform with all detected assets present.
- Build/typecheck clean; no unlayered CSS reset; fonts wired per AGENTS.md.

### Open items flagged for review
- Exact wording of a few small-print reference lines (offer fine print, some story microcopy) — `⚑ REVIEW`.
- Real social-API credentials/scopes and the backend for OAuth token exchange — required before *direct* publishing is functional; MVP ships the architecture + Web Share.
- Whether email export should target a specific ESP's HTML constraints — `⚑ REVIEW`.
