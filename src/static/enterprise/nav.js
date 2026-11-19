// The tab row under the header (founder, 2026-11-19). On a phone the five tabs
// are wider than the screen, so the row scrolls sideways: this keeps the
// current page's tab in view when the page opens, and fades the edge that
// has more tabs so the rest are discoverable. Without it the row still
// scrolls; nothing is hidden.
(function () {
  'use strict';
  var row = document.querySelector('.ent-tabs-row');
  if (!row) return;
  var cur = row.querySelector('[aria-current="page"]');
  if (cur) {
    var right = cur.offsetLeft + cur.offsetWidth + 32 - row.clientWidth;
    if (right > 0) row.scrollLeft = right;
  }
  function edges() {
    var max = row.scrollWidth - row.clientWidth;
    row.classList.toggle('is-left', row.scrollLeft > 2);
    row.classList.toggle('is-right', row.scrollLeft < max - 2);
  }
  row.addEventListener('scroll', edges, { passive: true });
  window.addEventListener('resize', edges);
  edges();
})();
