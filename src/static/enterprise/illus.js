// The illustrations on Pricing, Security and About (founder, 2026-11-19).
// Each [data-illus] figure plays its entrance once when it scrolls into view
// (.is-seen) and runs its loops only while on screen (.is-in), so nothing
// moves out of sight. Children of [data-stagger] get --i, their place in
// line, for staggered timing. With Reduce Motion, or without this script,
// every figure stays still and complete.
(function () {
  'use strict';
  var figs = document.querySelectorAll('[data-illus]');
  if (!figs.length) return;
  Array.prototype.forEach.call(document.querySelectorAll('[data-stagger]'), function (g) {
    Array.prototype.forEach.call(g.children, function (c, i) { c.style.setProperty('--i', String(i)); });
  });
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (still || !('IntersectionObserver' in window)) return;
  var seen = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      e.target.classList.toggle('is-in', e.isIntersecting);
      if (e.isIntersecting) e.target.classList.add('is-seen');
    });
  }, { threshold: 0.3 });
  Array.prototype.forEach.call(figs, function (f) {
    f.classList.add('illus-anim');
    seen.observe(f);
  });
})();
