import { handleContact } from './lib/contact.mjs';
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
    if (!env.RIG_TOKEN) return json({ ok: false, code: 'not_configured' }, 503);
    if (!(await pairedPc(request, env))) return json({ ok: false, code: 'unauthorised' }, 401, { 'WWW-Authenticate': 'Bearer' });
    const raw = await readLimited(request, 8 * 1024);
    if (raw === null) return json({ ok: false, code: 'too_large' }, 413);
    return hub(env).fetch(new Request('https://hub/ingest', { method: 'POST', body: raw, headers: { 'Content-Type': 'application/json' } }));
  }

  return json({ ok: false, code: 'method_not_allowed' }, 405, { Allow: 'GET, POST' });
}

export default {
  async fetch(request, env, ctx) {
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

    if (url.pathname === '/api/rig') {
      return secure(await handleRig(request, env, ctx), { api: true });
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
  },
};
