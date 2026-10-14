// Copies the public site into dist/ for Cloudflare static assets.
import { cpSync, rmSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const include = ['index.html', '404.html', 'robots.txt', 'sitemap.xml', 'assets', 'about', 'projects', 'expertise', 'contact', 'changelog'];

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
for (const item of include) {
  const from = join(root, item);
  if (!existsSync(from)) throw new Error(`Missing ${item}. Run: node scripts/generate-pages.mjs`);
  cpSync(from, join(dist, item), { recursive: true });
}
console.log(`Built ${include.length} entries into dist/`);
