import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Read the service worker template
const templatePath = join(rootDir, 'src', 'sw.template.js');
const template = readFileSync(templatePath, 'utf-8');

// Generate version based on current timestamp
const buildDate = new Date();
const version = `v${buildDate.getFullYear()}.${String(buildDate.getMonth() + 1).padStart(2, '0')}.${String(buildDate.getDate()).padStart(2, '0')}-${String(buildDate.getHours()).padStart(2, '0')}${String(buildDate.getMinutes()).padStart(2, '0')}`;

console.log(`[Build] Generating service worker with version: ${version}`);

// Replace the version placeholder
const output = template.replace(
  /const CACHE_VERSION = ['"]v\d+['"];/,
  `const CACHE_VERSION = '${version}';`
);

// Write to public directory
const outputPath = join(rootDir, 'public', 'sw.js');
writeFileSync(outputPath, output, 'utf-8');

console.log(`[Build] Service worker generated at: ${outputPath}`);
console.log(`[Build] Cache version: ${version}`);
