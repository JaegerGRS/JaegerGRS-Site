// Exercises the Worker against public/ with stand-ins for the ASSETS, Durable Object and email bindings.
import { readFileSync, existsSync, statSync } from 'node:fs';
import { dirname, join, resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import worker, { RigHub, Guard } from '../src/worker.mjs';

const dist = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'public');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.xml': 'application/xml', '.txt': 'text/plain' };

// Controllable clock so rate limits and agent throttling can be tested without waiting.
let skew = 0;
const realNow = Date.now.bind(Date);
Date.now = () => realNow() + skew;

const fakeState = () => { const m = new Map(); const s = { ready: Promise.resolve(), storage: { get: async (k) => m.get(k), put: async (k, v) => void m.set(k, v) }, blockConcurrencyWhile: (fn) => (s.ready = s.ready.then(fn)) }; return s; };
const namespace = (Cls) => { const objs = new Map(); return { idFromName: (n) => n, get: (id) => { if (!objs.has(id)) { const st = fakeState(); objs.set(id, [new Cls(st), st]); } const [o, st] = objs.get(id); return { fetch: async (req, init) => { await st.ready; return o.fetch(req instanceof Request ? req : new Request(req, init)); } }; } }; };

const TOKEN = 'a'.repeat(16) + 'B'.repeat(16) + '0123456789abcdef';
const sent = [];
const fakeInboxDb = () => {
  const messages = new Map();
  const replies = new Map();
  return {
    messages,
    replies,
    prepare(sql) {
      let args = [];
      const statement = {
        bind(...values) { args = values; return statement; },
        async all() {
          if (sql.includes('FROM inbox_replies')) return { results: [...replies.values()].filter((item) => item.message_id === args[0]).sort((a, b) => a.created_at - b.created_at) };
          const archived = sql.includes('archived_at IS NOT NULL');
          const rows = [...messages.values()].filter((item) => archived ? item.archived_at !== null : item.archived_at === null);
          return { results: rows.sort((a, b) => b.received_at - a.received_at).slice(0, 100) };
        },
        async first() {
          if (sql.includes('internet_message_id')) return [...messages.values()].find((item) => item.internet_message_id === args[0]) || null;
          if (sql.includes('FROM inbox_messages')) return messages.get(args[0]) || null;
          return null;
        },
        async run() {
          if (sql.includes('INSERT INTO inbox_messages')) {
            const [id, source, sender_name, sender_email, subject, body_text, received_at, notification_status, internet_message_id] = args;
            messages.set(id, { id, source, sender_name, sender_email, subject, body_text, received_at, read_at: null, archived_at: null, notification_status, internet_message_id: internet_message_id || null });
            return { meta: { changes: 1 } };
          }
          if (sql.includes('UPDATE inbox_messages SET notification_status')) {
            const item = messages.get(args[1]);
            if (item) item.notification_status = args[0];
            return { meta: { changes: item ? 1 : 0 } };
          }
          if (sql.includes('UPDATE inbox_messages SET read_at = COALESCE')) {
            const item = messages.get(args[1]);
            if (item && item.read_at === null) item.read_at = args[0];
            return { meta: { changes: item ? 1 : 0 } };
          }
          if (sql.includes('UPDATE inbox_messages SET read_at = ?')) {
            const item = messages.get(args[1]);
            if (item) item.read_at = args[0];
            return { meta: { changes: item ? 1 : 0 } };
          }
          if (sql.includes('UPDATE inbox_messages SET archived_at')) {
            const item = messages.get(args[1]);
            if (item) item.archived_at = args[0];
            return { meta: { changes: item ? 1 : 0 } };
          }
          if (sql.includes('DELETE FROM inbox_messages')) {
            const deleted = messages.delete(args[0]);
            if (deleted) for (const [id, reply] of replies) if (reply.message_id === args[0]) replies.delete(id);
            return { meta: { changes: deleted ? 1 : 0 } };
          }
          if (sql.includes('INSERT INTO inbox_replies')) {
            const [id, message_id, body_text, created_at, status] = args;
            replies.set(id, { id, message_id, body_text, created_at, status });
            return { meta: { changes: 1 } };
          }
          if (sql.includes('UPDATE inbox_replies SET status')) {
            const reply = replies.get(args[1]);
            if (reply) reply.status = args[0];
            return { meta: { changes: reply ? 1 : 0 } };
          }
          return { meta: { changes: 0 } };
        },
      };
      return statement;
    },
  };
};
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
const pages = ['/', '/projects/', '/projects/svart-security/', '/projects/svart-security/tools/', '/projects/grey-signal/', '/projects/grey-signal/build/', '/projects/grey-signal/channel/', '/projects/jaethetech/', '/projects/jaethetech/personal-ai/', '/projects/jae/', '/projects/jae/engineering/', '/projects/story-ai/', '/projects/story-ai/pipeline/', '/projects/rig-api/', '/projects/rig-api/install/', '/projects/rig-api/pricing/', '/projects/rig-api/what-you-get/', '/embed/rig-embed.js', '/embed/rig-embed.css', '/projects/hardware/', '/expertise/', '/expertise/hardware/', '/expertise/development/', '/about/', '/about/journey/', '/contact/', '/changelog/', '/robots.txt', '/sitemap.xml', '/assets/styles.css', '/assets/main.js', '/assets/boot.js', '/assets/rig.js', '/assets/contact.js', '/assets/inbox.js', '/assets/inbox.css', '/assets/favicon.svg'];
for (const p of pages) check((await req(p)).status === 200, `200 ${p}`);
check((await req('/inbox/')).status === 503, 'inbox fails closed until Cloudflare Access and storage are configured');
check((await req('/assets/img/social-card.jpg')).headers.get('cache-control') === 'public, max-age=604800', 'images are cached for a week');
check(/must-revalidate/.test((await req('/assets/main.js')).headers.get('cache-control') || ''), 'scripts revalidate');
check((await req('/assets/fonts/manrope.woff2')).status === 200, 'self-hosted font is served');
check(!/https?:\/\//.test((await req('/')).headers.get('content-security-policy') || ''), 'CSP allows no third-party hosts');
check((await (await req('/')).text()).includes('assets/img/social-card.jpg'), 'pages point at the social card');

for (const img of ['grey-signal-logo.webp', 'grey-signal-banner.webp', 'grey-signal-welcome.webp']) {
  const r = await req(`/assets/img/${img}`);
  const size = (await r.arrayBuffer()).byteLength;
  check(r.status === 200 && size > 1000, `image ${img} (${size} bytes)`);
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

// ---- private contact inbox
const inboxDb = fakeInboxDb();
env = makeEnv({ INBOX_DB: inboxDb });
r = await post('/api/contact', good, { 'CF-Connecting-IP': '192.0.2.125' });
const inboxMessage = [...inboxDb.messages.values()][0];
check(r.status === 200 && inboxMessage?.sender_email === good.email && inboxMessage?.notification_status === 'sent', 'contact submissions are stored in the private inbox and emailed');
const notifyDb = fakeInboxDb();
env = makeEnv({ INBOX_DB: notifyDb, EMAIL: { send: async () => { throw new Error('offline'); } } });
r = await post('/api/contact', good, { 'CF-Connecting-IP': '192.0.2.126' });
check(r.status === 200 && (await r.json()).code === 'received' && [...notifyDb.messages.values()][0]?.notification_status === 'failed', 'stored contact message remains received when its email alert fails');

const inboundDb = fakeInboxDb();
env = makeEnv({ INBOX_DB: inboundDb });
const rawMail = 'From: Example Sender <person@example.net>\r\nTo: contact@jaegergrs.com\r\nSubject: Inbound test\r\nMessage-ID: <inbound-test@example.net>\r\nContent-Type: text/plain; charset=utf-8\r\n\r\nThis email arrived through Cloudflare Email Routing.';
const incoming = {
  from: 'person@example.net',
  to: 'contact@jaegergrs.com',
  headers: new Headers({ Subject: 'Inbound test', 'Message-ID': '<inbound-test@example.net>' }),
  rawSize: new TextEncoder().encode(rawMail).length,
  raw: new Response(rawMail).body,
  rejection: '',
  setReject(reason) { this.rejection = reason; },
};
await worker.email(incoming, env);
const inboundMessage = [...inboundDb.messages.values()][0];
check(inboundMessage?.source === 'inbound_email' && inboundMessage?.sender_email === 'person@example.net' && inboundMessage.body_text.includes('Cloudflare Email Routing'), 'incoming Cloudflare email is parsed and stored in the site inbox');
await worker.email({ ...incoming, raw: new Response(rawMail).body }, env);
check(inboundDb.messages.size === 1, 'incoming email Message-ID prevents duplicate inbox entries');
const mailWithAttachment = 'From: Example Sender <person@example.net>\r\nTo: contact@jaegergrs.com\r\nSubject: Attachment\r\nMessage-ID: <attachment-test@example.net>\r\nContent-Type: multipart/mixed; boundary="mail-boundary"\r\n\r\n--mail-boundary\r\nContent-Type: text/plain\r\n\r\nPlease see attached.\r\n--mail-boundary\r\nContent-Type: text/plain\r\nContent-Disposition: attachment; filename="notes.txt"\r\n\r\nprivate attachment\r\n--mail-boundary--';
const attachmentMail = {
  ...incoming,
  headers: new Headers({ Subject: 'Attachment', 'Message-ID': '<attachment-test@example.net>' }),
  rawSize: new TextEncoder().encode(mailWithAttachment).length,
  raw: new Response(mailWithAttachment).body,
  rejection: '',
  setReject(reason) { this.rejection = reason; },
};
await worker.email(attachmentMail, env);
check(attachmentMail.rejection.includes('attachments') && inboundDb.messages.size === 1, 'inbound attachments are rejected without storing them');
const oversized = { ...incoming, rawSize: 200 * 1024, rejection: '', setReject(reason) { this.rejection = reason; } };
await worker.email(oversized, env);
check(oversized.rejection.includes('too large'), 'oversized inbound email is rejected before parsing');

const rsa = await crypto.subtle.generateKey({ name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['sign', 'verify']);
const publicJwk = await crypto.subtle.exportKey('jwk', rsa.publicKey);
publicJwk.kid = 'test-access-key';
publicJwk.alg = 'RS256';
const originalFetch = globalThis.fetch;
globalThis.fetch = async (url, options) => String(url).endsWith('/cdn-cgi/access/certs')
  ? Response.json({ keys: [publicJwk] })
  : originalFetch(url, options);
const part = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');
const jwt = async (email = 'jaegergrstratton@gmail.com') => {
  const head = part({ alg: 'RS256', kid: publicJwk.kid, typ: 'JWT' });
  const claims = part({ iss: 'https://portfolio.cloudflareaccess.com', aud: ['inbox-audience'], exp: Math.floor(Date.now() / 1000) + 300, email });
  const input = `${head}.${claims}`;
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', rsa.privateKey, new TextEncoder().encode(input));
  return `${input}.${Buffer.from(sig).toString('base64url')}`;
};
env = makeEnv({
  INBOX_DB: inboxDb,
  ACCESS_TEAM_DOMAIN: 'https://portfolio.cloudflareaccess.com',
  ACCESS_AUD: 'inbox-audience',
  INBOX_ALLOWED_EMAIL: 'jaegergrstratton@gmail.com',
});
r = await req('/api/inbox/messages');
check(r.status === 401, 'private inbox rejects requests without Cloudflare Access JWT');
const accessToken = await jwt();
r = await req('/api/inbox/messages', { headers: { 'CF-Access-Jwt-Assertion': accessToken } });
check(r.status === 200 && (await r.json()).messages.length === 1, 'verified Cloudflare Access identity can list stored messages');
r = await req('/api/inbox/messages', { headers: { 'CF-Access-Jwt-Assertion': await jwt('someone-else@example.com') } });
check(r.status === 401, 'private inbox only allows its configured owner identity');
r = await req(`/api/inbox/messages/${inboxMessage.id}/reply`, { method: 'POST', body: JSON.stringify({ body: 'Thanks for getting in touch. I will reply soon.' }), headers: { 'CF-Access-Jwt-Assertion': accessToken, 'Content-Type': 'application/json' } });
check(r.status === 403, 'private inbox rejects state changes without a same-origin header');
r = await req('/inbox/', { headers: { 'CF-Access-Jwt-Assertion': accessToken } });
check(r.status === 200 && r.headers.get('cache-control') === 'no-store' && (await r.text()).includes('Contact inbox'), 'authenticated private inbox page is not publicly cached');
r = await req(`/api/inbox/messages/${inboxMessage.id}/reply`, { method: 'POST', body: JSON.stringify({ body: 'Thanks for getting in touch. I will reply soon.' }), headers: { 'CF-Access-Jwt-Assertion': accessToken, 'Content-Type': 'application/json', Origin: 'https://jaegergrs.com' } });
check(r.status === 200 && inboxDb.replies.size === 1 && sent.at(-1)?.to === good.email, 'owner can send and retain a reply from the private inbox');
r = await req(`/api/inbox/messages/${inboxMessage.id}`, { headers: { 'CF-Access-Jwt-Assertion': accessToken } });
const messageDetail = await r.json();
check(r.status === 200 && messageDetail.replies.length === 1 && !!messageDetail.message.read_at, 'owner can read stored message and reply history');
r = await req(`/api/inbox/messages/${inboxMessage.id}/archive`, { method: 'POST', headers: { 'CF-Access-Jwt-Assertion': accessToken, Origin: 'https://jaegergrs.com' } });
check(r.status === 200 && inboxMessage.archived_at !== null, 'owner can archive a private inbox message');
r = await req(`/api/inbox/messages/${inboxMessage.id}/restore`, { method: 'POST', headers: { 'CF-Access-Jwt-Assertion': accessToken, Origin: 'https://jaegergrs.com' } });
check(r.status === 200 && inboxMessage.archived_at === null, 'owner can restore an archived message');
r = await req(`/api/inbox/messages/${inboxMessage.id}/delete`, { method: 'POST', headers: { 'CF-Access-Jwt-Assertion': accessToken, Origin: 'https://jaegergrs.com' } });
check(r.status === 200 && !inboxDb.messages.has(inboxMessage.id) && !inboxDb.replies.size, 'owner can permanently delete a message and its replies');
globalThis.fetch = originalFetch;

env = makeEnv();

// ---- PC pairing key and live data
const live = { cpuLoad: 42.5, gpuLoad: 70, gpuTemp: 61, ramPct: 55, ramUsedGb: 8.8, uptimeHours: 12, gpuFan: 40, gpuPower: 90 };
const specs = { cpu: { name: 'Test CPU', cores: 8, threads: 16 }, gpus: [{ name: 'Test GPU', vramMb: 8192, driver: 'DRV-123' }], ram: { totalGb: 32 }, board: { maker: 'BoardCo', model: 'BOARD-9' }, storage: { totalGb: 999, drives: 3 }, hostname: 'SECRET-PC', user: 'jaeger' };

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
check(!/DRV-123|BOARD-9|BoardCo|uptimeHours|gpuFan|gpuPower|storage/.test(JSON.stringify(s)), 'public snapshot omits board, driver, storage, uptime, fan and power');
check(s.live.gpuTemp === 61 && s.specs.gpus[0].vramMb === 8192 && s.specs.ram.totalGb === 32, 'public snapshot keeps what the panel displays');

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

const corsGet = (origin, e) => { env = makeEnv(e); return req('/api/rig', { headers: { Origin: origin } }); };
check(!(await corsGet('https://customer.example', {})).headers.get('access-control-allow-origin'), 'CORS is off by default');
let c = await corsGet('https://customer.example', { RIG_EMBED_ORIGINS: 'https://customer.example, https://other.example' });
check(c.headers.get('access-control-allow-origin') === 'https://customer.example' && c.headers.get('vary')?.includes('Origin'), 'listed origin is allowed, with Vary');
check(!(await corsGet('https://evil.example', { RIG_EMBED_ORIGINS: 'https://customer.example' })).headers.get('access-control-allow-origin'), 'unlisted origin gets no CORS header');
check((await corsGet('https://any.example', { RIG_EMBED_ORIGINS: '*' })).headers.get('access-control-allow-origin') === '*', 'wildcard allows any origin');
env = makeEnv({ RIG_EMBED_ORIGINS: '*' });
check(!(await req('/api/rig', { method: 'POST', body: '{}', headers: { Origin: 'https://x.example' } })).headers.get('access-control-allow-origin'), 'POST never gets CORS headers');

// An unexpected failure becomes a plain error response that leaks nothing.
const origError = console.error; console.error = () => {};
env = makeEnv({ ASSETS: { fetch: async () => { throw new Error('SECRET internal detail'); } } });
const boom = await req('/'), boomApi = await req('/api/contact', { method: 'GET' }), boomApi2 = await (async () => { env = makeEnv({ RIG_HUB: { idFromName: () => 'x', get: () => ({ fetch: async () => { throw new Error('SECRET internal detail'); } }) } }); return req('/api/rig'); })();
console.error = origError;
check(boom.status === 500 && !(await boom.clone().text()).includes('SECRET'), 'unexpected page failure returns a plain 500 with no internals');
check(boomApi2.status === 500 && (await boomApi2.json()).code === 'server_error' && boomApi2.headers.get('cache-control') === 'no-store', 'unexpected API failure returns JSON server_error, not cached');

if (failed) process.exit(1);
