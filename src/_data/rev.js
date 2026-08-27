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
  productCss: rev("src/static/openshore.css"),
};
