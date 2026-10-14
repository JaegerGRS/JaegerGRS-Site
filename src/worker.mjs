const CSP = [
  "default-src 'self'",
  "img-src 'self' data: https:",
  "script-src 'self'",
  "style-src 'self' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join('; ');

const REDIRECTS = new Map([
  ['/index.html', '/'],
  ['/changelog.html', '/changelog/'],
]);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === 'www.jaegergrs.com') {
      return Response.redirect(`https://jaegergrs.com${url.pathname}${url.search}`, 308);
    }
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
    }
    if (REDIRECTS.has(url.pathname)) {
      return Response.redirect(url.origin + REDIRECTS.get(url.pathname) + url.search, 308);
    }

    const res = await env.ASSETS.fetch(request);
    const headers = new Headers(res.headers);
    const type = headers.get('Content-Type') || '';
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('X-Frame-Options', 'DENY');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    if (type.includes('text/html')) {
      headers.set('Content-Security-Policy', CSP);
      headers.set('Cache-Control', 'public, max-age=180');
    }
    return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
  },
};
