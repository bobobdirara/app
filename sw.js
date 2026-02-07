const CACHE_NAME = "iq-expiry-pwa-v2";
const ASSETS = ["./index.html","./manifest.webmanifest","./sw.js"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => (k!==CACHE_NAME) ? caches.delete(k) : null)))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE_NAME).then(c => c.put(event.request, copy));
      return res;
    }).catch(()=>cached))
  );
});
