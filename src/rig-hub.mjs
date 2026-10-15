// Durable Object holding the latest PC snapshot. The PC app POSTs samples (through the Worker, which
// checks the pairing key); the public site polls GET /snapshot. One global instance ("main") is used.
import { sanitizeLive, sanitizeSpecs, publicSnapshotParts } from './lib/rig.mjs';

const OFFLINE_AFTER_MS = 25000;

export class RigHub {
  constructor(state) {
    this.state = state;
    this.specs = null;
    this.live = null;
    this.lastAt = 0;
    this.lastPost = 0;
    this.lastPersist = 0;
    this.watchers = [];
    state.blockConcurrencyWhile(async () => {
      const saved = await state.storage.get('snapshot');
      if (saved) { this.specs = saved.specs; this.live = saved.live; this.lastAt = saved.at; }
    });
  }

  watching() {
    const cutoff = Date.now() - 20000;
    this.watchers = this.watchers.filter((t) => t > cutoff);
    return this.watchers.length > 0;
  }

  async fetch(request) {
    const url = new URL(request.url);
    const now = Date.now();

    if (request.method === 'POST' && url.pathname === '/ingest') {
      const body = await request.json().catch(() => null);
      const live = sanitizeLive(body?.live);
      const specs = body?.specs ? sanitizeSpecs(body.specs) : null;
      if (!live && !specs) return Response.json({ ok: false, error: 'invalid' }, { status: 422 });
      if (now - this.lastPost < 1000) return Response.json({ ok: false, error: 'slow_down' }, { status: 429 });
      this.lastPost = now;
      if (live) { this.live = live; this.lastAt = now; }
      let specsChanged = false;
      if (specs) { specsChanged = JSON.stringify(specs) !== JSON.stringify(this.specs); this.specs = specs; }
      if (specsChanged || now - this.lastPersist > 30000) {
        this.lastPersist = now;
        await this.state.storage.put('snapshot', { specs: this.specs, live: this.live, at: this.lastAt });
      }
      // The agent slows down while nobody is watching the site.
      return Response.json({ ok: true, watching: this.watching() });
    }

    if (url.pathname === '/key' && request.method === 'GET') {
      return Response.json({ key: (await this.state.storage.get('pairingKey')) || null });
    }

    if (url.pathname === '/claim' && request.method === 'POST') {
      const existing = await this.state.storage.get('pairingKey');
      if (existing && url.searchParams.get('rotate') !== '1') {
        return Response.json({ ok: false, code: 'already_claimed' }, { status: 409 });
      }
      const key = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(36))))
        .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      await this.state.storage.put('pairingKey', key);
      return Response.json({ ok: true, key }, { headers: { 'Cache-Control': 'no-store' } });
    }

    if (request.method === 'GET' && url.pathname === '/snapshot') {
      this.watchers.push(now);
      if (this.watchers.length > 200) this.watchers.splice(0, this.watchers.length - 200);
      const ageMs = this.lastAt ? now - this.lastAt : null;
      const pub = publicSnapshotParts(this.specs, this.live);
      return Response.json({
        online: ageMs !== null && ageMs < OFFLINE_AFTER_MS,
        ageSec: ageMs === null ? null : Math.round(ageMs / 1000),
        specs: pub.specs,
        live: pub.live,
      });
    }

    return new Response('Not found', { status: 404 });
  }
}
