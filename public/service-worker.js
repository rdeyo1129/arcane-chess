const CACHE_NAME = 'image-cache-v1';
const IMAGE_URLS = [
  '/assets/dashboard/campaign.webp',
  '/assets/dashboard/stacktadium.webp',
  '/assets/dashboard/leaderboard.webp',
  '/assets/dashboard/quickplay.webp',
  '/assets/dashboard/lexicon.webp',
  '/assets/dashboard/manifest.webp',
  '/assets/dashboard/logout.webp',
];

// ✅ Install event: Pre-cache images
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching images...');
      return cache.addAll(IMAGE_URLS);
    })
  );
});

// ✅ Fetch event: Serve images from cache first
self.addEventListener('fetch', (event) => {
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          console.log(
            '[Service Worker] Serving from cache:',
            event.request.url
          );
          return cachedResponse;
        }

        console.log('[Service Worker] Fetching new image:', event.request.url);
        return fetch(event.request).then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      })
    );
  }
});

// ✅ Activate event: Clear old cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
});
