(() => {
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.r48-unleashed-standard').forEach((root) => root.classList.add('is-motion-ready'));
  document.querySelectorAll('[data-pcw-reveal="true"]').forEach((node) => {
    if (reduced || !('IntersectionObserver' in window)) return node.classList.add('is-visible');
    new IntersectionObserver((entries, observer) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: 0.12 }).observe(node);
  });
  document.querySelectorAll('.pcw-r48-motion-target, .r48-unleashed-standard .r48-animate').forEach((node) => {
    if (reduced || !('IntersectionObserver' in window)) return node.classList.add('is-visible');
    new IntersectionObserver((entries, observer) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: 0.14 }).observe(node);
  });
  document.querySelectorAll('[data-pcw-carousel="true"]').forEach((root) => {
    const track = root.querySelector('[data-pcw-carousel-track]');
    if (!track || track.children.length < 2 || reduced) return;
    const controls = document.createElement('div');
    controls.className = 'pcw-r48-carousel-controls';
    const previous = document.createElement('button'); previous.type = 'button'; previous.className = 'pcw-r48-carousel-button'; previous.setAttribute('aria-label', 'Previous slide'); previous.textContent = '←';
    const next = document.createElement('button'); next.type = 'button'; next.className = 'pcw-r48-carousel-button'; next.setAttribute('aria-label', 'Next slide'); next.textContent = '→';
    const scroll = (direction) => track.scrollBy({ left: direction * Math.max(track.clientWidth * .82, 260), behavior: 'smooth' });
    previous.addEventListener('click', () => scroll(-1)); next.addEventListener('click', () => scroll(1));
    controls.append(previous, next); root.append(controls);
  });
  document.querySelectorAll('[data-pcw-modal="true"]').forEach((root) => {
    const trigger = root.querySelector('.pcw-r48-cta');
    if (!trigger) return;
    const dialog = document.createElement('dialog'); dialog.className = 'pcw-r48-dialog';
    const title = root.querySelector('h1,h2,h3'); const body = root.querySelector('.pcw-r48-body');
    dialog.innerHTML = '<form method="dialog"><button class="pcw-r48-dialog-close" aria-label="Close">×</button></form>' + (title ? '<h2>' + title.textContent + '</h2>' : '') + (body ? body.innerHTML : '');
    document.body.append(dialog);
    trigger.addEventListener('click', (event) => { event.preventDefault(); dialog.showModal(); });
    dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  });
  document.querySelectorAll('[data-pcw-drawer]').forEach((drawer) => {
    const button = drawer.querySelector('[data-pcw-drawer-toggle]'); const nav = drawer.querySelector('nav');
    if (!button || !nav) return;
    button.addEventListener('click', () => { const open = button.getAttribute('aria-expanded') === 'true'; button.setAttribute('aria-expanded', String(!open)); nav.hidden = open; if (!open) nav.querySelector('a')?.focus(); });
  });
  document.querySelectorAll('[data-pcw-newsletter]').forEach((form) => {
    form.addEventListener('submit', (event) => { if (form.getAttribute('action')) return; event.preventDefault(); const status = form.querySelector('.pcw-r48-form-status'); if (status) status.textContent = 'Newsletter provider is not configured on this site yet.'; });
  });
  document.querySelectorAll('[data-pcw-tabs]').forEach((root) => {
    const cards = [...root.querySelectorAll('.pcw-r48-item')]; if (cards.length < 2) return;
    const controls = document.createElement('div'); controls.className = 'pcw-r48-tab-controls'; controls.setAttribute('role', 'tablist');
    cards.forEach((card, index) => { const panelId = `pcw-r48-panel-${Math.random().toString(36).slice(2)}-${index}`; card.id = panelId; card.setAttribute('role', 'tabpanel'); card.hidden = index !== 0; const button = document.createElement('button'); button.type = 'button'; button.setAttribute('role', 'tab'); button.textContent = card.querySelector('h3')?.textContent || `Tab ${index + 1}`; button.setAttribute('aria-selected', String(index === 0)); button.setAttribute('aria-controls', panelId); button.tabIndex = index === 0 ? 0 : -1; button.addEventListener('click', () => { cards.forEach((item, itemIndex) => { item.hidden = itemIndex !== index; }); [...controls.children].forEach((control, controlIndex) => { control.setAttribute('aria-selected', String(controlIndex === index)); control.tabIndex = controlIndex === index ? 0 : -1; }); }); controls.append(button); });
    root.prepend(controls);
  });
  document.querySelectorAll('[data-pcw-gallery] img').forEach((image) => {
    image.tabIndex = 0; image.setAttribute('role', 'button'); image.setAttribute('aria-label', `Open ${image.alt || 'image'}`);
    const open = () => { const dialog = document.createElement('dialog'); dialog.className = 'pcw-r48-dialog'; dialog.innerHTML = '<form method="dialog"><button class="pcw-r48-dialog-close" aria-label="Close">×</button></form>'; const full = image.cloneNode(); full.removeAttribute('tabindex'); full.removeAttribute('role'); dialog.append(full); document.body.append(dialog); dialog.showModal(); dialog.addEventListener('close', () => dialog.remove()); };
    image.addEventListener('click', open); image.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(); } });
  });
})();
