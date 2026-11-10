// Access to the OpenShore for Enterprise platform page (/enterprise/platform/)
// and the product tour (/enterprise/tour/) (founder, 2026-11-10): open only to
// people the founder gives a username and password, each good for 7 days.
//
// Nothing is stored. A username carries its own last day, as `name-YYYYMMDD`,
// and its password is an HMAC of the username under one secret
// (ENTERPRISE_ACCESS_SECRET, a Worker secret), so the Worker can check both
// and the founder can make new ones with scripts/enterprise-access.mjs. After
// a successful sign-in the Worker sets a cookie, itself signed the same way,
// that ends with the username's last day. Changing the secret revokes every
// username and cookie at once.
//
// Web Crypto only, so the same code runs in the Worker and in Node.

const enc = new TextEncoder();
const B32 = 'ABCDEFGHJKMNPQRSTVWXYZ23456789'; // no I, L, O, U, 0 or 1: easy to read out loud
export const COOKIE = 'os_ent';
export const DAYS = 7;
export const PROTECTED = /^\/enterprise\/(platform|tour)(\/|\/index\.html)?$/;

async function hmac(secret, message) {
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return new Uint8Array(await crypto.subtle.sign('HMAC', key, enc.encode(message)));
}

function words(bytes, n) {
  let out = '';
  for (let i = 0; out.length < n; i++) out += B32[bytes[i] % B32.length];
  return out;
}

/** A username's own form: lowercase letters, digits and hyphens, then its last day. */
export function normalizeUsername(raw) {
  return String(raw || '').trim().toLowerCase();
}

/** The last day a username is good for, as a Date at the end of that day (UTC), or null. */
export function lastDay(username) {
  const m = /^[a-z0-9][a-z0-9-]{0,40}-(\d{4})(\d{2})(\d{2})$/.exec(username);
  if (!m) return null;
  const end = Date.UTC(+m[1], +m[2] - 1, +m[3], 23, 59, 59);
  const d = new Date(end);
  if (d.getUTCMonth() !== +m[2] - 1 || d.getUTCDate() !== +m[3]) return null;
  return d;
}

/** The password for a username: 16 characters in four groups of four. */
export async function passwordFor(secret, username) {
  const w = words(await hmac(secret, 'password:' + username), 16);
  return `${w.slice(0, 4)}-${w.slice(4, 8)}-${w.slice(8, 12)}-${w.slice(12, 16)}`;
}

function samePassword(a, b) {
  const x = String(a || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  const y = String(b || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (x.length !== y.length) return false;
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x.charCodeAt(i) ^ y.charCodeAt(i);
  return diff === 0;
}

/** Make a username and password for a name, good for DAYS days from now. */
export async function issue(secret, name, now = new Date()) {
  const slug = String(name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 30) || 'guest';
  const last = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + DAYS));
  const ymd = `${last.getUTCFullYear()}${String(last.getUTCMonth() + 1).padStart(2, '0')}${String(last.getUTCDate()).padStart(2, '0')}`;
  const username = `${slug}-${ymd}`;
  return { username, password: await passwordFor(secret, username), lastDay: lastDay(username) };
}

/** True when the username and password match and the username has not run out. */
export async function checkSignIn(secret, rawUser, password, now = new Date()) {
  if (!secret) return false;
  const username = normalizeUsername(rawUser);
  const end = lastDay(username);
  if (!end || now > end) return false;
  return samePassword(password, await passwordFor(secret, username));
}

/** The signed cookie value for a username. */
export async function cookieFor(secret, username) {
  return `${username}.${words(await hmac(secret, 'cookie:' + username), 24)}`;
}

/** True when the request's cookie is signed by the secret and its username has not run out. */
export async function hasAccess(secret, cookieHeader, now = new Date()) {
  if (!secret) return false;
  const m = new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`).exec(cookieHeader || '');
  if (!m) return false;
  const value = decodeURIComponent(m[1]);
  const dot = value.lastIndexOf('.');
  if (dot < 1) return false;
  const username = value.slice(0, dot);
  const end = lastDay(username);
  if (!end || now > end) return false;
  return samePassword(value.slice(dot + 1), (await cookieFor(secret, username)).slice(dot + 1));
}

/** The Set-Cookie header for a signed-in username, ending on its last day. */
export async function setCookieHeader(secret, username, now = new Date()) {
  const end = lastDay(username);
  const maxAge = Math.max(0, Math.floor((end - now) / 1000));
  return `${COOKIE}=${encodeURIComponent(await cookieFor(secret, username))}; Max-Age=${maxAge}; Path=/enterprise; HttpOnly; Secure; SameSite=Lax`;
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

/** The page someone sees before they sign in: the platform page blurred, with the sign-in on top. */
export function lockedPage({ failed = false, username = '', next = '/enterprise/platform/' } = {}) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<meta name="robots" content="noindex, nofollow" />
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src 'self' data:; style-src 'self'; font-src 'self'; script-src 'none'; base-uri 'none'; form-action 'self'" />
<title>How the Platform Works · OpenShore for Enterprise</title>
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link rel="stylesheet" href="/enterprise/enterprise.css" />
</head>
<body class="ent-locked">
<div class="ent-locked-bg" aria-hidden="true"></div>
<main class="ent-lock">
  <form class="ent-lock-card" method="post" action="/enterprise/platform/">
    <svg viewBox="0 0 32 32" width="36" height="36" aria-hidden="true"><rect width="32" height="32" rx="7.5" fill="#1c2a33" /><g transform="translate(0 -0.81)"><line x1="7" y1="13" x2="25" y2="13" stroke="#f6f4ef" stroke-width="2" stroke-linecap="round" /><path d="M7 19q4.5-3.3 9 0t9 0" fill="none" stroke="#4b90a3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></g></svg>
    <h1>How the platform works</h1>
    <p>The product tour is open to design partners and people we’ve invited. Sign in with the username and password we sent you.</p>
    ${failed ? '<p class="ent-lock-error" role="alert">That username and password didn’t work, or the access has ended. Check them, or ask us for new ones.</p>' : ''}
    <label for="ent-user">Username</label>
    <input id="ent-user" name="username" type="text" autocomplete="username" autocapitalize="none" spellcheck="false" required value="${esc(username)}" />
    <label for="ent-pass">Password</label>
    <input id="ent-pass" name="password" type="password" autocomplete="current-password" required />
    <input type="hidden" name="next" value="${esc(next)}" />
    <button class="ent-btn ent-btn--primary" type="submit">Sign in</button>
    <p class="ent-lock-ask">No login yet? Email <a href="mailto:jack@openshore.ai?subject=OpenShore%20for%20Enterprise%20product%20tour">jack@openshore.ai</a>.</p>
    <a class="ent-back" href="/enterprise/"><span aria-hidden="true">&larr;</span> OpenShore for Enterprise</a>
  </form>
</main>
</body>
</html>`;
}

/** Answer a request for a protected path: the page itself with access, otherwise the sign-in. */
export async function handleProtected(request, env, now = new Date()) {
  const secret = env.ENTERPRISE_ACCESS_SECRET;
  const url = new URL(request.url);
  const page = (body, status, extra = {}) =>
    new Response(body, { status, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex', ...extra } });
  if (request.method === 'POST') {
    const form = await request.formData().catch(() => null);
    const username = normalizeUsername(form && form.get('username'));
    const ok = form && (await checkSignIn(secret, username, form.get('password'), now));
    if (!ok) return page(lockedPage({ failed: true, username }), 401);
    const next = String(form.get('next') || '');
    const to = PROTECTED.test(next) ? next : '/enterprise/platform/';
    return new Response(null, { status: 303, headers: { location: to, 'set-cookie': await setCookieHeader(secret, username, now), 'cache-control': 'no-store' } });
  }
  if (await hasAccess(secret, request.headers.get('cookie'), now)) {
    const res = await env.ASSETS.fetch(request);
    const out = new Response(res.body, res);
    out.headers.set('cache-control', 'private, no-store');
    out.headers.set('x-robots-tag', 'noindex');
    return out;
  }
  const next = url.pathname.startsWith('/enterprise/tour') ? '/enterprise/tour/' : '/enterprise/platform/';
  return page(lockedPage({ next }), 401);
}
