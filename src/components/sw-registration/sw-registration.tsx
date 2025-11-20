import { component$, useVisibleTask$ } from '@builder.io/qwik';

/**
 * Component that registers the custom service worker
 * Handles automatic updates in the background without user intervention
 */
export const ServiceWorkerRegistration = component$(() => {
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    if ('serviceWorker' in navigator) {
      // Listen for cache progress via BroadcastChannel (works during initial install)
      const progressChannel = new BroadcastChannel('sw-cache-progress');
      progressChannel.onmessage = (event) => {
        if (event.data && event.data.type === 'CACHE_PROGRESS') {
          // Forward cache progress to the cache progress component via custom event
          window.dispatchEvent(new CustomEvent('sw-cache-progress', {
            detail: {
              cached: event.data.cached,
              total: event.data.total,
              complete: event.data.complete
            }
          }));
        }
      };
      
      // Register the custom service worker with offline caching
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[App] Service Worker registered:', registration.scope);
          
          // Check for updates immediately
          registration.update().catch(err => {
            console.log('[App] Initial update check failed:', err);
          });
          
          // Check for updates every 60 seconds
          setInterval(() => {
            console.log('[App] Checking for service worker updates...');
            registration.update().catch(err => {
              console.log('[App] Update check failed:', err);
            });
          }, 60000);
          
          // Listen for updates
          registration.addEventListener('updatefound', () => {
            console.log('[App] Service Worker update found');
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                console.log('[App] New service worker state:', newWorker.state);
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New version available - update automatically
                  console.log('[App] New service worker available, updating automatically...');
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('[App] Service Worker registration failed:', error);
        });
      
      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'CACHE_PROGRESS') {
          // Forward cache progress to the cache progress component via custom event
          window.dispatchEvent(new CustomEvent('sw-cache-progress', {
            detail: {
              cached: event.data.cached,
              total: event.data.total,
              complete: event.data.complete
            }
          }));
        }
      });
      
      // Reload when new service worker takes control
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          console.log('[App] New service worker activated, reloading page...');
          refreshing = true;
          window.location.reload();
        }
      });
    }
  });

  return null;
});
