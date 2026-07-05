const CACHE_NAME = 'cocoderas-v6';
const APP_SHELL = [
    './',
    './index.html',
    './manifest.webmanifest',
    './css/style.css',
    './js/palm.js',
    './js/ground.js',
    './js/clouds.js',
    './js/wind.js',
    './js/mensajes.js',
    './js/coconuts.js',
    './js/music.js',
    './js/main.js',
    './js/pwa.js',
    './assets/esenciales/icono.png',
    './assets/esenciales/icon-192.png',
    './assets/esenciales/icon-512.png',
    './assets/palmera/base1.png',
    './assets/palmera/base2.png',
    './assets/palmera/base3.png',
    './assets/palmera/base4.png',
    './assets/palmera/base5.png',
    './assets/palmera/base6.png',
    './assets/suelo/base1.png',
    './assets/suelo/base2.png',
    './assets/suelo/base3.png',
    './assets/suelo/base4.png',
    './assets/suelo/base5.png',
    './assets/cielo/nube.png',
    './assets/cielo/nube1.png',
    './assets/cielo/nube2.png',
    './assets/cielo/nube3.png',
    './assets/cielo/nube4.png',
    './assets/cielo/nube5.png',
    './assets/cielo/nube6.png',
    './assets/cielo/nube7.png',
    './assets/cielo/nube8.png',
    './assets/cielo/nube9.png',
    './assets/cocos/coco1.png',
    './assets/cocos/coco2.png',
    './assets/cocos/coco3.png',
    './assets/cocos/coco4.png',
    './assets/cocos/coco-abierto.png',
    './assets/cocos/coco-nota.png'
];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(APP_SHELL);
            })
            .then(function () {
                return self.skipWaiting();
            })
    );
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys()
            .then(function (cacheNames) {
                return Promise.all(
                    cacheNames
                        .filter(function (cacheName) {
                            return cacheName !== CACHE_NAME;
                        })
                        .map(function (cacheName) {
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(function () {
                return self.clients.claim();
            })
    );
});

self.addEventListener('fetch', function (event) {
    if (event.request.method !== 'GET') {
        return;
    }

    if (event.request.headers.has('range')) {
        event.respondWith(fetch(event.request));
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then(function (cachedResponse) {
                return cachedResponse || fetch(event.request)
                    .then(function (networkResponse) {
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }

                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME)
                            .then(function (cache) {
                                cache.put(event.request, responseToCache);
                            });

                        return networkResponse;
                    });
            })
    );
});
