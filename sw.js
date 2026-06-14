/* Puzlino service worker — App-Shell offline, Packs laufzeit-gecacht */
const CACHE = "puzlino-v13";
const SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./intro.mp4",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png",
  "./apple-touch-icon.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Schriftarten: laufzeit-gecacht
  if (url.host.includes("fonts.googleapis.com") || url.host.includes("fonts.gstatic.com")) {
    e.respondWith(
      caches.open(CACHE).then((c) =>
        c.match(req).then((hit) => {
          const net = fetch(req).then((res) => { c.put(req, res.clone()); return res; }).catch(() => hit);
          return hit || net;
        })
      )
    );
    return;
  }

  // Bild-Packs (packs/...): NETWORK-FIRST, damit neue Bilder/Kategorien erscheinen;
  // offline aus dem Cache. Fehlende Bilder geben einen echten Fehler zurück (kein index.html-Fallback).
  if (url.pathname.includes("/packs/")) {
    e.respondWith(
      fetch(req).then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;                                  // auch 404 unverändert zurückgeben
      }).catch(() => caches.match(req))              // offline: aus Cache, sonst undefined (=> Fehler)
    );
    return;
  }

  // App-Shell & Rest: cache-first, Navigations-Fallback auf index.html
  e.respondWith(
    caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      if (res && res.ok) {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
      }
      return res;
    }).catch(() => (req.mode === "navigate" ? caches.match("./index.html") : undefined)))
  );
});
