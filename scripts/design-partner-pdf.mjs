// Renders the Design Partner Program PDF (founder, 2026-11-24) from
// src/_data/partnerProgram.js, in the site's own type and colours, to
// src/static/enterprise/openshore-design-partner-program.pdf.
//
//   npm run pdf:partners
//
// Needs Playwright with Chromium (not a dependency of the site build; the
// PDF is committed). Re-run it whenever the program, the prices or the
// free-setup count (src/_data/pilot.js) change, and commit the new PDF.
import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import program from "../src/_data/partnerProgram.js";
import site from "../src/_data/site.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "src/static/enterprise/openshore-design-partner-program.pdf");
const font = (f) => readFileSync(join(root, "src/static/fonts", f)).toString("base64");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const mark = (size, tile = "#1c2a33", line = "#f6f4ef") => `<svg viewBox="0 0 32 32" width="${size}" height="${size}" aria-hidden="true"><rect width="32" height="32" rx="7.5" fill="${tile}"/><g transform="translate(0 -0.81)"><line x1="7" y1="13" x2="25" y2="13" stroke="${line}" stroke-width="2" stroke-linecap="round"/><path d="M7 19q4.5-3.3 9 0t9 0" fill="none" stroke="#4b90a3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g></svg>`;
const list = (items) => `<ul class="checks">${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;
const foot = (n) => `<footer><span>${mark(14)} OpenShore · ${esc(program.title)}</span><span>${n}</span></footer>`;

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>OpenShore ${esc(program.title)}</title><style>
@font-face { font-family: Inter; font-weight: 100 900; src: url(data:font/woff2;base64,${font("inter-standard.woff2")}) format("woff2"); }
@font-face { font-family: Fraunces; font-weight: 100 900; src: url(data:font/woff2;base64,${font("fraunces-standard.woff2")}) format("woff2"); }
@page { size: Letter; margin: 0; }
:root { --paper: #f6f4ef; --raised: #fcfbf7; --ink: #1c2a33; --ink-soft: #4a5961; --muted: #606a6f; --sea: #2f5a66; --wave: #4b90a3; --rule: rgba(28, 42, 51, 0.12); }
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { font-family: Inter, sans-serif; color: var(--ink); -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.page { width: 8.5in; height: 11in; padding: 0.8in 0.8in 0.6in; background: var(--paper); position: relative; display: flex; flex-direction: column; gap: 22px; page-break-after: always; overflow: hidden; }
.page:last-child { page-break-after: auto; }
footer { position: absolute; left: 0.8in; right: 0.8in; bottom: 0.45in; display: flex; justify-content: space-between; align-items: center; font-size: 9.5px; color: var(--muted); border-top: 1px solid var(--rule); padding-top: 10px; }
footer span { display: inline-flex; align-items: center; gap: 6px; }
.eyebrow { font-size: 10.5px; font-weight: 650; letter-spacing: 0.16em; text-transform: uppercase; color: var(--sea); }
h2 { font-size: 22px; line-height: 1.2; letter-spacing: -0.015em; font-weight: 650; }
p { font-size: 13.5px; line-height: 1.55; color: var(--ink-soft); }
.checks { list-style: none; display: flex; flex-direction: column; gap: 8px; }
.checks li { position: relative; padding-left: 20px; font-size: 12.5px; line-height: 1.5; color: var(--ink-soft); }
.checks li::before { content: ""; position: absolute; left: 2px; top: 0.42em; width: 9px; height: 5px; border-left: 1.8px solid var(--wave); border-bottom: 1.8px solid var(--wave); transform: rotate(-45deg); }
section { display: flex; flex-direction: column; gap: 10px; }

/* Cover */
.cover { background: var(--ink); color: var(--paper); justify-content: space-between; padding: 0.9in 0.85in 0.75in; }
.brand { display: flex; align-items: center; gap: 16px; }
.brand b { font-family: Fraunces, serif; font-weight: 500; font-size: 40px; letter-spacing: -0.01em; }
.cover h1 { font-size: 44px; line-height: 1.08; letter-spacing: -0.025em; font-weight: 650; margin-top: 18px; }
.cover .for { font-size: 16px; color: #c9d3d4; margin-top: 14px; max-width: 30em; line-height: 1.5; }
.glance { list-style: none; display: flex; flex-direction: column; gap: 12px; margin-top: 30px; }
.glance li { position: relative; padding-left: 28px; font-size: 18px; color: #d5dcdc; }
.glance li b { color: var(--paper); font-weight: 650; }
.glance li::before { content: ""; position: absolute; left: 3px; top: 0.36em; width: 12px; height: 6.5px; border-left: 2.2px solid #9ccbd8; border-bottom: 2.2px solid #9ccbd8; transform: rotate(-45deg); }
.badge { display: inline-flex; align-items: center; gap: 9px; padding: 6px 13px; border-radius: 999px; background: rgba(127, 184, 200, 0.16); color: #9ccbd8; font-size: 12px; font-weight: 600; width: max-content; }
.badge i { width: 7px; height: 7px; border-radius: 50%; background: currentColor; }
.cover-foot { display: flex; justify-content: space-between; align-items: flex-end; font-size: 12px; color: #aab7b9; border-top: 1px solid rgba(246, 244, 239, 0.14); padding-top: 16px; }
.cover-foot b { color: var(--paper); font-weight: 600; }

/* Inner pages */
.what { font-size: 17px; line-height: 1.5; color: var(--ink); font-weight: 500; }
.agents { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.agent { background: var(--raised); border-radius: 12px; padding: 12px 14px; box-shadow: 0 0 0 1px var(--rule); }
.agent b { display: flex; align-items: center; gap: 7px; font-size: 13.5px; }
.agent span { display: block; font-size: 12px; line-height: 1.45; color: var(--ink-soft); margin-top: 4px; }
.steps { list-style: none; display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; counter-reset: s; }
.steps li { font-size: 12px; line-height: 1.45; background: var(--raised); border-radius: 12px; padding: 14px; box-shadow: 0 0 0 1px var(--rule); counter-increment: s; }
.steps li::before { content: counter(s); display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; border-radius: 50%; background: var(--sea); color: var(--paper); font-size: 11px; font-weight: 650; margin-bottom: 8px; }
.steps b { display: block; font-size: 13.5px; margin-bottom: 4px; }
.steps span { color: var(--ink-soft); }
.cols { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.card { background: var(--raised); border-radius: 14px; padding: 16px 18px; box-shadow: 0 0 0 1px var(--rule); display: flex; flex-direction: column; gap: 10px; }
.card h3 { font-size: 10.5px; font-weight: 650; letter-spacing: 0.16em; text-transform: uppercase; color: var(--sea); }
.prices { border-top: 1px solid var(--rule); }
.prices div { display: flex; justify-content: space-between; gap: 20px; padding: 11px 0; border-bottom: 1px solid var(--rule); }
.prices b { display: block; font-size: 14px; }
.prices span { font-size: 12px; color: var(--muted); }
.prices em { font-style: normal; font-size: 14px; font-weight: 650; white-space: nowrap; text-align: right; }
.apply { background: var(--sea); color: var(--paper); border-radius: 16px; padding: 22px 24px; display: flex; flex-direction: column; gap: 8px; margin-top: auto; margin-bottom: 0.35in; }
.apply h2 { color: var(--paper); font-size: 20px; }
.apply p { color: #e4eef0; font-size: 13px; }
.apply a { color: #ffffff; font-weight: 650; }
</style></head><body>

<div class="page cover">
  <div>
    <div class="brand">${mark(52, "#f6f4ef", "#1c2a33")}<b>OpenShore</b></div>
    <h1>${esc(program.title)}</h1>
    <p class="for">${esc(program.for)}</p>
    <ul class="glance">${program.glance.map(([k, v]) => `<li><b>${esc(k)},</b> ${esc(v)}</li>`).join("")}</ul>
  </div>
  <div style="display:flex;flex-direction:column;gap:22px">
    <span class="badge"><i></i>Design partner pilots open</span>
    <div class="cover-foot"><span>${esc(program.edition)}</span><span><b>jack@openshore.ai</b> · openshore.ai</span></div>
  </div>
</div>

<div class="page">
  <section>
    <p class="eyebrow">What OpenShore is</p>
    <p class="what">${esc(program.what)}</p>
  </section>
  <section>
    <p class="eyebrow">The agents</p>
    <div class="agents">${program.agents.map(([n, d]) => `<div class="agent"><b>${mark(16)}${esc(n)}</b><span>${esc(d)}</span></div>`).join("")}<div class="agent"><b>${mark(16)}The one you need</b><span>Need an agent we don’t have yet? Design partners get it built with them.</span></div></div>
  </section>
  <section>
    <p class="eyebrow">How the pilot runs</p>
    <ol class="steps">${program.timeline.map(([k, v]) => `<li><b>${esc(k)}</b><span>${esc(v)}</span></li>`).join("")}</ol>
  </section>
  ${foot(2)}
</div>

<div class="page">
  <section>
    <p class="eyebrow">The terms</p>
    <h2>What you get, and what we ask.</h2>
  </section>
  <div class="cols">
    <div class="card"><h3>You get</h3>${list(program.youGet)}</div>
    <div class="card"><h3>We ask</h3>${list(program.weAsk)}</div>
  </div>
  <div class="card"><h3>Guardrails</h3>${list(program.guardrails)}</div>
  ${foot(3)}
</div>

<div class="page">
  <section>
    <p class="eyebrow">What it costs</p>
    <h2>A cost your CFO can approve.</h2>
    <p>During the pilot there is no monthly OpenShore fee, and your cloud and model bills come from your providers at cost. After day 90, if you stay:</p>
  </section>
  <div class="prices">${program.prices.map(([k, d, v]) => `<div><p><b>${esc(k)}</b><span>${esc(d)}</span></p><em>${esc(v)}</em></div>`).join("")}</div>
  <section>
    <p class="eyebrow">Who’s behind it</p>
    <p>${esc(program.founder)}</p>
  </section>
  <div class="apply">
    <h2>Apply for a pilot.</h2>
    <p>${esc(program.apply).replace("jack@openshore.ai", `<a href="mailto:${site.enterpriseContact}?subject=OpenShore%20design%20partner">${site.enterpriseContact}</a>`)}</p>
  </div>
  ${foot(4)}
</div>

</body></html>`;

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require("playwright")); }
catch { console.error("Playwright is needed: npm i -g playwright (or run where it is installed)."); process.exit(1); }
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(html, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
writeFileSync(out, await page.pdf({ format: "Letter", printBackground: true, preferCSSPageSize: true }));
await browser.close();
console.log("wrote", out.replace(root + "/", ""));
