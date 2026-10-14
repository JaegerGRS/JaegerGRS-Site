// Validates generated pages: internal links, assets, sitemap and CSP-unsafe inline styles.
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { dirname, join, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'public');
const skip = new Set();
const walk = d => readdirSync(d, { withFileTypes: true }).flatMap(e =>
  skip.has(e.name) ? [] : e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]);

let errors = 0;
const fail = msg => { errors++; console.error('FAIL', msg); };
const pages = walk(root).filter(f => f.endsWith('.html'));
let checked = 0;

for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  const rel = relative(root, file);
  if (/\sstyle="/i.test(html)) fail(`${rel}: inline style attribute (blocked by CSP)`);
  if (/<script(?![^>]*(src=|application\/ld\+json))[^>]*>/i.test(html)) fail(`${rel}: inline script (blocked by CSP)`);
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const u = m[1].split('#')[0];
    if (!u || /^(https?:|mailto:|\/\/)/.test(u)) continue;
    checked++;
    let target = u.startsWith('/') ? join(root, u) : join(dirname(file), u);
    if (existsSync(target) && statSync(target).isDirectory()) target = join(target, 'index.html');
    if (!existsSync(target)) fail(`${rel}: broken link ${m[1]}`);
  }
}

const sitemap = readFileSync(join(root, 'sitemap.xml'), 'utf8');
for (const m of sitemap.matchAll(/<loc>https:\/\/jaegergrs\.com\/([^<]*)<\/loc>/g)) {
  const target = join(root, m[1], m[1].endsWith('.html') ? '' : 'index.html');
  if (!existsSync(target)) fail(`sitemap entry missing: /${m[1]}`);
}

if (errors) { console.error(`${errors} problem(s)`); process.exit(1); }
console.log(`OK: ${pages.length} pages, ${checked} internal links checked`);
