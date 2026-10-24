// Offline support for the installed (Add to Home Screen) app.
// App files come from the network when online and from the cache when offline; Supabase calls always go to the network.
// Bump VERSION after changing any file so installed apps pick up the update.
const VERSION = "cp8-v12";
const FILES = [
  "./", "index.html", "styles.css", "app.js", "cloud.js", "admin.js", "config.js", "manifest.webmanifest",
  "vendor/supabase.js", "vendor/qrcode.min.js",
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
  // News comes live from the server; never serve it from the offline cache.
  if (e.request.method !== "GET" || url.origin !== self.location.origin || url.pathname.startsWith("/.netlify/")) return;
  // Network first, so every visit gets the latest version; the cache is only the offline fallback.
  e.respondWith(caches.open(VERSION).then(async (cache) => {
    try {
      const res = await fetch(e.request, { cache: "no-cache" });
      if (res.ok) cache.put(e.request, res.clone());
      return res;
    } catch (err) {
      const cached = await cache.match(e.request, { ignoreSearch: true });
      if (cached) return cached;
      throw err;
    }
  }));
});
