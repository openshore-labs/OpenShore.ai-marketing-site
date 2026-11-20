// The headline's picture (founder, 2026-11-20). Under "The operating
// platform for growing startups:" the rest of the sentence is uncovered row
// by row, each by a wave washing across it, as the film's tides do. Then,
// one after another, team, AI and apps leave their rows (the rest of each
// row fades away) and fly onto a ring, where each bends into a badge of
// lettering round a circle: TEAM, AI, APPS. The ring turns once, the
// OpenShore mark rises to the surface in the middle, slowly, like a piece of
// wood in still water, and from then on the ring keeps turning round it. On
// a phone the picture fills the rest of the first screen.
//
// It starts when it comes into view, and rests while it is off screen or
// the tab is hidden. With Reduce Motion it shows the mark inside the ring,
// still; without this script the three rows simply stand under the
// headline. Every position is set here, on transforms and opacity only.
(function () {
  'use strict';
  var stage = document.querySelector('[data-orb]');
  if (!stage || !window.requestAnimationFrame || !document.createElementNS) return;
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS = 'http://www.w3.org/2000/svg';
  var MARK = '<svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="7.5" fill="#1c2a33" /><g transform="translate(0 -0.81)"><line x1="7" y1="13" x2="25" y2="13" stroke="#f6f4ef" stroke-width="2" stroke-linecap="round" /><path d="M7 19q4.5-3.3 9 0t9 0" fill="none" stroke="#4b90a3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></g></svg>';

  // The ring's lettering, one character per even step round the circle.
  // Each word's slots, and the word each row sends there.
  var RING = 'TEAM • AI • APPS • ';
  var WORD_SLOTS = [[0, 3], [7, 8], [12, 15]];
  var STEP = 360 / RING.length;
  var FIRST = -(WORD_SLOTS[0][0] + WORD_SLOTS[0][1]) / 2 * STEP; // TEAM sits at the top
  function slotAngle(i) { return FIRST + i * STEP; }               // degrees, clockwise from the top

  // The clock, in seconds from when the picture starts.
  var ROW_AT = [0.3, 1.7, 3.1]; // a wave starts across each row
  var REVEAL = 1.7;             // a wave's crossing
  var LIFT = 6.6;               // the first word lifts off (the sentence has been read)
  var LIFT_GAP = 0.7;           // between words lifting off
  var TRAVEL = 2.0;             // a word's flight onto the ring
  var BEND = 0.6;               // the word bending into the ring's lettering
  var JOINED = LIFT + 2 * LIFT_GAP + TRAVEL + BEND;
  var TURN_AT = JOINED + 0.3;   // the ring turns once
  var TURN = 7;
  var MARK_AT = TURN_AT + TURN + 0.2;
  var RISE = 2.2;               // the mark's rise from under the water to its peak
  var RIPPLE = 2.8;
  var END = MARK_AT + RISE + 4; // the picture's last still frame (for Reduce Motion)
  var SPIN_AT = MARK_AT + RISE + 1.0; // from here the ring keeps turning
  var SPIN_RAMP = 3;
  var SPIN_PACE = 360 / 24;     // degrees a second: one turn in 24 seconds

  function el(tag, cls) { var e = document.createElement(tag); e.className = cls; return e; }
  function svg(tag, cls) { var e = document.createElementNS(NS, tag); if (cls) e.setAttribute('class', cls); return e; }
  function clamp(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function inOutCubic(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function inOutSine(t) { return -(Math.cos(Math.PI * t) - 1) / 2; }
  function outCubic(t) { return 1 - Math.pow(1 - t, 3); }
  function nearest(deg) { deg = deg % 360; if (deg > 180) deg -= 360; if (deg <= -180) deg += 360; return deg; }

  var rows = Array.prototype.slice.call(stage.querySelectorAll('.orb-row'));
  rows.forEach(function (row) { row.appendChild(el('span', 'orb-foam')); });
  var parts = rows.map(function (row) {
    return { row: row, word: row.querySelector('.orb-w'), foam: row.querySelector('.orb-foam'), extra: Array.prototype.slice.call(row.querySelectorAll('.orb-x')) };
  });

  // The water layer: ripples and the ring; above it the mark, crisp above
  // the surface, hazy under it, and its reflection.
  var water = svg('svg', 'orb-water');
  var ripples = [svg('circle', 'orb-ripple'), svg('circle', 'orb-ripple'), svg('circle', 'orb-ripple')];
  ripples.forEach(function (c) { water.appendChild(c); });
  var ring = svg('g', 'orb-badge');
  var ringWords = [svg('g'), svg('g'), svg('g'), svg('g', 'orb-sep')]; // TEAM, AI, APPS, the dots
  ringWords.forEach(function (g) { ring.appendChild(g); });
  water.appendChild(ring);
  var up = el('div', 'orb-up'), down = el('div', 'orb-down'), refl = el('div', 'orb-refl');
  up.innerHTML = MARK; down.innerHTML = MARK; refl.innerHTML = MARK;
  var upMark = up.firstChild, downMark = down.firstChild, reflMark = refl.firstChild;
  stage.insertBefore(water, stage.firstChild);
  stage.appendChild(refl); stage.appendChild(down); stage.appendChild(up);
  stage.classList.add('orb-live');

  // Geometry, from the stage's size. On a phone the stage runs to the foot of
  // the first screen, and the ring keeps clear of the floating button.
  // `room` is the height the ring may use: on a phone, what shows of the
  // stage on the first screen above the floating button.
  var G = null, lastW = 0, room = 0;
  function sizeStage() {
    if (window.innerWidth < 720) {
      var top = stage.getBoundingClientRect().top + window.pageYOffset;
      var shows = window.innerHeight - top;
      stage.style.height = Math.round(Math.min(560, Math.max(200, shows + 12))) + 'px';
      room = Math.max(130, Math.min(shows, stage.clientHeight) - 80);
    } else {
      stage.style.height = '';
      room = stage.clientHeight - 10;
    }
  }
  function measure() {
    var W = stage.clientWidth, H = stage.clientHeight;
    var phone = W < 560;
    var usable = room || H - 10;
    var R = Math.max(50, Math.min(phone ? 130 : 120, W / 2 - 30, (usable - 8) / 2.25));
    var font = Math.round(Math.min(24, 0.72 * 2 * Math.PI * R / RING.length));
    var s = Math.round(Math.min(phone ? 44 : 58, R * 0.6));
    var cy = Math.max(R + font, usable / 2 + 2);
    G = { W: W, H: H, cx: W / 2, cy: cy, R: R, s: s, font: font };
    water.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    ripples.forEach(function (c) { c.setAttribute('cx', G.cx); c.setAttribute('cy', cy); });
    // The lettering: each character at its step round the circle, its top
    // facing out, reading clockwise.
    ringWords.forEach(function (g) { while (g.firstChild) g.removeChild(g.firstChild); });
    ring.style.fontSize = font + 'px';
    for (var i = 0; i < RING.length; i++) {
      var ch = RING[i];
      if (ch === ' ') continue;
      var a = slotAngle(i), rad = a * Math.PI / 180;
      var x = G.cx + R * Math.sin(rad), y = cy - R * Math.cos(rad);
      var t = svg('text');
      t.setAttribute('x', x.toFixed(2)); t.setAttribute('y', y.toFixed(2));
      t.setAttribute('transform', 'rotate(' + a.toFixed(2) + ' ' + x.toFixed(2) + ' ' + y.toFixed(2) + ')');
      t.textContent = ch;
      var w = 3;
      for (var k = 0; k < 3; k++) if (i >= WORD_SLOTS[k][0] && i <= WORD_SLOTS[k][1]) w = k;
      ringWords[w].appendChild(t);
    }
    // Where each word lands: the middle of its slots on the ring.
    parts.forEach(function (p, k) {
      p.w = p.word.offsetWidth; p.h = p.word.offsetHeight;
      p.ox = p.word.offsetLeft + p.w / 2; p.oy = p.word.offsetTop + p.h / 2;   // in the row
      p.nx = p.row.offsetLeft + p.ox; p.ny = p.row.offsetTop + p.oy;           // in the stage
      p.row.style.transformOrigin = p.ox + 'px ' + p.oy + 'px';
      p.rw = p.row.offsetWidth; p.rh = p.row.offsetHeight;
      var a = slotAngle((WORD_SLOTS[k][0] + WORD_SLOTS[k][1]) / 2), rad = a * Math.PI / 180;
      p.tx = G.cx + R * Math.sin(rad); p.ty = cy - R * Math.cos(rad);
      p.ta = nearest(a);
      p.ts = Math.min(1.1, font * 1.25 / parseFloat(getComputedStyle(stage).fontSize));
    });
    // The mark, centred in the ring: its foot is the water's surface.
    var foot = cy + s / 2;
    G.foot = foot;
    up.style.cssText = 'left:' + (G.cx - s / 2) + 'px;top:' + (foot - s - 14) + 'px;width:' + s + 'px;height:' + (s + 14) + 'px';
    upMark.style.top = '14px';
    down.style.cssText = 'left:' + (G.cx - s / 2 - 6) + 'px;top:' + foot + 'px;width:' + (s + 12) + 'px;height:' + (s * 1.6) + 'px';
    downMark.style.left = '6px'; downMark.style.width = s + 'px'; downMark.style.top = -s + 'px';
    refl.style.cssText = 'left:' + (G.cx - s / 2) + 'px;top:' + (foot + 1) + 'px;width:' + s + 'px;height:' + Math.round(s * 0.45) + 'px';
    reflMark.style.top = '0px';
  }

  // The ring's turn: once, then, after the mark surfaces, for good.
  function ringAngle(t) {
    var a = 360 * inOutSine(clamp((t - TURN_AT) / TURN));
    var u = t - SPIN_AT;
    if (u > 0 && !still) a += u < SPIN_RAMP ? SPIN_PACE * u * u / (2 * SPIN_RAMP) : SPIN_PACE * (u - SPIN_RAMP / 2);
    return a;
  }
  // The mark's depth under the surface (px; below 0 it rides above it).
  function depth(t) {
    var u = t - MARK_AT, d0 = G.s * 1.4;
    if (u <= 0) return d0;
    if (u < RISE) return d0 + (-5 - d0) * inOutCubic(u / RISE);
    var v = u - RISE;
    return -5 * Math.exp(-v / 0.6) * Math.cos(2 * Math.PI * v / 1.0);
  }
  var SURFACE = (function () { // when the mark breaks the surface: inOutCubic(k) = d0 / (d0 + 5)
    var lo = 0, hi = 1, want = 1.4 * 44 / (1.4 * 44 + 5);
    for (var i = 0; i < 30; i++) { var m = (lo + hi) / 2; if (inOutCubic(m) < want) lo = m; else hi = m; }
    return MARK_AT + lo * RISE;
  })();

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
      // The row is washed in.
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
      // Its word flies to the ring, turning and shrinking to match the
      // lettering there, then hands over to it.
      var lift = LIFT + i * LIFT_GAP;
      var k = clamp((t - lift) / TRAVEL), e = inOutCubic(k);
      var x = (p.tx - p.nx) * e, y = (p.ty - p.ny) * e - Math.sin(Math.PI * k) * 22;
      if (k === 0) y += (1 - outCubic(rk)) * 6; // each row settles a little as its wave passes
      var sc = 1 + (p.ts - 1) * e;
      p.row.style.transform = 'translate(' + x.toFixed(2) + 'px,' + y.toFixed(2) + 'px)' +
        (k > 0 ? ' rotate(' + (p.ta * e).toFixed(2) + 'deg) scale(' + sc.toFixed(3) + ')' : '');
      var hand = clamp((t - lift - TRAVEL) / BEND);
      p.word.style.opacity = k > 0 ? (1 - hand).toFixed(3) : '';
      ringWords[i].style.opacity = hand.toFixed(3);
      var fade = (1 - clamp((t - lift) / 0.55)).toFixed(3);
      p.extra.forEach(function (x2) { x2.style.opacity = fade; });
    });
    ringWords[3].style.opacity = clamp((t - JOINED + 0.2) / 0.8).toFixed(3);
    ring.setAttribute('transform', 'rotate(' + ringAngle(t).toFixed(3) + ' ' + G.cx + ' ' + G.cy + ')');
    // The mark comes up through the surface; ripples run out round it.
    var d = depth(t), d0 = G.s * 1.4;
    upMark.style.transform = 'translateY(' + d.toFixed(2) + 'px)';
    downMark.style.transform = 'translateY(' + d.toFixed(2) + 'px)';
    down.style.opacity = (0.22 * clamp((d0 - d) / (0.55 * d0))).toFixed(3);
    refl.style.opacity = (0.11 * clamp((t - SURFACE - 0.6) / 1.4)).toFixed(3);
    reflMark.style.transform = 'translateY(' + (-d).toFixed(2) + 'px) scaleY(-1)';
    ripples.forEach(function (c, j) {
      var r = (t - SURFACE - j * 0.45) / RIPPLE;
      if (r <= 0 || r >= 1) { c.style.opacity = '0'; return; }
      c.setAttribute('r', (G.s * 0.5 + (G.R * 1.5 - G.s * 0.5) * outCubic(r)).toFixed(1));
      c.style.opacity = ((j ? 0.26 : 0.4) * (1 - r)).toFixed(3);
    });
  }

  sizeStage(); measure();
  lastW = window.innerWidth;
  var clock = 0;
  function relayout() { sizeStage(); measure(); render(clock); }
  window.addEventListener('resize', function () { if (window.innerWidth !== lastW) { lastW = window.innerWidth; relayout(); } });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);
  window.addEventListener('load', relayout);

  if (still) {
    clock = END;
    render(END);
    return;
  }
  render(0);
  // One clock runs it all. It stops while the picture is off screen (and
  // the browser stops it while the tab is hidden), and picks up where it was.
  var last = null, started = false, onScreen = true, frame = 0;
  function tick(now) {
    frame = 0;
    if (last !== null) clock += Math.min(0.05, (now - last) / 1000);
    last = now;
    render(clock);
    if (onScreen) frame = requestAnimationFrame(tick);
  }
  function go() {
    if (started && onScreen && !frame) { last = null; frame = requestAnimationFrame(tick); }
  }
  if ('IntersectionObserver' in window) {
    onScreen = false;
    new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!started && e.intersectionRatio >= 0.35) started = true;
        onScreen = e.isIntersecting;
        if (!onScreen && frame) { cancelAnimationFrame(frame); frame = 0; }
        go();
      });
    }, { threshold: [0, 0.35] }).observe(stage);
  } else {
    started = true;
    go();
  }
})();
