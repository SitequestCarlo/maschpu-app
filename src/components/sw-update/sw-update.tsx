import { component$, useSignal, useVisibleTask$, $ } from "@builder.io/qwik";
import styles from "./sw-update.module.css";

/**
 * Component that shows a notification when a new version of the app is available
 * and allows the user to update
 */
export const SwUpdate = component$(() => {
  const showUpdate = useSignal(false);
  const isUpdating = useSignal(false);
  const cacheProgress = useSignal({ cached: 0, total: 0, complete: false });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    if ("serviceWorker" in navigator) {
      // Listen for service worker updates and cache progress
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data?.type === "SW_UPDATED") {
          showUpdate.value = true;
        }

        if (event.data?.type === "CACHE_PROGRESS") {
          cacheProgress.value = {
            cached: event.data.cached,
            total: event.data.total,
            complete: event.data.complete,
          };
        }
      });

      // Check if there's a waiting service worker
      navigator.serviceWorker.ready.then((registration) => {
        if (registration.waiting) {
          showUpdate.value = true;
        }

        // Listen for updates
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (
                newWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                showUpdate.value = true;
              }
            });
          }
        });
      });
    }
  });

  const handleUpdate = $(() => {
    isUpdating.value = true;

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        if (registration.waiting) {
          // Tell the waiting service worker to skip waiting
          registration.waiting.postMessage({ type: "SKIP_WAITING" });
        }
      });

      // Reload the page when the new service worker takes control
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        window.location.reload();
      });
    }
  });

  const handleDismiss = $(() => {
    showUpdate.value = false;
  });

  if (!showUpdate.value) {
    return null;
  }

  const progressPercent =
    cacheProgress.value.total > 0
      ? Math.round(
          (cacheProgress.value.cached / cacheProgress.value.total) * 100,
        )
      : 0;

  return (
    <div class={styles.updateBanner}>
      <div class={styles.updateContent}>
        <div class={styles.updateTextContainer}>
          <p class={styles.updateText}>
            {cacheProgress.value.complete
              ? "Neue Version bereit!"
              : "Eine neue Version wird geladen..."}
          </p>
          {cacheProgress.value.total > 0 && (
            <p class={styles.progressText}>
              {cacheProgress.value.cached} von {cacheProgress.value.total}{" "}
              Dateien
              {cacheProgress.value.complete ? " geladen" : " werden geladen"} (
              {progressPercent}%)
            </p>
          )}
        </div>
        <div class={styles.updateButtons}>
          <button
            class={styles.updateButton}
            onClick$={handleUpdate}
            disabled={isUpdating.value || !cacheProgress.value.complete}
          >
            {isUpdating.value ? "Aktualisiere..." : "Jetzt aktualisieren"}
          </button>
          <button
            class={styles.dismissButton}
            onClick$={handleDismiss}
            disabled={isUpdating.value}
          >
            Später
          </button>
        </div>
      </div>
    </div>
  );
});
