import type { RequestHandler } from '@builder.io/qwik-city';
import { trackPageView, getClientIp, getClientLanguage } from '../../../lib/analytics';

/**
 * API endpoint for service worker to report cached page views
 * This allows tracking even when pages are served from SW cache
 */
export const onPost: RequestHandler = async ({ request, json }) => {
  try {
    const body = await request.json();
    const { url, referrer } = body;

    if (!url || typeof url !== 'string') {
      json(400, { error: 'Missing url parameter' });
      return;
    }

    // Track the page view with client info from headers
    await trackPageView({
      url,
      hostname: 'maschpu.de',
      referrer: referrer || undefined,
      language: getClientLanguage(request),
      userAgent: request.headers.get('user-agent') || undefined,
      ip: getClientIp(request),
    });

    json(200, { ok: true });
  } catch (error) {
    // Don't fail the request, just log
    console.error('[Track API] Error:', error);
    json(200, { ok: true }); // Still return success to not block SW
  }
};

// Allow GET for simple beacon tracking (navigator.sendBeacon fallback)
export const onGet: RequestHandler = async ({ url, request, json }) => {
  const trackUrl = url.searchParams.get('url');
  const referrer = url.searchParams.get('referrer');

  if (!trackUrl) {
    json(400, { error: 'Missing url parameter' });
    return;
  }

  await trackPageView({
    url: trackUrl,
    hostname: 'maschpu.de',
    referrer: referrer || undefined,
    language: getClientLanguage(request),
    userAgent: request.headers.get('user-agent') || undefined,
    ip: getClientIp(request),
  });

  json(200, { ok: true });
};
