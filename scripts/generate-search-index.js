/**
 * Generates a static search index (public/search-index.json) from
 * MDX frontmatter and TSX DocumentHead exports.
 *
 * Run: node scripts/generate-search-index.js
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, relative, sep } from "path";

const ROUTES_DIR = join(process.cwd(), "src", "routes");
const OUT_FILE = join(process.cwd(), "public", "search-index.json");

/** Recursively find all index.mdx and index.tsx files under a directory */
function walk(dir, results = []) {
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
function parseMdxFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;

  const block = match[1];
  const get = (key) => {
    const re = new RegExp(`^${key}:\\s*(.*)$`, "m");
    const m = block.match(re);
    return m ? m[1].trim() : "";
  };

  return {
    title: get("title"),
    description: get("description"),
    tags: get("tags"),
  };
}

/** Extract DocumentHead fields from a TSX file */
function parseTsxHead(content) {
  // Extract title
  const titleMatch = content.match(/title:\s*["'`]([^"'`]*)["'`]/);
  const title = titleMatch ? titleMatch[1] : "";

  // Extract description meta
  const descMatch = content.match(
    /name:\s*["']description["'][\s\S]*?content:\s*\n?\s*["'`]([^"'`]*)["'`]/
  );
  const description = descMatch ? descMatch[1] : "";

  // Extract search:tags meta
  const tagsMatch = content.match(
    /name:\s*["']search:tags["'][\s\S]*?content:\s*["'`]([^"'`]*)["'`]/
  );
  const tags = tagsMatch ? tagsMatch[1] : "";

  return { title, description, tags };
}

/** Convert a file path under src/routes/ to a URL path */
function fileToUrl(filePath) {
  let rel = relative(ROUTES_DIR, filePath)
    .split(sep)
    .join("/")
    .replace(/\/index\.(tsx|mdx)$/, "");

  // Remove Qwik City route groups like (elektropumpen), (legal), (pwa) etc.
  rel = rel.replace(/\([^)]+\)\//g, "");

  // Skip utility routes
  if (
    rel.includes("dyn-sitemap") ||
    rel.includes("cache-map") ||
    rel === "404" ||
    rel === "plugin" ||
    rel === "layout"
  ) {
    return null;
  }

  return "/" + rel + "/";
}

// ── Main ──

const files = walk(ROUTES_DIR);
const index = [];

for (const file of files) {
  const url = fileToUrl(file);
  if (!url) continue;

  const content = readFileSync(file, "utf-8");
  let meta;

  if (file.endsWith(".mdx")) {
    meta = parseMdxFrontmatter(content);
  } else {
    // Only include .tsx files that have a DocumentHead export
    if (!content.includes("DocumentHead")) continue;
    meta = parseTsxHead(content);
  }

  if (!meta || !meta.title) continue;

  const entry = {
    url,
    title: meta.title,
  };

  if (meta.description) entry.desc = meta.description;
  if (meta.tags) entry.tags = meta.tags.split(",").map((t) => t.trim()).filter(Boolean);

  index.push(entry);
}

// Sort alphabetically by title
index.sort((a, b) => a.title.localeCompare(b.title, "de"));

writeFileSync(OUT_FILE, JSON.stringify(index, null, 2), "utf-8");
console.log(`✔ Search index: ${index.length} entries → ${OUT_FILE}`);
