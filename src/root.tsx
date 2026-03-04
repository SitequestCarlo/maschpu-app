import { component$ } from "@builder.io/qwik";
import { QwikCityProvider, RouterOutlet } from "@builder.io/qwik-city";
import { RouterHead } from "./components/router-head/router-head";
import { OfflineIndicator } from "./components/offline-indicator/offline-indicator";
import { CacheProgress } from "./components/cache-progress/cache-progress";
import { ServiceWorkerRegistration } from "./components/sw-registration/sw-registration";
import { useNetworkProvider } from "./contexts/network-context";

import "./global.css";

export default component$(() => {
  /**
   * The root of a QwikCity site always start with the <QwikCityProvider> component,
   * immediately followed by the document's <head> and <body>.
   *
   * Don't remove the `<head>` and `<body>` elements.
   */

  // Provide network context globally
  useNetworkProvider();

  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#fafafa" />
        <RouterHead />
      </head>
      <body lang="de">
        <CacheProgress />
        <OfflineIndicator />
        <RouterOutlet />
        <ServiceWorkerRegistration />
      </body>
    </QwikCityProvider>
  );
});
