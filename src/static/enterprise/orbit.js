// The opening picture (founder, 2026-11-20), above the headline. A ring of
// lettering, TEAM, AI, AGENTS, APPS, is already turning slowly when the page
// opens (one turn in 24 seconds, never faster). A moment later the OpenShore
// mark comes up in its middle. The screen is the water's surface, seen from
// above, and the mark is a piece of slate floating up to it.
//
// How it is made to look like water (2026-11-20, after reading how games and
// film render a floating thing):
//  - The water starts empty. A moment after the page opens the slate fades
//    in from deep down, faint, soft and blue, already drifting up.
//  - The rise is worked out from forces, not drawn as a curve. Under water
//    the slate is pushed up steadily and held back by drag; at the surface
//    the push becomes a spring about its float line. So it arrives with its
//    own momentum, lifts a little past where it floats, sinks back and
//    settles in two or three bobs, each smaller than the last.
//  - Water hides things by depth. The deeper the slate is, the fainter,
//    softer and bluer it shows, by the same falling curve light follows in
//    water. It clears as a whole, with no line drawn across its face.
//  - It breaks the surface one corner at a time (founder, 2026-11-20). Each
//    corner sends out rings from that corner, and the slate's first bob back
//    down sends one gentle ring all round it. The leading ring is the widest
//    and the ones behind it are finer, as on a pond. They are lit from the
//    top left, pass under the letters, nudge each letter as they pass, and
//    fade just past them.
//  - The slate's face catches the light as it tips, and its shadow on the
//    water tightens and loosens as it rides lower and higher.
// Once the slate is afloat the water goes still, and it rides just above the
// surface, rocking slowly, while the ring keeps turning.
// (The letters' flight from the sentence onto the ring, and its tuned
// routes, stay below; the picture now starts after it.)
//
// It runs while it is on screen and rests while it is off screen or the tab
// is hidden. With Reduce Motion it shows the mark inside the ring, still;
// without this script nothing shows. Every position is a function of the
// clock alone, so it can stop and pick up anywhere.
(function () {
  'use strict';
  var stage = document.querySelector('[data-orb]');
  if (!stage || !window.requestAnimationFrame) return;
  var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // The mark has a hair of clear margin (its box is 34 units for 32), so when
  // it tilts its edges are drawn inside the layer and stay smooth.
  var MARK = '<svg viewBox="-1 -1 34 34" aria-hidden="true"><rect width="32" height="32" rx="7.5" fill="#1c2a33" /><g transform="translate(0 -0.81)"><line x1="7" y1="13" x2="25" y2="13" stroke="#f6f4ef" stroke-width="2" stroke-linecap="round" /><path d="M7 19q4.5-3.3 9 0t9 0" fill="none" stroke="#4b90a3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></g></svg>';

  // The ring's lettering, one character per even step round the circle.
  // Each word's slots, and the word each row sends there.
  // The ring's lettering. A letter takes one step round the circle, a space
  // half a step and a dot a little more, so the words sit evenly with
  // tidy gaps between them.
  var RING = 'TEAM • AI • AGENTS • APPS • ';
  var WORD_SLOTS = [[0, 3], [7, 8], [12, 17], [21, 24]]; // TEAM, AI, AGENTS, APPS
  var MID = [], UNITS = 0;
  for (var ci = 0; ci < RING.length; ci++) {
    var wgt = RING[ci] === ' ' ? 0.5 : RING[ci] === '•' ? 0.6 : 1;
    MID.push(UNITS + wgt / 2); UNITS += wgt;
  }
  var STEP = 360 / UNITS;
  function wordMid(w) { return (MID[WORD_SLOTS[w][0]] + MID[WORD_SLOTS[w][1]]) / 2; }
  // Where the ring stands as it forms (TEAM's middle, degrees clockwise
  // from the top). With the order and bows below, it was chosen by a
  // simulation of every letter's path on phone and laptop layouts, so that
  // no letter passes through another or leaves the picture's edge.
  var PHASE = -180;
  var FIRST = PHASE - wordMid(0) * STEP;
  function slotAngle(i) { return FIRST + MID[i] * STEP; }          // degrees, clockwise from the top

  // The clock, in seconds from when the picture starts.
  // The sentence stands on the page from the start (founder, 2026-11-20).
  // Since 2026-11-20 (founder) the picture opens on the ring already made
  // and turning, so every word has landed before the clock starts.
  var FADE_AT = -20;
  var LIFT = -10;
  var WORD_GAP = 0.62;          // between words setting off
  var LETTER_GAP = 0.02;        // between letters of a word: a word travels as one
  var TRAVEL = 1.9;             // a letter's glide onto the ring
  var JOINED = LIFT + 3 * WORD_GAP + 5 * LETTER_GAP + TRAVEL;
  // The order the words set off in (by their place in WORD_SLOTS), and how
  // far each one's path bows: chosen so no letter passes through another or
  // through a word still in its row.
  var LEAVE = [0, 3, 2, 1];       // team, apps, agents, AI
  var BOW = [0.3, -0.15, -0.3, 0.2];
  var SPIN_AT = LIFT + 0.8;     // the ring starts to turn as the first letters near it
  var SPIN_RAMP = 5;            // easing up to its pace
  var SPIN_PACE = 360 / 24;     // degrees a second, at most: one turn in 24 seconds
  var MARK_AT = 0.8;            // the mark starts up a moment after the page opens
  var RIPPLE = 3.0;             // a ripple's life
  var END = MARK_AT + 12;       // the picture's last still frame (for Reduce Motion)

  function el(tag, cls) { var e = document.createElement(tag); e.className = cls; return e; }
  function clamp(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function inOutSine(t) { return -(Math.cos(Math.PI * t) - 1) / 2; }
  function nearest(deg) { deg = deg % 360; if (deg > 180) deg -= 360; if (deg <= -180) deg += 360; return deg; }

  var rows = Array.prototype.slice.call(stage.querySelectorAll('.orb-row'));
  var parts = rows.map(function (row) {
    return { row: row, extra: Array.prototype.slice.call(row.querySelectorAll('.orb-x')) };
  });

  // Each letter of team, AI, agents and apps is its own piece, so it can
  // leave the row for its place on the ring: the letter as written in the
  // sentence, and over it the capital it becomes.
  var letters = [];
  Array.prototype.forEach.call(stage.querySelectorAll('.orb-w'), function (word, w) {
    var text = word.textContent;
    word.textContent = '';
    for (var i = 0; i < text.length; i++) {
      var f = el('span', 'orb-f'), lc = el('span', 'orb-lc'), uc = el('span', 'orb-uc');
      lc.textContent = text[i]; uc.textContent = text[i].toUpperCase();
      f.appendChild(lc); f.appendChild(uc);
      word.appendChild(f);
      letters.push({ f: f, lc: lc, uc: uc, word: w, slot: WORD_SLOTS[w][0] + i, at: LIFT });
    }
  });
  var dots = [];
  for (var di = 0; di < RING.length; di++) if (RING[di] === '\u2022') { var dot = el('span', 'orb-dot'); stage.appendChild(dot); dots.push({ e: dot, slot: di }); }

  // The layers, from the bottom: the slate's shadows on the water; the slate
  // under water, twice (far down and soft, and nearer and clearer); the
  // ripples, painted on a canvas; the rows and the ring's letters, which
  // float on the water; and the slate itself, crisp where it is out of the
  // water, with the light on its face.
  var under = el('div', 'orb-slate'), over = el('div', 'orb-slate');
  var cast = el('div', 'orb-cast'), shade = el('div', 'orb-shade');
  var far = el('div', 'orb-deep'), deep = el('div', 'orb-deep'), top = el('div', 'orb-top');
  var gloss = el('div', 'orb-gloss'), glare = el('i', '');
  far.innerHTML = MARK.replace('#1c2a33', '#2d5767'); deep.innerHTML = MARK.replace('#1c2a33', '#213b47'); top.innerHTML = MARK;
  gloss.appendChild(glare); top.appendChild(gloss);
  under.appendChild(cast); under.appendChild(shade); under.appendChild(far); under.appendChild(deep);
  over.appendChild(top);
  var waves = document.createElement('canvas');
  waves.className = 'orb-waves';
  var pen = waves.getContext && waves.getContext('2d');
  stage.insertBefore(waves, stage.firstChild);
  stage.insertBefore(under, waves);
  stage.appendChild(over);
  stage.classList.add('orb-live');

  // Geometry. The ring hugs the mark (founder, 2026-11-20): its letters
  // clear the mark's corners by a small gap, and the stage is just tall
  // enough for the ring and the ripples' fade beyond it, so the headline
  // sits close above and the next paragraph close below.
  var G = null, lastW = 0, words = [];
  function measure() {
    var W = stage.clientWidth;
    var phone = W < 560;
    var s = phone ? 88 : 116;
    // The mark's rounded corners reach 0.61 of its side from the centre,
    // and the letters' inner edge clears them by a small gap; a letter's
    // half height is about 0.077 of the radius, so solve for the radius.
    var R = Math.round((0.61 * s + (phone ? 19 : 24)) / 0.923);
    var font = Math.round(Math.min(24, 0.72 * 2 * Math.PI * R / UNITS));
    var outer = R + font * 0.62, reach = Math.round(outer + (phone ? 18 : 22));
    stage.style.height = 2 * reach + 'px';
    var H = 2 * reach, cy = reach;
    // On a phone the picture is centred; wider, it lines up with the
    // headline's left edge (founder, 2026-11-20).
    G = { W: W, H: H, cx: phone ? W / 2 : Math.ceil(outer) + 1, cy: cy, R: R, s: s, font: font, outer: outer, reach: reach };
    stage.style.setProperty('--ring-font', font + 'px');
    // Where each letter stands in its row (its middle, in the stage), and
    // each word: its middle, and its place on the ring (taken the short way
    // round, and shared by its letters, so a word never splits).
    letters.forEach(function (l) {
      var row = l.f.offsetParent || stage;
      l.nx = (row === stage ? 0 : row.offsetLeft) + l.f.offsetLeft + l.f.offsetWidth / 2;
      l.ny = (row === stage ? 0 : row.offsetTop) + l.f.offsetTop + l.f.offsetHeight / 2;
    });
    words = WORD_SLOTS.map(function (sl, w) {
      var own = letters.filter(function (l) { return l.word === w; });
      var nx = own.reduce(function (a, l) { return a + l.nx; }, 0) / own.length;
      var ny = own.reduce(function (a, l) { return a + l.ny; }, 0) / own.length;
      var base = nearest(FIRST + wordMid(w) * STEP);
      own.forEach(function (l) { l.ox = l.nx - nx; l.rel = (MID[l.slot] - wordMid(w)) * STEP; });
      return { nx: nx, ny: ny, base: base };
    });
    // Words leave in turn; within a word the letters set off a breath
    // apart, from the front of its motion.
    LEAVE.forEach(function (w, turnNo) {
      var W = words[w], a = W.base * Math.PI / 180, dir = (G.cx + R * Math.sin(a) - W.nx) >= 0 ? 1 : -1;
      letters.filter(function (l) { return l.word === w; }).sort(function (p, q) { return dir * (q.ox - p.ox); })
        .forEach(function (l, rank) { l.at = LIFT + turnNo * WORD_GAP + rank * LETTER_GAP; });
    });
    // The slate, centred in the ring.
    var box = s * 34 / 32;
    [under, over].forEach(function (d) {
      d.style.left = (G.cx - box / 2) + 'px'; d.style.top = (cy - box / 2) + 'px';
      d.style.width = box + 'px'; d.style.height = box + 'px';
    });
    far.style.filter = 'blur(' + (0.062 * s).toFixed(1) + 'px)'; deep.style.filter = 'blur(' + (0.02 * s).toFixed(1) + 'px)';
    shade.style.filter = 'blur(' + (0.024 * s).toFixed(1) + 'px)'; cast.style.filter = 'blur(' + (0.09 * s).toFixed(1) + 'px)';
    sizeWaves();
  }

  // How far a spot is from the slate's edge (px; the spot is given from the
  // slate's middle). Ripples leave from that edge, so near the slate a ring
  // has its rounded-square shape; further out the rings relax into circles,
  // and are round by the time they pass under the letters.
  function fromEdge(x, y) {
    var s = G.s, r = s * 7.5 / 32, a = s / 2 - r;
    var qx = Math.abs(x) - a, qy = Math.abs(y) - a;
    var px = qx > 0 ? qx : 0, py = qy > 0 ? qy : 0, in2 = qx > qy ? qx : qy;
    var sd = Math.sqrt(px * px + py * py) + (in2 < 0 ? in2 : 0) - r;
    return sd + 0.9 * smooth(sd / (0.55 * s)) * (Math.sqrt(x * x + y * y) - 0.551 * s - sd);
  }

  // The ripples' canvas: a square over the ring, a little past the letters,
  // where the ripples fade out, drawn at the screen's own sharpness, up to a
  // budget (ripples are soft, so past about 1.6 dots to the px nothing is
  // gained and a phone pays for it). Nothing is painted on the slate itself.
  // The bob's ring leaves from the slate's whole edge, so its shape at a
  // spot depends only on how far the spot is from that edge; that, and which
  // way is "out" from there, is worked out once per spot here. A corner's
  // rings are circles about the corner, so their shape at a spot depends
  // only on how far it is from the corner. Each frame then looks the water
  // up in short tables and lights it.
  var field = null, FINE = 0.25;   // the tables' spacing, px
  function sizeWaves() {
    if (!pen) return;
    var inner = G.outer, reach = G.reach, U = G.s / 116;
    var side = Math.ceil(reach * 2);
    var n = Math.max(8, Math.min(440, Math.round(side * Math.min(1.6, window.devicePixelRatio || 1))));
    waves.width = n; waves.height = n;
    waves.style.left = (G.cx - reach) + 'px'; waves.style.top = (G.cy - reach) + 'px';
    waves.style.width = side + 'px'; waves.style.height = side + 'px';
    var step = side / n, cnt = n * n, most = 0, q = 0;
    var di = new Uint16Array(cnt), gx = new Int8Array(cnt), gy = new Int8Array(cnt), mk = new Uint8Array(cnt), mo = new Uint8Array(cnt);
    for (var j = 0; j < n; j++) for (var i = 0; i < n; i++, q++) {
      var x = (i + 0.5) * step - reach, y = (j + 0.5) * step - reach, d = fromEdge(x, y);
      // Off the slate, fading out past the letters.
      var out = smooth((d + U) / (4 * U)) * (1 - smooth((Math.sqrt(x * x + y * y) - inner) / (reach - inner)));
      if (out < 0.004) continue;
      mo[q] = Math.round(255 * out);
      // The bob's ring starts softly a little off the slate's edge.
      var w = smooth((d - 2 * U) / (14 * U)) * out;
      if (w < 0.004) continue;
      var ox = fromEdge(x + 0.75, y) - fromEdge(x - 0.75, y), oy = fromEdge(x, y + 0.75) - fromEdge(x, y - 0.75), ol = Math.sqrt(ox * ox + oy * oy) || 1;
      di[q] = Math.round(d / FINE); gx[q] = Math.round(127 * ox / ol); gy[q] = Math.round(127 * oy / ol); mk[q] = Math.round(255 * w);
      if (di[q] > most) most = di[q];
    }
    var size = most + 2, far = Math.ceil(side * 1.2 / FINE) + 2;
    var img = pen.createImageData(n, n);
    field = { n: n, step: step, reach: reach, size: size, di: di, gx: gx, gy: gy, mk: mk, mo: mo, img: img, px: new Uint32Array(img.data.buffer),
      wet: false, live: false, lo: 0, hi: -1, slow: field ? field.slow : 0, odd: false,
      S0: new Float32Array(size), C0: new Float32Array(size),
      R: [0, 1, 2, 3].map(function () { return { S: new Float32Array(far), C: new Float32Array(far), top: far - 1, on: false, x: 0, y: 0, lo: 0, hi: -1, f2: 0, b2: 0 }; }) };
  }

  // The ring's turn (degrees): it eases up to its pace and holds it. Its
  // speed is the pace times a smooth 0 to 1 ramp, so it is never faster.
  function ringAngle(t) {
    if (still) return -PHASE; // at rest, TEAM sits at the top
    return -PHASE + SPIN_PACE * t; // already turning at its pace, TEAM starting at the top
  }
  // A letter's glide: a slow start, a long soft landing.
  function glide(k) { k = smooth(k); return 1 - Math.pow(1 - k, 1.7); }
  // The slate. Heights are in slate units: 0 is the water's surface, below
  // it is under water, and it floats at 0.5 (it is one unit thick, and half
  // as dense as water). Its rise is worked out once, from the forces on a
  // floating body, in small steps of time:
  //  - the water pushes it up by how much of it is under: steadily while it
  //    is wholly under, and as a spring about the float line once part of it
  //    is out;
  //  - drag holds it back, heavily in the deep (so it comes up at an even,
  //    unhurried pace) and lightly at the surface (so it bobs).
  // So it breaks the surface still moving, rides up past its float line,
  // sinks back and settles, each bob smaller than the one before.
  // On the way up it wobbles round, the way a flat stone does in water,
  // which brings its corners out one after another; at the surface the water
  // rights it, and the wobble dies away into its slow rocking. Afloat, its
  // tilt is two slow, unrelated swings per axis, so it never repeats
  // itself, and small enough that no corner goes back into the water.
  var Z0 = -2.4, FLOAT = 0.5;
  var FADE_IN = 1.0;            // seconds for the slate to come into sight from the deep
  var SPRING = 21;              // the water's push, per unit of slate under or over its float line
  var DRAG_DEEP = 9.5, DRAG_TOP = 2.4;
  var WOB = 0.5, TURN = 2.7, PHI0 = -1.75;   // the wobble's size, seconds per turn, and where it starts (bottom right corner first)
  var RIGHTING = 2.2;           // how fast the surface levels it
  var HZ = 120, SPAN = 9;       // the rise is kept at this many steps a second, for this long
  var CORNERS = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
  function smooth(x) { x = clamp(x); return x * x * (3 - 2 * x); }
  function lean(u, w) {
    var phi = 2 * Math.PI * u / TURN + PHI0, calm = smooth(1 - w / WOB);
    return [w * Math.cos(phi) + calm * (0.12 * Math.sin(2 * Math.PI * u / 5.3 + 0.4) + 0.08 * Math.sin(2 * Math.PI * u / 3.1 + 1.7)),
      w * Math.sin(phi) + calm * (0.12 * Math.sin(2 * Math.PI * u / 6.7 + 2.1) + 0.08 * Math.sin(2 * Math.PI * u / 3.9 + 0.3))];
  }
  // Ripples are found on the way: rings leave a corner as it breaks the
  // surface (from the corner's spot at that moment, in slate widths from
  // the middle), and one ring leaves all round the slate as it first sinks
  // back through its float line, as strong as it is moving.
  var path = null, sources = [], DRY = 2;
  function plan() {
    var n = HZ * SPAN, zs = new Float32Array(n + 1), ws = new Float32Array(n + 1);
    var z = Z0, v = 0, w = WOB, dt = 1 / (HZ * 4), was = null, out = 0, seen = [0, 0, 0, 0], bobbed = 0;
    for (var i = 0; i <= n; i++) {
      zs[i] = z; ws[i] = w;
      for (var j = 0; j < 4; j++) {
        var u = (i * 4 + j) * dt, a = lean(u, w), wet = 0, hs = [], c;
        for (c = 0; c < 4; c++) { hs[c] = z + a[0] * CORNERS[c][0] + a[1] * CORNERS[c][1]; wet += clamp(1 - hs[c]) / 4; }
        v += (SPRING * (wet - 0.5) - (DRAG_TOP + (DRAG_DEEP - DRAG_TOP) * smooth((0.15 - z) / 0.7)) * v) * dt;
        if (was) for (c = 0; c < 4; c++) if (!seen[c] && was[c] < 0 && hs[c] >= 0) {
          seen[c] = 1; DRY = u;
          var reach = 0.43 * (0.86 + 0.14 * clamp((z - Z0) / (FLOAT - Z0))), rot = 1.6 * Math.sin(2 * Math.PI * u / 9.1) * Math.PI / 180;
          var phi = 2 * Math.PI * u / TURN + PHI0, kx = CORNERS[c][0], ky = CORNERS[c][1];
          sources.push({ at: MARK_AT + u, corner: true, amp: [1, 0.9, 0.82, 0.75][out++],
            x: (kx * Math.cos(rot) - ky * Math.sin(rot)) * reach + 0.045 * w * Math.cos(phi),
            y: (kx * Math.sin(rot) + ky * Math.cos(rot)) * reach + 0.045 * w * Math.sin(phi) });
        }
        if (out === 4 && !bobbed && v < -0.2 && z > FLOAT && z + v * dt <= FLOAT) { bobbed = 1; sources.push({ at: MARK_AT + u, amp: 0.8 * Math.min(1, -v / 0.6) }); }
        was = hs; z += v * dt;
        w -= w * RIGHTING * smooth((z + 0.3) / 0.8) * dt;
      }
    }
    path = { z: zs, w: ws };
  }
  function slateAt(t) {
    var u = t - MARK_AT;
    if (still) return { u: u, z: FLOAT, ax: 0, ay: 0, wx: 0, wy: 0, spin: 0 };
    var z = Z0, w = WOB;
    if (u > 0) {
      var f = u * HZ, i = Math.floor(f), n = path.z.length - 1;
      if (i >= n) { z = path.z[n]; w = path.w[n]; }
      else { z = path.z[i] + (path.z[i + 1] - path.z[i]) * (f - i); w = path.w[i] + (path.w[i + 1] - path.w[i]) * (f - i); }
      z += 0.07 * smooth((u - 3.4) / 3) * Math.sin(2 * Math.PI * (u - 3.4) / 4.7); // afloat, it rides a little up and down
    } else u = 0;
    var a = lean(u, w), phi = 2 * Math.PI * u / TURN + PHI0;
    return { u: u, z: z, ax: a[0], ay: a[1], wx: w * Math.cos(phi), wy: w * Math.sin(phi), spin: 1.6 * Math.sin(2 * Math.PI * u / 9.1) };
  }

  // A ripple train's shape, from its front (0) back to its tail (1): a wide
  // leading ring, then finer and fainter ones behind it, because on water
  // long waves outrun short ones. Kept as its slope (which is what light
  // catches) and its curve (crests gather the light into a bright line, and
  // troughs spread it), each scaled to 1.
  var PN = 512, PS = new Float32Array(PN + 2), PC = new Float32Array(PN + 2);
  (function () {
    var h = [], ms = 0, mc = 0, i;
    for (i = -1; i <= PN + 2; i++) {
      var x = i / PN;
      h.push(x <= 0 || x >= 1 ? 0 : (x / 0.3) * Math.exp(1 - x / 0.3) * (1 - smooth((x - 0.6) / 0.4)) * Math.sin(2 * Math.PI * 3 * Math.pow(x, 1.3)));
    }
    for (i = 0; i <= PN + 1; i++) {
      PS[i] = h[i + 2] - h[i]; PC[i] = h[i + 2] - 2 * h[i + 1] + h[i];
      ms = Math.max(ms, Math.abs(PS[i])); mc = Math.max(mc, Math.abs(PC[i]));
    }
    for (i = 0; i <= PN + 1; i++) { PS[i] /= ms; PC[i] /= mc; }
  })();

  // The water at time t, as tables along a line out from where each ripple
  // left: the slope and curve of its rings. A train's front runs ahead and
  // its tail falls behind (so its rings widen); it gathers quickly, and
  // thins as it spreads and ages. Trains add up where they cross, as real
  // ripples do.
  function swell(t) {
    var f = field;
    if (!f) return;
    var U = G.s / 116, i, live = false, lo = f.size, hi = -1, slot = 0;
    for (i = 0; i < f.size; i++) { f.S0[i] = 0; f.C0[i] = 0; }
    f.R.forEach(function (R) { R.on = false; });
    sources.forEach(function (sc) {
      var tau = t - sc.at;
      if (tau <= 0 || tau >= RIPPLE) return;
      var R = sc.corner ? f.R[slot++] : null;
      if (sc.corner && !R) return;
      live = true;
      var len = (26 + 15 * tau) * U, age = 1 - tau / RIPPLE, crisp = 26 * U / len;
      var k = sc.amp * age * Math.sqrt(age) * smooth(tau / (sc.corner ? 0.25 : 0.5));
      var front = sc.corner ? (4 + 48 * tau) * U : (52 * tau - 2) * U, S = R ? R.S : f.S0, C = R ? R.C : f.C0, top = R ? R.top : f.size - 1;
      var i0 = Math.max(0, Math.ceil((front - len) / FINE)), i1 = Math.min(top, Math.floor(front / FINE));
      if (R) {
        R.on = true; R.x = sc.x * G.s; R.y = sc.y * G.s; R.lo = i0; R.hi = i1;
        R.f2 = (i1 + 1) * FINE * (i1 + 1) * FINE; R.b2 = i0 > 1 ? (i0 - 1) * FINE * (i0 - 1) * FINE : 0;
      } else { if (i0 < lo) lo = i0; if (i1 > hi) hi = i1; }
      for (var i = i0; i <= i1; i++) {
        var d = i * FINE, x = (front - d) / len * PN, j = x | 0, m = x - j, g = k / Math.sqrt(1 + d / (46 * U));
        var s = g * (PS[j] + (PS[j + 1] - PS[j]) * m), c = g * crisp * (PC[j] + (PC[j + 1] - PC[j]) * m);
        if (R) { S[i] = s; C[i] = c; } else { S[i] += s; C[i] += c; }
      }
    });
    f.live = live; f.lo = lo; f.hi = hi;
  }
  // How far a passing ripple carries something afloat at a spot (given from
  // the slate's middle), out from the middle, in px: things on the water
  // are pushed out ahead of a crest and drawn back behind it.
  function ride(x, y) {
    var f = field;
    if (!f || !f.live) return 0;
    var r = Math.sqrt(x * x + y * y) || 1, i = Math.round(fromEdge(x, y) / FINE), push = 0;
    if (i >= f.lo && i <= f.hi) push += f.S0[i];
    f.R.forEach(function (R) {
      if (!R.on) return;
      var dx = x - R.x, dy = y - R.y, d = Math.sqrt(dx * dx + dy * dy) || 1, k = Math.round(d / FINE);
      if (k >= R.lo && k <= R.hi) push += R.S[k] * (dx * x + dy * y) / (d * r);
    });
    return 1.7 * (G.s / 116) * push;
  }
  // The water is lit from the top left: slopes facing the light are bright,
  // slopes facing away are in shadow (the sea's colour, not grey), and each
  // crest carries a fine bright line. Light glints, so the bright side is
  // drawn narrower than the shadow side.
  var LX = -0.6, LY = -0.8;
  // A pixel is written as one number: its colour, and how strongly it shows
  // in the top byte or the bottom one, by the machine's byte order.
  var LITTLE = new Uint8Array(new Uint32Array([1]).buffer)[0] === 1;
  var LIGHT = LITTLE ? 0xffffff : 0xffffff00, DARK = LITTLE ? (104 << 16) | (88 << 8) | 36 : (36 << 24) | (88 << 16) | (104 << 8), UP = LITTLE ? 24 : 0;
  function drawWaves() {
    var f = field;
    if (!f) return;
    if (!f.live) {
      if (f.wet) { pen.clearRect(0, 0, f.n, f.n); f.wet = false; }
      return;
    }
    // On a device that cannot keep up, the water is painted every other
    // frame; the slate and the letters still move on every one.
    f.odd = !f.odd;
    if (f.slow > 8 && f.odd) return;
    var began = window.performance && performance.now ? performance.now() : 0;
    var px = f.px, n = f.n, step = f.step, reach = f.reach, di = f.di, gx = f.gx, gy = f.gy, mk = f.mk, mo = f.mo;
    var S0 = f.S0, C0 = f.C0, lo = f.lo, hi = f.hi;
    var rs = f.R.filter(function (R) { return R.on; }), m = rs.length;
    var KS = 1.2 / (127 * 255), KR = 1.2 / 255, KC = 0.5 / 255;
    for (var j = 0, q = 0; j < n; j++) {
      var y = (j + 0.5) * step - reach;
      for (var i = 0; i < n; i++, q++) {
        var wo = mo[q];
        if (!wo) continue;
        var sh = 0, w = mk[q];
        if (w) {
          var e = di[q];
          if (e >= lo && e <= hi) { var nx = gx[q], ny = gy[q]; sh = (KS * S0[e] * (nx * LX + ny * LY) - KC * C0[e]) * w; }
        }
        if (m) {
          var x = (i + 0.5) * step - reach, acc = 0;
          for (var a = 0; a < m; a++) {
            var R = rs[a], dx = x - R.x, dy = y - R.y, d2 = dx * dx + dy * dy;
            if (d2 >= R.f2 || d2 < R.b2) continue;
            var d = Math.sqrt(d2), k = (d / FINE) | 0;
            if (k < R.lo || k > R.hi || d < 0.5) continue;
            acc += KR * R.S[k] * (dx * LX + dy * LY) / d - KC * R.C[k];
          }
          sh += acc * wo;
        }
        px[q] = sh > 0 ? LIGHT | ((sh >= 1 ? 200 : sh * Math.sqrt(sh) * 200) << UP) : sh < 0 ? DARK | ((sh <= -1 ? 170 : -sh * 170) << UP) : 0;
      }
    }
    pen.putImageData(f.img, 0, 0);
    f.wet = true;
    if (began && f.slow <= 8) f.slow = performance.now() - began > 9 ? f.slow + 1 : Math.max(0, f.slow - 1);
  }

  // How much of the slate shows at a height: all of it above the water, and
  // under it less and less with depth, by the falling curve light follows in
  // water. The crisp slate takes over near the surface; the two soft copies
  // carry it further down, the softest the furthest.
  function clear(h) { return h >= 0 ? 1 : Math.exp(h / 0.35); }
  function near(h) { return h >= 0 ? 0.66 * (1 - smooth(h / 0.12)) : 0.66 * Math.exp(h / 0.9); }
  function hazy(h) { return h >= 0 ? 0.45 * (1 - smooth(h / 0.16)) : 0.45 * Math.exp(h / 1.7); }
  function setOp(e, v) { v = v.toFixed(3); if (e._op !== v) { e._op = v; e.style.opacity = v; } }

  function render(t) {
    if (!G) return;
    parts.forEach(function (p) {
      var fade = (1 - smooth((t - FADE_AT) / 0.6)).toFixed(3);
      if (p.fade !== fade) { p.fade = fade; p.extra.forEach(function (x2) { x2.style.opacity = fade; }); }
    });
    // The letters. Each word leaves its row as a unit: it glides along a
    // gentle curve to its place on the ring and turns as it goes, its
    // letters held together, so they never pass through each other, even
    // for a word that ends upside down at the foot of the ring. Near the end the letters ease from a straight word into
    // the ring's curve, and each becomes its capital on the way. On the ring
    // they ride round, and a ripple passing under one nudges it out and back.
    swell(t);
    var turn = ringAngle(t), R = G.R;
    letters.forEach(function (l) {
      var k = clamp((t - l.at) / TRAVEL);
      if (k <= 0) {
        if (l.k !== 0) { l.k = 0; l.f.style.transform = ''; l.lc.style.opacity = ''; l.uc.style.opacity = ''; }
        return;
      }
      l.k = k;
      var W = words[l.word], e = glide(k);
      var aw = W.base + turn, rw = aw * Math.PI / 180;                 // the word's place on the ring
      var wx = G.cx + R * Math.sin(rw), wy = G.cy - R * Math.cos(rw);
      var al = aw + l.rel, rl = al * Math.PI / 180;                     // the letter's place on the ring
      var lx = G.cx + R * Math.sin(rl), ly = G.cy - R * Math.cos(rl);
      // The word's middle, along a curve bending the way the ring turns.
      var dx = wx - W.nx, dy = wy - W.ny, bow = BOW[l.word], m = 1 - e;
      var qx = (W.nx + wx) / 2 + dy * bow, qy = (W.ny + wy) / 2 - dx * bow;
      var cx = m * m * W.nx + 2 * m * e * qx + e * e * wx, cy = m * m * W.ny + 2 * m * e * qy + e * e * wy;
      // The letter, held in the turning word, then let into the curve.
      var spin = aw * e, rs = spin * Math.PI / 180, cs = Math.cos(rs), sn = Math.sin(rs);
      var ra = aw * Math.PI / 180;
      var bend = smooth((k - 0.45) / 0.55);
      var push = bend * ride(lx - G.cx, ly - G.cy);
      var x = cx + l.ox * cs + bend * (lx - wx - l.ox * Math.cos(ra)) + push * Math.sin(rl);
      var y = cy + l.ox * sn + bend * (ly - wy - l.ox * Math.sin(ra)) - push * Math.cos(rl);
      l.f.style.transform = 'translate(' + (x - l.nx).toFixed(2) + 'px,' + (y - l.ny).toFixed(2) + 'px) rotate(' + (spin + l.rel * bend * e).toFixed(2) + 'deg)';
      var up = smooth((k - 0.26) / 0.3); // one quick, even change of case, so the ink never thins
      if (l.up !== up) { l.up = up; l.lc.style.opacity = (1 - up).toFixed(3); l.uc.style.opacity = up.toFixed(3); }
    });
    var dotIn = 1;
    dots.forEach(function (d) {
      var a = (slotAngle(d.slot) + turn) * Math.PI / 180, r = R + ride(R * Math.sin(a), -R * Math.cos(a));
      d.e.style.transform = 'translate(' + (G.cx + r * Math.sin(a)).toFixed(2) + 'px,' + (G.cy - r * Math.cos(a)).toFixed(2) + 'px) scale(' + (0.4 + 0.6 * dotIn).toFixed(3) + ')';
      d.e.style.opacity = dotIn.toFixed(3);
    });
    // The slate, from above. It grows a little as it nears, as anything
    // coming toward the eye does, and a touch more while it rides high. Under
    // water it slides a little the way it leans, so it comes up along a
    // small spiral instead of dead straight.
    var S = slateAt(t), s = G.s, U = s / 116;
    var size = 0.86 + 0.14 * clamp((S.z - Z0) / (FLOAT - Z0)) + (S.z > FLOAT ? 0.12 * (S.z - FLOAT) : 0);
    var pose = 'translate(' + (S.wx * s * 0.045).toFixed(2) + 'px,' + (S.wy * s * 0.045).toFixed(2) + 'px) perspective(520px) rotateX(' + (S.ay * 13).toFixed(2) + 'deg) rotateY(' + (-S.ax * 13).toFixed(2) + 'deg) rotate(' + S.spin.toFixed(2) + 'deg) scale(' + size.toFixed(4) + ')';
    under.style.transform = pose; over.style.transform = pose;
    // How far up it is, taken a little toward its highest corner, so it
    // finishes clearing as its corners come out. The whole slate clears together:
    // crisp out of the water, fainter, softer and bluer the deeper it is.
    // It fades in from nothing over its first second.
    var tip = Math.abs(S.ax) + Math.abs(S.ay), lo = S.z - tip, h = S.z + 0.25 * tip;
    var seen = still ? 1 : smooth(S.u / FADE_IN);
    setOp(top, clear(h) * seen); setOp(deep, near(h) * seen); setOp(far, hazy(h) * seen);
    // Seen through moving water, what is under it shimmers a little.
    var shim = 0.014 * clamp(-h / 0.4);
    var wav = shim ? 'scale(' + (1 + shim * Math.sin(6.3 * S.u)).toFixed(4) + ',' + (1 + shim * Math.sin(5.1 * S.u + 1.3)).toFixed(4) + ') skewX(' + (40 * shim * Math.sin(4.3 * S.u + 2)).toFixed(2) + 'deg)' : '';
    if (deep._wav !== wav) { deep._wav = wav; deep.style.transform = wav; far.style.transform = wav; }
    // The light on the slate's face. It sits toward the top left, where the
    // light comes from, slides as the slate tips, and is brighter the more
    // the face turns to the light; a little brighter too while the slate is
    // still wet from the water. Under water its face catches none.
    var wetness = still ? 0 : 1 - smooth((S.u - DRY) / 4);
    glare.style.transform = 'translate(' + ((-0.2 + 0.8 * S.ax) * s).toFixed(2) + 'px,' + ((-0.26 + 0.8 * S.ay) * s).toFixed(2) + 'px)';
    gloss.style.opacity = (smooth(1 + lo / 0.5) * clamp(0.5 + 0.9 * (0.6 * S.ax + 0.8 * S.ay) + 0.3 * wetness)).toFixed(3);
    // Its shadows on the water, thrown down and to the right: a tight dark
    // one where it meets the water, and a wide soft one that slips further
    // out and thins as the slate rides higher.
    var lift = Math.max(0, S.z / FLOAT), out = clamp(lift);
    shade.style.opacity = (0.3 * out).toFixed(3);
    shade.style.transform = 'translate(' + ((0.8 + 1.4 * lift - S.ax * 2) * U).toFixed(2) + 'px,' + ((1.2 + 2 * lift - S.ay * 2) * U).toFixed(2) + 'px)';
    cast.style.opacity = (0.21 * out / (0.6 + 0.4 * lift)).toFixed(3);
    cast.style.transform = 'translate(' + ((2 + 4 * lift - S.ax * 6) * U).toFixed(2) + 'px,' + ((3 + 7 * lift - S.ay * 6) * U).toFixed(2) + 'px) scale(' + (1 + 0.03 * lift).toFixed(4) + ')';
    drawWaves();
  }

  if (!still) plan();
  measure();
  lastW = window.innerWidth;
  var clock = 0;
  function relayout() { measure(); render(clock); }
  window.addEventListener('resize', function () { if (window.innerWidth !== lastW) { lastW = window.innerWidth; relayout(); } });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);
  window.addEventListener('load', relayout);

  // The picture shows once the page's font is in (or after 0.8 seconds at
  // most), laid out in that font, so nothing reflows or jumps; its clock
  // starts then too.
  var shown = false;
  function show(then) {
    if (shown) return;
    shown = true;
    relayout();
    requestAnimationFrame(function () { stage.classList.add('orb-ready'); if (then) then(); });
  }
  function whenReady(then) {
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { show(then); });
      setTimeout(function () { show(then); }, 800);
    } else show(then);
  }

  if (still) {
    clock = END;
    whenReady(function () { render(END); });
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
  whenReady(function () {
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
  });
})();
