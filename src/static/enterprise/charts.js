// The animated charts on Grow with Us (founder, 2026-11-16).
//
// Each chart draws itself once, when it scrolls into view: a lit point
// travels along every line, the line draws behind it, and the parts that
// matter arrive as the point reaches them. The journey pauses at the key
// moments (an svg's data-stops: "x:ms to get there:ms to hold", in order).
//
// Without this script, or with Reduce Motion on, the charts stay still and
// complete: nothing is hidden until this script has taken a chart over.
//
//   path.c-draw      a line to draw; its x must only increase
//   [data-x="n"]     shown once the point passes x = n
//   rect.c-clip      the clip that reveals an area up to the point
//   path[data-from]  a line drawn along data-from, then snapped to its own d
//                    over the svg's data-morph ms (both with the same commands)
//   [data-after]     shown as that snap begins
//   .ent-replay      the figure's button that plays it again
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var svgs = document.querySelectorAll('svg[data-stops]');
  if (!svgs.length) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window) || !window.requestAnimationFrame) return;

  function ease(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function easeBack(t) {
    var c1 = 1.4;
    var c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }

  function circle(r, cls) {
    var c = document.createElementNS(NS, 'circle');
    c.setAttribute('r', r);
    c.setAttribute('class', cls);
    return c;
  }

  function setup(svg) {
    var lines = Array.prototype.map.call(svg.querySelectorAll('.c-draw'), function (p) {
      var toD = p.getAttribute('d');
      var fromD = p.getAttribute('data-from');
      if (fromD) p.setAttribute('d', fromD);
      var L = p.getTotalLength();
      var xs = [];
      var ls = [];
      for (var i = 0; i <= 240; i++) {
        var l = (L * i) / 240;
        xs.push(p.getPointAtLength(l).x);
        ls.push(l);
      }
      p.setAttribute('stroke-dasharray', L + ' ' + L);
      var sea = p.classList.contains('c-line--sea') ? ' c-head--sea' : '';
      var glow = circle(13, 'c-head-glow' + sea);
      var head = circle(5.5, 'c-head' + sea);
      svg.appendChild(glow);
      svg.appendChild(head);
      return { p: p, L: L, xs: xs, ls: ls, head: head, glow: glow, fromD: fromD, toD: toD };
    });
    if (!lines.length) return;

    var reveals = Array.prototype.slice.call(svg.querySelectorAll('[data-x]'));
    var afters = Array.prototype.slice.call(svg.querySelectorAll('[data-after]'));
    var morphMs = Number(svg.getAttribute('data-morph')) || 0;
    var morphing = lines.filter(function (o) { return o.fromD; });
    var clip = svg.querySelector('.c-clip');
    var x0 = Math.min.apply(null, lines.map(function (o) { return o.xs[0]; }));
    var stops = svg.getAttribute('data-stops').split(',').map(function (s) {
      var v = s.split(':').map(Number);
      return { x: v[0], move: v[1], hold: v[2] || 0 };
    });

    function lengthAt(o, x) {
      var n = o.xs.length - 1;
      if (x <= o.xs[0]) return 0;
      if (x >= o.xs[n]) return o.L;
      var lo = 0;
      var hi = n;
      while (hi - lo > 1) {
        var mid = (lo + hi) >> 1;
        if (o.xs[mid] < x) lo = mid; else hi = mid;
      }
      var f = (x - o.xs[lo]) / (o.xs[hi] - o.xs[lo] || 1);
      return o.ls[lo] + f * (o.ls[hi] - o.ls[lo]);
    }

    function draw(x) {
      lines.forEach(function (o) {
        var l = lengthAt(o, x);
        o.p.setAttribute('stroke-dashoffset', String(o.L - l));
        var pt = o.p.getPointAtLength(l);
        o.head.setAttribute('cx', pt.x);
        o.head.setAttribute('cy', pt.y);
        o.glow.setAttribute('cx', pt.x);
        o.glow.setAttribute('cy', pt.y);
      });
      if (clip) clip.setAttribute('width', String(Math.min(Math.max(0, x), 4000)));
      reveals.forEach(function (el) {
        if (x >= Number(el.getAttribute('data-x'))) el.classList.add('on');
      });
    }

    var frame = 0;
    function reset() {
      cancelAnimationFrame(frame);
      svg.classList.remove('c-run', 'c-done');
      reveals.concat(afters).forEach(function (el) { el.classList.remove('on'); });
      morphing.forEach(function (o) { o.p.setAttribute('d', o.fromD); });
      draw(x0 - 1);
    }

    function play() {
      reset();
      // One frame at the start, so the hidden state paints before the run.
      frame = requestAnimationFrame(function () {
        svg.classList.add('c-run');
        var start = performance.now();
        var tick = function (now) {
          var t = now - start;
          var from = x0;
          for (var i = 0; i < stops.length; i++) {
            var s = stops[i];
            if (t < s.move) {
              draw(from + (s.x - from) * ease(t / s.move));
              frame = requestAnimationFrame(tick);
              return;
            }
            t -= s.move;
            if (t < s.hold) {
              draw(s.x);
              frame = requestAnimationFrame(tick);
              return;
            }
            t -= s.hold;
            from = s.x;
          }
          draw(4000);
          svg.classList.remove('c-run');
          if (morphing.length && morphMs) {
            snap();
            return;
          }
          svg.classList.add('c-done');
        };
        frame = requestAnimationFrame(tick);
      });
    }

    // The snap: each line moves from its first shape to its final one with a
    // little overshoot, and the parts that explain it arrive.
    var NUM = /-?\d*\.?\d+/g;
    function snap() {
      afters.forEach(function (el) { el.classList.add('on'); });
      var pairs = morphing.map(function (o) {
        return { o: o, a: o.fromD.match(NUM).map(Number), b: o.toD.match(NUM).map(Number) };
      });
      var start = performance.now();
      var step = function (now) {
        var t = Math.min(1, (now - start) / morphMs);
        var k = easeBack(t);
        pairs.forEach(function (q) {
          var i = 0;
          q.o.p.setAttribute('d', q.o.fromD.replace(NUM, function () {
            var v = q.a[i] + (q.b[i] - q.a[i]) * k;
            i++;
            return String(Math.round(v * 10) / 10);
          }));
        });
        if (t < 1) {
          frame = requestAnimationFrame(step);
          return;
        }
        pairs.forEach(function (q) { q.o.p.setAttribute('d', q.o.toD); });
        svg.classList.add('c-done');
      };
      frame = requestAnimationFrame(step);
    }

    svg.classList.add('c-anim');
    reset();

    var figure = svg.closest('figure') || svg.parentNode;
    var replay = figure.querySelector('.ent-replay');
    if (replay) {
      replay.hidden = false;
      replay.addEventListener('click', play);
    }
    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          seen.disconnect();
          play();
        }
      });
    }, { threshold: 0.55 });
    seen.observe(svg);
  }

  Array.prototype.forEach.call(svgs, setup);
})();
