// The connections hub on the home page (founder, 2026-11-19): draws a line
// from each group of apps to the company's own OpenShore server in the
// middle. When the hub first scrolls into view the lines draw in, then
// points keep flowing from every group into the hub (the first wave rings
// it), while the hub is on screen. With Reduce Motion the lines are simply
// there and nothing moves. Without this script the groups show around the
// hub with no lines.
//
// The CSS says which shape to draw (--hub-layout on .hub): "wheel", groups
// on both sides of a round hub, or "spine", a line down the left from the
// hub to each group. The lines are measured from the page, so they follow
// any reflow (fonts loading, a resize, a phone turning).
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var hubs = document.querySelectorAll('[data-hub]');
  if (!hubs.length || !document.createElementNS) return;
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  Array.prototype.forEach.call(hubs, function (hub) {
    var svg = hub.querySelector('.hub-lines');
    var core = hub.querySelector('.hub-core');
    var mark = hub.querySelector('.hub-mark') || core;
    var nodes = Array.prototype.slice.call(hub.querySelectorAll('.hub-node'));
    if (!svg || !core || !nodes.length) return;

    var wires = document.createElementNS(NS, 'g');
    wires.setAttribute('class', 'hub-wires');
    wires.setAttribute('opacity', '0.42'); // the group fades as one, so lines that share the spine don't darken
    var dots = document.createElementNS(NS, 'g');
    svg.appendChild(wires);
    svg.appendChild(dots);
    var paths = nodes.map(function (node, i) {
      var p = document.createElementNS(NS, 'path');
      var any = node.classList.contains('hub-node--any');
      if (any) p.setAttribute('class', 'hub-wire--any');
      else p.setAttribute('pathLength', '1');
      p.style.setProperty('--i', String(i));
      wires.appendChild(p);
      return p;
    });

    function rel(r, box) {
      return { l: r.left - box.left, r: r.right - box.left, t: r.top - box.top, b: r.bottom - box.top, w: r.width, h: r.height };
    }

    // Each path runs from its group to the hub, the way the point travels.
    function layout() {
      var box = hub.getBoundingClientRect();
      svg.setAttribute('viewBox', '0 0 ' + box.width + ' ' + box.height);
      var c = rel(core.getBoundingClientRect(), box);
      var wheel = getComputedStyle(hub).getPropertyValue('--hub-layout').trim() === 'wheel';
      if (wheel) {
        var cx = c.l + c.w / 2;
        var cy = c.t + c.h / 2;
        var R = c.w / 2 + 12; // to the halo's edge
        var side = { left: [], right: [] };
        nodes.forEach(function (node, i) {
          var n = rel(node.getBoundingClientRect(), box);
          (n.r <= cx ? side.left : side.right).push({ i: i, n: n });
        });
        ['left', 'right'].forEach(function (s) {
          var list = side[s];
          list.forEach(function (o, k) {
            var spread = list.length > 1 ? (k / (list.length - 1) - 0.5) * 0.9 * R : 0;
            var ey = cy + spread;
            var dx = Math.sqrt(Math.max(0, R * R - spread * spread));
            var ex = s === 'left' ? cx - dx : cx + dx;
            var sx = s === 'left' ? o.n.r : o.n.l;
            var sy = o.n.t + o.n.h / 2;
            var mx = sx + (ex - sx) * 0.5;
            paths[o.i].setAttribute('d', 'M' + sx + ' ' + sy + ' C' + mx + ' ' + sy + ' ' + mx + ' ' + ey + ' ' + ex + ' ' + ey);
          });
        });
      } else {
        var m = rel(mark.getBoundingClientRect(), box);
        var x = m.l + m.w / 2;
        var y0 = c.b;
        nodes.forEach(function (node, i) {
          var n = rel(node.getBoundingClientRect(), box);
          var y = n.t + 20; // level with the group's title
          var bend = Math.min(10, (n.l - x) / 2);
          paths[i].setAttribute('d', 'M' + n.l + ' ' + y + ' H' + (x + bend) + ' Q' + x + ' ' + y + ' ' + x + ' ' + (y - bend) + ' V' + y0);
        });
      }
    }

    layout();
    if (window.ResizeObserver) {
      var ro = new ResizeObserver(function () { layout(); });
      ro.observe(hub);
      nodes.forEach(function (n) { ro.observe(n); });
    } else {
      window.addEventListener('resize', layout);
    }
    if (still || !('IntersectionObserver' in window) || !window.requestAnimationFrame) return;

    hub.classList.add('hub-anim');

    function ease(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    // The flow (founder, 2026-11-19: "continuously traveling up to
    // openshore"): after the lines draw, points keep running from every
    // group into the hub, each line on its own steady beat. The first wave
    // rings the hub; after that the points just arrive. One clock runs them
    // all, and it stops while the hub is off screen or the tab is hidden.
    var FIRST = 1150;   // when the first wave leaves, once the lines are in
    var SPEED = 0.17;   // px per ms, so a long line takes longer
    var flows = paths.map(function (p, i) {
      return { p: p, next: FIRST + i * 140, every: 2400 + ((i * 370) % 900), first: true };
    });
    var live = [];
    var clock = 0;      // ms of flow so far
    var last = null;
    var frame = 0;
    var started = false;
    var onScreen = false;

    function ring() {
      core.classList.remove('hub-hit');
      void core.offsetWidth; // restart the ring
      core.classList.add('hub-hit');
    }

    function spawn(f) {
      var dot = document.createElementNS(NS, 'circle');
      dot.setAttribute('r', '4.5');
      dot.setAttribute('class', 'hub-dot');
      dot.setAttribute('opacity', '0');
      dots.appendChild(dot);
      var L = f.p.getTotalLength();
      live.push({ dot: dot, p: f.p, from: clock, ms: Math.min(3200, Math.max(1100, L / SPEED)), first: f.first });
      f.first = false;
    }

    function tick(now) {
      frame = 0;
      if (last !== null) clock += Math.min(now - last, 64);
      last = now;
      flows.forEach(function (f) {
        if (clock >= f.next) {
          spawn(f);
          f.next += f.every;
        }
      });
      live = live.filter(function (d) {
        var k = Math.min(1, (clock - d.from) / d.ms);
        var L = d.p.getTotalLength();
        var pt = d.p.getPointAtLength(L * ease(k));
        d.dot.setAttribute('cx', pt.x);
        d.dot.setAttribute('cy', pt.y);
        d.dot.setAttribute('opacity', String(k < 0.1 ? k * 10 : k > 0.9 ? (1 - k) * 10 : 1));
        if (k < 1) return true;
        dots.removeChild(d.dot);
        if (d.first) ring();
        return false;
      });
      frame = requestAnimationFrame(tick);
    }

    function go() {
      if (started && onScreen && !document.hidden && !frame) {
        last = null;
        frame = requestAnimationFrame(tick);
      }
    }

    function halt() {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      last = null;
    }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) halt();
      else go();
    });

    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        onScreen = e.isIntersecting;
        if (!onScreen) {
          halt();
          return;
        }
        if (!started && e.intersectionRatio >= 0.35) {
          started = true;
          // One frame first, so the undrawn lines paint before they draw.
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              hub.classList.add('hub-drawn');
              go();
            });
          });
          return;
        }
        go();
      });
    }, { threshold: [0, 0.35] }).observe(hub);
  });
})();
