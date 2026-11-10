import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PROTECTED, issue, checkSignIn, hasAccess, setCookieHeader, handleProtected, lastDay } from './enterpriseAccess.js';

const SECRET = 'test-secret-not-real';
const NOW = new Date(Date.UTC(2026, 10, 10, 12));

test('only the platform page and the tour are protected', () => {
  for (const p of ['/enterprise/platform', '/enterprise/platform/', '/enterprise/platform/index.html', '/enterprise/tour/', '/enterprise/tour']) assert.ok(PROTECTED.test(p), p);
  for (const p of ['/enterprise/', '/enterprise/promo/', '/enterprise/tour-poster.jpg', '/enterprise/enterprise.css', '/enterprise/platform-preview.jpg']) assert.ok(!PROTECTED.test(p), p);
});

test('a username is good for 7 days, then stops', async () => {
  const { username, password } = await issue(SECRET, 'Acme Foods', NOW);
  assert.equal(username, 'acme-foods-20261117');
  assert.match(password, /^[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$/);
  assert.ok(await checkSignIn(SECRET, ' Acme-Foods-20261117 ', password.toLowerCase(), NOW));
  assert.ok(await checkSignIn(SECRET, username, password, new Date(Date.UTC(2026, 10, 17, 23, 0))));
  assert.ok(!(await checkSignIn(SECRET, username, password, new Date(Date.UTC(2026, 10, 18, 0, 1)))));
});

test('a wrong password, a changed date, a different secret or no secret all fail', async () => {
  const { username, password } = await issue(SECRET, 'Acme', NOW);
  assert.ok(!(await checkSignIn(SECRET, username, 'AAAA-AAAA-AAAA-AAAA', NOW)));
  assert.ok(!(await checkSignIn(SECRET, username.replace('20261117', '20271117'), password, NOW)));
  assert.ok(!(await checkSignIn('another-secret', username, password, NOW)));
  assert.ok(!(await checkSignIn('', username, password, NOW)));
  assert.equal(lastDay('acme-20261131'), null);
});

test('the cookie opens the pages until the last day, and cannot be forged', async () => {
  const { username } = await issue(SECRET, 'Acme', NOW);
  const header = await setCookieHeader(SECRET, username, NOW);
  assert.match(header, /HttpOnly; Secure; SameSite=Lax/);
  const cookie = header.split(';')[0];
  assert.ok(await hasAccess(SECRET, `other=1; ${cookie}`, NOW));
  assert.ok(!(await hasAccess(SECRET, cookie, new Date(Date.UTC(2026, 10, 18, 1)))));
  assert.ok(!(await hasAccess(SECRET, cookie.replace('20261117', '20271117'), NOW)));
  assert.ok(!(await hasAccess('another-secret', cookie, NOW)));
});

test('the Worker shows the sign-in, signs in, then serves the page', async () => {
  const served = [];
  const env = { ENTERPRISE_ACCESS_SECRET: SECRET, ASSETS: { fetch: async (r) => { served.push(new URL(r.url).pathname); return new Response('the platform page', { headers: { 'content-type': 'text/html' } }); } } };
  const locked = await handleProtected(new Request('https://openshore.ai/enterprise/platform/'), env, NOW);
  assert.equal(locked.status, 401);
  assert.match(await locked.text(), /Sign in/);
  assert.equal(served.length, 0);
  const { username, password } = await issue(SECRET, 'Acme', NOW);
  const bad = await handleProtected(new Request('https://openshore.ai/enterprise/platform/', { method: 'POST', body: new URLSearchParams({ username, password: 'nope' }) }), env, NOW);
  assert.equal(bad.status, 401);
  const ok = await handleProtected(new Request('https://openshore.ai/enterprise/platform/', { method: 'POST', body: new URLSearchParams({ username, password, next: 'https://evil.example/' }) }), env, NOW);
  assert.equal(ok.status, 303);
  assert.equal(ok.headers.get('location'), '/enterprise/platform/');
  const cookie = ok.headers.get('set-cookie').split(';')[0];
  const page = await handleProtected(new Request('https://openshore.ai/enterprise/tour/', { headers: { cookie } }), env, NOW);
  assert.equal(page.status, 200);
  assert.equal(await page.text(), 'the platform page');
  assert.equal(page.headers.get('cache-control'), 'private, no-store');
});

test('with no secret set, nobody gets in', async () => {
  const env = { ASSETS: { fetch: async () => new Response('the platform page') } };
  const res = await handleProtected(new Request('https://openshore.ai/enterprise/platform/'), env, NOW);
  assert.equal(res.status, 401);
});
