import type { RequestHandler } from '@builder.io/qwik-city';
import { trackPageView, getClientIp, getClientLanguage } from '../../../lib/analytics';

const jsonResponse = (status: number, data: object) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
};

/**
 * API endpoint for service worker to report cached page views
 * This allows tracking even when pages are served from SW cache
 */
export const onPost: RequestHandler = async (ev) => {
  const { request } = ev;
  try {
    // Read body as text first to handle empty bodies gracefully
    const text = await request.text();
    
    if (!text) {
      ev.send(jsonResponse(400, { error: 'Empty request body' }));
      return;
    }

    let body;
    try {
      body = JSON.parse(text);
    } catch {
      ev.send(jsonResponse(400, { error: 'Invalid JSON' }));
      return;
    }

    const { url, referrer } = body;

    if (!url || typeof url !== 'string') {
      ev.send(jsonResponse(400, { error: 'Missing url parameter' }));
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

    ev.send(jsonResponse(200, { ok: true }));
  } catch (error) {
    // Don't fail the request, just log
    console.error('[Track API] Error:', error);
    ev.send(jsonResponse(200, { ok: true })); // Still return success to not block SW
  }
};

// Allow GET for simple beacon tracking (navigator.sendBeacon fallback)
export const onGet: RequestHandler = async (ev) => {
  const { url, request } = ev;
  const trackUrl = url.searchParams.get('url');
  const referrer = url.searchParams.get('referrer');

  if (!trackUrl) {
    ev.send(jsonResponse(400, { error: 'Missing url parameter' }));
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

  ev.send(jsonResponse(200, { ok: true }));
};
