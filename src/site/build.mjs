// Generates every HTML page and sitemap.xml into public/.  Run: node src/site/build.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE, DATE } from './config.mjs';
import { page } from './components.mjs';
import home from './pages/home.mjs';
import projects from './pages/projects.mjs';
import svartSecurity from './pages/svart-security.mjs';
import greySignal from './pages/grey-signal.mjs';
import jaethetech from './pages/jaethetech.mjs';
import jae from './pages/jae.mjs';
import rigApi from './pages/rig-api.mjs';
import hardware from './pages/hardware.mjs';
import expertise from './pages/expertise.mjs';
import about from './pages/about.mjs';
import contact from './pages/contact.mjs';
import changelog from './pages/changelog.mjs';
import notFound from './pages/not-found.mjs';

const PUBLIC = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', 'public');
const pages = [home, projects, svartSecurity, greySignal, jaethetech, jae, rigApi, hardware, expertise, about, contact, changelog, notFound].flat();

for (const p of pages) {
  const out = join(PUBLIC, p.file);
  mkdirSync(dirname(out), { recursive: true });
  let html = page(p);
  // The 404 page is served from any path, so it needs root-relative URLs.
  if (p.file === '404.html') html = html.replace(/(href|src)="(?!https?:|\/|#|mailto:)([^"]+)"/g, '$1="/$2"');
  writeFileSync(out, html);
}

const urls = pages.filter(p => p.file !== '404.html').map(p => `${SITE}/${p.file.replace(/index\.html$/, '')}`);
writeFileSync(join(PUBLIC, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => ` <url><loc>${u}</loc><lastmod>${DATE}</lastmod></url>`).join('\n')}\n</urlset>\n`);
console.log(`${pages.length} pages written to public/`);
