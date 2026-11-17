// The animated charts on Solutions (founder, 2026-11-16 and 2026-11-17).
//
// Each chart plays once, when it scrolls into view. First a lit point travels
// along every line and the line draws behind it; the parts that matter arrive
// as the point reaches them, and the journey pauses at the key moments (an
// svg's data-stops: "x:ms to get there:ms to hold", in order). Then, if the
// svg has data-snaps, the lines snap from one shape to the next, one step at
// a time ("ms to snap:ms to hold", in order), and each step brings in and
// takes out its own parts.
//
// Without this script, or with Reduce Motion on, the charts stay still and
// show their finished picture: nothing is hidden until this script has taken
// a chart over.
//
//   path.c-draw        a line to draw; its x must only increase
//   [data-shapes]      on a .c-draw path: its earlier shapes, "a|b|...", each
//                      with the same commands as its final d; the line draws
//                      along the first, and snap k moves it to the next
//   [data-x="n"]       shown once the point passes x = n
//   [data-snap="k"]    shown when snap k (from 1) begins
//   [data-fade="k"]    taken away when snap k begins
//   rect.c-clip        the clip that reveals an area up to the point
//   .ent-replay        the figure's button that plays it again
(function () {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';
  var NUM = /-?\d*\.?\d+/g;
  var svgs = document.querySelectorAll('svg[data-stops]');
  if (!svgs.length) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window) || !window.requestAnimationFrame) return;

  function ease(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  // A snap: quick, with a little overshoot, then settles.
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

  function list(svg, sel) {
    return Array.prototype.slice.call(svg.querySelectorAll(sel));
  }

  function setup(svg) {
    var lines = list(svg, '.c-draw').map(function (p) {
      var shapes = (p.getAttribute('data-shapes') || '').split('|').filter(Boolean);
      shapes.push(p.getAttribute('d'));
      p.setAttribute('d', shapes[0]);
      var L = p.getTotalLength();
      var xs = [];
      var ls = [];
      for (var i = 0; i <= 240; i++) {
        var l = (L * i) / 240;
        xs.push(p.getPointAtLength(l).x);
        ls.push(l);
      }
      var sea = p.classList.contains('c-line--sea') ? ' c-head--sea' : '';
      var glow = circle(13, 'c-head-glow' + sea);
      var head = circle(5.5, 'c-head' + sea);
      svg.appendChild(glow);
      svg.appendChild(head);
      return { p: p, L: L, xs: xs, ls: ls, head: head, glow: glow, shapes: shapes };
    });
    if (!lines.length) return;

    var reveals = list(svg, '[data-x]');
    var snapIn = list(svg, '[data-snap]');
    var snapOut = list(svg, '[data-fade]');
    var clip = svg.querySelector('.c-clip');
    var x0 = Math.min.apply(null, lines.map(function (o) { return o.xs[0]; }));
    var stops = svg.getAttribute('data-stops').split(',').map(function (s) {
      var v = s.split(':').map(Number);
      return { x: v[0], move: v[1], hold: v[2] || 0 };
    });
    var snaps = (svg.getAttribute('data-snaps') || '').split(',').filter(Boolean).map(function (s) {
      var v = s.split(':').map(Number);
      return { move: v[0], hold: v[1] || 0 };
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

    // Moves every line from shape k to shape k + 1 by t (0 to 1).
    function shape(k, t) {
      lines.forEach(function (o) {
        if (o.shapes.length <= k + 1) return;
        var a = o.shapes[k].match(NUM).map(Number);
        var b = o.shapes[k + 1].match(NUM).map(Number);
        var i = 0;
        o.p.setAttribute('d', o.shapes[k].replace(NUM, function () {
          var v = a[i] + (b[i] - a[i]) * t;
          i++;
          return String(Math.round(v * 10) / 10);
        }));
      });
    }

    function stepIn(k) {
      snapIn.forEach(function (el) { if (Number(el.getAttribute('data-snap')) === k) el.classList.add('on'); });
      snapOut.forEach(function (el) { if (Number(el.getAttribute('data-fade')) === k) el.classList.add('gone'); });
    }

    var frame = 0;
    function reset() {
      cancelAnimationFrame(frame);
      svg.classList.remove('c-run', 'c-done');
      reveals.concat(snapIn).forEach(function (el) { el.classList.remove('on'); });
      snapOut.forEach(function (el) { el.classList.remove('gone'); });
      lines.forEach(function (o) {
        o.p.setAttribute('d', o.shapes[0]);
        o.p.setAttribute('stroke-dasharray', o.L + ' ' + o.L);
      });
      draw(x0 - 1);
    }

    function finish() {
      lines.forEach(function (o) {
        o.p.setAttribute('d', o.shapes[o.shapes.length - 1]);
        o.p.removeAttribute('stroke-dasharray');
        o.p.removeAttribute('stroke-dashoffset');
      });
      svg.classList.add('c-done');
    }

    function runSnaps() {
      if (!snaps.length) {
        finish();
        return;
      }
      var start = performance.now();
      var begun = 0;
      var step = function (now) {
        var t = now - start;
        for (var k = 0; k < snaps.length; k++) {
          var s = snaps[k];
          if (begun <= k) {
            begun = k + 1;
            stepIn(k + 1);
          }
          if (t < s.move) {
            shape(k, easeBack(t / s.move));
            frame = requestAnimationFrame(step);
            return;
          }
          shape(k, 1);
          t -= s.move;
          if (t < s.hold) {
            frame = requestAnimationFrame(step);
            return;
          }
          t -= s.hold;
        }
        finish();
      };
      frame = requestAnimationFrame(step);
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
          runSnaps();
        };
        frame = requestAnimationFrame(tick);
      });
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
