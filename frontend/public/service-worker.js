/* eslint-disable no-restricted-globals */

const CACHE_NAME = 'breatheasy-v2';
const OFFLINE_URL = '/';

// Critical assets for offline emergency support
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/audio/rain.mp3',
  '/audio/ocean.mp3',
  '/audio/whitenoise.mp3'
];

// Emergency routes that must work offline
const EMERGENCY_ROUTES = [
  '/help-now',
  '/emergency',
  '/emergency/safety',
  '/emergency/breathing',
  '/emergency/grounding',
  '/emergency/reassurance',
  '/emergency/recovery'
];

// Install event - cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('BreatheEasy: Caching core assets for offline use');
      return cache.addAll(PRECACHE_ASSETS).catch(err => {
        console.log('Some assets failed to cache:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName.startsWith('breatheasy-') && cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests (except for CDN resources)
  if (!url.origin.includes(self.location.origin) && 
      !url.origin.includes('fonts.googleapis.com') &&
      !url.origin.includes('fonts.gstatic.com')) {
    return;
  }

  // For API requests - network first, fail gracefully
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          return response;
        })
        .catch(() => {
          // Return a friendly offline response for API calls
          return new Response(
            JSON.stringify({ error: 'offline', message: 'You are offline' }),
            { 
              status: 503, 
              headers: { 'Content-Type': 'application/json' }
            }
          );
        })
    );
    return;
  }

  // For audio files - cache first (critical for offline emergency)
  if (url.pathname.startsWith('/audio/')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) {
          // Update cache in background
          fetch(request).then((response) => {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, response);
            });
          }).catch(() => {});
          return cached;
        }
        
        return fetch(request).then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        });
      })
    );
    return;
  }

  // For navigation requests (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful navigation responses
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Offline - try cache first
          return caches.match(request).then((cached) => {
            if (cached) return cached;
            
            // For emergency routes, return the app shell
            if (EMERGENCY_ROUTES.some(route => url.pathname.startsWith(route))) {
              return caches.match(OFFLINE_URL);
            }
            
            // Fallback to home page for any navigation
            return caches.match(OFFLINE_URL);
          });
        })
    );
    return;
  }

  // For other static assets (JS, CSS, images) - stale while revalidate
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request)
        .then((networkResponse) => {
          // Cache successful responses
          if (networkResponse.ok) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => null);

      // Return cached version immediately, update in background
      return cached || fetchPromise;
    })
  );
});

// Background sync for panic sessions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-panic-sessions') {
    event.waitUntil(syncPanicSessions());
  }
});

async function syncPanicSessions() {
  console.log('BreatheEasy: Syncing offline panic sessions');
  // The actual sync is handled by the app when it detects online status
}

// Push notifications (future feature)
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  
  self.registration.showNotification(data.title || 'BreatheEasy', {
    body: data.body || 'Time for a calming moment',
    icon: '/logo192.png',
    badge: '/logo192.png',
    tag: 'breatheasy-notification',
    requireInteraction: false,
    silent: true
  });
});

// Message handling
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
