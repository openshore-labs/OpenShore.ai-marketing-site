// Renders the platform page's product screens (src/static/enterprise/flow/report.jpg
// and dashboard.jpg) from the HTML in scripts/mockups/. Example data only.
//   node scripts/render-flow-mockups.mjs [report|dashboard]
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
// Playwright is not a project dependency; resolve it from the global install.
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require("playwright")); }
catch { ({ chromium } = require(require("node:child_process").execSync("npm root -g").toString().trim() + "/playwright")); }
const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(here, "..", "src/static/enterprise/flow");
const which = process.argv[2] ? [process.argv[2]] : ["report", "dashboard"];
const browser = await chromium.launch();
for (const name of which) {
  const page = await browser.newPage({ viewport: { width: 1600, height: 1200 }, deviceScaleFactor: 1.5 });
  await page.goto("file://" + path.join(here, "mockups", name + ".html"));
  await page.evaluate(() => document.fonts.ready);
  const el = page.locator("#shot");
  const box = await el.boundingBox();
  await el.screenshot({ path: path.join(out, name + ".jpg"), type: "jpeg", quality: 84 });
  console.log(name, Math.round(box.width) + "x" + Math.round(box.height));
}
await browser.close();
