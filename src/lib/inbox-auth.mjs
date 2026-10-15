const jwksCache = new Map();
const encoder = new TextEncoder();

function decodePart(value) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  return Uint8Array.from(atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')), (c) => c.charCodeAt(0));
}

function decodeJson(value) {
  return JSON.parse(new TextDecoder().decode(decodePart(value)));
}

function accessIssuer(value) {
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.pathname !== '/' || url.search || url.hash || !url.hostname.endsWith('.cloudflareaccess.com')) {
    throw new Error('Invalid Cloudflare Access team domain');
  }
  return url.origin;
}

async function accessKeys(issuer) {
  const cached = jwksCache.get(issuer);
  if (cached && cached.until > Date.now()) return cached.keys;

  const response = await fetch(`${issuer}/cdn-cgi/access/certs`, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`Cloudflare Access key request failed: ${response.status}`);
  const document = await response.json();
  if (!Array.isArray(document.keys)) throw new Error('Cloudflare Access returned invalid signing keys');
  jwksCache.set(issuer, { keys: document.keys, until: Date.now() + 5 * 60 * 1000 });
  return document.keys;
}

export async function authorizeInbox(request, env) {
  if (!env.ACCESS_TEAM_DOMAIN || !env.ACCESS_AUD || !env.INBOX_ALLOWED_EMAIL) return 'not_configured';

  let issuer;
  try {
    issuer = accessIssuer(env.ACCESS_TEAM_DOMAIN);
  } catch (error) {
    console.error('inbox access configuration invalid', error?.name || 'Error');
    return 'not_configured';
  }

  const token = request.headers.get('cf-access-jwt-assertion') || '';
  const parts = token.split('.');
  if (parts.length !== 3) return 'unauthorized';

  let header;
  let claims;
  try {
    header = decodeJson(parts[0]);
    claims = decodeJson(parts[1]);
  } catch {
    return 'unauthorized';
  }
  const audiences = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
  if (header.alg !== 'RS256' || typeof header.kid !== 'string') return 'unauthorized';
  if (claims.iss !== issuer || !audiences.includes(env.ACCESS_AUD)) return 'unauthorized';

  const now = Math.floor(Date.now() / 1000);
  if (typeof claims.exp !== 'number' || claims.exp <= now || (typeof claims.nbf === 'number' && claims.nbf > now)) return 'unauthorized';
  if (typeof claims.email !== 'string' || claims.email.toLowerCase() !== env.INBOX_ALLOWED_EMAIL.toLowerCase()) return 'unauthorized';

  let keys;
  try {
    keys = await accessKeys(issuer);
  } catch (error) {
    console.error('inbox access keys unavailable', error?.name || 'Error');
    return 'unavailable';
  }
  let jwk = keys.find((key) => key.kid === header.kid && key.kty === 'RSA');
  if (!jwk) {
    jwksCache.delete(issuer);
    try {
      jwk = (await accessKeys(issuer)).find((key) => key.kid === header.kid && key.kty === 'RSA');
    } catch (error) {
      console.error('inbox access keys unavailable', error?.name || 'Error');
      return 'unavailable';
    }
  }
  if (!jwk) return 'unauthorized';

  try {
    const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
    const valid = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, decodePart(parts[2]), encoder.encode(`${parts[0]}.${parts[1]}`));
    return valid ? claims.email : 'unauthorized';
  } catch {
    return 'unauthorized';
  }
}
