// Run with `npm test` (node --test). No network: the resolver is pure.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveDownload } from './downloads.js';

const rel = (tag, names, extra = {}) => ({
  tag_name: tag,
  ...extra,
  assets: names.map((name) => ({ name, browser_download_url: `https://dl/${tag}/${name}` })),
});

// The shape a per-push release history really has: the newest release is
// Linux and Windows only until the Mac build lands in it.
const RELEASES = [
  rel('v0.1.4', ['OpenShore.Setup.0.1.4.exe', 'OpenShore-0.1.4.AppImage', 'oscode-app_0.1.4_amd64.deb', 'latest.yml']),
  rel('v0.1.3', [
    'OpenShore.Setup.0.1.3.exe',
    'OpenShore.Setup.0.1.3.exe.blockmap',
    'OpenShore-0.1.3.AppImage',
    'OpenShore-0.1.3-arm64.dmg',
    'OpenShore-0.1.3.dmg',
    'OpenShore-0.1.3-arm64-mac.zip',
  ]),
];

test('Windows and Linux take the newest release', () => {
  assert.equal(resolveDownload(RELEASES, 'windows'), 'https://dl/v0.1.4/OpenShore.Setup.0.1.4.exe');
  assert.equal(resolveDownload(RELEASES, 'linux'), 'https://dl/v0.1.4/OpenShore-0.1.4.AppImage');
  assert.equal(resolveDownload(RELEASES, 'linux-deb'), 'https://dl/v0.1.4/oscode-app_0.1.4_amd64.deb');
});

test('the Mac takes the newest release that has a Mac build, never the blockmap or zip', () => {
  assert.equal(resolveDownload(RELEASES, 'mac'), 'https://dl/v0.1.3/OpenShore-0.1.3-arm64.dmg');
  assert.equal(resolveDownload(RELEASES, 'mac-intel'), 'https://dl/v0.1.3/OpenShore-0.1.3.dmg');
});

test('drafts, prereleases, and unknown platforms give nothing', () => {
  assert.equal(resolveDownload([rel('v1', ['a.exe'], { draft: true })], 'windows'), undefined);
  assert.equal(resolveDownload([rel('v1', ['a.exe'], { prerelease: true })], 'windows'), undefined);
  assert.equal(resolveDownload(RELEASES, 'solaris'), undefined);
});
