// OFFLINE AFTER THE FIRST VISIT (Tom 11-09).  The cached copy opens at once; when online the newest is fetched
// behind it and is the one the NEXT launch opens.
const CACHE = "a2p";
const FILES = ["./", "manifest.webmanifest", "icon-192.png", "icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting();
});
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit   = await c.match(e.request, { ignoreSearch: true });
    // ALWAYS ASK THE SITE (Tom 11-11): Pages sends max-age=600, so a plain fetch could hand back the browser's
    // 10-minute copy and the update would miss the next launch too.  F5 was the only way round it.
    const fresh = fetch(e.request, { cache: "no-cache" }).then(r => { if (r.ok) c.put(e.request, r.clone()); return r; });
    if (hit) { e.waitUntil(fresh.catch(() => {})); return hit; }
    return fresh;
  }));
});
