// The floating design partner button (founder, 2026-11-20). It sits at the
// bottom of every page and goes to the offer at the foot of Pricing. While
// the offer itself is on screen it steps aside, since the reader is already
// there. Without this script it stays put.
(function () {
  'use strict';
  var btn = document.querySelector('[data-float]');
  if (!btn) return;
  var spots = document.querySelectorAll('[data-float-spot]');
  if (!spots.length || !('IntersectionObserver' in window)) {
    btn.classList.remove('is-off');
    return;
  }
  var showing = [];
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var i = showing.indexOf(e.target);
      if (e.isIntersecting && i < 0) showing.push(e.target);
      if (!e.isIntersecting && i >= 0) showing.splice(i, 1);
    });
    btn.classList.toggle('is-off', showing.length > 0);
  });
  Array.prototype.forEach.call(spots, function (s) { io.observe(s); });
})();
