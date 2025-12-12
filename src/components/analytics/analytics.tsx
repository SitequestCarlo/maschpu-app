import { component$, useVisibleTask$, useSignal } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';

/**
 * Client-side analytics tracker for SPA navigations
 * 
 * Tracks page views when the user actually navigates (URL changes).
 * Full page loads are tracked server-side, this only handles SPA transitions.
 */
export const Analytics = component$(() => {
  const location = useLocation();
  const lastTrackedPath = useSignal('');
  
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    const currentPath = track(() => location.url.pathname);
    
    // Skip if already tracked this path (initial load is handled server-side)
    if (lastTrackedPath.value === currentPath) {
      return;
    }
    
    // Skip first render - server-side plugin handles initial page load
    if (!lastTrackedPath.value) {
      lastTrackedPath.value = currentPath;
      return;
    }
    
    // Update tracked path
    lastTrackedPath.value = currentPath;
    
    // Skip in dev mode
    if (location.url.hostname === 'localhost' || location.url.hostname === '127.0.0.1') {
      return;
    }
    
    // Track the SPA navigation
    console.log('[Analytics] Tracking SPA navigation:', currentPath);
    
    const params = new URLSearchParams({
      url: currentPath,
      referrer: document.referrer || '',
    });
    
    fetch(`/api/track?${params.toString()}`, {
      method: 'GET',
      keepalive: true,
    }).catch(() => {
      // Silently fail - analytics should never break the app
    });
  });
  
  return null;
});
