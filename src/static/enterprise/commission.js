// The worked examples on the home page (founder, 2026-11-18): the promo
// film's commission scene and the inventory fix, each played once when its
// chat scrolls into view, then held on its last frame. Replay plays it again.
// Every [data-cd] panel runs on its own clock.
//
// The tabs ([data-cd-tabs]) show one panel at a time. They work with Reduce
// Motion too; without this script every panel shows and the tabs stay hidden.
// Where the row is wider than the screen it scrolls sideways, fades at the
// edge that has more, and keeps the chosen tab in view.
// A panel shown by its tab plays when it is first seen, like the other.
//
// Without this script, or with Reduce Motion on, the section stays still and
// complete: nothing is hidden until this script has taken it over.
//
//   [data-type="ms"]   a message whose typing dots start then
//   [data-at="ms"]     gets .on then (inside .cd-loop, counted from the
//                      loop's own data-at)
//   .cd-loop           waits at its start until it is on screen, so a phone
//                      reader sees the loop light rather than finding it lit
//   [data-typein]      "start ms:end ms:send ms", the app frame's composer:
//                      its data-text is typed in from start to end, and
//                      leaves the field at send, when the message lands
//                      (its .cd-compose gets .has-text while it holds words and
//                      .is-writing until it is sent)
//   [data-count]       "from:to:start ms:length ms", a figure that counts,
//                      read through data-format ({n} is the number) when it
//                      has one, else in data-unit, else in dollars
//
// The clock stops while the tab is hidden and picks up where it left off.
(function () {
  'use strict';

  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // The tabs: one panel at a time, arrow keys move between tabs.
  Array.prototype.forEach.call(document.querySelectorAll('[data-cd-tabs]'), function (list) {
    var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
    function panelOf(tab) { return document.getElementById(tab.getAttribute('aria-controls')); }
    function edges() {
      var max = list.scrollWidth - list.clientWidth;
      list.classList.toggle('cd-tabs--left', list.scrollLeft > 2);
      list.classList.toggle('cd-tabs--right', list.scrollLeft < max - 2);
    }
    function reveal(tab) {
      var room = 28; // keep the chosen tab clear of the faded edge
      var l = tab.offsetLeft - room;
      var r = tab.offsetLeft + tab.offsetWidth + room - list.clientWidth;
      var to = list.scrollLeft < r ? r : list.scrollLeft > l ? l : list.scrollLeft;
      if (to !== list.scrollLeft) list.scrollTo({ left: Math.max(0, to), behavior: still ? 'auto' : 'smooth' });
    }
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        var panel = panelOf(t);
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus({ preventScroll: true });
      reveal(tab);
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(tab, false); });
      tab.addEventListener('keydown', function (e) {
        var k = e.key;
        var j = k === 'ArrowRight' ? i + 1 : k === 'ArrowLeft' ? i - 1 : k === 'Home' ? 0 : k === 'End' ? tabs.length - 1 : -1;
        if (j === -1 && k !== 'ArrowLeft') return;
        e.preventDefault();
        select(tabs[(j + tabs.length) % tabs.length], true);
      });
    });
    list.hidden = false;
    list.addEventListener('scroll', edges, { passive: true });
    window.addEventListener('resize', edges);
    select(tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0] || tabs[0], false);
    edges();
  });

  // The app frame ([data-cd-app], the home page, 2026-11-22): from 640px wide
  // the example sits in the desktop window, a 1280 by 800 canvas scaled to
  // the frame (--k). The zoom (--zx, --zy, --zs) frames the thread and the
  // composer, worked out from where they sit, and is redone on every resize.
  // This runs with Reduce Motion too: the window then shows still, whole and
  // complete.
  Array.prototype.forEach.call(document.querySelectorAll('[data-cd-app]'), function (app) {
    var W = 1280, H = 800, PAD = 28;
    var cam = app.querySelector('.cd-cam');
    var thread = app.querySelector('.cd-thread');
    var compose = app.querySelector('.cd-compose');
    if (!cam || !thread || !compose) return;
    function at(el) {
      var x = 0, y = 0;
      while (el && el !== cam) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent; }
      return { x: x, y: y };
    }
    function fit() {
      var w = app.clientWidth;
      var on = w >= 640;
      app.classList.toggle('cd-app--fit', on);
      if (!on) return;
      app.style.setProperty('--k', String(w / W));
      var a = at(thread), b = at(compose);
      var left = Math.min(a.x, b.x), top = a.y;
      var right = Math.max(a.x + thread.offsetWidth, b.x + compose.offsetWidth);
      var bottom = b.y + compose.offsetHeight;
      var s = Math.min(1.7, W / (right - left + PAD * 2), H / (bottom - top + PAD * 2));
      var tx = W / 2 - s * (left + right) / 2;
      var ty = H / 2 - s * (top + bottom) / 2;
      tx = Math.min(0, Math.max(W - s * W, tx));
      ty = Math.min(0, Math.max(H - s * H, ty));
      app.style.setProperty('--zs', s.toFixed(4));
      app.style.setProperty('--zx', tx.toFixed(1) + 'px');
      app.style.setProperty('--zy', ty.toFixed(1) + 'px');
    }
    fit();
    if ('ResizeObserver' in window) new ResizeObserver(fit).observe(app);
    else window.addEventListener('resize', fit);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  });

  if (still || !('IntersectionObserver' in window) || !window.requestAnimationFrame) return;
  Array.prototype.forEach.call(document.querySelectorAll('[data-cd]'), setup);

  function setup(root) {
    var chat = root.querySelector('.cd-chat');
    var loop = root.querySelector('.cd-loop');
    if (!chat || !loop) return;
    var loopAt = Number(loop.getAttribute('data-at')) || 0;
    var gate = loopAt - 1; // where the clock waits for the loop to be on screen

    var events = [];
    Array.prototype.forEach.call(root.querySelectorAll('[data-type]'), function (el) {
      events.push({ at: Number(el.getAttribute('data-type')), el: el, cls: 'is-typing' });
    });
    Array.prototype.forEach.call(root.querySelectorAll('[data-at]'), function (el) {
      if (el === loop) return;
      var at = Number(el.getAttribute('data-at'));
      events.push({ at: loop.contains(el) ? loopAt + at : at, el: el, cls: 'on' });
    });
    events.sort(function (a, b) { return a.at - b.at; });

    var counters = Array.prototype.map.call(root.querySelectorAll('[data-count]'), function (el) {
      var v = el.getAttribute('data-count').split(':').map(Number);
      return { el: el, from: v[0], to: v[1], at: v[2], ms: v[3] || 1, unit: el.getAttribute('data-unit'), format: el.getAttribute('data-format') };
    });
    var drafts = Array.prototype.map.call(root.querySelectorAll('[data-typein]'), function (el) {
      var v = el.getAttribute('data-typein').split(':').map(Number);
      return { el: el, field: el.closest('.cd-compose') || el.parentNode, text: el.getAttribute('data-text') || '', at: v[0], to: v[1], sent: v[2], shown: -1 };
    });
    function type(d) {
      var n = t < d.at || t >= d.sent ? 0 : Math.round(d.text.length * Math.min(1, (t - d.at) / Math.max(1, d.to - d.at)));
      var writing = t >= d.at && t < d.sent;
      if (n === d.shown && writing === d.writing) return;
      d.shown = n;
      d.writing = writing;
      d.el.textContent = d.text.slice(0, n);
      d.field.classList.toggle('has-text', n > 0);
      d.field.classList.toggle('is-writing', writing);
    }

    function figure(c, n) {
      var whole = Math.round(n).toLocaleString('en-US');
      if (c.format) return c.format.replace('{n}', whole);
      return c.unit ? '+' + whole + ' ' + c.unit : '+$' + whole;
    }
    function easeOut(x) {
      return 1 - Math.pow(1 - x, 3);
    }

    var end = events.length ? events[events.length - 1].at : 0;
    counters.forEach(function (c) { end = Math.max(end, c.at + c.ms); });
    drafts.forEach(function (d) { end = Math.max(end, d.sent); });

    var t = 0;         // the demo's own clock, in ms
    var last = null;   // the frame time the clock last read
    var next = 0;      // the next event to fire
    var frame = 0;
    var started = false;
    var loopIn = false;

    function draw() {
      while (next < events.length && events[next].at <= t) {
        events[next].el.classList.add(events[next].cls);
        next++;
      }
      counters.forEach(function (c) {
        var k = Math.min(1, Math.max(0, (t - c.at) / c.ms));
        c.el.textContent = figure(c, c.from + (c.to - c.from) * easeOut(k));
      });
      drafts.forEach(type);
    }

    function tick(now) {
      frame = 0;
      if (last !== null) {
        var dt = Math.min(now - last, 64);
        // The loop waits at its start until it is on screen.
        t = !loopIn && t <= gate ? Math.min(t + dt, gate) : t + dt;
      }
      last = now;
      draw();
      if (t >= end) return;
      if (!loopIn && t === gate) {
        last = null;
        return; // resumed by the loop's observer
      }
      frame = requestAnimationFrame(tick);
    }

    function run() {
      if (!frame && !document.hidden && t < end) frame = requestAnimationFrame(tick);
    }

    function stop() {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      last = null;
    }

    function reset() {
      stop();
      t = 0;
      next = 0;
      events.forEach(function (e) { e.el.classList.remove('is-typing', 'on'); });
      counters.forEach(function (c) { c.el.textContent = figure(c, c.from); });
      drafts.forEach(function (d) { d.shown = -1; type(d); });
    }

    function play() {
      started = true;
      reset();
      // One frame first, so the hidden state paints before the run.
      frame = requestAnimationFrame(function () {
        frame = 0;
        last = null;
        run();
      });
    }

    root.classList.add('cd-anim');
    reset();

    var replay = root.querySelector('.ent-replay');
    if (replay) {
      replay.hidden = false;
      replay.addEventListener('click', play);
    }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop();
      else if (started) run();
    });

    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        loopIn = e.isIntersecting;
        if (loopIn && started) run();
      });
    }, { threshold: 0.3 }).observe(loop);

    // The app frame (2026-11-22) opens on the whole window, so it waits until
    // the whole window is on screen (or fills most of a short screen) rather
    // than starting while the reader is still scrolling to it.
    var need = 0.4;
    if (chat.hasAttribute('data-cd-app')) {
      need = Math.min(0.95, (0.9 * window.innerHeight) / Math.max(1, chat.offsetHeight));
    }
    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && e.intersectionRatio >= need - 0.01 && !started) {
          seen.disconnect();
          play();
        }
      });
    }, { threshold: [need] });
    seen.observe(chat);
  }
})();
