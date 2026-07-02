/* Mobility Hub — offline-first service worker.
 * Caches the app shell so the PWA works with no connection.
 * Bump CACHE when you change any shell file to force an update.
 */
var CACHE = "mobility-hub-v5";
var SHELL = [
  "./",
  "index.html",
  "styles.css",
  "script.js",
  "manifest.webmanifest",
  "js/references.js",
  "js/exercises.js",
  "js/catalog.js",
  "js/assessments.js",
  "js/programs.js",
  "js/store.js",
  "js/engine.js",
  "js/charts.js",
  "js/videos.js",
  "icons/icon.svg",
  "icons/favicon.svg",
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches
      .open(CACHE)
      .then(function (c) {
        return c.addAll(SHELL);
      })
      .then(function () {
        return self.skipWaiting();
      }),
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches
      .keys()
      .then(function (keys) {
        return Promise.all(
          keys
            .filter(function (k) {
              return k !== CACHE;
            })
            .map(function (k) {
              return caches.delete(k);
            }),
        );
      })
      .then(function () {
        return self.clients.claim();
      }),
  );
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  // Never cache cross-origin (e.g., YouTube) — let the network handle it.
  if (new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    caches.match(req).then(function (cached) {
      if (cached) return cached;
      return fetch(req)
        .then(function (res) {
          if (res && res.status === 200 && res.type === "basic") {
            var copy = res.clone();
            caches.open(CACHE).then(function (c) {
              c.put(req, copy);
            });
          }
          return res;
        })
        .catch(function () {
          // offline fallback to app shell for navigations
          if (req.mode === "navigate") return caches.match("index.html");
        });
    }),
  );
});
