// Phone behavior for the scrolling tab strip. A separate same-origin file (not
// inline) so it passes the strict script-src 'self' CSP in base.njk.
//
// 1. Bring the current tab into view once on load, so a visitor landing on a
//    later section (say, Self-Hosting) is not left looking at "Platform".
//    block:"nearest" keeps this from nudging the page vertically.
// 2. Mark the strip's scroll position so the CSS edge fade can follow it:
//    is-scrolled once the left edge has moved (fade the left side too), and
//    is-end when the last tab is fully in view (clear the right fade).
(function () {
  var strip = document.querySelector(".sitenav-tabs");
  if (!strip) return;

  function mark() {
    var left = strip.scrollLeft;
    var end = left + strip.clientWidth >= strip.scrollWidth - 1;
    strip.classList.toggle("is-scrolled", left > 1);
    strip.classList.toggle("is-end", end);
  }

  var tab = strip.querySelector(".sitenav-tab.is-active");
  if (tab && typeof tab.scrollIntoView === "function") {
    tab.scrollIntoView({ block: "nearest", inline: "center" });
  }

  strip.addEventListener("scroll", mark, { passive: true });
  window.addEventListener("resize", mark, { passive: true });
  mark();
})();
