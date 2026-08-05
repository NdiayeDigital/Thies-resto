const CACHE_NAME = 'thies-resto-cache-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/logo.jpg',
    '/manifest.json'
];

// Install Event
self.addEventListener('install', e => {
    self.skipWaiting();
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS).catch(err => console.log("SW caching error during install:", err));
        })
    );
});

// Activate Event
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});

// Fetch Event (Network-first, falling back to cache if offline)
self.addEventListener('fetch', e => {
    // Ne pas intercepter les requêtes non-GET ou les appels à l'API Supabase
    if (e.request.method !== 'GET' || e.request.url.includes('supabase.co')) {
        return;
    }

    // Permettre le cache pour le domaine local OU pour les requêtes d'images externes (comme unsplash)
    const isLocalOrigin = e.request.url.startsWith(self.location.origin);
    const isImageRequest = e.request.destination === 'image' || e.request.url.match(/\.(jpg|jpeg|png|gif|webp)$/i);

    if (!isLocalOrigin && !isImageRequest) {
        return;
    }

    e.respondWith(
        fetch(e.request)
            .then(res => {
                // Clone response to cache
                if (res.status === 200) {
                    const resClone = res.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(e.request, resClone);
                    });
                }
                return res;
            })
            .catch(() => {
                return caches.match(e.request).then(cachedResponse => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    // Fallback for HTML page if not in cache
                    if (e.request.headers.get('accept').includes('text/html')) {
                        return caches.match('/index.html');
                    }
                });
            })
    );
});

// Push notifications
self.addEventListener('push', event => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'THIÉS Resto';
    const options = {
        body: data.body || 'Vous avez une nouvelle notification',
        icon: '/logo.jpg',
        badge: '/logo.jpg',
        vibrate: [200, 100, 200, 100, 200, 100, 200],
        data: {
            url: data.url || '/'
        }
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});
