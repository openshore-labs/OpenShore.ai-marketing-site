// Asset fingerprints - content hashes of the same-origin CSS/JS, appended to
// their URLs as a `?v=` cache-buster. styles.css and openshore.css keep stable
// filenames, and Cloudflare's edge caches by full URL (query string included),
// so without this a CSS change ships new HTML that still points the edge at the
// OLD cached stylesheet - new markup, stale styles, broken layout. Hashing the
// URL means every change is a URL the edge has never seen, so it can't serve a
// stale copy. Recomputed each build; unchanged files keep the same hash.

import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";

function rev(path) {
  try {
    return createHash("sha1").update(readFileSync(path)).digest("hex").slice(0, 10);
  } catch (e) {
    return "0";
  }
}

export default {
  css: rev("src/static/styles.css"),
  appJs: rev("src/static/openshore-app.js"),
  siteJs: rev("src/static/site.js"),
  productCss: rev("src/static/openshore.css"),
  // The Open Graph card. Social scrapers (iMessage, Slack, X, Facebook) cache
  // the og:image by full URL, so a new card at the same path would keep showing
  // the old preview. Hashing it into a `?v=` means a refreshed card is a URL the
  // scraper has never seen, so the new preview wins.
  ogImage: rev("src/static/og-openshore.png"),
  // The launch film and its poster: a re-render ships as a URL the edge has
  // never seen.
  film: rev("src/static/film/openshore-film.mp4"),
  filmWebm: rev("src/static/film/openshore-film.webm"),
  filmPoster: rev("src/static/film/openshore-film-poster.jpg"),
  filmTitle: rev("src/static/film/openshore-film-title.jpg"),
  // The enterprise page (/enterprise/): its stylesheet and the two film posters.
  entCss: rev("src/static/enterprise/enterprise.css"),
  entPromoPoster: rev("src/static/enterprise/promo-poster.jpg"),
  entPartnerPdf: rev("src/static/enterprise/openshore-design-partner-program.pdf"),
  entTourPoster: rev("src/static/enterprise/tour-poster.jpg"),
  // The link-preview image for the Enterprise pages (2026-11-17): the film's
  // title frame without "for Startups".
  entOg: rev("src/static/enterprise/og-enterprise.jpg"),
  // The founder's photo on the About page, once it is added.
  entFounder: rev("src/static/enterprise/founder.jpg"),
  // The chart animation on the About page.
  entCharts: rev("src/static/enterprise/charts.js"),
  // The commission demo on the home page.
  entCommission: rev("src/static/enterprise/commission.js"),
  // The connections hub on the home page.
  entHub: rev("src/static/enterprise/hub.js"),
  // The tab row's scroll on a phone, on every page.
  entNav: rev("src/static/enterprise/nav.js"),
  // The illustrations on Pricing, Security and About.
  entIllus: rev("src/static/enterprise/illus.js"),
  entFloat: rev("src/static/enterprise/float.js"),
  // The price calculator on Pricing.
  entOrbit: rev("src/static/enterprise/orbit.js"),
};
