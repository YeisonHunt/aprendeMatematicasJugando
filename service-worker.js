  /*****************************************************************************
   *
   * Service worker
   *
   ****************************************************************************/

// nombre del cache actual
// IMPORTANTE !!!  (se debe cambiar el nombre por cada cambio)
//var cacheName = 'dados-a-03';
const CACHE_VERSION = "dados-v4a";
const CACHE_NAME = `${registration.scope}!${CACHE_VERSION}`;

// lista de archivos necesarios para la shell app (index, js, imagenes,css, etc)
// para github pages, se mepieza con el nombre del repositorio
var filesToCache = [
    '/dados/',
    '/dados/index.html',
    '/dados/app.js',
    '/dados/style.css',
    '/dados/media/dados_sprite01.png',
    '/dados/media/midi_lst.mp3'
];

/*
// LOCAL (dev)
// cambiar start_url tambien
var filesToCache = [
  '/',
  '/index.html',
  '/app.js',
  '/style.css',
  '/media/dados_sprite01.png',
  '/media/midi_lst.mp3'
];
*/

// Instalación
// se abre cache y se da un nombre con caches.open()
// cache.addAll() toma una lista de URL, las obtiene del servidor y agrega la respuesta al cache.
self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

// Activación
// se inicia, cuando se inicia el service worker.
// se actualiza el cache cada vez que se cambie el cacheName
self.addEventListener("activate", event => {
  console.log('[ServiceWorker] Activate');
  const currentCaches = CACHE_NAME;
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return cacheNames.filter(
          cacheName => !currentCaches.includes(cacheName)
        );
      })
      .then(cachesToDelete => {
        return Promise.all(
          cachesToDelete.map(cacheToDelete => {
            console.log('[ServiceWorker] Removing old cache', cacheToDelete);
            return caches.delete(cacheToDelete);
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch
// intercepta las solicitudes de la PWA para controlarlas con el service worker.
// caches.match() responde con la versión almacenada del cache o usa fetch para obtener una copia de la red.
// e.respondWith() devuelve la response.
  self.addEventListener('fetch', function(e) {
    console.log('[ServiceWorker] Fetch', e.request.url);
    e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
  });