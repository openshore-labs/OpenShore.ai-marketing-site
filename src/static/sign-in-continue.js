// The sign-in email's link lands here first (openshore.code.ai, passwordless
// sign-in, CTO 2026-10-12). Mail scanners and link previews open every link in
// an email; if the link went straight to the auth server, a scanner would use
// up the one-time token and the person's code would stop working too. So the
// email links here, with the real address in the fragment (never sent to any
// server), and only a person's tap moves on to it.
//
// The address must be this project's own /auth/v1/verify, returning to one of
// the app's own sign-in addresses, or nothing happens: this page never sends
// anyone anywhere else.

/** Where a sign-in may return, as supabase/config.toml lists them. */
export const APP_RETURNS = [
  'oscode://auth-callback',
  'http://127.0.0.1:4817/auth-callback',
  'http://localhost:5173/auth-callback',
];

/** The verify address to move on to, or null when the link is not one of
 *  ours. `authOrigin` is the project's https origin. */
export function verifyTarget(fragment, authOrigin) {
  const raw = new URLSearchParams(String(fragment || '').replace(/^#/, '')).get('u');
  if (!raw) return null;
  let u;
  let origin;
  try {
    u = new URL(raw);
    origin = new URL(authOrigin);
  } catch {
    return null;
  }
  if (u.protocol !== 'https:' || origin.protocol !== 'https:') return null;
  if (u.host !== origin.host || u.pathname !== '/auth/v1/verify') return null;
  if (u.username || u.password) return null;
  const token = u.searchParams.get('token');
  const type = u.searchParams.get('type');
  const back = u.searchParams.get('redirect_to');
  if (!token || !['magiclink', 'signup', 'email'].includes(type || '')) return null;
  if (!back || !APP_RETURNS.includes(back)) return null;
  return u.toString();
}

if (typeof document !== 'undefined') {
  const root = document.getElementById('continue');
  const target = root ? verifyTarget(location.hash, root.dataset.authOrigin) : null;
  // The token leaves the address bar and history at once; it stays only in
  // this page's memory until the tap.
  if (location.hash) history.replaceState(null, '', location.pathname);
  const ready = document.getElementById('continue-ready');
  const bad = document.getElementById('continue-bad');
  if (target && ready) {
    ready.hidden = false;
    document.getElementById('continue-go')?.addEventListener('click', () => {
      location.replace(target);
    });
  } else if (bad) {
    bad.hidden = false;
  }
}
