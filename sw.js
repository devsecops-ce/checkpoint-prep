// Offline support for the installed (Add to Home Screen) app.
// App files are served from cache and refreshed in the background; Supabase calls always go to the network.
// Bump VERSION after changing any file so installed apps pick up the update.
const VERSION = "cp8-v5";
const FILES = [
  "./", "index.html", "styles.css", "app.js", "cloud.js", "admin.js", "config.js", "manifest.webmanifest",
  "vendor/supabase.js",
  "data/maths.js", "data/science.js", "data/english.js", "data/esl.js", "data/global.js", "data/computing.js", "data/mathsboost.js",
  "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== self.location.origin) return;
  e.respondWith(caches.open(VERSION).then(async (cache) => {
    const cached = await cache.match(e.request, { ignoreSearch: true });
    const fresh = fetch(e.request).then((res) => {
      if (res.ok) cache.put(e.request, res.clone());
      return res;
    }).catch(() => cached);
    return cached || fresh;
  }));
});
