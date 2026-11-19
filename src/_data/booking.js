// Where every "Book a call" goes (founder, 2026-11-18). With a booking page
// set in site.js (bookingUrl), it opens there in a new tab; until then it
// opens an email to the founder asking for a time, so the button always
// works. A link only: nothing from a booking service loads on this site.
import site from "./site.js";

const subject = encodeURIComponent("A call about OpenShore");
const body = encodeURIComponent(
  "Hi Jack,\n\nI'd like to set up a 20-minute call about OpenShore. A few times that work for me:\n\n",
);

export default site.bookingUrl
  ? { href: site.bookingUrl, attrs: ' target="_blank" rel="noopener"', external: true }
  : { href: `mailto:${site.enterpriseContact}?subject=${subject}&body=${body}`, attrs: "", external: false };
