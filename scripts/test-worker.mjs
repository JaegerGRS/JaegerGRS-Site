// Exercises the Worker against public/ using a stand-in for the ASSETS binding.
import { readFileSync, existsSync, statSync } from 'node:fs';
import { dirname, join, resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import worker from '../src/worker.mjs';

const dist = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'public');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.xml': 'application/xml', '.txt': 'text/plain' };

const env = {
  ASSETS: {
    async fetch(req) {
      let p = join(dist, new URL(req.url).pathname);
      if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html');
      if (!existsSync(p)) return new Response(readFileSync(join(dist, '404.html')), { status: 404, headers: { 'Content-Type': types['.html'] } });
      return new Response(readFileSync(p), { headers: { 'Content-Type': types[extname(p)] || 'application/octet-stream' } });
    },
  },
};

const get = (path, host = 'jaegergrs.com', method = 'GET') => worker.fetch(new Request(`https://${host}${path}`, { method }), env);
let failed = false;
const check = (ok, label) => { console.log(ok ? 'OK  ' : 'FAIL', label); if (!ok) failed = true; };

const pages = ['/', '/projects/', '/projects/svart-security/', '/projects/grey-signal/', '/projects/jaethetech/', '/projects/jae/', '/projects/hardware/', '/expertise/', '/expertise/hardware/', '/expertise/development/', '/about/', '/about/journey/', '/contact/', '/changelog/', '/robots.txt', '/sitemap.xml', '/assets/styles.css', '/assets/main.js', '/assets/favicon.svg'];
for (const p of pages) check((await get(p)).status === 200, `200 ${p}`);

for (const img of ['grey-signal-logo.png', 'grey-signal-banner.jpg', 'grey-signal-welcome.jpg', 'grey-signal-subscribe.png']) {
  const r = await get(`/assets/img/${img}`);
  const size = (await r.arrayBuffer()).byteLength;
  check(r.status === 200 && size > 10000, `image ${img} (${size} bytes)`);
}

const home = await get('/');
check(!!home.headers.get('content-security-policy'), 'CSP on html');
check(home.headers.get('x-frame-options') === 'DENY', 'X-Frame-Options');
check((await get('/nope/')).status === 404, '404 for unknown path');
check((await get('/projects/', 'jaegergrs.com', 'POST')).status === 405, '405 for POST');

const www = await get('/projects/', 'www.jaegergrs.com');
check(www.status === 308 && www.headers.get('location') === 'https://jaegergrs.com/projects/', 'www redirects to apex');
const legacy = await get('/changelog.html');
check(legacy.status === 308 && legacy.headers.get('location') === 'https://jaegergrs.com/changelog/', '/changelog.html redirects');

if (failed) process.exit(1);
