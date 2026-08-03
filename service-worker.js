const CACHE_NAME = 'cocoderas-v677';

const APP_SHELL = [
    './',
    './index.html',
    './manifest.webmanifest',
    './css/style.css',
    './js/palm.js',
    './js/ground.js',
    './js/sun.js',
    './js/clouds.js',
    './js/wind.js',
    './js/mensajes.js',
    './js/coconuts.js',
    './js/music.js',
    './js/theme.js',
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
    './assets/cielo/sol2.png',
    './assets/cielo/sol3.png',
    './assets/cielo/luna0.png',
    './assets/cielo/luna1.png',
    './assets/cielo/luna2.png',
    './assets/cielo/luna3.png',
    './assets/cielo/luna4.png',
    './assets/cielo/luna5.png',
    './assets/cielo/luna6.png',
    './assets/cielo/luna7.png',
    './assets/cocos/coco1.png',
    './assets/cocos/coco2.png',
    './assets/cocos/coco3.png',
    './assets/cocos/coco4.png',
    './assets/cocos/coco-abierto.png',
    './assets/cocos/coco-nota.png'
];

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(APP_SHELL);
        })
    );

    self.skipWaiting();
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        (async function () {
            const cacheNames = await caches.keys();

            await Promise.all(
                cacheNames
                    .filter(function (cacheName) {
                        return cacheName !== CACHE_NAME;
                    })
                    .map(function (cacheName) {
                        return caches.delete(cacheName);
                    })
            );

            await self.clients.claim();
        })()
    );
});

self.addEventListener('message', function (event) {
    if (event.data === 'SKIP_WAITING') {
        self.skipWaiting();
    }
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
        caches.match(event.request).then(function (cachedResponse) {

            const networkFetch = fetch(event.request)
                .then(function (networkResponse) {

                    if (
                        networkResponse &&
                        networkResponse.status === 200 &&
                        (networkResponse.type === 'basic' || networkResponse.type === 'cors')
                    ) {
                        const responseClone = networkResponse.clone();

                        caches.open(CACHE_NAME).then(function (cache) {
                            cache.put(event.request, responseClone);
                        });
                    }

                    return networkResponse;
                })
                .catch(function () {
                    return cachedResponse;
                });

            return cachedResponse || networkFetch;
        })
    );
});