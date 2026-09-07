# Renew48 Campaign Asset Studio

The Campaign Asset Studio is a Vite application for turning approved brand inputs and campaign briefs into editable, reviewable marketing assets.

## Local development

```sh
npm install
npm run dev
```

## Production build

```sh
npm run build
```

## Brand-kit intake

The Library accepts a ZIP archive or a batch of individual files. ZIP contents are unpacked in the browser and grouped by filename/path into brand marks, badges and markers, typography, color systems, calls to action, background imagery, reference boards, or unsorted intake. Users can change every group before reuse.

Composite boards are preserved as visual references. The intake pass can identify likely boards and record their dimensions, but it does not trace, redraw, OCR, or claim pixel-perfect recreation of logos from a flat PNG. Supply individual logo, badge, and wordmark files when exact reuse is required.

## Cloudflare Pages

This project is static Vite output and includes `wrangler.toml` for Cloudflare Pages. Connect the GitHub repository to Cloudflare Pages with:

- Root directory: `apps/renew48-campaign-asset-studio`
- Build command: `npm run build`
- Build output directory: `dist`

The production bundle is mounted below `/marketing-studio/`, so asset URLs and the public entry path stay isolated from the existing `apps.renew48.com` root application. For a local root preview, use `VITE_BASE_PATH=/ npm run dev`.

Or deploy a validated build with `npx wrangler pages deploy dist --project-name renew48-marketing-suite` from this directory after authenticating Wrangler. Account, domain, and production publish settings are intentionally managed in Cloudflare rather than committed here.

## Routes and access boundary

- `/marketing-studio/` is the public marketing overview.
- `/marketing-studio/add-on/` is the public subscription add-on handoff page.
- `/marketing-studio/studio/` is the private studio entry route.

Cloudflare Access is the security boundary for the studio route. The public overview is served at `apps.renew48.com/marketing-studio/`; the private `/marketing-studio/studio/` path is routed through the existing PCWProps Access policy. The in-app entry screen is only a user-facing handoff after the edge policy, not a replacement for authentication.
