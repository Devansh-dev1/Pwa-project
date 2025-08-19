const CACHE_NAME = 'my-pwa-cache-v1';
const urlsToCache = [
  '/', 
  '/index.html',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

// Install event: cache important files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.log('Failed to cache:', err))
  );
});

// Activate event: claim clients
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating');
  event.waitUntil(
    clients.claim()
  );
});

// Fetch event: serve from cache or network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // If found in cache, return it
        if (response) {
          return response;
        }

        // Otherwise, fetch from network and cache it
        return fetch(event.request)
          .then(networkResponse => {
            if (!networkResponse || networkResponse.status !== 200 || event.request.method !== 'GET') {
              return networkResponse;
            }

            // Clone the response for caching
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, responseToCache));

            return networkResponse;
          });
      })
  );
});