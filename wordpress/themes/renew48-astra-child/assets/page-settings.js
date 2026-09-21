(function (wp) {
  const { registerPlugin } = wp.plugins;
  const { PluginDocumentSettingPanel } = wp.editPost;
  const { SelectControl, TextControl, PanelBody, Button } = wp.components;
  const { MediaUpload, MediaUploadCheck } = wp.blockEditor || {};
  const { useSelect, useDispatch } = wp.data;
  const { createElement: el } = wp.element;
  const { __ } = wp.i18n;
  const key = '_pcw_presentation_mode';
  const themeKey = '_pcw_liquid_glass_theme';
  const mediaKey = '_pcw_page_media';
  const themes = [
    ['arizona-sky', 'Arizona Sky'], ['endless-skies', 'Endless Skies'], ['first-light', 'First Light'],
    ['jane-aire-dark', 'Jane-Aire Dark'], ['morning-haze', 'Morning Haze'], ['neon-nights', 'Neon Nights'],
    ['red-rocks', 'Red Rocks'], ['tropical-oasis', 'Tropical Oasis'], ['pcwprops', 'PCWProps']
  ].map(([value, label]) => ({ value, label }));

  function PresentationMode() {
    const meta = useSelect((select) => select('core/editor').getEditedPostAttribute('meta') || {}, []);
    const { editPost } = useDispatch('core/editor');
    const value = meta[key] || 'contained-desert';
    const theme = meta[themeKey] || 'arizona-sky';
    const media = meta[mediaKey] || {};
    const updateMedia = (next) => editPost({ meta: { ...meta, [mediaKey]: { ...media, ...next } } });
    return el(PluginDocumentSettingPanel, { name: 'renew48-presentation-mode', title: __('Renew48 page presentation', 'renew48-astra-child') },
      el(SelectControl, {
        label: __('Canvas mode', 'renew48-astra-child'),
        help: __('The page shell owns the background. Blocks inherit this context.', 'renew48-astra-child'),
        value,
        options: [
          { label: __('Contained Desert', 'renew48-astra-child'), value: 'contained-desert' },
          { label: __('Masked Parallax', 'renew48-astra-child'), value: 'masked-parallax' },
          { label: __('Full-Bleed Glass', 'renew48-astra-child'), value: 'full-bleed-glass' }
        ],
        onChange: (next) => editPost({ meta: { ...meta, [key]: next } })
      }),
      el(SelectControl, {
        label: __('Desert Liquid Glass theme', 'renew48-astra-child'),
        help: __('Exactly nine approved presets. Theme changes do not change composition or media.', 'renew48-astra-child'),
        value: theme,
        options: themes,
        onChange: (next) => editPost({ meta: { ...meta, [themeKey]: next } })
      }),
      el(PanelBody, { title: __('Page visual media', 'renew48-astra-child'), initialOpen: false },
        el(TextControl, { label: __('Background image URL', 'renew48-astra-child'), value: media.url || '', onChange: (url) => updateMedia({ url }) }),
        MediaUploadCheck && MediaUpload && el(MediaUploadCheck, {}, el(MediaUpload, { onSelect: (item) => updateMedia({ url: item.url || '', alt: item.alt || '' }), allowedTypes: ['image'], render: ({ open }) => el(Button, { variant: 'secondary', onClick: open }, media.url ? __('Replace page image', 'renew48-astra-child') : __('Choose page image', 'renew48-astra-child')) })),
        el(TextControl, { label: __('Mobile image URL (optional)', 'renew48-astra-child'), value: media.mobileUrl || '', onChange: (mobileUrl) => updateMedia({ mobileUrl }) }),
        el(SelectControl, { label: __('Focal position', 'renew48-astra-child'), value: media.position || 'center center', options: ['left top','center top','right top','left center','center center','right center','left bottom','center bottom','right bottom'].map((value) => ({ label: value, value })), onChange: (position) => updateMedia({ position }) }),
        el(SelectControl, { label: __('Mobile focal position', 'renew48-astra-child'), value: media.mobilePosition || media.position || 'center center', options: ['left top','center top','right top','left center','center center','right center','left bottom','center bottom','right bottom'].map((value) => ({ label: value, value })), onChange: (mobilePosition) => updateMedia({ mobilePosition }) }),
        el(SelectControl, { label: __('Background sizing', 'renew48-astra-child'), value: media.size || 'cover', options: [{ label: 'Cover', value: 'cover' }, { label: 'Contain', value: 'contain' }, { label: 'Natural', value: 'auto' }], onChange: (size) => updateMedia({ size }) }),
        el(SelectControl, { label: __('Overlay intensity', 'renew48-astra-child'), value: media.overlay || 'medium', options: [{ label: 'None', value: 'none' }, { label: 'Low', value: 'low' }, { label: 'Medium', value: 'medium' }, { label: 'High', value: 'high' }], onChange: (overlay) => updateMedia({ overlay }) })
      )
    );
  }
  registerPlugin('renew48-page-presentation-mode', { render: PresentationMode });
})(window.wp);
