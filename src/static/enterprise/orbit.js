// The headline's picture (founder, 2026-11-20). Under "The operating
// platform for growing startups:" the rest of the sentence is uncovered row
// by row, each by a wave washing across it, as the film's tides do. Then
// the small words fade, and team, AI and apps leave their rows one after
// another, letter by letter: each letter glides along a curve onto a slowly
// turning ring, turning to face outward and becoming a capital on the way,
// until they read TEAM, AI, APPS round a circle. The ring eases up to its
// resting pace and never turns faster than that (founder, 2026-11-20). Then
// the OpenShore mark comes up in the middle. The screen is the water's surface,
// seen from above, and the mark is a piece of slate floating up to it: it
// arrives hazy from underneath and breaks the surface one corner at a time.
// Each corner sends out real ripples: trains of rings, lit from one side,
// that widen, cross each other, pass under the letters and fade just past
// them. They are painted on the water, so the part of the slate that is out
// of the water covers them. Once the slate is afloat the water goes still,
// and it rides just above the surface, rocking slowly, while the ring keeps
// turning round it. On a phone the picture fills the rest of the first
// screen.
//
// It starts when it comes into view, and rests while it is off screen or
// the tab is hidden. With Reduce Motion it shows the mark inside the ring,
// still; without this script the three rows simply stand under the
// headline. Every position is set here, on transforms and opacity only.
(function () {
  'use strict';
  var stage = document.querySelector('[data-orb]');
  if (!stage || !window.requestAnimationFrame) return;
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var MARK = '<svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="7.5" fill="#1c2a33" /><g transform="translate(0 -0.81)"><line x1="7" y1="13" x2="25" y2="13" stroke="#f6f4ef" stroke-width="2" stroke-linecap="round" /><path d="M7 19q4.5-3.3 9 0t9 0" fill="none" stroke="#4b90a3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></g></svg>';

  // The ring's lettering, one character per even step round the circle.
  // Each word's slots, and the word each row sends there.
  var RING = 'TEAM • AI • APPS • ';
  var WORD_SLOTS = [[0, 3], [7, 8], [12, 15]];
  var STEP = 360 / RING.length;
  // Where the ring stands as it forms: TEAM to the upper right, AI at the
  // lower right, APPS up the left side. From the rows on the left, that lets
  // each word's letters fan out to their places without crossing.
  var PHASE = 50;
  var FIRST = PHASE - (WORD_SLOTS[0][0] + WORD_SLOTS[0][1]) / 2 * STEP;
  function slotAngle(i) { return FIRST + i * STEP; }               // degrees, clockwise from the top

  // The clock, in seconds from when the picture starts.
  var ROW_AT = [0.3, 1.7, 3.1]; // a wave starts across each row
  var REVEAL = 1.7;             // a wave's crossing
  var FADE_AT = 6.0;            // the small words fade (the sentence has been read)
  var LIFT = 6.7;               // the first letter leaves its row
  var WORD_GAP = 0.62;          // between words setting off
  var LETTER_GAP = 0.085;       // between letters of a word
  var TRAVEL = 1.9;             // a letter's glide onto the ring
  var JOINED = LIFT + 2 * WORD_GAP + 3 * LETTER_GAP + TRAVEL;
  var SPIN_AT = LIFT + 0.8;     // the ring starts to turn as the first letters near it
  var SPIN_RAMP = 5;            // easing up to its pace
  var SPIN_PACE = 360 / 24;     // degrees a second, at most: one turn in 24 seconds
  var MARK_AT = JOINED + 1.6;   // the mark starts up once the ring is whole
  var RISE = 3.4;               // the slate's rise from under the water to its float
  var RIPPLE = 3.1;             // a ripple's life
  var END = MARK_AT + RISE + 4; // the picture's last still frame (for Reduce Motion)

  function el(tag, cls) { var e = document.createElement(tag); e.className = cls; return e; }
  function clamp(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function inOutSine(t) { return -(Math.cos(Math.PI * t) - 1) / 2; }
  function outCubic(t) { return 1 - Math.pow(1 - t, 3); }
  function nearest(deg) { deg = deg % 360; if (deg > 180) deg -= 360; if (deg <= -180) deg += 360; return deg; }

  var rows = Array.prototype.slice.call(stage.querySelectorAll('.orb-row'));
  rows.forEach(function (row) { row.appendChild(el('span', 'orb-foam')); });
  var parts = rows.map(function (row) {
    return { row: row, word: row.querySelector('.orb-w'), foam: row.querySelector('.orb-foam'), extra: Array.prototype.slice.call(row.querySelectorAll('.orb-x')) };
  });

  // Each letter of team, AI and apps is its own piece, so it can leave the
  // row for its place on the ring: the letter as written in the sentence,
  // and over it the capital it becomes.
  var letters = [];
  parts.forEach(function (p, w) {
    var text = p.word.textContent;
    p.word.textContent = '';
    for (var i = 0; i < text.length; i++) {
      var f = el('span', 'orb-f'), lc = el('span', 'orb-lc'), uc = el('span', 'orb-uc');
      lc.textContent = text[i]; uc.textContent = text[i].toUpperCase();
      f.appendChild(lc); f.appendChild(uc);
      p.word.appendChild(f);
      letters.push({ f: f, lc: lc, uc: uc, word: w, slot: WORD_SLOTS[w][0] + i, at: LIFT + w * WORD_GAP + i * LETTER_GAP });
    }
  });
  var dots = [];
  for (var di = 0; di < RING.length; di++) if (RING[di] === '\u2022') { var dot = el('span', 'orb-dot'); stage.appendChild(dot); dots.push({ e: dot, slot: di }); }

  // The layers, from the bottom: the slate under water (hazy) and its
  // shadow; the ripples, painted on a canvas; the rows and the ring's
  // letters, which float on the water; and the part of the slate that is
  // out of the water.
  var under = el('div', 'orb-slate'), over = el('div', 'orb-slate');
  var shade = el('div', 'orb-shade'), deep = el('div', 'orb-deep'), top = el('div', 'orb-top');
  deep.innerHTML = MARK; top.innerHTML = MARK;
  under.appendChild(shade); under.appendChild(deep); over.appendChild(top);
  var waves = document.createElement('canvas');
  waves.className = 'orb-waves';
  var pen = waves.getContext && waves.getContext('2d');
  stage.insertBefore(waves, stage.firstChild);
  stage.insertBefore(under, waves);
  stage.appendChild(over);
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
    stage.style.setProperty('--ring-font', font + 'px');
    parts.forEach(function (p) { p.rw = p.row.offsetWidth; p.rh = p.row.offsetHeight; });
    // Where each letter stands in its row (its middle, in the stage).
    letters.forEach(function (l) {
      var row = l.f.offsetParent || stage;
      l.nx = (row === stage ? 0 : row.offsetLeft) + l.f.offsetLeft + l.f.offsetWidth / 2;
      l.ny = (row === stage ? 0 : row.offsetTop) + l.f.offsetTop + l.f.offsetHeight / 2;
      var a = slotAngle(l.slot) * Math.PI / 180, dx = G.cx + R * Math.sin(a) - l.nx, dy = cy - R * Math.cos(a) - l.ny;
      l.far = dx * dx + dy * dy;
    });
    // In each word the letter with the farthest to go leaves first, so the
    // word opens out as it goes and no letter has to pass another.
    [0, 1, 2].forEach(function (w) {
      letters.filter(function (l) { return l.word === w; }).sort(function (p, q) { return q.far - p.far; })
        .forEach(function (l, rank) { l.at = LIFT + w * WORD_GAP + rank * LETTER_GAP; });
    });
    // The slate, centred in the ring.
    [under, over].forEach(function (d) {
      d.style.left = (G.cx - s / 2) + 'px'; d.style.top = (cy - s / 2) + 'px';
      d.style.width = s + 'px'; d.style.height = s + 'px';
    });
    sizeWaves();
  }

  // The ripples' canvas: a square over the ring, a little past the letters,
  // where the ripples fade out. It is drawn small and scaled up, which keeps
  // each frame cheap and the water soft.
  var field = null;
  function sizeWaves() {
    if (!pen) return;
    var inner = G.R + G.font * 0.7, reach = G.R + G.font * 1.5 + 26;
    var side = Math.ceil(reach * 2);
    var n = Math.max(8, Math.round(side * Math.min(1, Math.sqrt(26000 / (side * side)))));
    waves.width = n; waves.height = n;
    waves.style.left = (G.cx - reach) + 'px'; waves.style.top = (G.cy - reach) + 'px';
    waves.style.width = side + 'px'; waves.style.height = side + 'px';
    var mask = new Float32Array(n * n), px = side / n;
    for (var j = 0; j < n; j++) for (var i = 0; i < n; i++) {
      var dx = (i + 0.5) * px - reach, dy = (j + 0.5) * px - reach;
      mask[j * n + i] = 1 - smooth((Math.sqrt(dx * dx + dy * dy) - inner) / (reach - inner));
    }
    field = { n: n, px: px, reach: reach, mask: mask, img: pen.createImageData(n, n), wet: false };
  }


  // The ring's turn (degrees): it eases up to its pace and holds it. Its
  // speed is the pace times a smooth 0 to 1 ramp, so it is never faster.
  function ringAngle(t) {
    if (still) return -PHASE; // at rest, TEAM sits at the top
    var u = t - SPIN_AT;
    if (u <= 0) return 0;
    if (u >= SPIN_RAMP) return SPIN_PACE * (u - SPIN_RAMP / 2);
    var x = u / SPIN_RAMP;
    return SPIN_PACE * SPIN_RAMP * (x * x * x - x * x * x * x / 2);
  }
  // A letter's glide: a slow start, a long soft landing.
  function glide(k) { k = smooth(k); return 1 - Math.pow(1 - k, 1.7); }
  // The slate. Heights are in slate units: 0 is the water's surface, below
  // it is under water, and it floats at about 0.5. On the way up it wobbles
  // round, the way a flat stone does in water, which brings its corners out
  // one after another. Once it floats, its tilt is two slow, unrelated
  // swings per axis, so it never repeats itself, and small enough that no
  // corner goes back into the water.
  var FLOAT = 0.5;
  function smooth(x) { x = clamp(x); return x * x * (3 - 2 * x); }
  function slateAt(t) {
    var u = t - MARK_AT, k = u / RISE;
    var z = u <= 0 ? -1.7 : -1.7 + (FLOAT + 1.7) * inOutSine(clamp(k));
    if (u > RISE) z += 0.07 * Math.sin(2 * Math.PI * (u - RISE) / 4.7);
    var wob = 0.5 * (1 - smooth((k - 0.8) / 0.45)), phi = 2 * Math.PI * u / 2.9 - 2.6;
    var calm = smooth((k - 0.65) / 0.5);
    var ax = wob * Math.cos(phi) + calm * (0.12 * Math.sin(2 * Math.PI * u / 5.3 + 0.4) + 0.08 * Math.sin(2 * Math.PI * u / 3.1 + 1.7));
    var ay = wob * Math.sin(phi) + calm * (0.12 * Math.sin(2 * Math.PI * u / 6.7 + 2.1) + 0.08 * Math.sin(2 * Math.PI * u / 3.9 + 0.3));
    if (still) { ax = 0; ay = 0; }
    return { z: z, ax: ax, ay: ay, spin: still ? 0 : 1.6 * Math.sin(2 * Math.PI * u / 9.1), k: clamp(k) };
  }
  var CORNERS = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  var cornerH = null, cornerT = [-9, -9, -9, -9], seenT = -1;

  // Ripples. Each is a short train of rings running out from where a corner
  // met the surface: the front runs ahead, the train behind it grows longer
  // (so the rings widen), and it thins as it spreads and ages. The water's
  // height is the sum of the trains, so they cross as real ripples do, and
  // it is lit from the top left: slopes facing the light are bright, slopes
  // facing away are in shadow.
  var sources = [];
  var LX = -0.6, LY = -0.8;
  function drawWaves(t) {
    if (!field) return;
    var f = field, n = f.n, px = f.px, data = f.img.data, U = G.R / 62;
    var live = [];
    sources.forEach(function (sc) {
      var tau = t - sc.at;
      if (tau <= 0 || tau >= RIPPLE) return;
      var lead = (6 + 44 * tau) * U, len = (20 + 17 * tau) * U;
      var age = 1 - tau / RIPPLE;
      live.push({ x: sc.x - (G.cx - f.reach), y: sc.y - (G.cy - f.reach), lead: lead, lead2: lead * lead, len: len,
        k: 2 * Math.PI * 3.25 / len, amp: sc.amp * age * Math.sqrt(age) * Math.min(1, tau / 0.12), fall: 70 * U });
    });
    if (!live.length) {
      if (f.wet) { pen.clearRect(0, 0, n, n); f.wet = false; }
      return;
    }
    var m = live.length, o = 0, q = 0;
    for (var j = 0; j < n; j++) {
      var y = (j + 0.5) * px;
      for (var i = 0; i < n; i++, o += 4, q++) {
        var w = f.mask[q];
        if (w <= 0) { data[o + 3] = 0; continue; }
        var x = (i + 0.5) * px, sh = 0;
        for (var a = 0; a < m; a++) {
          var L = live[a], dx = x - L.x, dy = y - L.y, r2 = dx * dx + dy * dy;
          if (r2 >= L.lead2) continue;
          var r = Math.sqrt(r2), g = (L.lead - r) / L.len;
          if (g >= 1) continue;
          var env = Math.sin(Math.PI * g), ph = L.k * (L.lead - r);
          var amp = L.amp * env * (0.35 + 0.65 * env) / (1 + r / L.fall);
          sh += amp * (0.95 * Math.cos(ph) * (r > 0.5 ? (dx * LX + dy * LY) / r : 0) + 0.34 * Math.sin(ph));
        }
        sh *= w;
        if (sh > 0) { data[o] = 255; data[o + 1] = 255; data[o + 2] = 255; data[o + 3] = sh >= 1 ? 245 : sh * 245; }
        else { data[o] = 30; data[o + 1] = 66; data[o + 2] = 78; data[o + 3] = sh <= -1 ? 150 : -sh * 150; }
      }
    }
    pen.putImageData(f.img, 0, 0);
    f.wet = true;
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
      if (rk < 1) p.row.style.transform = 'translateY(' + ((1 - outCubic(rk)) * 6).toFixed(2) + 'px)'; // each row settles as its wave passes
      else if (p.row.style.transform) p.row.style.transform = '';
      var fade = (1 - smooth((t - FADE_AT) / 0.6)).toFixed(3);
      if (p.fade !== fade) { p.fade = fade; p.extra.forEach(function (x2) { x2.style.opacity = fade; }); }
    });
    // The letters: each leaves its row along a curve to its place on the
    // ring, turns to face outward, and becomes its capital on the way. On
    // the ring it simply rides round.
    var turn = ringAngle(t), R = G.R;
    letters.forEach(function (l) {
      var k = clamp((t - l.at) / TRAVEL);
      if (k <= 0) {
        if (l.k !== 0) { l.k = 0; l.f.style.transform = ''; l.lc.style.opacity = ''; l.uc.style.opacity = ''; }
        return;
      }
      l.k = k;
      var e = glide(k), base = nearest(slotAngle(l.slot)), a = (base + turn) * Math.PI / 180;
      var ex = G.cx + R * Math.sin(a), ey = G.cy - R * Math.cos(a);
      var x = ex, y = ey;
      if (k < 1) {
        // A gentle curve from the row to the slot. Every letter's curve
        // bends the same way, the way the ring turns, so together they
        // read as one slow swirl and no two paths tangle.
        var dx = ex - l.nx, dy = ey - l.ny, bow = l.word === 1 ? 0.42 : 0.2; // AI swings wide of the row below it
        var qx = (l.nx + ex) / 2 + dy * bow, qy = (l.ny + ey) / 2 - dx * bow, m = 1 - e;
        x = m * m * l.nx + 2 * m * e * qx + e * e * ex;
        y = m * m * l.ny + 2 * m * e * qy + e * e * ey;
      }
      // It turns a little later than it moves, so the letters have drawn
      // apart before they start to lean.
      l.f.style.transform = 'translate(' + (x - l.nx).toFixed(2) + 'px,' + (y - l.ny).toFixed(2) + 'px) rotate(' + ((base + turn) * glide((k - 0.2) / 0.8)).toFixed(2) + 'deg)';
      var up = smooth((k - 0.26) / 0.3); // one quick, even change of case, so the ink never thins
      if (l.up !== up) { l.up = up; l.lc.style.opacity = (1 - up).toFixed(3); l.uc.style.opacity = up.toFixed(3); }
    });
    var dotIn = smooth((t - JOINED + 0.5) / 1.1);
    dots.forEach(function (d) {
      var a = (slotAngle(d.slot) + turn) * Math.PI / 180;
      d.e.style.transform = 'translate(' + (G.cx + R * Math.sin(a)).toFixed(2) + 'px,' + (G.cy - R * Math.cos(a)).toFixed(2) + 'px) scale(' + (0.4 + 0.6 * dotIn).toFixed(3) + ')';
      d.e.style.opacity = dotIn.toFixed(3);
    });
    // The slate, from above.
    var S = slateAt(t), s = G.s;
    var near = clamp((S.z + 1.7) / 1.1);                 // it comes into sight from the deep
    var size = 0.86 + 0.14 * clamp((S.z + 1.7) / (FLOAT + 1.7));
    var pose = 'perspective(520px) rotateX(' + (S.ay * 13).toFixed(2) + 'deg) rotateY(' + (-S.ax * 13).toFixed(2) + 'deg) rotate(' + S.spin.toFixed(2) + 'deg) scale(' + size.toFixed(4) + ')';
    under.style.transform = pose; over.style.transform = pose;
    // Only what is out of the water shows crisp: the slate's height runs
    // evenly from its lowest corner to its highest, so the waterline is a
    // straight, soft edge across it. Under the water it is the hazy copy.
    var tilt = Math.abs(S.ax) + Math.abs(S.ay), lo = S.z - tilt, hi = S.z + tilt, HAZE = 0.28, mask = '';
    if (hi <= -HAZE) top.style.opacity = '0';
    else if (lo >= 0) top.style.opacity = '1';
    else if (hi - lo < 0.02) top.style.opacity = clamp((S.z + HAZE) / HAZE).toFixed(3);
    else {
      top.style.opacity = '1';
      mask = 'linear-gradient(' + (Math.atan2(S.ax, -S.ay) * 180 / Math.PI).toFixed(1) + 'deg, transparent ' +
        (100 * (-HAZE - lo) / (hi - lo)).toFixed(1) + '%, #000 ' + (100 * -lo / (hi - lo)).toFixed(1) + '%)';
    }
    if (top._mask !== mask) { top._mask = mask; top.style.webkitMaskImage = mask; top.style.maskImage = mask; }
    deep.style.opacity = (0.36 * near * clamp(-lo / 0.3)).toFixed(3);
    var lift = clamp(S.z / FLOAT);
    shade.style.opacity = (0.2 * lift).toFixed(3);
    shade.style.transform = 'translate(' + (2 + 3 * lift - S.ax * 4).toFixed(2) + 'px,' + (3 + 4 * lift - S.ay * 4).toFixed(2) + 'px)';
    // While the slate is coming up, a corner that breaks the surface (or
    // dips back through it) sends out a ripple from there. Afloat, the
    // water is left still (founder, 2026-11-20).
    var hs = CORNERS.map(function (c) { return S.z + S.ax * c[0] + S.ay * c[1]; });
    if (cornerH && t > seenT && t - seenT < 0.2 && t > MARK_AT && t < MARK_AT + RISE + 0.6) {
      var rot = S.spin * Math.PI / 180, cs = Math.cos(rot), sn = Math.sin(rot), half = s * size * 0.45;
      CORNERS.forEach(function (c, i) {
        var up = cornerH[i] < 0 && hs[i] >= 0, down = cornerH[i] >= 0 && hs[i] < 0;
        if ((up || down) && t - cornerT[i] > 0.5) {
          cornerT[i] = t;
          sources.push({ x: G.cx + (c[0] * cs - c[1] * sn) * half, y: G.cy + (c[0] * sn + c[1] * cs) * half, at: t, amp: up ? 1.15 : 0.75 });
          if (sources.length > 10) sources.shift();
        }
      });
    }
    cornerH = hs; seenT = t;
    drawWaves(t);
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
