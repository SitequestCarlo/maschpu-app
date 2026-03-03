/**
 * PWA Utilities
 * Helper functions for managing PWA features, service worker, and offline capabilities
 */

/**
 * Check if the app is currently running in offline mode
 */
export function isOffline(): boolean {
  return !navigator.onLine;
}

/**
 * Check if we have real network connectivity by trying to fetch a resource
 */
export async function checkRealConnectivity(): Promise<boolean> {
  if (!navigator.onLine) {
    return false;
  }

  try {
    // Try to fetch a small resource with a timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    const response = await fetch('/favicon.svg', {
      method: 'HEAD',
      cache: 'no-cache',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Get the current service worker version
 */
export async function getServiceWorkerVersion(): Promise<string | null> {
  if (!('serviceWorker' in navigator)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    if (registration.active) {
      return new Promise((resolve) => {
        const messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = (event) => {
          resolve(event.data.version || null);
        };
        registration.active?.postMessage(
          { type: 'GET_VERSION' },
          [messageChannel.port2]
        );
      });
    }
  } catch (error) {
    console.error('Error getting service worker version:', error);
  }

  return null;
}

/**
 * Clear all caches manually (useful for debugging or forced refresh)
 */
export async function clearAllCaches(): Promise<boolean> {
  if (!('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    if (registration.active) {
      return new Promise((resolve) => {
        const messageChannel = new MessageChannel();
        messageChannel.port1.onmessage = (event) => {
          resolve(event.data.success || false);
        };
        registration.active?.postMessage(
          { type: 'CLEAR_CACHE' },
          [messageChannel.port2]
        );
      });
    }
  } catch (error) {
    console.error('Error clearing caches:', error);
  }

  return false;
}

/**
 * Check if service worker is supported
 */
export function isServiceWorkerSupported(): boolean {
  return 'serviceWorker' in navigator;
}

/**
 * Check if the app is installed as a PWA
 */
export function isInstalled(): boolean {
  // Check if running in standalone mode (installed PWA)
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true;
  }

  // Check for iOS standalone mode
  if ((window.navigator as any).standalone === true) {
    return true;
  }

  return false;
}

/**
 * Listen for online/offline events
 */
export function onConnectivityChange(callback: (online: boolean) => void): () => void {
  const onlineHandler = () => callback(true);
  const offlineHandler = () => callback(false);

  window.addEventListener('online', onlineHandler);
  window.addEventListener('offline', offlineHandler);

  // Return cleanup function
  return () => {
    window.removeEventListener('online', onlineHandler);
    window.removeEventListener('offline', offlineHandler);
  };
}

/**
 * Get cache storage information (if supported)
 */
export async function getCacheInfo(): Promise<{
  usage: number;
  quota: number;
  percentage: number;
} | null> {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    try {
      const estimate = await navigator.storage.estimate();
      const usage = estimate.usage || 0;
      const quota = estimate.quota || 0;
      const percentage = quota > 0 ? (usage / quota) * 100 : 0;

      return {
        usage,
        quota,
        percentage,
      };
    } catch (error) {
      console.error('Error getting cache info:', error);
    }
  }

  return null;
}

/**
 * Format bytes to human-readable format
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Request persistent storage (prevents browser from clearing cache)
 */
export async function requestPersistentStorage(): Promise<boolean> {
  if ('storage' in navigator && 'persist' in navigator.storage) {
    try {
      const isPersisted = await navigator.storage.persist();
      console.log(`Persistent storage ${isPersisted ? 'granted' : 'denied'}`);
      return isPersisted;
    } catch (error) {
      console.error('Error requesting persistent storage:', error);
    }
  }

  return false;
}

/**
 * Check if persistent storage is already granted
 */
export async function isPersistentStorageGranted(): Promise<boolean> {
  if ('storage' in navigator && 'persisted' in navigator.storage) {
    try {
      return await navigator.storage.persisted();
    } catch (error) {
      console.error('Error checking persistent storage:', error);
    }
  }

  return false;
}
