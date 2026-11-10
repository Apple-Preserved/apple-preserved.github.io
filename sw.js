// RETIRED (11-10): the app moved to /app/.  This replaces the old top-level worker and removes it.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", () => self.registration.unregister());
