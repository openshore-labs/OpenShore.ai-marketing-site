// Tells Bing (which ChatGPT search and Copilot read from), Yandex, Seznam and
// Naver that openshore.ai's pages changed, through IndexNow, so they re-crawl
// now instead of on their own schedule (2026-11-21: ChatGPT was still quoting
// the site from before the 2026-11-16 relaunch). Google does not take IndexNow;
// for Google (and so Gemini) submit the sitemap in Search Console.
//
// Run it after a deploy is live, never before: the engines fetch the key file
// below from the live site to prove the ping comes from the site's owner.
//
//   npm run indexnow                 every URL in the sitemap
//   npm run indexnow -- / /pricing/  only these paths
//
// The key is public by design (it is served at the site root); it is not a
// secret. To rotate it, rename src/static/<key>.txt and change KEY together.
import { readFileSync } from 'node:fs';

const HOST = 'openshore.ai';
const KEY = '7f5e3fec076f4fe7836c2b18514ab07a';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

const args = process.argv.slice(2);
const urls = args.length
  ? args.map((p) => new URL(p, `https://${HOST}`).href)
  : [...readFileSync('src/static/sitemap.xml', 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const live = await fetch(KEY_LOCATION);
const body = live.ok ? (await live.text()).trim() : '';
if (body !== KEY) {
  console.error(`indexnow: ${KEY_LOCATION} does not serve the key yet (HTTP ${live.status}). Deploy first, then run this.`);
  process.exit(1);
}

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: urls }),
});
// 200 and 202 both mean accepted (202: key validation still pending).
console.log(`indexnow: HTTP ${res.status} for ${urls.length} URL(s)`);
if (res.status !== 200 && res.status !== 202) {
  console.error(await res.text());
  process.exit(1);
}
