import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import styles from './cache-progress.module.css';

/**
 * Component that shows progress when service worker is caching files
 */
export const CacheProgress = component$(() => {
  const cached = useSignal(0);
  const total = useSignal(0);
  const isVisible = useSignal(false);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const handleProgress = (event: CustomEvent) => {
      const { cached: cachedCount, total: totalCount } = event.detail;
      cached.value = cachedCount;
      total.value = totalCount;
      
      // Show the indicator when caching starts
      if (totalCount > 0 && cachedCount < totalCount) {
        isVisible.value = true;
      }
      
      // Hide after a delay when caching completes
      if (cachedCount === totalCount && totalCount > 0) {
        setTimeout(() => {
          isVisible.value = false;
        }, 2000);
      }
    };

    window.addEventListener('sw-cache-progress', handleProgress as EventListener);

    return () => {
      window.removeEventListener('sw-cache-progress', handleProgress as EventListener);
    };
  });

  if (!isVisible.value) {
    return null;
  }

  const percentage = total.value > 0 ? Math.round((cached.value / total.value) * 100) : 0;

  return (
    <div class={styles.cacheIndicator} role="status" aria-live="polite">
      <div class={styles.cacheContent}>
        <svg
          class={styles.cacheIcon}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        <span class={styles.cacheText}>
          {cached.value}/{total.value} Dateien zwischengespeichert ({percentage}%)
        </span>
      </div>
    </div>
  );
});
