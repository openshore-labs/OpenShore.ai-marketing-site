import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseLead, leadMessage, handleApply, SIZES, FOCI, APPLY_PATH } from './leads.js';

const good = { email: 'dana@acme.co', size: '50 to 150', focus: 'Revenue ops and commissions' };

test('accepts the three answers when each is one of the form options', () => {
  assert.deepEqual(parseLead(good), { ok: true, lead: good });
});

test('turns away a bad email or an answer the form does not offer', () => {
  assert.equal(parseLead({ ...good, email: 'not-an-email' }).reason, 'email');
  assert.equal(parseLead({ ...good, email: 'a@b.co\r\nBcc: x@y.z' }).reason, 'email');
  assert.equal(parseLead({ ...good, size: '10000' }).reason, 'size');
  assert.equal(parseLead({ ...good, focus: 'anything <b>' }).reason, 'focus');
  assert.equal(parseLead(null).ok, false);
});

test('a filled honeypot is accepted quietly and sends nothing', () => {
  assert.deepEqual(parseLead({ ...good, website: 'spam.example' }), { ok: true, spam: true });
});

test('the form template offers exactly the options the Worker accepts', async () => {
  const { readFileSync } = await import('node:fs');
  const html = readFileSync(new URL('../src/_includes/ent-apply.njk', import.meta.url), 'utf8');
  const options = [...html.matchAll(/<option>([^<]+)<\/option>/g)].map((m) => m[1]);
  assert.deepEqual(options, [...SIZES, ...FOCI]);
  assert.match(html, new RegExp(`action="${APPLY_PATH}"`));
});

test('the message replies to the applicant and keeps headers on one line', () => {
  const raw = leadMessage(good, { from: 'partners@openshore.ai', to: 'jack@openshore.ai', now: new Date(0), id: 'x' });
  assert.match(raw, /^From: OpenShore site <partners@openshore\.ai>\r\n/);
  assert.match(raw, /\r\nReply-To: dana@acme\.co\r\n/);
  assert.match(raw, /Company size: 50 to 150/);
  const headers = raw.split('\r\n\r\n')[0].split('\r\n');
  for (const h of headers) assert.match(h, /^[A-Za-z-]+: /);
});

function post(body, { type = 'application/json', origin = 'https://openshore.ai' } = {}) {
  return new Request('https://openshore.ai/design-partners/apply', {
    method: 'POST',
    headers: { 'content-type': type, origin },
    body: type === 'application/json' ? JSON.stringify(body) : new URLSearchParams(body).toString(),
  });
}

test('sends one message and answers 200 when the site can send', async () => {
  const sent = [];
  const res = await handleApply(post(good), { send: async (raw) => sent.push(raw), from: 'partners@openshore.ai', to: 'jack@openshore.ai' });
  assert.equal(res.status, 200);
  assert.equal(sent.length, 1);
});

test('answers 503 so the page opens an email when the site cannot send yet', async () => {
  const res = await handleApply(post(good), { send: null, from: 'a@openshore.ai', to: 'b@openshore.ai' });
  assert.equal(res.status, 503);
  assert.equal((await res.json()).fallback, 'email');
});

test('a post without the script lands on the thanks page', async () => {
  const res = await handleApply(post(good, { type: 'application/x-www-form-urlencoded' }), { send: async () => {}, from: 'a@openshore.ai', to: 'b@openshore.ai' });
  assert.equal(res.status, 303);
  assert.equal(res.headers.get('location'), '/thanks/');
});

test('refuses another site posting here, and anything but POST', async () => {
  const send = async () => assert.fail('must not send');
  assert.equal((await handleApply(post(good, { origin: 'https://evil.example' }), { send, from: 'a@x.y', to: 'b@x.y' })).status, 403);
  const get = new Request('https://openshore.ai/design-partners/apply');
  assert.equal((await handleApply(get, { send, from: 'a@x.y', to: 'b@x.y' })).status, 405);
  assert.equal((await handleApply(post({ ...good, size: 'huge' }), { send, from: 'a@x.y', to: 'b@x.y' })).status, 400);
});
