// The sign-in continue page moves on only to this project's own verify
// address, returning only to the app (src/static/sign-in-continue.js).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { verifyTarget } from '../src/static/sign-in-continue.js';

const ORIGIN = 'https://lzlrlfdffwiypzreoldb.supabase.co';
const verify = (q) => `${ORIGIN}/auth/v1/verify?${q}`;
const frag = (u) => `#u=${encodeURIComponent(u)}`;

test('moves on to our own verify address, returning to the app', () => {
  const u = verify('token=pkce_abc&type=magiclink&redirect_to=oscode://auth-callback');
  assert.equal(verifyTarget(frag(u), ORIGIN), new URL(u).toString());
  const signup = verify('token=pkce_abc&type=signup&redirect_to=http://127.0.0.1:4817/auth-callback');
  assert.ok(verifyTarget(frag(signup), ORIGIN));
});

test('refuses anything else', () => {
  for (const u of [
    'https://evil.example/auth/v1/verify?token=t&type=magiclink',
    `${ORIGIN}/auth/v1/token?token=t&type=magiclink`,
    verify('type=magiclink'),
    verify('token=t&type=recovery'),
    verify('token=t&type=magiclink&redirect_to=https://evil.example/'),
    verify('token=t&type=magiclink&redirect_to=oscode://auth-callback'),
    verify('token=pkce_t&type=email&redirect_to=oscode://auth-callback'),
    verify('token=pkce_t&type=magiclink&redirect_to=http://localhost:5173/auth-callback'),
    verify('token=t&type=magiclink'),
    `http://lzlrlfdffwiypzreoldb.supabase.co/auth/v1/verify?token=pkce_t&type=magiclink&redirect_to=oscode://auth-callback`,
    `https://user:pw@lzlrlfdffwiypzreoldb.supabase.co/auth/v1/verify?token=pkce_t&type=magiclink&redirect_to=oscode://auth-callback`,
    'javascript:alert(1)',
  ]) {
    assert.equal(verifyTarget(frag(u), ORIGIN), null, u);
  }
  assert.equal(verifyTarget('', ORIGIN), null);
  assert.equal(verifyTarget('#u=not a url', ORIGIN), null);
});
