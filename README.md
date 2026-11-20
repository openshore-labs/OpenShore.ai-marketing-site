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

## Layout: OpenShore at the root (2026-11-16)

The founder repositioned the site on 2026-11-16:

- `openshore.ai/` is **OpenShore**, a page for design partners
  (`src/index.njk`, the light frame `ent-layout.njk`), word for word the page
  that sat at `/enterprise/` (founder: a one-to-one replica). `/about/` itself 301s to
  `/os-code/` (the pages under it stay). `/enterprise/` 301s to `/`;
  the platform page, the tour and the promo film keep their addresses.
- Under the Enterprise header sit three tabs (`src/_data/entTabs.js`):
  **Solutions** (`/`), **Product Tour** (the gated platform page) and **Grow
  with Us** (`/grow-with-us/`, `src/grow-with-us.njk`). The Worker's sign-in
  page draws the same tabs. Grow with Us reads its words from
  `src/_data/growWithUs.js`: the mission, the principles from the business
  plan's appendix and the founder's profile and photo
  (`src/static/enterprise/founder.jpg`); an empty section is left off.
- OpenShore has its own **Privacy Policy** (`/privacy/`),
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
  the old tab addresses 301 here. These are the personal product's own: OpenShore
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

## Design partners, security and the call link (2026-11-18)

- The product is just **OpenShore** (founder, 2026-11-18): no "for
  Enterprise" in titles, labels or copy. The two films keep their animated
  "for Enterprise, then for Startups" beat until they are re-cut.
- The home page carries a **Security and privacy** section
  (`_includes/ent-security.njk`) right after the commission demo, and a
  trust line under the hero buttons. Each card states a rule from the
  product's design; no certifications are claimed.
- The design partner offer sits in the closing section (revised
  2026-11-18): a 90-day pilot with no OpenShore fee, a one-time $5,000
  setup credited against the first year if the partner stays, then a
  founding price of $500 a bot per month locked for two years, or they
  leave. In return: a signed agreement, a sponsor, an owner and a technical
  contact, a dedicated cloud account, past commission statements to test
  against, and a review every two weeks. The Pricing section states the
  list prices up front ($8 a person per month, free up to 10; $500 a bot per
  month; $5,000 setup). These match the Design Partner Program doc and the
  business plan; change them together. Spelled out on 2026-11-19 after a
  cold read: the setup is paid at install and is kept if the partner leaves
  at day 90; the founding price is today's list price held for two years
  (not a discount); the technical contact need not be an engineer.

## Home page focus (2026-11-19, settled 2026-11-20)

- The hero: the turning ring of TEAM, AI, AGENTS and APPS with the mark
  surfacing in it (`static/enterprise/orbit.js`), the headline "The
  operating platform for growing startups" in sentence case (its
  screen-reader span carries the rest of the sentence), then "OpenShore is
  the operating platform for growing companies." No visible subhead.
- The status pill in the header reads "Piloting now. Design with us." on
  every page and the product tour's sign-in page. It stands still (no
  ticker) and is never cut off: on a narrow phone each sentence takes its
  own line.
- The home page plays one worked example, the commission fix (the job the
  pilot starts with), with no tab row, then "More bots, one per part of the
  business", one line each (`more` in `src/_data/entDemos.js`). All five
  examples play, behind tabs, in the product tour's Workers section.
  `ent-demos.njk` takes `demoIds` to choose.
- The setup box keeps the title "No CTO or CIO needed" and names the
  technical contact: whoever holds the cloud and admin accounts today, often
  an operator, not an engineer.
- Why we build it (the Greiner chart) left the home page for About, where it
  comes first: Why we build it (the problem), Our mission (the answer),
  Growth principles (how we work), The founder (who leads it). `charts.js`
  loads on About only. The illustrative cost chart is gone; its point is one
  sentence before "That gap is why we build OpenShore", and the source note
  ends "The OpenShore paths show where we come in."
- Every why line carries a checked figure: the inventory study is described
  by its size (nearly 370,000 records, 37 stores), and the analytics line
  carries the carriers' 5.9% average 2026 rate rise.
- The setup term: the $5,000 setup is paid when we install, credited against
  the first year if the partner stays, and covers the setup work if they
  leave at day 90. "At our cost" is now "with no OpenShore fee".
- The founder's tenure, on Pricing and About: more than 15 years in
  operations, the last 10 building the revenue operations, planning and AI
  systems behind businesses as large as $200B at Amazon, AWS and Microsoft.
- Support access (founder, 2026-11-18): privacy first, but OpenShore needs
  to maintain and improve each install. By default it sees service telemetry
  (errors, uptime, versions) with no customer content; the term was chosen
  on 2026-11-20 so it never reads as medical data.
  Deeper access is with the customer's permission, limited to that task,
  logged, and revocable; data is never sold or used to train AI models. It
  appears in the Security section, the design partner guardrails, the
  platform page's trust list and the privacy policy. The product
  (openshore.enterprise) must enforce it.
- Applying is by email for now. A three-question form and a Book a call
  link are built and deferred (founder, 2026-11-18) on the
  `site-form-and-calendar` branch.
- The OS Code by OpenShore foot line is off the OpenShore pages.
- `static/enterprise/commission.js` plays each worked example on its own
  clock and runs the tabs where there is more than one; without it every
  panel shows, still and complete.

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
