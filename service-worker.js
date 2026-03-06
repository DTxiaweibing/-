var CACHE_NAME = 'promo-cache-v1';
var FILES_TO_CACHE = [
  '/promo-site/index.html',
  '/promo-site/assets/css/styles.css',
  '/promo-site/assets/js/script.js',
  '/promo-site/manifest.json',
];

self.addEventListener('install', function(e){
  e.waitUntil((async ()=>{
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(FILES_TO_CACHE);
  })());
  self.skipWaiting();
});

self.addEventListener('activate', function(e){
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(e){
  e.respondWith((async ()=>{
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(e.request);
    if (cachedResponse) return cachedResponse;
    const networkResponse = await fetch(e.request);
    if (networkResponse && networkResponse.status === 200) {
      cache.put(e.request, networkResponse.clone());
    }
    return networkResponse;
  })());
});
