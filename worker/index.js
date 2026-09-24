// openshore.ai's one piece of server code. Everything else is the static
// Eleventy build, served first by Workers Static Assets; only a path with no
// file behind it reaches this script, and it handles one thing:
//
//   /download/<platform>  ->  302 to the newest release file for it
//
// so a "Download" button starts the download right there instead of sending
// the person to GitHub to find the right file (worker/downloads.js has the
// rules). The release list is cached for ten minutes per location, so GitHub
// sees a handful of requests an hour however busy the page is. Anything that
// goes wrong (GitHub down, rate limited, no file yet) sends the person to the
// releases page instead, so a button never dead-ends.
//
// Optional: a GITHUB_TOKEN secret (a fine-grained token with no permissions,
// public repos only) lifts GitHub's anonymous rate limit. Not needed at this
// traffic with the cache.
import { PLATFORMS, RELEASES_PAGE, REPO, resolveDownload } from './downloads.js';

const CACHE_SECONDS = 600;

async function releases(env, ctx) {
  const api = `https://api.github.com/repos/${REPO}/releases?per_page=20`;
  const cache = caches.default;
  const key = new Request(api);
  const hit = await cache.match(key);
  if (hit) return hit.json();
  const headers = {
    accept: 'application/vnd.github+json',
    'user-agent': 'openshore.ai-downloads',
  };
  if (env.GITHUB_TOKEN) headers.authorization = `Bearer ${env.GITHUB_TOKEN}`;
  const res = await fetch(api, { headers });
  if (!res.ok) throw new Error(`GitHub answered ${res.status}`);
  const body = await res.text();
  ctx.waitUntil(
    cache.put(
      key,
      new Response(body, {
        headers: {
          'content-type': 'application/json',
          'cache-control': `public, max-age=${CACHE_SECONDS}`,
        },
      }),
    ),
  );
  return JSON.parse(body);
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const m = /^\/download\/([a-z-]+)\/?$/.exec(url.pathname);
    if (!m || !(m[1] in PLATFORMS)) return env.ASSETS.fetch(request);
    let target = RELEASES_PAGE;
    try {
      target = resolveDownload(await releases(env, ctx), m[1]) || RELEASES_PAGE;
    } catch (err) {
      // Fall through to the releases page; the reason shows in the Worker logs.
      console.error('[download]', m[1], err instanceof Error ? err.message : String(err));
    }
    return new Response(null, {
      status: 302,
      headers: { location: target, 'cache-control': 'no-store' },
    });
  },
};
