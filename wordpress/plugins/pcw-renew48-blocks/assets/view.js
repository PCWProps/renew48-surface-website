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
})();
