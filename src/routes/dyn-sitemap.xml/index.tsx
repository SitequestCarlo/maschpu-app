import type { RequestHandler } from "@builder.io/qwik-city";
import { routes } from "@qwik-city-plan";
import { readdirSync, readFileSync, statSync } from "fs";
import { join, relative, sep } from "path";

const SITE_URL = "https://maschpu.de";

/**
 * Collect URL paths of pages marked as draft: true
 */
function collectDraftUrls(): Set<string> {
  const routesDir = join(process.cwd(), "src", "routes");
  const drafts = new Set<string>();

  function walk(dir: string) {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) {
        walk(full);
      } else if (name === "index.mdx") {
        const content = readFileSync(full, "utf-8");
        const fm = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
        if (fm && /^draft:\s*true$/m.test(fm[1])) {
          let rel = relative(routesDir, full).split(sep).join("/").replace(/\/index\.mdx$/, "");
          rel = rel.replace(/\([^)]+\)\//g, "");
          drafts.add("/" + rel + "/");
        }
      }
    }
  }

  walk(routesDir);
  return drafts;
}

/**
 * Routes to exclude from sitemap
 */
const EXCLUDED_PATTERNS = [
  /dyn-sitemap\.xml/, // This sitemap
  /api/, // API routes
  /cache-map\.json/, // Cache map
  /404/, // 404 pages
  /q-data\.json/, // Qwik data files
];

/**
 * Normalize route - remove trailing slash for comparison
 */
function normalizeRoute(route: string): string {
  if (route === "/") return route;
  return route.replace(/\/$/, "");
}

/**
 * Get priority based on route depth and type
 */
function getPriority(route: string): number {
  const normalized = normalizeRoute(route);
  if (normalized === "/") return 1.0;
  if (normalized === "/impressum") return 0.3;

  const depth = normalized.split("/").filter(Boolean).length;

  // Main sections
  if (depth === 1) return 0.9;
  // Sub-pages (calculators, pump details, theory pages)
  if (depth === 2) return 0.7;
  // Deeper pages
  return 0.5;
}

/**
 * Get change frequency based on route type
 */
function getChangefreq(route: string): string {
  if (route === "/") return "weekly";
  if (route.includes("impressum")) return "yearly";
  if (route.includes("/rechner")) return "monthly";
  if (route.includes("/pumpen")) return "monthly";
  if (route.includes("/theorie")) return "monthly";
  return "monthly";
}

/**
 * Generate sitemap XML from Qwik routes
 */
function createSitemap(baseUrl: string): string {
  const today = new Date().toISOString().split("T")[0];
  const draftUrls = collectDraftUrls();

  // Extract routes from Qwik City plan
  const siteRoutes = routes
    .map(([route]) => route as string)
    .filter((route) => {
      // Exclude dynamic routes with parameters
      if (route.includes("[") || route.includes("]")) return false;
      // Exclude routes matching exclusion patterns
      if (EXCLUDED_PATTERNS.some((pattern) => pattern.test(route)))
        return false;
      // Exclude draft pages
      if (draftUrls.has(route)) return false;
      return true;
    })
    .sort();

  const urlEntries = siteRoutes
    .map((route) => {
      // Ensure proper URL format with slash between domain and path
      const path = route.startsWith("/") ? route : `/${route}`;
      const loc = route === "/" ? baseUrl : `${baseUrl}${path}`;
      return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${getChangefreq(route)}</changefreq>
    <priority>${getPriority(route)}</priority>
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

export const onGet: RequestHandler = (ev) => {
  const siteUrl = ev.env.get("ORIGIN") || SITE_URL;
  const sitemap = createSitemap(siteUrl);

  const response = new Response(sitemap, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400",
    },
  });

  ev.send(response);
};
