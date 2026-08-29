if (typeof self !== 'undefined' && self.location && (self.location.hostname === 'thies-resto.com' || self.location.hostname === 'www.thies-resto.com')) {
  try {
    importScripts("https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js");
  } catch (e) {
    console.warn("OneSignal Service Worker script import skipped:", e);
  }
}
const CACHE_NAME = 'thies-resto-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/js/data.js',
  '/js/store.js',
  '/js/router.js',
  '/js/logger.js',
  '/manifest.json'
];

self.addEventListener('install', (e) => {
  self.skipWaiting(); // Force new SW to take control immediately
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (e) => {
  // Clear old caches
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  // Network-First strategy for better reliability
  e.respondWith(
    fetch(e.request)
      .then((networkResponse) => {
        // Cache the new response if it's successful
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
                cache.put(e.request, responseToCache);
            });
        }
        return networkResponse;
      })
      .catch(() => {
        // Fallback to cache if offline
        return caches.match(e.request);
      })
  );
});