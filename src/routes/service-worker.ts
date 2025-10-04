/*
 * WHAT IS THIS FILE?
 *
 * This file is used for PWA functionality and custom service worker logic.
 * As of Qwik 1.16+, the setupServiceWorker() function is deprecated as
 * Qwik now automatically embeds preloading logic into the application.
 * 
 * https://qwik.dev/qwikcity/prefetching/overview/
 *
 * You can add custom service worker functionality here if needed.
 */
import { setupPwa } from "@qwikdev/pwa/sw";

// setupServiceWorker() is deprecated - Qwik now handles preloading automatically
// Keep this file only if you need PWA functionality or custom service worker logic

setupPwa();
