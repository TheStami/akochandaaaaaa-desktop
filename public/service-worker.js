const CACHE_NAME = 'mahjong-calc-v4';

const TILE_ASSETS = [
  './tiles/-1.png',
  './tiles/-1_small.png',
  ...Array.from({ length: 37 }, (_, i) => [
    `./tiles/${i}.png`,
    `./tiles/${i}_small.png`
  ]).flat()
];

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './favicon.ico',
  './main.wasm',
  './main.data',
  './img/icons/icon.png',
  './img/icons/icon-192x192.png',
  './img/icons/icon-512x512.png',
  './img/icons/apple-touch-icon.png',
  ...TILE_ASSETS
];

// Install Event - Pre-cache all assets resiliently (one error won't block the rest)
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log('[ServiceWorker] Pre-caching offline assets & tiles resiliently');
      await Promise.all(
        ASSETS_TO_CACHE.map((asset) => {
          const resolvedUrl = new URL(asset, self.location.href).href;
          return cache.add(resolvedUrl).catch((err) => {
            console.warn('[ServiceWorker] Could not pre-cache:', asset, err);
          });
        })
      );
    })
  );
});

// Activate Event - Purge old cache versions & claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[ServiceWorker] Purging old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - Cache First strategy with automatic dynamic fallback & caching
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        if (event.request.headers.get('accept')?.includes('text/html')) {
          return caches.match('./index.html') || caches.match('./');
        }
      });
    })
  );
});
