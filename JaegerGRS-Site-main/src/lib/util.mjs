export const enc = new TextEncoder();

export const str = (v, max = 120) =>
  String(v ?? '').replace(/[\x00-\x1F\x7F<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);

export const num = (v, min, max) => {
  const n = Number(v);
  return v !== null && v !== '' && v !== undefined && Number.isFinite(n) && n >= min && n <= max ? Math.round(n * 10) / 10 : undefined;
};

export const strip = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== ''));

// Constant-time comparison: both sides are hashed first so length differences leak nothing.
export async function safeEqual(a, b) {
  const [x, y] = await Promise.all([a, b].map(async (s) => new Uint8Array(await crypto.subtle.digest('SHA-256', enc.encode(String(s))))));
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}

export const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers } });

// Reads a request body as text but refuses anything larger than maxBytes.
export async function readLimited(request, maxBytes) {
  const declared = Number(request.headers.get('content-length'));
  if (Number.isFinite(declared) && declared > maxBytes) return null;
  const buf = await request.arrayBuffer();
  if (buf.byteLength > maxBytes) return null;
  return new TextDecoder().decode(buf);
}
