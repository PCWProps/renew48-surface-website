(function (wp) {
  const { registerPlugin } = wp.plugins;
  const { PluginDocumentSettingPanel } = wp.editPost;
  const { SelectControl } = wp.components;
  const { useSelect, useDispatch } = wp.data;
  const { createElement: el } = wp.element;
  const { __ } = wp.i18n;
  const key = '_pcw_presentation_mode';

  function PresentationMode() {
    const meta = useSelect((select) => select('core/editor').getEditedPostAttribute('meta') || {}, []);
    const { editPost } = useDispatch('core/editor');
    const value = meta[key] || 'contained-desert';
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
      })
    );
  }
  registerPlugin('renew48-page-presentation-mode', { render: PresentationMode });
})(window.wp);
