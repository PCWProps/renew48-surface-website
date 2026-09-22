(function (wp) {
    const { registerBlockType } = wp.blocks;
    const { createElement: el } = wp.element;
    const { RichText, InspectorControls, InnerBlocks, MediaUpload, MediaUploadCheck } = wp.blockEditor;
    const { PanelBody, TextControl, SelectControl, Button } = wp.components;
    const blocks = [
        'container', 'section', 'grid', 'flex-row', 'flex-column', 'spacer', 'divider',
        'hero-primary', 'cinematic-hero', 'hero-split', 'hero-video', 'cta-banner',
        'service-card', 'service-grid', 'service-comparison', 'service-accordion', 'faq-accordion',
        'testimonial-slider', 'blog-preview', 'education-grid', 'glass-panel', 'liquid-glass',
        'acrylic-card', 'neon-accent', 'parallax-layer', 'hover-reveal', 'scroll-reveal',
        'header-cta', 'footer-columns', 'navigation-panel', 'breadcrumbs', 'alert-banner',
        'carousel-slide', 'modal-trigger', 'gallery-lightbox', 'tabbed-content',
        'newsletter-capture', 'social-proof-strip', 'pricing-grid'
    ];
    const label = (slug) => slug.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

    blocks.forEach((slug) => registerBlockType('dlg/' + slug, {
        title: 'Desert ' + label(slug),
        icon: 'screenoptions',
        category: 'design',
        attributes: {
            title: { type: 'string', default: label(slug) },
            body: { type: 'string', default: '' },
            mediaUrl: { type: 'string', default: '' },
            mediaAlt: { type: 'string', default: '' },
            surface: { type: 'string', default: 'solid' }
        },
        edit: ({ attributes, setAttributes }) => el('section', { className: 'dlg-surface dlg-block-editor-preview' },
            el(InspectorControls, null,
                el(PanelBody, { title: 'Desert Liquid Glass surface', initialOpen: true },
                    el(MediaUploadCheck, null,
                        el(MediaUpload, {
                            onSelect: (media) => setAttributes({ mediaUrl: media.url || '', mediaAlt: media.alt || '' }),
                            allowedTypes: ['image'],
                            value: attributes.mediaUrl,
                            render: ({ open }) => el(Button, { variant: 'secondary', onClick: open }, attributes.mediaUrl ? 'Replace component media' : 'Choose component media')
                        })
                    ),
                    attributes.mediaUrl ? el(Button, { variant: 'tertiary', isDestructive: true, onClick: () => setAttributes({ mediaUrl: '', mediaAlt: '' }) }, 'Remove component media') : null,
                    el(TextControl, { label: 'Image alt text', value: attributes.mediaAlt, onChange: (value) => setAttributes({ mediaAlt: value }) }),
                    el(SelectControl, {
                        label: 'Surface material', value: attributes.surface,
                        options: [
                            { label: 'Solid', value: 'solid' },
                            { label: 'Translucent', value: 'translucent' },
                            { label: 'Gradient glass', value: 'gradient-glass' }
                        ],
                        onChange: (value) => setAttributes({ surface: value })
                    })
                )
            ),
            el('div', { className: 'dlg-surface__content' },
                el(RichText, { tagName: 'h2', value: attributes.title, onChange: (value) => setAttributes({ title: value }), placeholder: 'Section title' }),
                el(RichText, { tagName: 'p', value: attributes.body, onChange: (value) => setAttributes({ body: value }), placeholder: 'Supporting copy' }),
                el(InnerBlocks, { renderAppender: InnerBlocks.ButtonBlockAppender })
            )
        ),
        save: () => el(InnerBlocks.Content)
    }));

    const { registerPlugin } = wp.plugins;
    const { PluginDocumentSettingPanel } = wp.editPost;
    const { useSelect, useDispatch } = wp.data;
    const PageSettings = () => {
        const postType = useSelect((select) => select('core/editor').getCurrentPostType(), []);
        const meta = useSelect((select) => select('core/editor').getEditedPostAttribute('meta') || {}, []);
        const { editPost } = useDispatch('core/editor');
        if (postType !== 'page') {
            return null;
        }
        const updateMeta = (key, value) => editPost({ meta: Object.assign({}, meta, { [key]: value }) });
        const media = meta._dlg_page_media || {};
        return el(PluginDocumentSettingPanel, { name: 'dlg-page-presentation', title: 'Desert Liquid Glass page presentation', className: 'dlg-page-settings' },
            el(SelectControl, {
                label: 'Theme', value: meta._dlg_theme || '',
                options: [
                    { label: 'Use site default', value: '' }, { label: 'Arizona Sky', value: 'arizona-sky' },
                    { label: 'Endless Skies', value: 'endless-skies' }, { label: 'First Light', value: 'first-light' },
                    { label: 'Jane-Aire Dark', value: 'jane-aire-dark' }, { label: 'Morning Haze', value: 'morning-haze' },
                    { label: 'Neon Nights', value: 'neon-nights' }, { label: 'PCWProps', value: 'pcwprops' },
                    { label: 'Red Rocks', value: 'red-rocks' }, { label: 'Tropical Oasis', value: 'tropical-oasis' }
                ], onChange: (value) => updateMeta('_dlg_theme', value)
            }),
            el(SelectControl, {
                label: 'Composition mode', value: meta._dlg_mode || '',
                options: [
                    { label: 'Use site default', value: '' }, { label: 'Contained Desert', value: 'contained' },
                    { label: 'Masked Parallax', value: 'masked' }, { label: 'Full-Bleed Glass', value: 'full' }
                ], onChange: (value) => updateMeta('_dlg_mode', value)
            }),
            el(MediaUploadCheck, null,
                el(MediaUpload, {
                    onSelect: (selected) => updateMeta('_dlg_page_media', Object.assign({}, media, { url: selected.url || '', mobileUrl: media.mobileUrl || '', position: media.position || 'center center', mobilePosition: media.mobilePosition || 'center center', size: media.size || 'cover', overlay: media.overlay || 'medium' })),
                    allowedTypes: ['image'], value: media.url,
                    render: ({ open }) => el(Button, { variant: 'secondary', onClick: open }, media.url ? 'Replace page media' : 'Choose page media')
                })
            ),
            el(MediaUploadCheck, null,
                el(MediaUpload, {
                    onSelect: (selected) => updateMeta('_dlg_page_media', Object.assign({}, media, { mobileUrl: selected.url || '', position: media.position || 'center center', mobilePosition: media.mobilePosition || 'center center', size: media.size || 'cover', overlay: media.overlay || 'medium' })),
                    allowedTypes: ['image'], value: media.mobileUrl,
                    render: ({ open }) => el(Button, { variant: 'tertiary', onClick: open }, media.mobileUrl ? 'Replace mobile media' : 'Choose mobile media')
                })
            ),
            media.url ? el(Button, { variant: 'tertiary', isDestructive: true, onClick: () => updateMeta('_dlg_page_media', {}) }, 'Remove page media') : null,
            el(SelectControl, { label: 'Page media sizing', value: media.size || 'cover', options: [{ label: 'Cover', value: 'cover' }, { label: 'Contain', value: 'contain' }, { label: 'Original size', value: 'auto' }], onChange: (size) => updateMeta('_dlg_page_media', Object.assign({}, media, { size })) })
        );
    };
    registerPlugin('dlg-page-presentation', { render: PageSettings });
}(window.wp));
