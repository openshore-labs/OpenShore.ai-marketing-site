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

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) out.push(...walk(p));
    else if (EXTS.has(p.slice(p.lastIndexOf('.')))) out.push(p);
  }
  return out;
}

const violations = [];
for (const file of walk(ROOT)) {
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
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
