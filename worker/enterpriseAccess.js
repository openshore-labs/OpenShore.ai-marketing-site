// Access to the OpenShore platform page (/enterprise/platform/)
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

import entTabs from '../src/_data/entTabs.js';

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
<title>How the Platform Works · OpenShore</title>
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link rel="stylesheet" href="/enterprise/enterprise.css?v=lock3" />
</head>
<body class="ent-locked">
<div class="ent-locked-bg" aria-hidden="true"></div>
<header class="ent-top ent-top--locked"><a class="ent-brand" href="/" aria-label="OpenShore, home"><svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true"><rect width="32" height="32" rx="7.5" fill="#1c2a33" /><g transform="translate(0 -0.81)"><line x1="7" y1="13" x2="25" y2="13" stroke="#f6f4ef" stroke-width="2" stroke-linecap="round" /><path d="M7 19q4.5-3.3 9 0t9 0" fill="none" stroke="#4b90a3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></g></svg><span><b>OpenShore</b></span></a><p class="ent-badge ent-badge--ticker ent-badge--top"><span class="ent-dot" aria-hidden="true"></span><span class="ent-ticker"><span class="ent-ticker-track"><span>Now piloting with design partners</span><span class="ent-ticker-copy" aria-hidden="true">Now piloting with design partners</span></span></span></p></header>
<nav class="ent-tabs ent-tabs--locked" aria-label="OpenShore"><div class="ent-tabs-row">${entTabs.map((t) => `<a href="${t.href}"${t.locked ? ' aria-current="page"' : ''}>${esc(t.label)}</a>`).join('')}</div></nav>
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
  </form>
  <aside class="ent-lock-preview" aria-label="Inside the tour">
    <p class="ent-lock-preview-k">Inside the tour</p>
    <p>Connections, chats, projects, tasks, reports, the owner’s view and bots.</p>
    <a class="ent-film ent-film--wide" href="/enterprise/promo/"><img src="/enterprise/promo-poster.jpg" alt="" width="960" height="540" /><span class="ent-film-meta"><b>OpenShore</b><span>In under three minutes</span></span><span class="ent-play" aria-hidden="true"><svg viewBox="0 0 14 16" width="14" height="16"><path d="M1.5 1.2v13.6L13 8z" fill="currentColor" /></svg></span></a>
  </aside>
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
    const owner = form && (await isOwner(env, username, form.get('password')));
    const ok = owner || (form && (await checkSignIn(secret, username, form.get('password'), now)));
    if (!ok || !secret) return page(lockedPage({ failed: true, username }), 401);
    const next = String(form.get('next') || '');
    const to = PROTECTED.test(next) ? next : '/enterprise/platform/';
    // The owner's cookie is signed for a dated stand-in name, so the cookie
    // check stays the same; it lasts OWNER_DAYS and signing in again renews it.
    const cookieUser = owner ? `owner-${ymdIn(now, OWNER_DAYS)}` : username;
    return new Response(null, { status: 303, headers: { location: to, 'set-cookie': await setCookieHeader(secret, cookieUser, now), 'cache-control': 'no-store' } });
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

// Issuing a login without the access key leaving Cloudflare (founder,
// 2026-11-18): POST /enterprise/issue with a JSON body {"name": "..."} and the
// header "Authorization: Bearer <ENTERPRISE_ADMIN_TOKEN>" answers with a new
// username, password and last day, exactly what scripts/enterprise-access.mjs
// prints. ENTERPRISE_ADMIN_TOKEN is a second Worker secret, separate from the
// access key, at least 32 characters; without it (or the access key) the
// endpoint answers 503 and issues nothing. Changing it revokes only this door,
// not the logins already given out.
export const ISSUE_PATH = '/enterprise/issue';

async function sameToken(given, expected) {
  const digest = async (s) => new Uint8Array(await crypto.subtle.digest('SHA-256', enc.encode(String(s))));
  const [a, b] = await Promise.all([digest(given), digest(expected)]);
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

/** Answer POST /enterprise/issue: a new login for a name, for the holder of the admin token only. */
export async function handleIssue(request, env, now = new Date()) {
  const json = (body, status, extra = {}) =>
    new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store', 'x-robots-tag': 'noindex', ...extra } });
  if (request.method !== 'POST') return json({ error: 'Use POST.' }, 405, { allow: 'POST' });
  const token = env.ENTERPRISE_ADMIN_TOKEN;
  const secret = env.ENTERPRISE_ACCESS_SECRET;
  if (!secret || !token || String(token).length < 32) return json({ error: 'Not set up.' }, 503);
  const given = (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  if (!given || !(await sameToken(given, token))) return json({ error: 'Not allowed.' }, 401);
  const body = await request.json().catch(() => null);
  const name = body && typeof body.name === 'string' ? body.name.trim() : '';
  if (!name || name.length > 80) return json({ error: 'Send {"name": "..."} (1 to 80 characters).' }, 400);
  const { username, password, lastDay: end } = await issue(secret, name, now);
  return json({ username, password, goodThrough: end.toISOString().slice(0, 10), signIn: 'https://openshore.ai/enterprise/platform/' }, 200);
}

// The owner's own login (founder, 2026-11-18): a username and password that do
// not expire, both Worker secrets (ENTERPRISE_OWNER_USERNAME,
// ENTERPRISE_OWNER_PASSWORD), never in this repo. Unset, there is no owner
// login. The username is matched without case; the password exactly, in
// constant time. A signed-in owner gets a cookie good for OWNER_DAYS.
export const OWNER_DAYS = 30;

function ymdIn(now, days) {
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + days));
  return `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`;
}

export async function isOwner(env, rawUser, password) {
  const user = env.ENTERPRISE_OWNER_USERNAME;
  const pass = env.ENTERPRISE_OWNER_PASSWORD;
  if (!user || !pass || !password) return false;
  const a = await sameToken(String(rawUser || '').trim().toLowerCase(), String(user).trim().toLowerCase());
  const b = await sameToken(String(password), String(pass));
  return a && b;
}
