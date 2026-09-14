(function (blocks, element, components, blockEditor, i18n) {
  const { registerBlockType } = blocks;
  const { createElement: el, Fragment } = element;
  const ServerSideRender = window.wp.serverSideRender && (window.wp.serverSideRender.default || window.wp.serverSideRender);
  const { InspectorControls, RichText, useBlockProps } = blockEditor;
  const { PanelBody, TextControl, SelectControl } = components;
  const names = ['container','section','grid','flex-row','flex-column','spacer','divider','hero-primary','hero-split','hero-video','hero-service','cta-banner','service-card','service-grid','service-detail','service-comparison','service-accordion','membership-tier','membership-comparison','membership-benefits','membership-cta','booking-widget','availability-preview','lead-form','consultation-cta','funnel-step','faq-accordion','testimonial-slider','blog-preview','education-grid','glass-panel','liquid-glass','acrylic-card','neon-accent','parallax-layer','hover-reveal','scroll-reveal','header-cta','footer-columns','navigation-panel','breadcrumbs','alert-banner','unleashed-article'];
  const label = (name) => name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  names.forEach((name) => registerBlockType(`renew48/${name}`, {
    apiVersion: 3, title: `Renew48: ${label(name)}`, category: 'design', icon: 'layout', supports: { html: false, anchor: true, align: ['wide','full'] },
    attributes: { title:{type:'string',default:label(name)}, eyebrow:{type:'string',default:''}, body:{type:'string',default:''}, ctaLabel:{type:'string',default:''}, ctaUrl:{type:'string',default:''}, source:{type:'string',default:''}, site:{type:'string',default:''}, variant:{type:'string',default:'default'}, items:{type:'array',default:[]}, level:{type:'integer',default:2} },
    edit: ({attributes,setAttributes}) => name === 'unleashed-article' && ServerSideRender ? el(ServerSideRender, {block:'renew48/unleashed-article', attributes}) : el(Fragment, {},
      el(InspectorControls, {}, el(PanelBody, {title:i18n.__('Renew48 settings','pcw-renew48')},
        el(TextControl,{label:i18n.__('Eyebrow','pcw-renew48'),value:attributes.eyebrow,onChange:eyebrow=>setAttributes({eyebrow})}),
        el(TextControl,{label:i18n.__('Public API source','pcw-renew48'),help:i18n.__('Only a configured public projection is loaded on the site.','pcw-renew48'),value:attributes.source,onChange:source=>setAttributes({source})}),
        el(TextControl,{label:i18n.__('Site key','pcw-renew48'),value:attributes.site,onChange:site=>setAttributes({site})}),
        el(TextControl,{label:i18n.__('CTA label','pcw-renew48'),value:attributes.ctaLabel,onChange:ctaLabel=>setAttributes({ctaLabel})}),
        el(TextControl,{label:i18n.__('CTA URL','pcw-renew48'),value:attributes.ctaUrl,onChange:ctaUrl=>setAttributes({ctaUrl})}),
        el(SelectControl,{label:i18n.__('Visual variation','pcw-renew48'),value:attributes.variant,options:[{label:'Default',value:'default'},{label:'Glass',value:'glass'},{label:'Quiet',value:'quiet'}],onChange:variant=>setAttributes({variant})})
      )),
      el('section',useBlockProps({className:`pcw-r48-editor pcw-r48-${name}`}),
        attributes.eyebrow && el('p',{className:'pcw-r48-eyebrow'},attributes.eyebrow),
        el(RichText,{tagName:'h2',value:attributes.title,onChange:title=>setAttributes({title}),placeholder:i18n.__('Heading','pcw-renew48')}),
        el(RichText,{tagName:'p',value:attributes.body,onChange:body=>setAttributes({body}),placeholder:i18n.__('Supporting copy','pcw-renew48')})
      )
    ), save: () => null
  }));
})(window.wp.blocks, window.wp.element, window.wp.components, window.wp.blockEditor, window.wp.i18n);
