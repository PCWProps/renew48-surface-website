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
})();
