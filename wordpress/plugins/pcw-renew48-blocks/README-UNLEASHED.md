# Unleashed standard-block page

Version 0.4.0 assembles the Unleashed article from WordPress core blocks. The article uses Groups, Images, Headings, Paragraphs, Columns, and links; no custom block owns the article content.

## Existing page migration

After the updated plugin is installed and an administrator visits WordPress Admin, the plugin looks for a page containing the legacy `renew48/unleashed-article` block. Only that legacy block page is replaced with the standard-block composition, and its existing title and publication status are preserved.

If no legacy page exists, the plugin creates an unpublished draft named `Unleashed — Committed to Wellness`.

## Manual insertion

The same composition is available from the block inserter under Patterns → Renew48 → Blog Single.

## Editing

All article copy and imagery can be selected in List View and edited with normal Gutenberg controls. The plugin supplies the bundled image assets, scoped presentation CSS, and reduced-motion-safe reveal animation.
