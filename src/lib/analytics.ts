/**
 * Server-side Umami Analytics
 * 
 * Tracks page views and events without any client-side JavaScript.
 * All requests are made server-side for maximum privacy and ad-blocker immunity.
 */

const UMAMI_HOST = process.env.UMAMI_HOST || 'https://analytics.site.quest';
const UMAMI_WEBSITE_ID = process.env.UMAMI_WEBSITE_ID || '669fc97e-c864-4055-8a2e-7effc7c46778';
const IS_DEV = process.env.NODE_ENV === 'development';
const TRACKING_TIMEOUT = 3000; // 3 second timeout to prevent hanging

interface PageViewPayload {
  hostname: string;
  language?: string;
  referrer?: string;
  screen?: string;
  title?: string;
  url: string;
  website: string;
  ip?: string;
}

interface EventPayload extends PageViewPayload {
  name: string;
  data?: Record<string, string | number | boolean>;
}

interface TrackOptions {
  url: string;
  referrer?: string;
  hostname?: string;
  language?: string;
  title?: string;
  userAgent?: string;
  ip?: string;
}

interface EventOptions extends TrackOptions {
  name: string;
  data?: Record<string, string | number | boolean>;
}

/**
 * Track a page view
 */
export async function trackPageView(options: TrackOptions): Promise<void> {
  // Skip tracking in development mode
  if (IS_DEV) {
    return;
  }

  const payload: PageViewPayload = {
    website: UMAMI_WEBSITE_ID,
    hostname: options.hostname || 'site.quest',
    url: options.url,
    referrer: options.referrer || '',
    language: options.language,
    ip: options.ip,
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TRACKING_TIMEOUT);
    
    await fetch(`${UMAMI_HOST}/api/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': options.userAgent || 'Qwik-Server',
        // Send IP in both header and payload for nginx proxy compatibility
        ...(options.ip && { 'X-Forwarded-For': options.ip }),
        ...(options.ip && { 'X-Real-IP': options.ip }),
      },
      body: JSON.stringify({
        type: 'event',
        payload,
      }),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));
  } catch (error) {
    // Silently fail - analytics should never break the site
    // This handles offline mode and network errors gracefully
    if (error instanceof Error && error.name !== 'AbortError') {
      console.error('[Analytics] Failed to track page view:', error.message);
    }
  }
}

/**
 * Track a custom event
 */
export async function trackEvent(options: EventOptions): Promise<void> {
  // Skip tracking in development mode
  if (IS_DEV) {
    return;
  }

  const payload: EventPayload = {
    website: UMAMI_WEBSITE_ID,
    hostname: options.hostname || 'site.quest',
    url: options.url,
    referrer: options.referrer || '',
    language: options.language,
    name: options.name,
    data: options.data,
    ip: options.ip,
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TRACKING_TIMEOUT);
    
    await fetch(`${UMAMI_HOST}/api/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': options.userAgent || 'Qwik-Server',
        // Send IP in both header and payload for nginx proxy compatibility
        ...(options.ip && { 'X-Forwarded-For': options.ip }),
        ...(options.ip && { 'X-Real-IP': options.ip }),
      },
      body: JSON.stringify({
        type: 'event',
        payload,
      }),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));
  } catch (error) {
    // Silently fail - analytics should never break the site
    // This handles offline mode and network errors gracefully
    if (error instanceof Error && error.name !== 'AbortError') {
      console.error('[Analytics] Failed to track event:', error.message);
    }
  }
}

/**
 * Extract client IP from request headers
 */
export function getClientIp(request: Request): string | undefined {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    undefined
  );
}

/**
 * Extract language from Accept-Language header
 */
export function getClientLanguage(request: Request): string | undefined {
  return request.headers.get('accept-language')?.split(',')[0];
}
