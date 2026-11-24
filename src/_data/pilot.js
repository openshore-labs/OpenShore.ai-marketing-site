// The free-setup offer for design partners (founder, 2026-11-24): the first
// 15 design partners pay no setup fee, stay or leave; from the 16th, the
// $5,000 setup applies as before (paid at install, credited against the
// first year if they stay, kept for the setup work if they leave at day 90).
//
// When a design partner signs, raise `taken` by one and redeploy. The pages
// show how many free spots are left only once the first one is taken
// (founder: "show spots left after the first one"). Once all are taken, the
// pages go back to the $5,000 terms and the button drops "free".
const spots = 15;
const taken = 0;

export default {
  spots,
  taken,
  left: Math.max(0, spots - taken),
  open: taken < spots,
  showCount: taken >= 1 && taken < spots,
  setupFee: "$5,000",
  // The main button, on the home page hero and floating on every page.
  button: taken < spots ? "Apply for a free pilot" : "Apply for a pilot",
};
