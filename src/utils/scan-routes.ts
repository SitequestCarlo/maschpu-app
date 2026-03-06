import { readFileSync, existsSync } from "fs";

export function parseFrontmatter(
  content: string,
): Record<string, string> | null {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;

  const result: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const m = line.match(/^([\w][\w-]*):[ \t]*(.*)/);
    if (m) result[m[1]] = m[2].trim();
  }
  return result;
}

export function readMdxMeta(mdxPath: string): Record<string, string> | null {
  if (!existsSync(mdxPath)) return null;
  return parseFrontmatter(readFileSync(mdxPath, "utf-8"));
}
