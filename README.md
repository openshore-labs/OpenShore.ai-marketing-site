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
  that sat at `/enterprise/` (founder: a one-to-one replica). `/about/` is OpenShore's
  About page; the old pages under it 301 to `/os-code/`. `/enterprise/` 301s to `/`;
  the platform page, the tour and the promo film keep their addresses.
- Under the Enterprise header sit the tabs (`src/_data/entTabs.js`):
  **Overview** (`/`), **Product Tour** (the platform page, public since 2026-11-20),
  **Pricing**, **Security** and **About** (`/about/`, `src/about.njk`;
  `/grow-with-us/` 301s to it). The Worker's old sign-in
  page (unrouted since 2026-11-20) draws the same tabs. About reads its words from
  `src/_data/growWithUs.js`: the mission, the principles from the business
  plan's appendix and the founder's profile and photo
  (`src/static/enterprise/founder.jpg`); an empty section is left off.
- OpenShore has its own **Privacy Policy** (`/privacy/`),
  **Terms of Use** (`/terms/`) and **Support** (`/support/`), on the same
  frame (`src/ent-privacy.njk`, `ent-terms.njk`, `ent-support.njk`), linked
  from its footer. They cover the Enterprise pages and design-partner email,
  not a product. Each claim matches the code: the pages set no cookies (the
  tour's sign-in, and its cookie, went on 2026-11-20), and the two film pages load
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
  Enterprise" in titles, labels or copy. On 2026-11-24 the founder took the
  animated "for Enterprise, then for Startups" beat out of both films too:
  their title cards read just "OpenShore" (hand patches, like "The way out").
- **Data Foundations is not an agent** (founder, 2026-11-24). It is the layer
  every agent works from; the tour lists the five agents and names Data
  Foundations beside them, never as a sixth.
- **The pricing row names the agents**: "Each Expert Agent" (capitalized), with the five
  listed, on Pricing and in the program PDF (founder, 2026-11-24).
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
  surfacing in it (`static/enterprise/orbit.js`), the headline "Grow your
  business, not your headcount." (founder, 2026-11-24, the consensus pick of
  three, after a friend's read took the site for a copilot with a
  self-hosted backend: the hook is the payoff, scaling without hiring the
  executives to build it; before that, briefly, "AI experts that already
  know the job.", and before that "AI agents working alongside your team.",
  "The operating platform for growing startups", then briefly "Operations
  run by AI agents. Your team focused on customers."), then the first
  paragraph, which says what it is: "AI agents built by domain experts to
  work alongside your teams in sales ops, finance, supply chain, and more.
  They share one context across every app you use and run on any AI model.
  All on a private server in your own cloud. Your data stays yours." (The last
  sentence added 2026-11-24, founder: the private cloud is a separator, so
  it belongs in the opening, in the Security section's own words.) (founder, 2026-11-24: the shared context across every app is
  the point to make, not "works with Slack or Teams", which Connections
  still lists.) The founder's bet: the hook is the agents running
  operations, and the one workspace wins people over once they use it, so
  the hero sells the agents and does not pitch the platform; the demos show
  it. The home page's description, the site's default description and the
  program PDF (`partnerProgram.js`) carry the same idea as a full sentence:
  "OpenShore gives your team AI agents built by domain experts for sales
  ops, finance, supply chain, and more, with one context across every app
  you use, so you grow your business, not your headcount." Keep them in step. No visible subhead.
- On a desktop (900px and wider, with a mouse; founder, 2026-11-24) the ring
  beside the headline is a fifth larger (`--orb-scale` in enterprise.css,
  read by orbit.js) and centred on the headline and paragraph, not the
  button. Both films, the home page's and the platform page's product tour,
  play in their windows as the page opens: muted, on a loop, with only Mute
  and Full screen (`static/enterprise/film-embed.js` loads each film with
  `?embed`, which the film pages handle; the page holds a film while it is
  scrolled out of sight). Phones, tablets and reduced motion keep the
  poster that opens the film full page.
- The status pill in the header reads "Piloting now. Design with us." on
  every page. It stands still (no
  ticker) and is never cut off: on a narrow phone each sentence takes its
  own line.
- The home page plays all five worked examples behind tabs, Sales ops first,
  under "AI agents that run your operations" (2026-11-24). The product tour
  no longer repeats them: its Agents section links to them (`/#bots-h`).
  `ent-demos.njk` takes `demoIds` to choose.
- The setup box keeps the title "No CTO or CIO needed" and names the
  technical contact: whoever holds the cloud and admin accounts today, often
  an operator, not an engineer.
- Why we build it (the Greiner chart) sits on the home page again since
  2026-11-21 (founder), just below Connections (after the bots and
  before Connections until later that day),
  with its copy cut to a few sentences. About now runs Our mission, Growth
  principles, The founder. `charts.js` loads on the home page only. The
  source note ends "The OpenShore paths show where we come in."
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

## Cold-read fixes (2026-11-24)

From a startup founder's recorded first visit:

- **The films have a way out.** On `/enterprise/tour/` and `/enterprise/promo/`
  the cursor used to hide 3 seconds after load and never come back, the only
  control (Play the film) sat bottom centre where screen-share bars cover it,
  and nothing led back. Each film now has a "Back to OpenShore" link top left,
  Escape leaves (to the page that opened it, else the platform page or `/`),
  and the cursor hides only while the film plays and the mouse is still. These
  are hand patches to the exported film pages: if a film is re-exported,
  re-apply them (search for "The way out").
- **The hero.** On a laptop the turning ring stands to the right of the
  headline (`.ent-hero-top`), so the film shows in the first screen; on a
  phone it stays above. A "Become a design partner" button is back under the
  first paragraph, the floating button's twin; the floating one steps aside
  while it is on screen.
- **The offer** at the foot of Pricing opens with four short checked lines
  instead of a paragraph, and the CFO line no longer repeats the terms.

Then, the same day (founder):

- **Agents, not bots.** One word everywhere: "agent" (no "bot", no
  "worker"). Each is named for its job in plain words: Sales ops agent (not
  "Sales agent", which reads as a person), Finance agent, Planning agent,
  Supply chain agent, Analytics agent. The two films carry the same words
  (hand patches to their visible text, like "The way out" above: re-apply
  them if a film is re-exported), and the sales example says
  "salesperson", not "rep".
- **Product tour: Any AI model.** "One chat" (shown in the film and the
  home page's demos) gave way to a section on the OpenShore Harness,
  OpenShore's own layer between the model and the team, which makes any
  capable large model work the same way: the same chats, agents and
  approvals. Describe only what the harness does; the founder confirms
  anything new. Each agent is its own harness inside the OpenShore Harness,
  contained and held to OpenShore's standards of quality and security,
  whatever the model (the Agents section); "Built to be trusted" opens with
  any model, no lock-in, and the harnesses lessening each model's
  volatility so agents stay steady (founder, 2026-11-24). The tour's poster (`tour-poster.jpg`) was recaptured from
  the film's title card (at 8 s, 1280 by 720 at 1.5x) so its chips say
  Agents.
- **All five agents on the home page**, behind tabs, Sales ops first (the job
  the pilot starts with). The one-line "More bots" list is gone. In the app
  frame every example shows the same four channels with its own lit.
- **Pricing is the price list alone.** The calculator (`ill-pricing.njk`,
  `pricing.js`) is removed.
- **Free setup for the first 5 design partners** (15 until the founder cut it
  on 2026-11-24), stay or leave; from the 6th, the $5,000 terms above apply. The count lives in
  `src/_data/pilot.js`: raise `taken` when a partner signs. Pages show
  "N of 5 left" only once the first is taken, and drop "free" (and the
  button's "free") once all 5 are. The main button reads "Apply for a free
  pilot". Update the Design Partner Program doc and business plan to match.
- **The program as a PDF.** The offer at the foot of Pricing keeps the
  summary (who it is for, four lines, how to apply) and links to
  `/enterprise/openshore-design-partner-program.pdf`, four branded pages:
  the agents, how the pilot runs, you get / we ask / guardrails, the costs
  and the founder. Its words live in `src/_data/partnerProgram.js`;
  `npm run pdf:partners` renders it in the site's own fonts and colours
  (needs Playwright with Chromium). Re-render and commit it whenever the
  program, the prices or `pilot.js` change.

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

## Search freshness: keeping Google, Bing and AI answers current (2026-11-21)

ChatGPT and Gemini answer from search indexes (Bing's, and Google's), not
from a live visit. The live site serves the current build to every crawler:
Cloudflare's AI-crawler blocking is off, robots.txt allows everything, and
Always Online is off. So when they quote old copy, the index is stale, and the
fix is to tell the engines the pages changed:

1. **Sitemap `lastmod`.** `src/static/sitemap.xml` carries a `lastmod` per
   page. When a page's visible copy changes, set its date to that day.
2. **IndexNow (Bing, ChatGPT search, Copilot).** After the deploy is live, run
   `npm run indexnow` (every sitemap URL) or `npm run indexnow -- /pricing/`.
   The key file `src/static/7f5e3fec076f4fe7836c2b18514ab07a.txt` proves
   ownership and must stay in place.
3. **Google (Gemini).** Google ignores IndexNow. In Google Search Console:
   **Sitemaps** → submit `https://openshore.ai/sitemap.xml`, then **URL
   inspection** → `https://openshore.ai/` → **Request indexing** (repeat for
   key pages). Bing Webmaster Tools has the same two steps and can import the
   site from Search Console.

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
