# Installable products

This checkout builds two independent WordPress products:

- `dist/desert-liquid-glass-0.1.4-install.zip` — general-purpose Astra-compatible theme. It works without Renew-48 and owns tokens, page media, composition modes, generic surface primitives, responsive/accessibility foundations, generic blocks, and admin documentation.
- `dist/renew-48-0.9.2-install.zip` — optional Renew-48 plugin. It owns Renew48 semantic blocks, directories, funnels, handoffs, attribution boundaries, diagnostics, and disabled integration adapters.

Checksums are generated at build time with SHA-256. No production deployment, platform synchronization, CRM, Jane, SMS, email, payment, or live-content deletion is part of this build.

The legacy deployable MU-plugin files remain present for evidence review. Their deployed source and usage must be verified before removal; the plugin no longer runs its former automatic `admin_init` page migration.
