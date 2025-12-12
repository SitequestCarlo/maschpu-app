import type { RequestHandler } from '@builder.io/qwik-city';
import { trackPageView, getClientIp, getClientLanguage } from '../lib/analytics';

export const onRequest: RequestHandler = ({ url, request }) => {
  // Skip pre-cache requests from service worker (not real user visits)
  if (request.headers.get('x-purpose') === 'precache') {
    return;
  }

  // Only track actual page views, not static assets, API calls, or tracking endpoint
  const isStaticAsset = /^\/(build|assets|fonts|images|favicon|robots|manifest|service-worker|q-|@qwik|api\/)/i.test(url.pathname) ||
    /\.(js|css|map|ico|png|jpg|jpeg|gif|svg|webp|woff|woff2|ttf|eot|json)$/i.test(url.pathname);

  if (!isStaticAsset) {
    // Track page view (fire and forget - don't block the response)
    // Uses the real client IP from nginx proxy headers
    trackPageView({
      url: url.pathname,
      hostname: 'maschpu.de',
      referrer: request.headers.get('referer') || undefined,
      language: getClientLanguage(request),
      userAgent: request.headers.get('user-agent') || undefined,
      ip: getClientIp(request),
    });
  }
};