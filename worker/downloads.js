// The download resolver: which file a "Download" button on openshore.ai should
// hand over. Pure, so it is tested without a network (worker/downloads.test.js).
//
// Desktop releases come from openshore.code.ai's release workflow on every push
// to main, and each file name carries its version (OpenShore.Setup.0.1.3.exe),
// so no fixed link stays right. The Mac build also lands later than Linux and
// Windows (Codemagic, or built by hand), so the newest release may not have a
// Mac file yet. Each platform therefore takes the newest published release that
// actually carries its file.

export const REPO = 'openshore-labs/openshore.code.ai';
export const RELEASES_PAGE = `https://github.com/${REPO}/releases`;

/** The platforms a button can ask for, and how each one's file is named by
 *  electron-builder. */
export const PLATFORMS = {
  windows: (n) => /\.exe$/i.test(n),
  linux: (n) => /\.AppImage$/i.test(n),
  'linux-deb': (n) => /\.deb$/i.test(n),
  mac: (n) => /-arm64\.dmg$/i.test(n),
  'mac-intel': (n) => /\.dmg$/i.test(n) && !/-arm64\.dmg$/i.test(n),
};

/**
 * The download URL for a platform from a list of GitHub releases (newest
 * first, as the API returns them), or undefined when no release has it.
 */
export function resolveDownload(releases, platform) {
  const matches = PLATFORMS[platform];
  if (!matches) return undefined;
  for (const r of releases) {
    if (r.draft || r.prerelease) continue;
    const asset = (r.assets || []).find((a) => matches(a.name));
    if (asset) return asset.browser_download_url;
  }
  return undefined;
}
