// The web app lives at openshore.ai/os-code/app/ (a single page built from
// openshore.code.ai/app, published into src/webapp/; it sat at the root from
// 2026-11-07 to 2026-11-16). It has no routes of its own but one, kept at the
// root so the sign-in address the account backend already allows keeps
// working: an emailed sign-in link returns to /auth-callback?code=...,
// where the app reads the code and trades it, with the verifier this browser
// holds, for a session (store.ts, authRedirectTo and completeAuthCallback).
// No file sits at that path, so the Worker answers it with the app's own
// index.html. Kept to that one exact path: every other unknown address stays
// a plain 404, never the app passing for a page that does not exist.

/** Where the web app's page is served. Its scripts load by absolute path
 *  under this folder, so its page works at /auth-callback too. */
export const APP_PATH = '/os-code/app/';

/** True for the paths the web app answers itself. */
export function isAppRoute(pathname) {
  return pathname === '/auth-callback' || pathname === '/auth-callback/';
}

/** The request for the app's shell, carrying nothing of the original but its
 *  origin: the code stays in the browser's address bar for the app to read,
 *  and never reaches the asset fetch. */
export function appShellRequest(url) {
  return new Request(new URL(APP_PATH, url).toString(), { method: 'GET' });
}
