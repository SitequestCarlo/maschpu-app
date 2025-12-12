/**
 * Custom Service Worker for MaschPu PWA
 * Provides full offline capabilities with intelligent caching
 */

const CACHE_VERSION = 'v3';
const CACHE_NAME = `maschpu-${CACHE_VERSION}`;
const RUNTIME_CACHE = `maschpu-runtime-${CACHE_VERSION}`;

// Dev hosts need query-aware cache lookups so Vite's ?t= busting works
const DEV_HOSTS = new Set(['localhost', '127.0.0.1', '::1']);
const isDevHost = DEV_HOSTS.has(self.location.hostname);

// Broadcast channel for cache progress (works even before clients are controlled)
const progressChannel = new BroadcastChannel('sw-cache-progress');

/**
 * Track a page view via the server API
 * Used when serving cached pages so analytics still work
 */
function trackCachedPageView(url, referrer) {
  // Don't track in dev mode
  if (isDevHost) return;
  
  // Use GET with query params - more reliable with keepalive than POST with body
  const params = new URLSearchParams({ url });
  if (referrer) params.set('referrer', referrer);
  
  // Fire and forget - don't await
  fetch(`/api/track?${params.toString()}`, {
    method: 'GET',
    keepalive: true,
  }).catch(() => {
    // Silently fail - analytics should never break the app
  });
}

// Fetch the list of URLs to cache from the cache-map.json endpoint
async function getPrecacheUrls() {
  try {
    const response = await fetch('/cache-map.json');
    if (!response.ok) {
      console.warn('[SW] Failed to fetch cache-map.json, using fallback');
      return ['/'];
    }
    const urls = await response.json();
    console.log(`[SW] Fetched ${urls.length} URLs from cache-map.json`);
    return urls;
  } catch (err) {
    console.error('[SW] Error fetching cache-map.json:', err);
    // Fallback to minimal set
    return ['/'];
  }
}

// Cache strategies patterns
const CACHE_FIRST_PATTERNS = [
  /\.js$/,
  /\.css$/,
  /\.woff2?$/,
  /\.ttf$/,
  /\.otf$/,
  /\.eot$/,
  /\.(png|jpg|jpeg|gif|svg|webp|ico)$/i,  // Case insensitive for images
  /\.(pdf|doc|docx|xls|xlsx)$/i,  // Case insensitive for documents
  /\/build\//,  // All files in /build/ directory
  /^\/files\//,  // All files starting with /files/
  /^\/gifs\//,   // All files starting with /gifs/
  /\/q-data\.json$/,  // Qwik data files
];

console.log('[SW] Service Worker loading', CACHE_VERSION);

// Install event - cache critical files
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker', CACHE_VERSION);
  
  event.waitUntil(
    (async () => {
      if (isDevHost) {
        console.log('[SW] Dev host detected, skipping precache to keep assets live');
        self.skipWaiting();
        return;
      }
      try {
        const cache = await caches.open(CACHE_NAME);
        
        // Fetch the list of URLs to cache from cache-map.json
        const PRECACHE_URLS = await getPrecacheUrls();
        
        // Cache URLs in batches to avoid overwhelming browser
        const batchSize = 10;
        let cached = 0;
        let failed = 0;
        const total = PRECACHE_URLS.length;
        
        console.log(`[SW] Caching ${total} URLs in batches of ${batchSize}`);
        
        // Notify about cache progress via BroadcastChannel (works even during first install)
        const notifyProgress = () => {
          const data = {
            type: 'CACHE_PROGRESS',
            cached: cached,
            total: total,
            complete: cached === total
          };
          
          // Broadcast to all windows
          progressChannel.postMessage(data);
          
          // Also try to notify controlled clients (for updates)
          self.clients.matchAll().then(clients => {
            clients.forEach(client => client.postMessage(data));
          });
        };
        
        for (let i = 0; i < total; i += batchSize) {
          const batch = PRECACHE_URLS.slice(i, i + batchSize);
          
          await Promise.allSettled(
            batch.map(async (url) => {
              try {
                // Use fetch with custom header so server knows this is pre-caching, not a real visit
                const response = await fetch(url, {
                  headers: { 'X-Purpose': 'precache' }
                });
                if (response.ok) {
                  await cache.put(url, response);
                }
                cached++;
                // Notify progress after each file
                notifyProgress();
                return true;
              } catch (err) {
                console.warn(`[SW] Failed to cache ${url}:`, err.message);
                failed++;
                notifyProgress();
                return false;
              }
            })
          );
          
          // Small delay between batches
          if (i + batchSize < total) {
            await new Promise(resolve => setTimeout(resolve, 10));
          }
        }
        
        // Final progress notification
        notifyProgress();
        
        console.log(`[SW] Installation complete: ${cached} cached, ${failed} failed`);
        
        // Skip waiting to activate immediately
        self.skipWaiting();
        
      } catch (err) {
        console.error('[SW] Install error:', err);
        // Still skip waiting even on error
        self.skipWaiting();
      }
    })()
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker', CACHE_VERSION);
  
  event.waitUntil(
    (async () => {
      // Delete old caches
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((name) => name.startsWith('maschpu-') && name !== CACHE_NAME && name !== RUNTIME_CACHE)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
      
      // Take control of all clients immediately
      await self.clients.claim();
      console.log('[SW] Service worker activated and controlling all clients');
      
      // Notify clients about activation
      const clients = await self.clients.matchAll();
      clients.forEach((client) => {
        client.postMessage({
          type: 'SW_ACTIVATED',
          version: CACHE_VERSION,
        });
      });
    })()
  );
});

// Fetch event - intelligent caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Log ALL requests for debugging PDFs and GIFs
  if (url.pathname.includes('/files/') || url.pathname.includes('/gifs/') || url.pathname.endsWith('.pdf') || url.pathname.endsWith('.gif')) {
    console.log('[SW] 📄 Fetch request:', url.pathname, 'Mode:', request.mode, 'Dest:', request.destination);
  }
  
  // Skip cross-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip API requests - always go to network
  if (url.pathname.startsWith('/api/')) {
    return;
  }
  
  // Don't intercept if we're still installing - let browser handle it
  if (self.registration.installing) {
    return;
  }
  
  // For static assets (JS, CSS, images, fonts, PDFs):
  // Use cache if available, otherwise let browser fetch normally
  const matchedPattern = CACHE_FIRST_PATTERNS.find((pattern) => pattern.test(url.pathname));
  if (matchedPattern) {
    if (isDevHost) {
      event.respondWith(fetch(request));
      return;
    }
    console.log('[SW] 🎯 Cache-first pattern matched:', matchedPattern, 'for', url.pathname);
    
    event.respondWith(
      (async () => {
        // Check cache first (respect ?t=... params in dev for fast refresh)
        const cacheMatchOptions = isDevHost ? undefined : {
          ignoreSearch: true,
          ignoreVary: true
        };
        const cached = await caches.match(request, cacheMatchOptions);
        
        if (cached) {
          console.log('[SW] ✓ Serving from cache:', url.pathname);
          return cached;
        }
        
        // Not in cache - fetch from network and cache the result
        console.log('[SW] 📡 Not in cache, fetching from network:', url.pathname);
        
        try {
          // Use a plain fetch without the request object to avoid triggering SW again
          const response = await fetch(url.href, {
            credentials: 'same-origin',
            mode: 'cors'
          });
          
          // Cache for next time if successful
          if (response && response.ok && response.status === 200) {
            const cacheClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(request, cacheClone);
              console.log('[SW] 🔄 Cached new asset:', url.pathname);
            });
          }
          
          return response;
        } catch (error) {
          console.error('[SW] ❌ Fetch failed for:', url.pathname, error);
          
          // Return a proper offline response instead of throwing
          return new Response('Network unavailable and resource not cached', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain',
            }),
          });
        }
      })()
    );
    return;
  }
  
  event.respondWith(
    (async () => {
      // For HTML pages and q-data.json: Check cache with variations
      let cached = await caches.match(request);
      
      // If not found, try with/without trailing slash for HTML and q-data.json
      if (!cached && (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html') || url.pathname.endsWith('q-data.json'))) {
        const altUrl = url.pathname.endsWith('/') 
          ? new URL(url.pathname.slice(0, -1), url.origin)
          : new URL(url.pathname + '/', url.origin);
        
        cached = await caches.match(altUrl);
        if (cached) {
          console.log('[SW] Cache hit with alternate URL:', altUrl.pathname);
        }
      }
      
      if (cached) {
        console.log('[SW] Cache hit:', url.pathname);
        
        // Track page view for cached HTML navigations
        if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
          trackCachedPageView(url.pathname, request.referrer);
        }
        
        // Track page view for q-data.json requests (SPA navigation)
        // Skip prefetch requests to avoid false positives
        const isPrefetch = request.headers.get('purpose') === 'prefetch' || 
                          request.headers.get('sec-purpose')?.includes('prefetch');
        if (url.pathname.endsWith('/q-data.json') && !isPrefetch) {
          // Extract page path from q-data.json URL: /pumpen/q-data.json -> /pumpen/
          const pagePath = url.pathname.replace(/q-data\.json$/, '');
          trackCachedPageView(pagePath, request.referrer);
        }
        
        // Return cached immediately and update in background
        fetch(request)
          .then(async (response) => {
            if (response.ok) {
              const cache = await caches.open(RUNTIME_CACHE);
              cache.put(request, response.clone());
            }
          })
          .catch(() => {}); // Ignore errors - we have cached version
        
        return cached;
      }
      
      // Not in cache, try network
      try {
        const response = await fetch(request);
        if (response.ok) {
          const cache = await caches.open(RUNTIME_CACHE);
          cache.put(request, response.clone());
        }
        return response;
      } catch (err) {
        // Network failed and no cache - for HTML navigation, return 404 page as fallback
        if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
          console.log('[SW] Network failed for navigation, checking for 404 fallback');
          // Try to serve cached 404 page
          const notFoundCache = await caches.match('/404/') || await caches.match('/404');
          if (notFoundCache) {
            console.log('[SW] Returning 404 page as offline fallback for:', url.pathname);
            return notFoundCache;
          }
          // Final fallback to homepage if 404 not cached
          const homepageCache = await caches.match('/');
          if (homepageCache) {
            console.log('[SW] Returning homepage as final fallback for:', url.pathname);
            return homepageCache;
          }
        }
        
        console.error('[SW] Failed to fetch and no cache available:', url.pathname);
        throw err;
      }
    })()
  );
});

// Message event - handle commands from app
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    console.log('[SW] Received SKIP_WAITING message');
    self.skipWaiting();
  }
  
  if (event.data?.type === 'GET_VERSION') {
    event.ports[0].postMessage({
      version: CACHE_VERSION,
    });
  }
  
  if (event.data?.type === 'CLEAR_CACHE') {
    event.waitUntil(
      (async () => {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
        console.log('[SW] All caches cleared');
        event.ports[0].postMessage({ success: true });
      })()
    );
  }
});
