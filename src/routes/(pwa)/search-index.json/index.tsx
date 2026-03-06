import type { RequestHandler } from "@builder.io/qwik-city";
import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative, sep } from "path";

interface SearchEntry {
  url: string;
  title: string;
  desc?: string;
  tags?: string[];
}

/** Recursively find all index.mdx and index.tsx files */
function walk(dir: string, results: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      walk(full, results);
    } else if (name === "index.mdx" || name === "index.tsx") {
      results.push(full);
    }
  }
  return results;
}

/** Extract YAML frontmatter fields from an MDX file */
function parseMdxFrontmatter(content: string) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;

  const block = match[1];
  const get = (key: string) => {
    const re = new RegExp(`^${key}:[ \\t]*(.*)$`, "m");
    const m = block.match(re);
    return m ? m[1].trim() : "";
  };

  return { title: get("title"), description: get("description"), tags: get("tags"), draft: get("draft") === "true" };
}

/** Extract DocumentHead fields from a TSX file */
function parseTsxHead(content: string) {
  const titleMatch = content.match(/title:\s*["'`]([^"'`]*)["'`]/);
  const title = titleMatch ? titleMatch[1] : "";

  const descMatch = content.match(
    /name:\s*["']description["'][\s\S]*?content:\s*\n?\s*["'`]([^"'`]*)["'`]/,
  );
  const description = descMatch ? descMatch[1] : "";

  const tagsMatch = content.match(
    /name:\s*["']search:tags["'][\s\S]*?content:\s*["'`]([^"'`]*)["'`]/,
  );
  const tags = tagsMatch ? tagsMatch[1] : "";

  return { title, description, tags };
}

/** Convert a file path under src/routes/ to a URL path */
function fileToUrl(routesDir: string, filePath: string): string | null {
  let rel = relative(routesDir, filePath)
    .split(sep)
    .join("/")
    .replace(/\/index\.(tsx|mdx)$/, "");

  // Remove Qwik City route groups like (elektropumpen), (legal), (pwa) etc.
  rel = rel.replace(/\([^)]+\)\//g, "");

  if (
    rel.includes("dyn-sitemap") ||
    rel.includes("cache-map") ||
    rel.includes("search-index") ||
    rel === "404" ||
    rel === "plugin" ||
    rel === "layout"
  ) {
    return null;
  }

  return "/" + (rel ? rel + "/" : "");
}

export const onGet: RequestHandler = async (ev) => {
  const routesDir = join(process.cwd(), "src", "routes");
  const files = walk(routesDir);
  const index: SearchEntry[] = [];

  for (const file of files) {
    const url = fileToUrl(routesDir, file);
    if (!url) continue;

    const content = readFileSync(file, "utf-8");
    let meta;

    if (file.endsWith(".mdx")) {
      meta = parseMdxFrontmatter(content);
    } else {
      if (!content.includes("DocumentHead")) continue;
      meta = parseTsxHead(content);
    }

    if (!meta || !meta.title) continue;
    if ("draft" in meta && meta.draft) continue;

    const entry: SearchEntry = { url, title: meta.title };
    if (meta.description) entry.desc = meta.description;
    if (meta.tags) {
      entry.tags = meta.tags.split(",").map((t) => t.trim()).filter(Boolean);
    }

    index.push(entry);
  }

  index.sort((a, b) => a.title.localeCompare(b.title, "de"));

  ev.headers.set("Content-Type", "application/json");
  ev.headers.set("Cache-Control", "public, max-age=3600, s-maxage=86400");
  ev.send(200, JSON.stringify(index));
};
