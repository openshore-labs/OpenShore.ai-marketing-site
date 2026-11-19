// The worked examples on the home page (founder, 2026-11-18): the promo
// film's commission scene and the inventory fix, each played once when its
// chat scrolls into view, then held on its last frame. Replay plays it again.
// Every [data-cd] panel runs on its own clock.
//
// The tabs ([data-cd-tabs]) show one panel at a time. They work with Reduce
// Motion too; without this script both panels show and the tabs stay hidden.
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
//   [data-count]       "from:to:start ms:length ms", a figure that counts up,
//                      in dollars, or in data-unit when it has one
//
// The clock stops while the tab is hidden and picks up where it left off.
(function () {
  'use strict';

  // The tabs: one panel at a time, arrow keys move between tabs.
  Array.prototype.forEach.call(document.querySelectorAll('[data-cd-tabs]'), function (list) {
    var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
    function panelOf(tab) { return document.getElementById(tab.getAttribute('aria-controls')); }
    function select(tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        var panel = panelOf(t);
        if (panel) panel.hidden = !on;
      });
      if (focus) tab.focus();
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
    select(tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0] || tabs[0], false);
  });

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window) || !window.requestAnimationFrame) return;
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
      return { el: el, from: v[0], to: v[1], at: v[2], ms: v[3] || 1, unit: el.getAttribute('data-unit') };
    });
    function figure(c, n) {
      var whole = Math.round(n).toLocaleString('en-US');
      return c.unit ? '+' + whole + ' ' + c.unit : '+$' + whole;
    }
    function easeOut(x) {
      return 1 - Math.pow(1 - x, 3);
    }

    var end = events.length ? events[events.length - 1].at : 0;
    counters.forEach(function (c) { end = Math.max(end, c.at + c.ms); });

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

    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !started) {
          seen.disconnect();
          play();
        }
      });
    }, { threshold: 0.4 });
    seen.observe(chat);
  }
})();
