export const CSP = [
  "default-src 'self'",
  "img-src 'self' data: https:",
  "script-src 'self'",
  "style-src 'self' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "connect-src 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join('; ');

export const SECURITY_TXT = `Contact: mailto:jaegergrstratton@gmail.com
Expires: 2027-10-01T00:00:00.000Z
Preferred-Languages: en
Canonical: https://jaegergrs.com/.well-known/security.txt
`;

export function secure(res, { html = false, api = false } = {}) {
  const headers = new Headers(res.headers);
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), usb=()');
  headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  if (html) {
    headers.set('Content-Security-Policy', CSP);
    headers.set('Cache-Control', 'public, max-age=180');
  } else if (api) {
    headers.set('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'");
    headers.set('Cache-Control', 'no-store');
  } else if (res.ok) {
    // Assets are not fingerprinted, so keep CSS/JS fresh-ish and let images cache for a week.
    const type = headers.get('Content-Type') || '';
    if (type.startsWith('image/')) headers.set('Cache-Control', 'public, max-age=604800');
    else if (/css|javascript/.test(type)) headers.set('Cache-Control', 'public, max-age=3600, must-revalidate');
  }
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
}
