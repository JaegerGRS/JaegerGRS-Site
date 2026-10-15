// Exercises the Worker against public/ with stand-ins for the ASSETS, Durable Object and email bindings.
import { readFileSync, existsSync, statSync } from 'node:fs';
import { dirname, join, resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import worker, { RigHub, Guard } from '../src/worker.mjs';

const dist = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'public');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.xml': 'application/xml', '.txt': 'text/plain' };

// Controllable clock so rate limits and agent throttling can be tested without waiting.
let skew = 0;
const realNow = Date.now.bind(Date);
Date.now = () => realNow() + skew;

const fakeState = () => { const m = new Map(); const s = { ready: Promise.resolve(), storage: { get: async (k) => m.get(k), put: async (k, v) => void m.set(k, v) }, blockConcurrencyWhile: (fn) => (s.ready = s.ready.then(fn)) }; return s; };
const namespace = (Cls) => { const objs = new Map(); return { idFromName: (n) => n, get: (id) => { if (!objs.has(id)) { const st = fakeState(); objs.set(id, [new Cls(st), st]); } const [o, st] = objs.get(id); return { fetch: async (req, init) => { await st.ready; return o.fetch(req instanceof Request ? req : new Request(req, init)); } }; } }; };

const TOKEN = 'a'.repeat(16) + 'B'.repeat(16) + '0123456789abcdef';
const sent = [];
const makeEnv = (over = {}) => ({
  ASSETS: {
    async fetch(req) {
      let p = join(dist, new URL(req.url).pathname);
      if (existsSync(p) && statSync(p).isDirectory()) p = join(p, 'index.html');
      if (!existsSync(p)) return new Response(readFileSync(join(dist, '404.html')), { status: 404, headers: { 'Content-Type': types['.html'] } });
      return new Response(readFileSync(p), { headers: { 'Content-Type': types[extname(p)] || 'application/octet-stream' } });
    },
  },
  RIG_HUB: namespace(RigHub),
  GUARD: namespace(Guard),
  EMAIL: { send: async (m) => { sent.push(m); return { messageId: 'x' }; } },
  RIG_TOKEN: TOKEN,
  CONTACT_TO: 'me@example.com',
  CONTACT_FROM: 'website@jaegergrs.com',
  ALLOWED_ORIGINS: 'https://jaegergrs.com',
  ...over,
});

let env = makeEnv();
const req = (path, { host = 'jaegergrs.com', method = 'GET', headers = {}, body } = {}) =>
  worker.fetch(new Request(`https://${host}${path}`, { method, headers, body }), env, { waitUntil() {} });
const post = (path, data, headers = {}) =>
  req(path, { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json', Origin: 'https://jaegergrs.com', Accept: 'application/json', 'CF-Connecting-IP': '203.0.113.7', ...headers } });
const rigPost = (data, token = TOKEN) => req('/api/rig', { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) } });

let failed = false;
const check = (ok, label) => { console.log(ok ? 'OK  ' : 'FAIL', label); if (!ok) failed = true; };

// ---- static site
const pages = ['/', '/projects/', '/projects/svart-security/', '/projects/grey-signal/', '/projects/jaethetech/', '/projects/jae/', '/projects/rig-api/', '/embed/rig-embed.js', '/embed/rig-embed.css', '/projects/hardware/', '/expertise/', '/expertise/hardware/', '/expertise/development/', '/about/', '/about/journey/', '/contact/', '/changelog/', '/robots.txt', '/sitemap.xml', '/assets/styles.css', '/assets/main.js', '/assets/boot.js', '/assets/rig.js', '/assets/contact.js', '/assets/favicon.svg'];
for (const p of pages) check((await req(p)).status === 200, `200 ${p}`);

for (const img of ['grey-signal-logo.png', 'grey-signal-banner.jpg', 'grey-signal-welcome.jpg', 'grey-signal-subscribe.png']) {
  const r = await req(`/assets/img/${img}`);
  const size = (await r.arrayBuffer()).byteLength;
  check(r.status === 200 && size > 10000, `image ${img} (${size} bytes)`);
}

// ---- headers and redirects
const home = await req('/');
const csp = home.headers.get('content-security-policy') || '';
check(csp.includes("script-src 'self'") && !csp.includes('unsafe-inline') && csp.includes("form-action 'self'") && csp.includes("frame-ancestors 'none'"), 'strict CSP on html');
check(home.headers.get('x-frame-options') === 'DENY' && home.headers.get('x-content-type-options') === 'nosniff', 'frame + sniff headers');
check(!!home.headers.get('strict-transport-security') && home.headers.get('cross-origin-opener-policy') === 'same-origin', 'HSTS + COOP');
check((await req('/nope/')).status === 404, '404 for unknown path');
check((await req('/projects/', { method: 'POST' })).status === 405, '405 for POST to a page');
const www = await req('/projects/', { host: 'www.jaegergrs.com' });
check(www.status === 308 && www.headers.get('location') === 'https://jaegergrs.com/projects/', 'www redirects to apex');
const legacy = await req('/changelog.html');
check(legacy.status === 308 && legacy.headers.get('location') === 'https://jaegergrs.com/changelog/', '/changelog.html redirects');
const sec = await req('/.well-known/security.txt');
check(sec.status === 200 && (await sec.text()).includes('Contact:'), 'security.txt served');

// ---- contact form
const good = { name: 'Alex Tester', email: 'alex@example.com', topic: 'Job or role', message: 'Hello Jaeger, I would like to talk about a role.', website: '' };
let r = await post('/api/contact', good);
check(r.status === 200 && sent.length === 1, 'valid message sends an email');
check(sent[0]?.to === 'me@example.com' && sent[0]?.replyTo === 'alex@example.com' && sent[0]?.subject.includes('Job or role'), 'email goes to owner with reply-to');
check(r.headers.get('cache-control') === 'no-store', 'contact responses are not cached');

r = await post('/api/contact', { ...good, website: 'http://spam.example' });
check(r.status === 200 && sent.length === 1, 'honeypot is silently dropped');

r = await post('/api/contact', good, { Origin: 'https://evil.example' });
check(r.status === 403, 'wrong Origin is rejected');
r = await req('/api/contact', { method: 'POST', body: JSON.stringify(good), headers: { 'Content-Type': 'application/json', Accept: 'application/json' } });
check(r.status === 403, 'missing Origin is rejected');

check((await post('/api/contact', { ...good, email: 'not-an-email' })).status === 422, 'bad email rejected');
check((await post('/api/contact', { ...good, email: 'a@b.com\r\nBcc: x@evil.com' })).status === 422, 'email header injection rejected');
check((await post('/api/contact', { ...good, message: 'short' })).status === 422, 'short message rejected');
check((await post('/api/contact', { ...good, message: 'x'.repeat(4001) })).status === 422, 'long message rejected');

r = await post('/api/contact', { ...good, name: 'Eve\r\nBcc: evil@example.com', message: 'A perfectly fine long message here.' }, { 'CF-Connecting-IP': '198.51.100.9' });
check(r.status === 200 && !/[\r\n]/.test(sent.at(-1).subject) && !sent.at(-1).subject.includes('Bcc:\n'), 'CRLF in name cannot inject headers');

r = await req('/api/contact', { method: 'POST', body: 'x'.repeat(20000), headers: { 'Content-Type': 'application/json', Origin: 'https://jaegergrs.com', Accept: 'application/json' } });
check(r.status === 413, 'oversized body rejected');
check((await req('/api/contact')).status === 405, 'GET /api/contact is 405');

const form = await req('/api/contact', { method: 'POST', body: new URLSearchParams({ ...good, message: 'A plain form post from a browser without scripts.' }).toString(), headers: { 'Content-Type': 'application/x-www-form-urlencoded', Origin: 'https://jaegergrs.com', 'CF-Connecting-IP': '192.0.2.50' } });
check(form.status === 303 && form.headers.get('location').includes('status=sent'), 'no-JS form post redirects back with status');

const ip = { 'CF-Connecting-IP': '192.0.2.99' };
const codes = [];
for (let i = 0; i < 4; i++) codes.push((await post('/api/contact', good, ip)).status);
check(codes.join() === '200,200,200,429', `rate limit: 3 per 10 min then 429 (${codes.join()})`);
skew += 11 * 60 * 1000;
check((await post('/api/contact', good, ip)).status === 200, 'rate limit window resets');

const before = sent.length;
env = makeEnv({ EMAIL: undefined, RESEND_API_KEY: undefined });
check((await post('/api/contact', good, { 'CF-Connecting-IP': '192.0.2.123' })).status === 503 && sent.length === before, 'unconfigured mail returns 503');
env = makeEnv({ EMAIL: { send: async () => { throw Object.assign(new Error('boom'), { code: 'E_X' }); } } });
check((await post('/api/contact', good, { 'CF-Connecting-IP': '192.0.2.124' })).status === 502, 'mail provider failure returns 502');
env = makeEnv();

// ---- PC pairing key and live data
const live = { cpuLoad: 42.5, gpuLoad: 70, gpuTemp: 61, ramPct: 55, ramUsedGb: 8.8 };
const specs = { cpu: { name: 'Test CPU', cores: 8, threads: 16 }, gpus: [{ name: 'Test GPU', vramMb: 8192 }], ram: { totalGb: 32 }, hostname: 'SECRET-PC', user: 'jaeger' };

check((await rigPost({ live }, null)).status === 401, 'rig POST without a key is 401');
check((await rigPost({ live }, 'wrong'.repeat(8))).status === 401, 'rig POST with a wrong key is 401');
check((await rigPost({ live }, TOKEN.slice(0, -1) + 'x')).status === 401, 'rig POST with a near-miss key is 401');
env = makeEnv({ RIG_TOKEN: undefined });
check((await rigPost({ live })).status === 503, 'no key configured means 503, never open');
env = makeEnv();

// ---- site-generated key (claim)
const claim = () => req('/api/rig/claim', { method: 'POST' });
env = makeEnv({ RIG_TOKEN: undefined });
check((await claim()).status === 403, 'claim is refused while setup is closed');
env = makeEnv({ RIG_TOKEN: undefined, RIG_SETUP: 'open' });
r = await claim();
const claimed = await r.json();
check(r.status === 200 && /^[A-Za-z0-9_-]{48}$/.test(claimed.key), 'claim with setup open returns a key');
check(r.headers.get('cache-control') === 'no-store', 'claimed key response is never cached');
check((await claim()).status === 409, 'a second claim cannot replace the key');
check((await rigPost({ live }, claimed.key)).status === 200, 'the site-generated key is accepted');
check((await rigPost({ live }, TOKEN)).status === 401, 'other keys are still refused');
env.RIG_SETUP = 'rotate';
const rotated = await (await claim()).json();
check(rotated.key && rotated.key !== claimed.key, 'rotate mode replaces the key');
check((await rigPost({ live }, claimed.key)).status === 401, 'the old key stops working after rotation');
env = makeEnv({ RIG_SETUP: 'open' });
check((await claim()).status === 409, 'claim is refused when a Cloudflare secret key exists');
check((await req('/api/rig/claim')).status === 405, 'claim only accepts POST');
env = makeEnv({ RIG_TOKEN: 'short' });
check((await rigPost({ live }, 'short')).status === 401, 'short keys are never accepted');
env = makeEnv();

let s = await (await req('/api/rig')).json();
check(s.online === false && s.live === null, 'before any data the PC shows offline');

r = await rigPost({ live, specs });
const ack = await r.json();
check(r.status === 200 && ack.ok === true && ack.watching === true, 'valid key is accepted (and reports someone is watching)');
skew += 1500;
s = await (await req('/api/rig')).json();
check(s.online === true && s.live.cpuLoad === 42.5 && s.specs.cpu.name === 'Test CPU', 'snapshot shows live data and specs');
check(!JSON.stringify(s).includes('SECRET-PC') && !JSON.stringify(s).includes('jaeger'), 'unknown fields (hostname, user) are stripped');

skew += 2500;
r = await rigPost({ live: { cpuLoad: 999, gpuTemp: -5, bogus: 1 } });
check(r.status === 422, 'out-of-range values are rejected');
r = await rigPost({ live: { cpuLoad: 10 } });
check(r.status === 200, 'second sample accepted');
check((await rigPost({ live: { cpuLoad: 11 } })).status === 429, 'agent flooding is throttled');
check((await rigPost('not an object')).status === 422, 'garbage body rejected');
check((await req('/api/rig', { method: 'POST', body: 'x'.repeat(20000), headers: { Authorization: `Bearer ${TOKEN}` } })).status === 413, 'oversized rig body rejected');

skew += 60000;
s = await (await req('/api/rig')).json();
check(s.online === false && s.ageSec >= 60 && s.specs?.cpu?.name === 'Test CPU', 'goes offline when the PC stops reporting, keeps last specs');
check((await req('/api/rig', { method: 'DELETE' })).status === 405, 'DELETE /api/rig is 405');
check((await req('/api/unknown')).status === 404, 'unknown API path is 404');
check((await req('/api/rig')).headers.get('content-security-policy')?.includes("default-src 'none'"), 'API responses carry a locked-down CSP');

if (failed) process.exit(1);
