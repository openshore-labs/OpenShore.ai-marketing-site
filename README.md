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

`src/static/_redirects` sends `/os-code/` to `/` (301) because the Stripe
checkout/portal edge functions still default their return URLs to
`openshore.ai/os-code/`. See the comment in that file.
