// The headline's picture (founder, 2026-11-20). Under "The operating
// platform for growing startups:" the rest of the sentence is uncovered row
// by row, each by a wave washing across it, as the film's tides do. Then,
// one after another, team, AI and apps leave their rows (the rest of each
// row fades away) and fly onto a ring, where each bends into a badge of
// lettering round a circle: TEAM, AI, APPS. The ring turns once, then the
// OpenShore mark comes up in the middle. The screen is the water's surface,
// seen from above, and the mark is a piece of slate floating up to it: it
// arrives hazy from underneath, breaks the surface one corner at a time, and
// each corner leaves small ripples. From then on it rides just above the
// water, rocking slowly, a corner touching down now and then, while the ring
// keeps turning round it. On a phone the picture fills the rest of the
// first screen.
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
  var RISE = 3.4;               // the slate's rise from under the water to its float
  var RIPPLE = 2.4;             // a ripple's life
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

  // The water layer: ripples and the ring. Over it the slate, seen from
  // above: a hazy copy for when it is under the surface, a crisp one for
  // when it is out, and its shadow on the water.
  var water = svg('svg', 'orb-water');
  var pool = [];
  for (var n = 0; n < 14; n++) { var c0 = svg('circle', 'orb-ripple'); water.appendChild(c0); pool.push({ c: c0, at: -99, x: 0, y: 0, k: 0, big: 1 }); }
  var ring = svg('g', 'orb-badge');
  var ringWords = [svg('g'), svg('g'), svg('g'), svg('g', 'orb-sep')]; // TEAM, AI, APPS, the dots
  ringWords.forEach(function (g) { ring.appendChild(g); });
  water.appendChild(ring);
  var slate = el('div', 'orb-slate'), shade = el('div', 'orb-shade'), deep = el('div', 'orb-deep'), top = el('div', 'orb-top');
  deep.innerHTML = MARK; top.innerHTML = MARK;
  slate.appendChild(shade); slate.appendChild(deep); slate.appendChild(top);
  stage.insertBefore(water, stage.firstChild);
  stage.appendChild(slate);
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
    var s = Math.round(Math.min(phone ? 88 : 116, R * 1.2)); // the mark fills the ring's middle (founder, 2026-11-20)
    var cy = Math.max(R + font, usable / 2 + 2);
    G = { W: W, H: H, cx: W / 2, cy: cy, R: R, s: s, font: font };
    water.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
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
    // The slate, centred in the ring.
    slate.style.left = (G.cx - s / 2) + 'px'; slate.style.top = (cy - s / 2) + 'px';
    slate.style.width = s + 'px'; slate.style.height = s + 'px';
  }

  // The ring's turn: once, then, after the mark surfaces, for good.
  function ringAngle(t) {
    var a = 360 * inOutSine(clamp((t - TURN_AT) / TURN));
    var u = t - SPIN_AT;
    if (u > 0 && !still) a += u < SPIN_RAMP ? SPIN_PACE * u * u / (2 * SPIN_RAMP) : SPIN_PACE * (u - SPIN_RAMP / 2);
    return a;
  }
  // The slate. Heights are in slate units: 0 is the water's surface, below
  // it is under water, and it floats at about 0.5. On the way up it wobbles
  // round, the way a flat stone does in water, which brings its corners out
  // one after another. Once it floats, its tilt is two slow, unrelated
  // swings per axis, so it never repeats itself.
  var FLOAT = 0.5;
  function smooth(x) { x = clamp(x); return x * x * (3 - 2 * x); }
  function slateAt(t) {
    var u = t - MARK_AT, k = u / RISE;
    var z = u <= 0 ? -1.7 : -1.7 + (FLOAT + 1.7) * inOutSine(clamp(k));
    if (u > RISE) z += 0.07 * Math.sin(2 * Math.PI * (u - RISE) / 4.7);
    var wob = 0.5 * (1 - smooth((k - 0.8) / 0.45)), phi = 2 * Math.PI * u / 2.9 - 2.6;
    var calm = smooth((k - 0.65) / 0.5);
    var ax = wob * Math.cos(phi) + calm * (0.26 * Math.sin(2 * Math.PI * u / 5.3 + 0.4) + 0.17 * Math.sin(2 * Math.PI * u / 3.1 + 1.7));
    var ay = wob * Math.sin(phi) + calm * (0.26 * Math.sin(2 * Math.PI * u / 6.7 + 2.1) + 0.17 * Math.sin(2 * Math.PI * u / 3.9 + 0.3));
    if (still) { ax = 0; ay = 0; }
    return { z: z, ax: ax, ay: ay, spin: still ? 0 : 1.6 * Math.sin(2 * Math.PI * u / 9.1), k: clamp(k) };
  }
  var CORNERS = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  var cornerH = null, cornerT = [-9, -9, -9, -9], seenT = -1, nextRipple = 0;
  function ripple(x, y, at, big) {
    var r = pool[nextRipple]; nextRipple = (nextRipple + 1) % pool.length;
    r.at = at; r.x = x; r.y = y; r.big = big;
    r.c.setAttribute('cx', x.toFixed(1)); r.c.setAttribute('cy', y.toFixed(1));
  }

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
    // The slate, from above.
    var S = slateAt(t), s = G.s;
    var near = clamp((S.z + 1.7) / 1.1);                 // it comes into sight from the deep
    var out = clamp((S.z + 0.3) / 0.6);                  // 0 under the surface, 1 clear of it
    var size = 0.86 + 0.14 * clamp((S.z + 1.7) / (FLOAT + 1.7)) + 0.012 * (S.z - FLOAT) * out;
    slate.style.transform = 'perspective(520px) rotateX(' + (S.ay * 13).toFixed(2) + 'deg) rotateY(' + (-S.ax * 13).toFixed(2) + 'deg) rotate(' + S.spin.toFixed(2) + 'deg) scale(' + size.toFixed(4) + ')';
    deep.style.opacity = (0.34 * near * (1 - out)).toFixed(3);
    top.style.opacity = out.toFixed(3);
    // The side still in the water stays hazy.
    var low = S.z - Math.abs(S.ax) - Math.abs(S.ay);
    if (out > 0 && low < 0.02) {
      var deg = Math.atan2(S.ax, -S.ay) * 180 / Math.PI;
      var m = 'linear-gradient(' + deg.toFixed(1) + 'deg, rgba(0,0,0,' + Math.max(0.12, 1 + low * 1.5).toFixed(2) + '), #000 58%)';
      top.style.webkitMaskImage = m; top.style.maskImage = m;
    } else if (top.style.maskImage) {
      top.style.webkitMaskImage = ''; top.style.maskImage = '';
    }
    var lift = clamp(S.z / FLOAT);
    shade.style.opacity = (0.2 * lift).toFixed(3);
    shade.style.transform = 'translate(' + (2 + 3 * lift - S.ax * 4).toFixed(2) + 'px,' + (3 + 4 * lift - S.ay * 4).toFixed(2) + 'px)';
    // A corner that comes up through the surface, or touches back down on
    // it, leaves a ripple there (two rings, the second smaller).
    var hs = CORNERS.map(function (c) { return S.z + S.ax * c[0] + S.ay * c[1]; });
    if (cornerH && t > seenT && t - seenT < 0.2 && t > MARK_AT) {
      var rot = S.spin * Math.PI / 180, cs = Math.cos(rot), sn = Math.sin(rot), half = s * size * 0.44;
      CORNERS.forEach(function (c, i) {
        var up = cornerH[i] < 0 && hs[i] >= 0, down = cornerH[i] >= 0 && hs[i] < 0;
        if (up && t > MARK_AT + RISE + 0.5) up = false; // afloat, only a touch-down leaves a ripple
        if ((up || down) && t - cornerT[i] > 0.9) {
          cornerT[i] = t;
          var x = G.cx + (c[0] * cs - c[1] * sn) * half, y = G.cy + (c[0] * sn + c[1] * cs) * half;
          var big = up && S.k < 1 ? 1 : 0.7;
          ripple(x, y, t, big); ripple(x, y, t + 0.38, big * 0.62);
        }
      });
    }
    cornerH = hs; seenT = t;
    pool.forEach(function (r) {
      var k = (t - r.at) / RIPPLE;
      if (k <= 0 || k >= 1) { if (r.k) { r.c.style.opacity = '0'; r.k = 0; } return; }
      r.k = k;
      r.c.setAttribute('r', (2 + s * 0.62 * r.big * outCubic(k)).toFixed(1));
      r.c.style.opacity = (0.42 * r.big * (1 - k) * (1 - k)).toFixed(3);
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
