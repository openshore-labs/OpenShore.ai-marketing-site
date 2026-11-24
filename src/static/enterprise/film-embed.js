// The films in their windows (founder, 2026-11-24): on a desktop, the home
// page's film and the platform page's product tour play where their posters
// stand, from the moment the page opens, muted, on a loop, with only Mute and
// Full screen (the film's own ?embed mode). The poster shows until the film
// has loaded. The page holds a film while it is scrolled out of sight.
//
// Phones, tablets and anyone who asks for reduced motion keep the poster,
// which opens the film full page, as before. So does a page without scripts.
(function () {
  'use strict';
  var mq = window.matchMedia;
  if (!mq || !mq('(min-width: 900px) and (hover: hover) and (pointer: fine)').matches) return;
  if (mq('(prefers-reduced-motion: reduce)').matches) return;

  function embed(a) {
    var href = a.getAttribute('href');
    var box = document.createElement('div');
    box.className = a.className + ' ent-film--live';
    var frame = document.createElement('div');
    frame.className = 'ent-film-frame';
    var img = a.querySelector('img');
    if (img) frame.appendChild(img.cloneNode(true));
    var ifr = document.createElement('iframe');
    ifr.src = href + (href.indexOf('?') < 0 ? '?' : '&') + 'embed';
    ifr.title = a.getAttribute('data-film-title') || 'The OpenShore film';
    ifr.allow = 'autoplay; fullscreen';
    ifr.setAttribute('allowfullscreen', '');
    var seen = true;
    function tell() {
      try { ifr.contentWindow.postMessage({ osFilm: seen ? 'go' : 'hold' }, location.origin); } catch (err) {}
    }
    ifr.addEventListener('load', function () { box.classList.add('is-ready'); tell(); });
    frame.appendChild(ifr);
    box.appendChild(frame);
    var meta = a.querySelector('.ent-film-meta');
    if (meta) box.appendChild(meta.cloneNode(true));
    a.parentNode.replaceChild(box, a);

    // The note under a poster ("Opens full screen...") describes the poster,
    // not the window.
    var note = box.parentNode.querySelector('[data-film-note]');
    if (note) note.hidden = true;

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { seen = e.isIntersecting; tell(); });
      }, { threshold: 0.2 }).observe(box);
    }
  }

  function start() {
    Array.prototype.forEach.call(document.querySelectorAll('a.ent-film[data-film-embed]'), embed);
  }
  // After the page itself has loaded, so the film never slows its first paint.
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start);
})();
