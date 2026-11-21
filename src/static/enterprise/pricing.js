// The price calculator on Pricing (founder, 2026-11-21). Reveals the team
// size slider and bot buttons, and redraws the bill: free up to the free
// seat count, then every seat at the seat rate, plus each bot. Rates come
// from the figure's data-* attributes so the page's markup stays the one
// place prices are written. Without this script the bill stays the still
// 20-person example.
(function () {
  'use strict';
  var root = document.querySelector('[data-calc]');
  if (!root) return;
  var fig = root.querySelector('.ill-bill');
  var ctl = root.querySelector('[data-calc-ctl]');
  var input = root.querySelector('[data-in-n]');
  var botBtns = root.querySelectorAll('[data-bots]');
  var dots = root.querySelector('[data-dots]');
  var icons = root.querySelector('[data-bots-icons]');
  var mark = icons.innerHTML;
  var SEAT = +fig.getAttribute('data-seat');
  var FREE = +fig.getAttribute('data-free');
  var BOT = +fig.getAttribute('data-bot');
  var q = function (s) { return root.querySelector(s); };
  var money = function (v) { return '$' + v.toLocaleString('en-US'); };
  var bots = 1;
  var shownDots = -1;
  var shownBots = 1;

  function draw() {
    var n = Math.max(2, Math.min(300, parseInt(input.value, 10) || 2));
    var people = n === 1 ? '1 person' : n + ' people';
    var free = n <= FREE;
    var ws = free ? 0 : n * SEAT;
    var bt = bots * BOT;
    var total = ws + bt;
    q('[data-out-n]').textContent = people;
    input.setAttribute('aria-valuetext', people);
    q('[data-l-n]').textContent = people;
    q('[data-l-rate]').textContent = free ? 'Free up to ' + FREE + ' people' : '× ' + money(SEAT) + ' a month';
    q('[data-v-n]').textContent = free ? 'Free' : money(ws);
    q('[data-l-b]').textContent = bots === 1 ? '1 bot' : bots + ' bots';
    q('[data-v-b]').textContent = money(bt);
    q('[data-v-t]').textContent = money(total);
    // One dot a person up to 50; past that, one dot for every five.
    var want = n <= 50 ? n : Math.ceil(n / 5);
    if (want !== shownDots) {
      var html = '';
      for (var i = 0; i < want; i++) html += '<i></i>';
      dots.innerHTML = html;
      dots.classList.toggle('ill-people--scaled', n > 50);
      shownDots = want;
    }
    if (bots !== shownBots) {
      var b = '';
      for (var k = 0; k < bots; k++) b += mark;
      icons.innerHTML = b;
      icons.setAttribute('data-n', String(bots));
      shownBots = bots;
    }
    fig.setAttribute('aria-label', 'The bill for ' + people + ' and ' + (bots === 1 ? 'one bot' : bots + ' bots') + ': workspace ' + (free ? 'free' : money(ws)) + ', bots ' + money(bt) + ', ' + money(total) + ' a month, plus the one-time $5,000 setup.');
  }

  // Once someone touches the controls, the entrance animation is done with:
  // the bill updates in place rather than replaying.
  function live() { fig.classList.add('is-live'); }

  input.addEventListener('input', function () { live(); draw(); });
  Array.prototype.forEach.call(botBtns, function (btn) {
    btn.addEventListener('click', function () {
      bots = +btn.getAttribute('data-bots');
      Array.prototype.forEach.call(botBtns, function (o) { o.setAttribute('aria-pressed', String(o === btn)); });
      live();
      draw();
    });
  });
  ctl.hidden = false;
})();
