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

Or deploy a validated build with `npx wrangler pages deploy dist --project-name renew48-marketing-suite` from this directory after authenticating Wrangler. Account, domain, and production publish settings are intentionally managed in Cloudflare rather than committed here.
