const CACHE_NAME = 'carplay-cache-v1';

// Lista plików, które mają być zapisane offline
// Upewnij się, że ścieżki do Twoich obrazków się zgadzają z tymi w index.html
const urlsToCache = [
    '/',
    '/index.html',
    '/maps.html', // Ten plik też zostanie zapisany
    '/assets/back.png',
    '/assets/switch.png',
    '/assets/dock/telefon.png',
    '/assets/dock/mapy.png',
    '/assets/dock/muzyka.png',
    '/assets/menu/telefon.png',
    '/assets/menu/muzyka.png',
    '/assets/menu/mapy.png',
    '/assets/menu/wiadomosci.png',
    '/assets/menu/odtwarzane.png',
    '/assets/menu/podcasty.png',
    '/assets/menu/ustawienia.png',
    '/assets/menu/whatsapp.png'
];

// 1. Instalacja Service Workera i zapisanie zasobów w Cache
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Otwarto cache');
                // Pomiń błędy dla pojedynczych plików, jeśli któregoś z assets jeszcze nie masz
                return Promise.all(
                    urlsToCache.map(url => {
                        return cache.add(url).catch(err => console.warn('Nie udało się zapisać do cache:', url, err));
                    })
                );
            })
    );
});

// 2. Obsługa żądań sieciowych (Fetch) - zwracaj z cache, jeśli jest offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Zwraca odpowiedź z cache, albo próbuje pobrać z sieci
                return response || fetch(event.request);
            })
    );
});

// 3. Aktualizacja Service Workera i usuwanie starego cache
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});