// Service worker CMS BAPENDA — PWA installable + fallback offline.
// ponytail: cache statis app-shell saja. Ganti dengan Workbox bila butuh
// strategi per-route (stale-while-revalidate untuk API, dsb).
const CACHE = "cms-bapenda-v1";
const OFFLINE_URL = "/offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll([OFFLINE_URL, "/icons/icon-192.png"]))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  // Hanya navigasi yang di-handle: data CMS harus selalu segar, tidak di-cache.
  if (req.mode !== "navigate") return;

  event.respondWith(
    fetch(req).catch(() => caches.match(OFFLINE_URL).then((r) => r ?? Response.error()))
  );
});
