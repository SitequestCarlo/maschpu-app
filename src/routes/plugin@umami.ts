import type { RequestHandler } from '@builder.io/qwik-city';
import { trackPageView, trackEvent, getClientIp, getClientLanguage } from '../lib/analytics';

/**
 * Bot/scanner path patterns to track as events (not page views)
 */
const BOT_PATH_PATTERNS = [
  // PHP files (not used in this app)
  /\.php$/i,
  // Environment/config files (sensitive)
  /\.env/i,
  /\.ya?ml$/i,
  /\.config/i,
  /\.git/i,
  // Hidden files/directories
  /\/\./i,
  // WordPress paths
  /^\/wp-/i,
  /^\/wordpress/i,
  // Admin/dashboard paths
  /\/admin/i,
  /\/dash(board)?/i,
  /\/login/i,
  /\/panel/i,
  // Debug/profiler paths
  /\/debug/i,
  /\/_profiler/i,
  /\/profiler/i,
  /\/phpinfo/i,
  /\/info\/?$/i,
  /\/test\/?$/i,
  // Common directory probes
  /\/files\/?/i,
  /\/mini\/?/i,
  /\/uploads?\/?/i,
  /\/backup/i,
  /\/temp\/?/i,
  /\/tmp\/?/i,
  // Common attack vectors
  /^\/cgi-bin/i,
  /^\/xmlrpc/i,
  // Common webshell/backdoor names
  /^\/alfa/i,
  /^\/shell/i,
  /^\/c99/i,
  /^\/r57/i,
  // Other scanner targets
  /^\/phpmyadmin/i,
  /^\/mysql/i,
];

/**
 * Crawler/bot User-Agent patterns to exclude from tracking
 */
const CRAWLER_USER_AGENTS = [
  // Search engines
  /googlebot/i,
  /bingbot/i,
  /slurp/i,           // Yahoo
  /duckduckbot/i,
  /baiduspider/i,
  /yandexbot/i,
  /applebot/i,
  // Social media
  /facebookexternalhit/i,
  /twitterbot/i,
  /linkedinbot/i,
  /whatsapp/i,
  /telegrambot/i,
  /discordbot/i,
  // SEO tools
  /semrushbot/i,
  /ahrefsbot/i,
  /mj12bot/i,
  /dotbot/i,
  /petalbot/i,
  /bytespider/i,
  // Generic bot patterns
  /bot\b/i,
  /crawler/i,
  /spider/i,
  /headless/i,
];

/**
 * Static asset patterns to exclude from tracking
 */
const STATIC_ASSET_PATTERNS = [
  /^\/(build|assets|fonts|images|favicon|robots|manifest|service-worker|q-|@qwik|api\/)/i,
  /\.(js|css|map|ico|png|jpg|jpeg|gif|svg|webp|woff|woff2|ttf|eot|xml|txt)$/i,
  // Exclude json except q-data.json (used for SPA navigation tracking)
  /\.json$/i,
];

/**
 * Check if this is a SPA navigation request (q-data.json)
 * Returns the page path if it's a trackable SPA navigation, null otherwise
 */
function getSPANavigationPath(url: URL, request: Request): string | null {
  // Only track q-data.json requests (Qwik SPA navigation)
  if (!url.pathname.endsWith('/q-data.json')) {
    return null;
  }
  
  // Skip prefetch requests
  const purpose = request.headers.get('purpose') || '';
  const secPurpose = request.headers.get('sec-purpose') || '';
  if (purpose === 'prefetch' || purpose === 'preload' || secPurpose.includes('prefetch')) {
    return null;
  }
  
  // Extract page path: /pumpen/q-data.json -> /pumpen/
  return url.pathname.replace(/q-data\.json$/, '');
}

/**
 * Umami Analytics Plugin
 * 
 * Handles server-side page view tracking with bot filtering.
 * Bot/scanner requests are tracked as events, not page views.
 * Crawlers are excluded entirely.
 */
export const onRequest: RequestHandler = ({ request, url }) => {
  // Skip pre-cache requests from service worker (not real user visits)
  if (request.headers.get('x-purpose') === 'precache') {
    return;
  }

  const userAgent = request.headers.get('user-agent') || '';
  const isCrawler = CRAWLER_USER_AGENTS.some(pattern => pattern.test(userAgent));

  // Skip crawlers entirely
  if (isCrawler) {
    return;
  }

  // Check if this is a SPA navigation (q-data.json request)
  const spaPagePath = getSPANavigationPath(url, request);
  if (spaPagePath) {
    // Track SPA navigation with the actual page path
    trackPageView({
      url: spaPagePath,
      hostname: 'maschpu.de',
      referrer: request.headers.get('referer') || undefined,
      language: getClientLanguage(request),
      userAgent: userAgent || undefined,
      ip: getClientIp(request),
    });
    return;
  }

  const isStaticAsset = STATIC_ASSET_PATTERNS.some(pattern => pattern.test(url.pathname));
  const isBotPath = BOT_PATH_PATTERNS.some(pattern => pattern.test(url.pathname));

  // Skip static assets
  if (isStaticAsset) {
    return;
  }

  const commonOptions = {
    url: url.pathname,
    hostname: 'maschpu.de',
    referrer: request.headers.get('referer') || undefined,
    language: getClientLanguage(request),
    userAgent: userAgent || undefined,
    ip: getClientIp(request),
  };

  // Track bot paths as events (fire and forget)
  if (isBotPath) {
    trackEvent({
      ...commonOptions,
      name: 'bot_blocked',
      data: { path: url.pathname },
    });
    return;
  }

  // Track legitimate page views (fire and forget)
  trackPageView(commonOptions);
};
