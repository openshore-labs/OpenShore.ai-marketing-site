# OpenShore.ai marketing site

Standalone marketing site for **OpenShore**, deployed at **openshore.ai**.

Eleventy (11ty) static build, no framework. Content lives in `src/_data/`
(`site.js` for the site shell, `oscode.js` for all product copy and the
checkout config); templates in `src/_includes/base.njk` and `src/index.njk`;
static assets pass through verbatim from `src/static/`.

This page used to live at `openshore.ai/os-code/`, a subpage of
`openshore-labs/Open-Shore-LLC-Homepage` (now `openshorellc.com`, the Open
Shore, LLC corporate site). It moved here so `openshore.ai` can be a
dedicated, standalone site for the product, at the site's root (`/`). See
`_redirects` and "Runtime and keys" below for what that move touches.

## Layout: OpenShore for Enterprise at the root (2026-11-16)

The founder repositioned the site on 2026-11-16:

- `openshore.ai/` is **OpenShore for Enterprise**, a page for design partners
  (`src/index.njk`, the light frame `ent-layout.njk`), word for word the page
  that sat at `/enterprise/` (founder: a one-to-one replica). `/about/` itself 301s to
  `/os-code/` (the pages under it stay). `/enterprise/` 301s to `/`;
  the platform page, the tour and the promo film keep their addresses.
- OpenShore for Enterprise has its own **Privacy Policy** (`/privacy/`),
  **Terms of Use** (`/terms/`) and **Support** (`/support/`), on the same
  frame (`src/ent-privacy.njk`, `ent-terms.njk`, `ent-support.njk`), linked
  from its footer. They cover the Enterprise pages and design-partner email,
  not a product. Each claim matches the code: the one cookie is the invited
  guests' sign-in (`worker/enterpriseAccess.js`), and the two film pages load
  Google Fonts. Change the policy with either. Until 2026-11-16 these
  addresses redirected to the personal product's pages, so App Store
  Connect's privacy and support URLs must name `/os-code/privacy/` and
  `/os-code/support/`.
- `openshore.ai/os-code/` is **OS Code by OpenShore**, the free personal
  coding agent (`src/os-code.njk`, the dark frame `base.njk`), always by its
  full name on the site. Every page of it sits under `/os-code/`: its tabs
  (`/os-code/llm-choice/`, `/os-code/sustainability/`, `/os-code/ethics/`,
  `/os-code/self-hosting/`), its privacy policy (`/os-code/privacy/`), terms
  (`/os-code/terms/`) and support (`/os-code/support/`). They were under
  `/about/` until 2026-11-16 and at the root before that; `/about/...` and
  the old tab addresses 301 here. These are the personal product's own: OpenShore for Enterprise
  will get its own policy and terms. `/oscode/` 301s to `/os-code/`. Stripe's
  return addresses (`/os-code/?checkout=success`) land on this page directly.
- The web app (the OpenShore.ai app in a browser) is at
  **`openshore.ai/os-code/app/`**. Its bundle sits in `src/webapp/` and
  passes through to that folder. Do not edit it here: it is built from
  `openshore.code.ai/app` (`pnpm build:web`, base `/os-code/app/`) and
  committed by that repo's **Publish web app** workflow
  (`.github/workflows/web.yml`). Its service worker is scoped to its folder.
  `/sw.js` at the root retires the worker the app registered there while it
  lived at `/` (2026-11-07 to 2026-11-16).
- `/auth-callback` stays at the root, the address the account backend
  allows: the Worker answers it with the app's page from `/os-code/app/`
  (`worker/appShell.js`), so an emailed sign-in link returns into the app.
- Every page carries one foot line to `/os-code/` (`_includes/sitefoot.njk`).
- `/sign-in/continue/`, `/download/<platform>` and `/os-code/catalog*.json`
  keep their addresses; live clients use them.
- The copy gate (`scripts/check-copy.mjs`) skips the app's `assets/`: that is
  not this site's copy, and the app's own em-dash test holds its source. The
  founder's tagline is the one em dash it lets through, on `/` and the films.

## Build

```
npm ci
npm run build     # eleventy -> _site, then the em-dash copy gate
npm run serve     # local dev server
```

## Deploy — Cloudflare Pages

Same pattern as the sibling repos: zero repo secrets (GitHub App OAuth, no
deploy key), DNS + TLS + cache live in one pane.

1. Cloudflare → **Workers & Pages → Create → Pages** → connect this repo.
   Build command `npm run build`, output directory `_site`.
2. **Custom domains** → add `openshore.ai` and `www.openshore.ai`; Cloudflare
   auto-creates the proxied DNS records and provisions TLS.
3. Pick a canonical host and 301 the other (redirect rule). SSL/TLS mode
   **Full (strict)**, **Always Use HTTPS** on.
4. **Security headers** via a Cloudflare Transform Rule (response headers):
   `Content-Security-Policy: frame-ancestors 'none'`,
   `X-Content-Type-Options: nosniff`,
   `Strict-Transport-Security: max-age=31536000; includeSubDomains`.
   (Fetchable CSP directives are also set as a `<meta>` in `base.njk`;
   framing/transport directives only work as real headers.)
5. `openshore.ai` (and `www`) must first be **removed as a custom domain from
   the `Open-Shore-LLC-Homepage` Pages project** — a domain can only be
   attached to one Pages project at a time.

## Download buttons (`/download/<platform>`)

The desktop tiles' Download buttons point at `/download/windows`,
`/download/linux`, `/download/linux-deb`, `/download/mac`, and
`/download/mac-intel` on this site. The static files are always served first;
only those paths (which have no file behind them) run the site's one script,
`worker/index.js` (wired as `main` in `wrangler.jsonc`). It answers with a
302 to the newest openshore-releases release file for that platform, so the
click downloads on the spot. Release file names carry the version and a Mac
build can land after Linux and Windows, so each platform takes the newest
release that actually has its file (`worker/downloads.js`, tested by
`npm test`). The release list is cached for ten minutes; any failure sends
the person to the releases page. An optional `GITHUB_TOKEN` Worker secret
lifts GitHub's anonymous rate limit; the cache makes it unnecessary today.

## Runtime and keys

The page carries a small client runtime (`src/static/openshore-app.js`) for
sign-in and Stripe checkout. It talks to Supabase from the browser using two
**public** values, both kept in one place (`src/_data/oscode.js`, `checkout`):

- `supabaseUrl` - the project's public REST/Auth origin. It is also the single
  source for the CSP `connect-src` in `base.njk`, so the policy can never
  drift from the endpoint the client actually calls.
- `publishableKey` - the Supabase **publishable/anon** key. Public by design:
  row-level security, not key secrecy, protects the data.

This is the same Supabase project (`lzlrlfdffwiypzreoldb`) the OpenShore app
itself talks to (`openshore.code.ai/app`, `VITE_SUPABASE_URL`) and the same
project whose edge functions (`openshore.code.ai/supabase/functions`) own
Stripe checkout/portal and the entitlement writes.

There are no service-role keys, no `STRIPE_SECRET_KEY`, no Cloudflare tokens
in this repo. Every real secret lives only in the Supabase edge-function
secrets. Keep it that way: only public, RLS-guarded values ever ship here.

`src/static/os-code/catalog.json` is the OpenShore model marketplace catalog,
published here by the `Publish model catalog` GitHub Actions workflow in
`openshore.code.ai` (`.github/workflows/catalog.yml`), which the app's
`config.catalog.url` default (`https://openshore.ai/os-code/catalog.json`)
expects at exactly this path. Do not move or rename it without updating both
that workflow and the app's default.

The Stripe checkout/portal edge functions still default their return URLs to
`openshore.ai/os-code/`, which is the OS Code by OpenShore page again
(2026-11-16), so they need no redirect.
