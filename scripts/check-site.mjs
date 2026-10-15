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
const titles = new Map();

for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  const rel = relative(root, file);
  const title = /<title>([^<]+)<\/title>/.exec(html)?.[1];
  if (!title) fail(`${rel}: missing <title>`);
  else if (titles.has(title)) fail(`${rel}: duplicate title "${title}" (also ${titles.get(title)})`);
  else titles.set(title, rel);
  if (!/<meta name="description" content="[^"]{20,}/.test(html)) fail(`${rel}: missing or short meta description`);
  if (!/<link rel="canonical" href="https:\/\/jaegergrs\.com\//.test(html)) fail(`${rel}: missing canonical`);
  if (title && title.length > 70) fail(`${rel}: title over 70 characters`);
  const descLen = /<meta name="description" content="([^"]*)"/.exec(html)?.[1].length ?? 0;
  if (descLen > 200) fail(`${rel}: meta description over 200 characters (${descLen})`);
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { if (JSON.parse(m[1])['@context'] !== 'https://schema.org') fail(`${rel}: JSON-LD without schema.org context`); }
    catch { fail(`${rel}: invalid JSON-LD`); }
  }
  if (rel !== '404.html' && /name="robots"[^>]*noindex/.test(html)) fail(`${rel}: unexpected noindex`);
  if (rel === '404.html' && !/name="robots" content="noindex"/.test(html)) fail('404.html should be noindex');
  if ((html.match(/<h1[\s>]/g) || []).length !== 1) fail(`${rel}: needs exactly one <h1>`);
  for (const tag of html.match(/<img\b[^>]*>/g) || []) {
    if (!/\balt="/.test(tag)) fail(`${rel}: image without alt text`);
    if (!/\bwidth="/.test(tag) || !/\bheight="/.test(tag)) fail(`${rel}: image without width/height (causes layout shift)`);
  }
  const og = /property="og:image" content="https:\/\/jaegergrs\.com\/([^"]+)"/.exec(html)?.[1];
  if (!og || !existsSync(join(root, og))) fail(`${rel}: og:image missing or not found`);
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
for (const file of pages) {
  const rel = relative(root, file).replace(/\\/g, '/');
  if (rel === '404.html') continue;
  if (!sitemap.includes(`<loc>https://jaegergrs.com/${rel.replace(/index\.html$/, '')}</loc>`)) fail(`${rel}: not in sitemap`);
}
for (const m of sitemap.matchAll(/<loc>https:\/\/jaegergrs\.com\/([^<]*)<\/loc>/g)) {
  const target = join(root, m[1], m[1].endsWith('.html') ? '' : 'index.html');
  if (!existsSync(target)) fail(`sitemap entry missing: /${m[1]}`);
}

if (errors) { console.error(`${errors} problem(s)`); process.exit(1); }
console.log(`OK: ${pages.length} pages, ${checked} internal links checked`);
