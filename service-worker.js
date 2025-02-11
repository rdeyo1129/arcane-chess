self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('image-cache').then((cache) => {
      return cache.addAll([
        '/assets/dashboard/campaign.webp',
        '/assets/dashboard/stacktadium.webp',
        '/assets/dashboard/leaderboard.webp',
        '/assets/dashboard/quickplay.webp',
        '/assets/dashboard/lexicon.webp',
        '/assets/dashboard/manifest.webp',
        '/assets/dashboard/logout.webp',
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        console.log(cachedResponse);
        return (
          cachedResponse ||
          fetch(event.request).then((response) => {
            return caches.open('image-cache').then((cache) => {
              cache.put(event.request, response.clone());
              return response;
            });
          })
        );
      })
    );
  }
});
