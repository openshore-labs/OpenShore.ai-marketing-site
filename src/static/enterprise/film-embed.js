// The films in their windows (founder, 2026-11-24): on a desktop, the home
// page's film and the platform page's product tour play where their posters
// stand, from the moment the page opens, muted, on a loop, with only Mute and
// Full screen (the film's own ?embed mode). The poster shows until the film
// has loaded. The page holds a film while it is scrolled out of sight.
//
// Phones, tablets and anyone who asks for reduced motion keep the poster;
// a click plays the film in its window, with sound. A page without scripts
// still opens the film full page.
(function () {
  'use strict';
  var mq = window.matchMedia;
  // A desktop plays the film by itself, muted. Everywhere else the poster
  // waits, and a click plays the film in the same window, with sound, with
  // Full screen as an option (founder, 2026-11-25).
  var auto = !!mq && mq('(min-width: 900px) and (hover: hover) and (pointer: fine)').matches &&
    !mq('(prefers-reduced-motion: reduce)').matches;

  function embed(a, withSound) {
    var href = a.getAttribute('href');
    var box = document.createElement('div');
    box.className = a.className + ' ent-film--live';
    var frame = document.createElement('div');
    frame.className = 'ent-film-frame';
    var img = a.querySelector('img');
    if (img) frame.appendChild(img.cloneNode(true));
    var ifr = document.createElement('iframe');
    ifr.src = href + (href.indexOf('?') < 0 ? '?' : '&') + 'embed' + (withSound ? '&sound' : '');
    ifr.title = a.getAttribute('data-film-title') || 'The OpenShore film';
    ifr.allow = 'autoplay; fullscreen';
    ifr.setAttribute('allowfullscreen', '');
    var seen = true;
    function tell() {
      try { ifr.contentWindow.postMessage({ osFilm: seen ? 'go' : 'hold' }, location.origin); } catch (err) {}
    }
    ifr.addEventListener('load', function () { box.classList.add('is-ready'); tell(); });
    // The film says when it is up, which can be well before the frame's load
    // event on a phone. It also asks for the page to fill the screen where the
    // browser cannot take it full screen (an iPhone).
    function onKey(e) { if (e.key === 'Escape') setPFull(false); }
    function setPFull(on) {
      box.classList.toggle('is-pfull', on);
      document.documentElement.classList.toggle('ent-pfull', on);
      if (on) document.addEventListener('keydown', onKey); else document.removeEventListener('keydown', onKey);
      try { ifr.contentWindow.postMessage({ osFilm: 'full', on: on }, location.origin); } catch (err) {}
    }
    window.addEventListener('message', function (e) {
      if (e.origin !== location.origin || e.source !== ifr.contentWindow || !e.data) return;
      if (e.data.osFilmReady) { box.classList.add('is-ready'); tell(); }
      if (typeof e.data.osFilmFull === 'boolean') setPFull(e.data.osFilmFull);
    });
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
    Array.prototype.forEach.call(document.querySelectorAll('a.ent-film[data-film-embed]'), function (a) {
      if (auto) { embed(a, false); return; }
      a.addEventListener('click', function (e) {
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button) return;
        e.preventDefault();
        embed(a, true);
      });
    });
  }
  // After the page itself has loaded, so the film never slows its first paint.
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start);
})();
