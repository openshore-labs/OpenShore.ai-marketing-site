// The headline's picture (founder, 2026-11-20). Under "The operating
// platform for growing startups:" the rest of the sentence is uncovered row
// by row, each by a wave washing across it, as the film's tides do.
// Then, one after another, team, AI and apps leave their rows (the rest of
// each row fades away), travel onto a ring of still water and circle it once
// together. Last, the OpenShore mark rises to the surface in the
// middle, slowly, like a piece of wood in still water, and its ripples pass
// under the words. On a phone the picture fills the rest of the first screen.
//
// It plays once, when it comes into view. With Reduce Motion it shows its
// last frame; without this script the three rows simply stand under the
// headline. Every position is set here, on transforms and opacity only.
(function () {
  'use strict';
  var stage = document.querySelector('[data-orb]');
  if (!stage || !window.requestAnimationFrame || !document.createElementNS) return;
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS = 'http://www.w3.org/2000/svg';
  var MARK = '<svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="7.5" fill="#1c2a33" /><g transform="translate(0 -0.81)"><line x1="7" y1="13" x2="25" y2="13" stroke="#f6f4ef" stroke-width="2" stroke-linecap="round" /><path d="M7 19q4.5-3.3 9 0t9 0" fill="none" stroke="#4b90a3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></g></svg>';

  // The clock, in seconds from when the picture starts.
  var ROW_AT = [0.3, 1.7, 3.1]; // a wave starts across each row
  var REVEAL = 1.7;             // a wave's crossing
  var LIFT = 6.6;               // the first row lifts off (the sentence has been read)
  var LIFT_GAP = 0.6;           // between rows lifting off
  var TRAVEL = 1.9;             // a row's journey onto the ring
  var SPIN = 9;                 // the ring's turn, from the first lift-off to rest
  var TURNS = 1.3;              // turns in that time: a full one after the last row joins
  var MARK_AT = LIFT + SPIN + 0.4;
  var RISE = 2.2;               // the mark's rise from deep water to its peak
  var RIPPLE = 2.8;
  var END = MARK_AT + RISE + 3.2;
  var REST = [210, 330, 90].map(function (d) { return d * Math.PI / 180; }); // back left, back right, front

  function el(tag, cls) { var e = document.createElement(tag); e.className = cls; return e; }
  function clamp(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function inOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function inOutSine(t) { return -(Math.cos(Math.PI * t) - 1) / 2; }
  function outCubic(t) { return 1 - Math.pow(1 - t, 3); }

  var rows = Array.prototype.slice.call(stage.querySelectorAll('.orb-row'));
  rows.forEach(function (row) { row.appendChild(el('span', 'orb-foam')); });

  // The water: the ring, the ripples, and the mark above, under and
  // reflected in the surface.
  var water = document.createElementNS(NS, 'svg');
  water.setAttribute('class', 'orb-water');
  function ellipse(cls) { var e = document.createElementNS(NS, 'ellipse'); e.setAttribute('class', cls); e.setAttribute('vector-effect', 'non-scaling-stroke'); water.appendChild(e); return e; }
  var ring = ellipse('orb-ring');
  var ripples = [ellipse('orb-ripple'), ellipse('orb-ripple'), ellipse('orb-ripple')];
  var up = el('div', 'orb-up'), down = el('div', 'orb-down'), refl = el('div', 'orb-refl');
  up.innerHTML = MARK; down.innerHTML = MARK; refl.innerHTML = MARK;
  var upMark = up.firstChild, downMark = down.firstChild, reflMark = refl.firstChild;
  stage.insertBefore(water, stage.firstChild);
  stage.appendChild(refl); stage.appendChild(down); stage.appendChild(up);
  stage.classList.add('orb-live');

  var parts = rows.map(function (row) {
    return { row: row, word: row.querySelector('.orb-w'), foam: row.querySelector('.orb-foam'), extra: Array.prototype.slice.call(row.querySelectorAll('.orb-x')) };
  });

  // Geometry, from the stage's size. On a phone the stage runs to the foot of
  // the first screen, keeping clear of the floating button.
  var G = null, lastW = 0;
  function sizeStage() {
    var phone = window.innerWidth < 720;
    if (phone) {
      var top = stage.getBoundingClientRect().top + window.pageYOffset;
      stage.style.height = Math.round(Math.min(460, Math.max(240, window.innerHeight - top))) + 'px';
    } else {
      stage.style.height = '';
    }
  }
  function measure() {
    var W = stage.clientWidth, H = stage.clientHeight;
    var phone = W < 560;
    var usable = H - (phone ? 86 : 10);
    var wide = 0;
    parts.forEach(function (p) {
      p.w = p.word.offsetWidth; p.h = p.word.offsetHeight;
      p.ox = p.word.offsetLeft + p.w / 2; p.oy = p.word.offsetTop + p.h / 2;   // in the row
      p.nx = p.row.offsetLeft + p.ox; p.ny = p.row.offsetTop + p.oy;           // in the stage
      p.row.style.transformOrigin = p.ox + 'px ' + p.oy + 'px';
      p.rw = p.row.offsetWidth; p.rh = p.row.offsetHeight;
      wide = Math.max(wide, p.w);
    });
    var s = phone ? 44 : 58;
    var Rx = Math.max(60, Math.min(phone ? 999 : 270, W / 2 - wide / 2 - 8));
    var above = s + 12, below = 22;
    var Ry = Math.max(22, Math.min(Rx * 0.3, usable - above - below - 8));
    var cy = above + Math.max(0, (usable - above - (Ry + below)) / 2);
    G = { W: W, H: H, cx: W / 2, cy: cy, Rx: Rx, Ry: Ry, s: s };
    water.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    ring.setAttribute('cx', G.cx); ring.setAttribute('cy', cy); ring.setAttribute('rx', Rx); ring.setAttribute('ry', Ry);
    ripples.forEach(function (e) { e.setAttribute('cx', G.cx); e.setAttribute('cy', cy); });
    // The mark: above the surface (crisp), under it (hazy), and its reflection.
    up.style.cssText = 'left:' + (G.cx - s / 2) + 'px;top:' + (cy - s - 14) + 'px;width:' + s + 'px;height:' + (s + 14) + 'px';
    upMark.style.top = '14px';
    down.style.cssText = 'left:' + (G.cx - s / 2 - 6) + 'px;top:' + cy + 'px;width:' + (s + 12) + 'px;height:' + (s * 2.2) + 'px';
    downMark.style.left = '6px'; downMark.style.width = s + 'px'; downMark.style.top = -s + 'px';
    refl.style.cssText = 'left:' + (G.cx - s / 2) + 'px;top:' + (cy + 1) + 'px;width:' + s + 'px;height:' + Math.round(s * 0.45) + 'px';
    reflMark.style.top = '0px';
  }

  // The ring turns from the first lift-off and comes to rest a little over
  // a full turn after the last row has joined it.
  function angle(i, t) {
    var p = inOutSine(clamp((t - LIFT) / SPIN));
    return REST[i] - TURNS * 2 * Math.PI * (1 - p);
  }
  // The mark's depth under the surface (px; below 0 it rides above it).
  function depth(t) {
    var u = t - MARK_AT, d0 = G.s * 1.9;
    if (u <= 0) return d0;
    if (u < RISE) return d0 + (-5 - d0) * inOutCubic(u / RISE);
    var v = u - RISE;
    return -5 * Math.exp(-v / 0.6) * Math.cos(2 * Math.PI * v / 1.0);
  }
  var SURFACE = (function () { // when the mark breaks the surface: solve inOutCubic(k) = d0 / (d0 + 5)
    var lo = 0, hi = 1, want = 1.9 * 44 / (1.9 * 44 + 5);
    for (var i = 0; i < 30; i++) { var m = (lo + hi) / 2; if (inOutCubic(m) < want) lo = m; else hi = m; }
    return MARK_AT + lo * RISE;
  })();
  function rippleScale(j, t) { var k = (t - SURFACE - j * 0.45) / RIPPLE; return k <= 0 || k >= 1 ? null : { k: k, s: 0.2 + 1.4 * outCubic(k) }; }

  // A wave across a row: everything behind its front shows, and the front
  // is a soft, moving swell rather than a straight edge.
  function wave(p, e, t) {
    var amp = p.rh * 0.22, front = -amp * 3 + (p.rw + amp * 6) * e, pts = ['-24px -10px'];
    for (var j = 0; j <= 10; j++) {
      var yy = -10 + (p.rh + 20) * j / 10;
      pts.push((front + amp * Math.sin(j / 10 * Math.PI * 2.4 - t * 4.2)).toFixed(1) + 'px ' + yy.toFixed(1) + 'px');
    }
    pts.push('-24px ' + (p.rh + 10) + 'px');
    return { clip: 'polygon(' + pts.join(',') + ')', front: front };
  }

  function render(t) {
    if (!G) return;
    parts.forEach(function (p, i) {
      var rk = clamp((t - ROW_AT[i]) / REVEAL);
      if (rk < 1) {
        var wv = wave(p, inOutSine(rk), t);
        p.row.style.clipPath = wv.clip; p.row.style.webkitClipPath = wv.clip;
        p.foam.style.transform = 'translateX(' + (wv.front - 34).toFixed(1) + 'px)';
        p.foam.style.opacity = (Math.sin(Math.PI * rk) * 0.9).toFixed(3);
      } else if (p.row.style.clipPath !== 'none') {
        p.row.style.clipPath = 'none'; p.row.style.webkitClipPath = 'none';
        p.foam.style.opacity = '0';
      }
      var th = angle(i, t), sn = Math.sin(th);
      var front = (1 + sn) / 2;
      var sx = G.cx + G.Rx * Math.cos(th), sy = G.cy + G.Ry * sn;
      var k = clamp((t - LIFT - i * LIFT_GAP) / TRAVEL), e = inOutCubic(k);
      var x = (sx - p.nx) * e, y = (sy - p.ny) * e - Math.sin(Math.PI * k) * 18;
      // The ripples lift each word a little as they pass under it.
      for (var j = 0; j < 3; j++) {
        var b = t - (SURFACE + j * 0.45 + 0.62);
        if (b > 0 && b < 0.8) y -= (j ? 1.2 : 2.4) * Math.sin(Math.PI * b / 0.8);
      }
      var sc = 1 + (0.86 + 0.14 * front - 1) * e;
      if (k === 0) y += (1 - outCubic(rk)) * 6; // each row settles a little as its wave passes
      p.row.style.transform = 'translate(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px)' + (k > 0 ? ' scale(' + sc.toFixed(3) + ')' : '');
      p.row.style.zIndex = k > 0.5 ? String(10 + Math.round(sn * 8)) : '30';
      p.word.style.opacity = k > 0 ? (1 + (0.82 + 0.18 * front - 1) * e).toFixed(3) : '';
      var fade = (1 - clamp((t - LIFT - i * LIFT_GAP) / 0.55)).toFixed(3);
      p.extra.forEach(function (x2) { x2.style.opacity = fade; });
    });
    ring.style.opacity = (clamp((t - LIFT - 0.8) / 1.6) * (1 - 0.45 * clamp((t - SURFACE) / 1.5))).toFixed(3);
    var d = depth(t), d0 = G.s * 1.9;
    upMark.style.transform = 'translateY(' + d.toFixed(2) + 'px)';
    downMark.style.transform = 'translateY(' + d.toFixed(2) + 'px)';
    down.style.opacity = (0.22 * clamp((d0 - d) / (0.55 * d0))).toFixed(3);
    refl.style.opacity = (0.11 * clamp((t - SURFACE - 0.6) / 1.4)).toFixed(3);
    reflMark.style.transform = 'translateY(' + (-d).toFixed(2) + 'px) scaleY(-1)';
    ripples.forEach(function (e, j) {
      var r = rippleScale(j, t);
      if (!r) { e.style.opacity = '0'; return; }
      e.setAttribute('rx', (G.Rx * r.s).toFixed(1)); e.setAttribute('ry', (G.Ry * r.s).toFixed(1));
      e.style.opacity = ((j ? 0.28 : 0.42) * (1 - r.k)).toFixed(3);
    });
  }

  sizeStage(); measure();
  lastW = window.innerWidth;
  function relayout() { sizeStage(); measure(); render(clock); }
  window.addEventListener('resize', function () { if (window.innerWidth !== lastW) { lastW = window.innerWidth; relayout(); } });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);
  window.addEventListener('load', relayout);

  var clock = 0;
  if (still) {
    clock = END;
    render(END);
    return;
  }
  render(0);
  var last = null, started = false;
  function tick(now) {
    if (last !== null) clock += Math.min(0.05, (now - last) / 1000);
    last = now;
    render(clock);
    if (clock < END) requestAnimationFrame(tick);
  }
  function start() {
    if (started) return;
    started = true;
    requestAnimationFrame(tick);
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { io.disconnect(); start(); } });
    }, { threshold: 0.35 });
    io.observe(stage);
  } else {
    start();
  }
})();
