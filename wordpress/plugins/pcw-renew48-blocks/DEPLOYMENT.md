# Shared plugin deployment contract

`pcw-renew48-blocks` is a shared runtime dependency for Renew48, ChiroGoAZ,
and AromaHMT staging. Clinic repositories may deploy their own `wp-content`
trees, but must restore this exact signed source package immediately after any
whole-tree deployment and before activating a clinic child theme.

The plugin source of truth is this directory on the
`codex/gutenberg-unleashed-migration` branch. The deployment artifact is
`deployables/pcw-renew48-blocks-0.7.0.zip` at the same commit.

Required post-deploy verification:

1. `wp plugin get pcw-renew48-blocks --field=version` returns `0.7.0`.
2. `PCW_Renew48_Visual_Renderers` is loadable.
3. Gutenberg lists the `renew48/*` block family.
4. The clinic deploy has not activated CRM, payment, Jane, or messaging paths.

This contract does not authorize production deployment or activate external
handoffs.
