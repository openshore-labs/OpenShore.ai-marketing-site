import { test } from 'node:test';
import assert from 'node:assert/strict';
import { appShellRequest, isAppRoute } from './appShell.js';

test('only the sign-in return path is the app', () => {
  assert.equal(isAppRoute('/auth-callback'), true);
  assert.equal(isAppRoute('/auth-callback/'), true);
  for (const p of ['/', '/about/', '/auth-callback/x', '/auth', '/nope', '/download/mac']) {
    assert.equal(isAppRoute(p), false, p);
  }
});

test('the shell request is the root, without the code', () => {
  const req = appShellRequest(new URL('https://openshore.ai/auth-callback?code=secret'));
  assert.equal(req.url, 'https://openshore.ai/');
  assert.equal(req.method, 'GET');
});
