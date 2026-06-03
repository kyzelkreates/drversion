// 4P3X CareLink Dashboard™ — Service Worker v3
// Network-first for assets, cache-first for offline fallback

const CACHE_VERSION = 'v3';
const CACHE_NAME = `4p3x-carelink-${CACHE_VERSION}`;

self.addEventListener('install', (event) => {
  // Pre-cache only the HTML shell
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(['/index.html'])).catch(() => {})
  );
  // Take over immediately — don't wait for old SW to finish
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Delete ALL old caches on activation
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => {
        if (k !== CACHE_NAME) {
          console.log('[SW] Deleting old cache:', k);
          return caches.delete(k);
        }
      }))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // NETWORK-FIRST for JS, CSS, and same-origin assets
  // This ensures new deploys always load fresh code
  if (
    url.origin === self.location.origin &&
    (url.pathname.startsWith('/assets/') || url.pathname === '/index.html' || url.pathname === '/manifest.json')
  ) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request)) // offline fallback
    );
    return;
  }

  // CACHE-FIRST for everything else (icons, fonts, etc.)
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).catch(() => caches.match('/index.html'));
    })
  );
});
