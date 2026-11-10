// Copy gate: no em dash (U+2014) in anything a customer reads. OpenShore's
// sibling repos (uki-audio, Open-Shore-LLC-Homepage, openshore.code.ai) all
// run this same guard; this repo carries it forward for consistency.
//
// It scans the BUILT output (_site), not source, on purpose: the rendered HTML,
// JS, and CSS are exactly what ships to a browser, with code comments already
// stripped, so a legitimate em dash in a source comment (ops notes) never trips
// it and a real one in customer copy always does. Wired into `npm run build`
// (eleventy && npm run check:copy), so a violation fails the build and the
// previous deploy keeps serving. House rule: use a period, a comma, the middle
// dot for label pairs, or a rewrite. Never soften this scanner to pass; fix the
// copy. Emergency door: SKIP_COPY_CHECK=1.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

if (process.env.SKIP_COPY_CHECK === '1') {
  console.log('check:copy skipped (SKIP_COPY_CHECK=1). Routine use means the scanner needs a fix, not the rule.');
  process.exit(0);
}

const ROOT = '_site';
const EM_DASH = '—';
const EXTS = new Set(['.html', '.js', '.css']);

let siteExists = true;
try {
  siteExists = statSync(ROOT).isDirectory();
} catch {
  siteExists = false;
}
if (!siteExists) {
  console.error(`check:copy: ${ROOT}/ not found. Run "npm run build" first (it runs this for you).`);
  process.exit(1);
}

// The web app's bundle (src/webapp, passed through to _site/assets) is not
// this site's copy: it is built from openshore.code.ai/app, whose own
// em-dash test holds every line of its source, and the minified bundle also
// carries third-party library code (the Anthropic SDK's error strings) and
// the app's own dash-replacing code, where the character is the point. So
// the scan skips what the web app publishes and nothing else. Its
// index.html, at the root, is still scanned.
const WEB_APP_DIRS = new Set([join(ROOT, 'assets'), join(ROOT, 'app-icons')]);
// The two OpenShore for Enterprise films (/enterprise/promo/ and /enterprise/tour/)
// show the founder's locked tagline, "Every Team (em dash) Every Agent. Working as
// One.", exactly as written (founder, 2026-11-10: taglines do not change). Only that
// line is allowed through, and only on those two pages; any other em dash there fails.
const FILM_PAGES = new Set([join(ROOT, 'enterprise', 'promo', 'index.html'), join(ROOT, 'enterprise', 'tour', 'index.html')]);
const TAGLINE = /Every Team \u2014 Every Agent\.|>\u2014<\/span>/g;

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (WEB_APP_DIRS.has(p)) continue;
    const s = statSync(p);
    if (s.isDirectory()) out.push(...walk(p));
    else if (EXTS.has(p.slice(p.lastIndexOf('.')))) out.push(p);
  }
  return out;
}

const violations = [];
for (const file of walk(ROOT)) {
  const film = FILM_PAGES.has(file);
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((raw, i) => {
    const line = film ? raw.replace(TAGLINE, (m) => m.replace(EM_DASH, '-')) : raw;
    let col = line.indexOf(EM_DASH);
    while (col !== -1) {
      violations.push({ file, line: i + 1, col: col + 1, text: line.trim().slice(0, 100) });
      col = line.indexOf(EM_DASH, col + 1);
    }
  });
}

if (violations.length > 0) {
  console.error(`check:copy FAILED: ${violations.length} em dash(es) in customer-facing output.\n`);
  for (const v of violations) {
    console.error(`  ${v.file}:${v.line}:${v.col}  ${v.text}`);
  }
  console.error('\nReplace each em dash with a period, comma, the middle dot for a label pair, or a rewrite.');
  process.exit(1);
}

console.log('check:copy passed: no em dashes in customer-facing output.');
