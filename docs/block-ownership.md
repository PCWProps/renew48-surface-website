# Block ownership and migration boundary

`block-capabilities.json` is the shared capability inventory used for documentation and migration review.

## Desert Liquid Glass theme

Generic layout, surface, typography, media-plane, accessibility, and presentation blocks belong to the general-purpose theme. They must remain portable on sites without Renew-48.

## Renew-48 plugin

Membership, directory, referral, funnel, booking handoff, attribution, platform handoff, contract-suite, and Renew48-specific navigation/profile blocks remain plugin-owned. They may use the theme surface compatibility API but never make the theme depend on Renew-48.

## Runtime cleanup status

The repository contains deployable legacy files for `pcw-blueprint-pages`, `pcw-funnel-dashboards`, and `pcw-membership-actions`. They are not deleted in this pass because their deployed source and site usage evidence must be verified first. The automatic `admin_init` page migration hook has been removed from the plugin; migration must be administrator-triggered and reviewable.

No CRM, Jane, SMS, email, payment, or platform synchronization is activated by this package work.
