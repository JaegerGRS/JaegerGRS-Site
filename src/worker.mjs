import { handleContact } from './lib/contact.mjs';
import { handleInbox } from './lib/inbox.mjs';
import { authorizeInbox } from './lib/inbox-auth.mjs';
import { receiveEmail } from './lib/email-receive.mjs';
import { SECURITY_TXT, secure } from './lib/security.mjs';
import { json, readLimited, safeEqual } from './lib/util.mjs';

export { RigHub } from './rig-hub.mjs';
export { Guard } from './guard.mjs';

const REDIRECTS = new Map([
  ['/index.html', '/'],
  ['/changelog.html', '/changelog/'],
]);

const hub = (env) => env.RIG_HUB.get(env.RIG_HUB.idFromName('main'));

// The PC app proves who it is with a secret pairing key (RIG_TOKEN), sent as a Bearer token.
async function pairedPc(request, env) {
  const match = /^Bearer ([A-Za-z0-9_-]{32,200})$/.exec(request.headers.get('authorization') || '');
  return !!match && !!env.RIG_TOKEN && env.RIG_TOKEN.length >= 32 && (await safeEqual(match[1], env.RIG_TOKEN));
}

async function handleRig(request, env, ctx) {
  if (!env.RIG_HUB) return json({ ok: false, code: 'not_configured' }, 503);

  if (request.method === 'GET') {
    const cache = typeof caches !== 'undefined' ? caches.default : null;
    const key = new Request(new URL('/api/rig', request.url).toString());
    const hit = cache ? await cache.match(key) : null;
    if (hit) return hit;
    const res = await hub(env).fetch('https://hub/snapshot');
    const fresh = new Response(res.body, { status: res.status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=2' } });
    if (cache && res.ok) ctx?.waitUntil?.(cache.put(key, fresh.clone()));
    return fresh;
  }

  if (request.method === 'POST') {
    const token = env.RIG_TOKEN || (await (await hub(env).fetch('https://hub/key')).json()).key;
    if (!token) return json({ ok: false, code: 'not_configured' }, 503);
    if (!(await pairedPc(request, { RIG_TOKEN: token }))) return json({ ok: false, code: 'unauthorised' }, 401, { 'WWW-Authenticate': 'Bearer' });
    const raw = await readLimited(request, 8 * 1024);
    if (raw === null) return json({ ok: false, code: 'too_large' }, 413);
    return hub(env).fetch(new Request('https://hub/ingest', { method: 'POST', body: raw, headers: { 'Content-Type': 'application/json' } }));
  }

  return json({ ok: false, code: 'method_not_allowed' }, 405, { Allow: 'GET, POST' });
}

// Off by default. RIG_EMBED_ORIGINS ("*" or a comma-separated origin list) lets other websites read the
// public GET snapshot from the browser. Only GET is covered; POST never gets CORS headers.
function embedCors(request, env, res) {
  const allow = (env.RIG_EMBED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
  if (request.method !== 'GET' || !allow.length) return res;
  const origin = request.headers.get('Origin');
  const out = new Response(res.body, res);
  out.headers.append('Vary', 'Origin');
  if (allow.includes('*')) out.headers.set('Access-Control-Allow-Origin', '*');
  else if (origin && allow.includes(origin)) out.headers.set('Access-Control-Allow-Origin', origin);
  return out;
}

// The site can create the pairing key itself, but only while the owner has switched on setup in
// Cloudflare (variable RIG_SETUP = "open", or "rotate" to replace an existing key). The key is
// returned once, straight to the app, and never shown on a page.
async function handleClaim(request, env) {
  if (request.method !== 'POST') return json({ ok: false, code: 'method_not_allowed' }, 405, { Allow: 'POST' });
  if (!env.RIG_HUB) return json({ ok: false, code: 'not_configured' }, 503);
  const mode = env.RIG_SETUP;
  if (mode !== 'open' && mode !== 'rotate') return json({ ok: false, code: 'setup_closed' }, 403);
  if (env.RIG_TOKEN) return json({ ok: false, code: 'key_set_in_cloudflare' }, 409);
  return hub(env).fetch(new Request(`https://hub/claim?rotate=${mode === 'rotate' ? 1 : 0}`, { method: 'POST' }));
}

// An unexpected failure (for example a Durable Object restarting) returns a plain JSON error rather than
// Cloudflare's bare 1101 page. Only the error name is logged, never request contents.
async function handle(request, env, ctx) {
    const url = new URL(request.url);

    if (url.hostname === 'www.jaegergrs.com') {
      return Response.redirect(`https://jaegergrs.com${url.pathname}${url.search}`, 308);
    }

    if (url.pathname === '/.well-known/security.txt') {
      return secure(new Response(SECURITY_TXT, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }), { api: true });
    }

    if (url.pathname === '/api/contact') {
      if (request.method !== 'POST') return secure(json({ ok: false, code: 'method_not_allowed' }, 405, { Allow: 'POST' }), { api: true });
      return secure(await handleContact(request, env), { api: true });
    }

    if (url.pathname.startsWith('/api/inbox/')) {
      if (request.method !== 'GET' && request.method !== 'POST') return secure(json({ ok: false, code: 'method_not_allowed' }, 405), { api: true });
      return secure(await handleInbox(request, env), { api: true });
    }

    if (url.pathname === '/inbox' || url.pathname.startsWith('/inbox/')) {
      if (request.method !== 'GET' && request.method !== 'HEAD') return secure(new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } }));
      const identity = await authorizeInbox(request, env);
      if (identity === 'not_configured') return secure(new Response('Inbox is not configured.', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }));
      if (identity === 'unavailable') return secure(new Response('Inbox authentication is temporarily unavailable.', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }));
      if (identity === 'unauthorized') return secure(new Response('Sign in through the authorised Cloudflare Access account to continue.', { status: 401, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }));
      if (!env.INBOX_DB) return secure(new Response('Inbox storage is not configured.', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }));
      const page = await env.ASSETS.fetch(new Request(new URL('/inbox/', request.url), request));
      const protectedPage = secure(page, { html: true });
      const headers = new Headers(protectedPage.headers);
      headers.set('Cache-Control', 'no-store, no-transform');
      return new Response(protectedPage.body, { status: protectedPage.status, statusText: protectedPage.statusText, headers });
    }

    if (url.pathname === '/api/rig/claim') {
      return secure(await handleClaim(request, env), { api: true });
    }

    if (url.pathname === '/api/rig') {
      return secure(embedCors(request, env, await handleRig(request, env, ctx)), { api: true });
    }

    if (url.pathname.startsWith('/api/')) return secure(json({ ok: false, code: 'not_found' }, 404), { api: true });

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return secure(new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } }));
    }
    if (REDIRECTS.has(url.pathname)) {
      return Response.redirect(url.origin + REDIRECTS.get(url.pathname) + url.search, 308);
    }

    const res = await env.ASSETS.fetch(request);
    const html = (res.headers.get('Content-Type') || '').includes('text/html');
    return secure(res, { html });
}

export default {
  async fetch(request, env, ctx) {
    try {
      return await handle(request, env, ctx);
    } catch (e) {
      console.error('worker error', e && e.name);
      const api = new URL(request.url).pathname.startsWith('/api/');
      return secure(api ? json({ ok: false, code: 'server_error' }, 500) : new Response('Something went wrong. Please try again.', { status: 500, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }), { api });
    }
  },
  async email(message, env) {
    try {
      await receiveEmail(message, env);
    } catch (error) {
      console.error('incoming email storage failed', error?.name || 'Error');
      message.setReject('The site inbox could not store this message.');
    }
  },
};
