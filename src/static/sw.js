// Retires the web app's old service worker (2026-11-16). From 2026-11-07 the
// OpenShore.ai web app sat at openshore.ai/ and registered a worker here, at
// /sw.js, for the whole site. The app moved to /os-code/app/, with its own
// worker in that folder, and openshore.ai/ is now OpenShore for Enterprise.
// A browser that still holds the old worker fetches this file on its next
// visit, installs it, and it unregisters itself, so nothing outside the app's
// folder is ever answered from the old cache. It caches nothing and answers
// no request. The app's new worker clears the old caches when it activates.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil(self.registration.unregister());
});
