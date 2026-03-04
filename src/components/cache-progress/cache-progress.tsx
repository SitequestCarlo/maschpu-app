import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import styles from "./cache-progress.module.css";

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

    window.addEventListener(
      "sw-cache-progress",
      handleProgress as EventListener,
    );

    return () => {
      window.removeEventListener(
        "sw-cache-progress",
        handleProgress as EventListener,
      );
    };
  });

  if (!isVisible.value) {
    return null;
  }

  const percentage =
    total.value > 0 ? Math.round((cached.value / total.value) * 100) : 0;

  return (
    <div class={styles.cacheIndicator} role="status" aria-live="polite">
      <div
        class={styles.cacheFill}
        style={{ width: `${percentage}%` }}
      />
      <span class={styles.cacheText}>
        {percentage}% zwischengespeichert
      </span>
    </div>
  );
});
