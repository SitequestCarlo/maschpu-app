/**
 * Service Worker for MaschPu PWA
 * Extends Qwik's built-in service worker with offline capabilities
 * and automatic updates when new versions are released
 */

/// <reference lib="webworker" />
declare const self: ServiceWorkerGlobalScope;

import { setupServiceWorker } from "@builder.io/qwik-city/service-worker";

// Setup Qwik's built-in prefetch service worker first
setupServiceWorker();

// Version of our custom service worker - increment this to trigger updates
const CACHE_VERSION = "v1";
const CACHE_NAME = `maschpu-${CACHE_VERSION}`;
const RUNTIME_CACHE = `maschpu-runtime-${CACHE_VERSION}`;
const CACHE_MAP_URL = "/cache-map.json";

// Cache strategies
const PRECACHE_URLS = ["/", "/manifest.json", "/robots.txt"];

// URLs that should always be fetched from network first
const NETWORK_FIRST_PATTERNS = [/\/cache-map\.json$/, /\/q-data\.json$/];

// URLs that should be cached first (static assets)
const CACHE_FIRST_PATTERNS = [
  /\.(js|css|woff2?|ttf|otf|eot)$/,
  /\.(png|jpg|jpeg|gif|svg|webp|ico)$/,
  /\.(pdf|doc|docx|xls|xlsx)$/,
];

setupServiceWorker();

// Install event - cache essential files
self.addEventListener("install", (event) => {
  console.log("[SW] Installing service worker", CACHE_VERSION);

  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);

        // Cache the critical precache URLs first
        console.log("[SW] Caching precache URLs");
        await cache.addAll(PRECACHE_URLS).catch((err) => {
          console.error("[SW] Failed to cache precache URLs:", err);
        });

        // Skip waiting immediately - don't block on cache-map
        self.skipWaiting();

        // Cache additional files in background (non-blocking)
        // This won't block the installation
        setTimeout(() => {
          cacheAdditionalFiles();
        }, 100);
      } catch (err) {
        console.error("[SW] Install error:", err);
        // Still skip waiting even if there's an error
        self.skipWaiting();
      }
    })(),
  );
});

// Background caching function - runs after installation
async function cacheAdditionalFiles() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const response = await fetch(CACHE_MAP_URL);

    if (!response.ok) {
      console.warn("[SW] Cache map not available");
      return;
    }

    const urls: string[] = await response.json();
    console.log(`[SW] Background caching ${urls.length} files`);

    // Filter out problematic URLs
    const validUrls = urls.filter((url) => {
      // Skip external URLs
      if (url.startsWith("http") && !url.startsWith(self.location.origin)) {
        return false;
      }
      // Skip data URLs
      if (url.startsWith("data:")) {
        return false;
      }
      // Skip the service worker itself
      if (url.includes("sw.js") || url.includes("service-worker")) {
        return false;
      }
      return true;
    });

    console.log(`[SW] Filtered to ${validUrls.length} valid URLs`);

    // Cache in small batches with delays to avoid overwhelming the browser
    const batchSize = 10;
    let cached = 0;

    for (let i = 0; i < validUrls.length; i += batchSize) {
      const batch = validUrls.slice(i, i + batchSize);

      await Promise.allSettled(
        batch.map(async (url) => {
          try {
            const resp = await fetch(url, {
              cache: "no-cache",
              credentials: "same-origin",
            });

            if (resp.ok && resp.status === 200) {
              await cache.put(url, resp);
              cached++;
              return true;
            }
            return false;
          } catch (err) {
            console.warn(`[SW] Failed to cache ${url}:`, err);
            return false;
          }
        }),
      );

      // Add small delay between batches
      if (i + batchSize < validUrls.length) {
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    }

    console.log(
      `[SW] Background caching complete: ${cached}/${validUrls.length} files cached`,
    );
  } catch (err) {
    console.error("[SW] Background caching error:", err);
  }
}

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating service worker", CACHE_VERSION);

  event.waitUntil(
    (async () => {
      // Delete old caches
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter(
            (name) =>
              name.startsWith("maschpu-") &&
              name !== CACHE_NAME &&
              name !== RUNTIME_CACHE,
          )
          .map((name) => {
            console.log("[SW] Deleting old cache:", name);
            return caches.delete(name);
          }),
      );

      // Take control of all clients
      await self.clients.claim();

      // Notify clients about the update
      const clients = await self.clients.matchAll();
      clients.forEach((client) => {
        client.postMessage({
          type: "SW_UPDATED",
          version: CACHE_VERSION,
        });
      });
    })(),
  );
});

// Fetch event - intelligent caching strategy
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== self.location.origin) {
    return;
  }

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  event.respondWith(
    (async () => {
      // Network-first strategy for dynamic content
      if (
        NETWORK_FIRST_PATTERNS.some((pattern) => pattern.test(url.pathname))
      ) {
        try {
          const response = await fetch(request);
          if (response.ok) {
            // Update cache with fresh data
            const cache = await caches.open(RUNTIME_CACHE);
            cache.put(request, response.clone());
          }
          return response;
        } catch (err) {
          // Fallback to cache if network fails
          const cached = await caches.match(request);
          if (cached) {
            return cached;
          }
          throw err;
        }
      }

      // Cache-first strategy for static assets
      if (CACHE_FIRST_PATTERNS.some((pattern) => pattern.test(url.pathname))) {
        const cached = await caches.match(request);
        if (cached) {
          return cached;
        }

        try {
          const response = await fetch(request);
          if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, response.clone());
          }
          return response;
        } catch (err) {
          // If network fails and we have a cached version, return it
          const fallbackCached = await caches.match(request);
          if (fallbackCached) {
            return fallbackCached;
          }
          throw err;
        }
      }

      // Default: Stale-while-revalidate for better offline support
      // This ensures cached content is returned immediately while updating in background
      const cached = await caches.match(request);

      const fetchPromise = fetch(request)
        .then(async (response) => {
          if (response.ok) {
            const cache = await caches.open(RUNTIME_CACHE);
            cache.put(request, response.clone());
          }
          return response;
        })
        .catch(() => null);

      // Return cached content immediately if available
      if (cached) {
        // Update cache in background
        fetchPromise.catch(() => {});
        return cached;
      }

      // Otherwise wait for network
      const response = await fetchPromise;
      if (response) {
        return response;
      }

      // Return offline page for navigation requests as last resort
      if (request.mode === "navigate") {
        const offlineCache = await caches.match("/");
        if (offlineCache) {
          return offlineCache;
        }
      }

      throw new Error("No cached content and network unavailable");
    })(),
  );
});

// Message event - handle messages from clients
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data?.type === "GET_VERSION") {
    event.ports[0].postMessage({
      version: CACHE_VERSION,
    });
  }

  if (event.data?.type === "CLEAR_CACHE") {
    event.waitUntil(
      (async () => {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
        event.ports[0].postMessage({ success: true });
      })(),
    );
  }
});

// Periodic background sync for updates (if supported)
self.addEventListener("periodicsync", (event: any) => {
  if (event.tag === "check-updates") {
    event.waitUntil(
      (async () => {
        try {
          const response = await fetch(CACHE_MAP_URL);
          if (response.ok) {
            const urls: string[] = await response.json();
            const cache = await caches.open(CACHE_NAME);

            // Update cache with new files
            for (const url of urls) {
              try {
                const resp = await fetch(url);
                if (resp.ok) {
                  await cache.put(url, resp);
                }
              } catch (err) {
                // Ignore errors
              }
            }
          }
        } catch (err) {
          console.error("[SW] Background sync failed:", err);
        }
      })(),
    );
  }
});
