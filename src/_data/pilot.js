// The free-setup offer for design partners (founder, 2026-11-24; cut from 15
// to 5 on 2026-11-24): the first 5 design partners pay no setup fee, stay or
// leave; from the 6th, the
// $5,000 setup applies as before (paid at install, credited against the
// first year if they stay, kept for the setup work if they leave at day 90).
//
// When a design partner signs, raise `taken` by one, run
// `npm run pdf:partners` (the program PDF reads these terms), and redeploy. The pages
// show how many free spots are left only once the first one is taken
// (founder: "show spots left after the first one"). Once all are taken, the
// pages go back to the $5,000 terms.
import site from "./site.js";

const spots = 5;
const taken = 0;

// The main button opens an email to the founder (2026-11-24), with a few
// lines to fill in. It used to go to the offer at the foot of Pricing.
const subject = "Design partner: OpenShore demo";
const body = [
  "Hi Jack,",
  "",
  "We'd like to become a design partner and book a demo of OpenShore.",
  "",
  "Company:",
  "Team size:",
  "The first job we'd hand an agent:",
  "",
].join("\n");

export default {
  spots,
  taken,
  left: Math.max(0, spots - taken),
  open: taken < spots,
  showCount: taken >= 1 && taken < spots,
  setupFee: "$5,000",
  // The main button, on the home page hero and floating on every page
  // (founder, 2026-11-24; "Apply for a free pilot" before that).
  button: "Become a design partner. Book a demo.",
  buttonHref: `mailto:${site.enterpriseContact}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
};
