// Tiny per-visitor rate limiter. The Worker asks one Guard object per hashed visitor key.
// Limits: 3 messages per 10 minutes and 8 per day.
const WINDOWS = [[10 * 60 * 1000, 3], [24 * 60 * 60 * 1000, 8]];

export class Guard {
  constructor() { this.hits = []; }

  async fetch() {
    const now = Date.now();
    this.hits = this.hits.filter((t) => now - t < WINDOWS[1][0]);
    for (const [span, max] of WINDOWS) {
      if (this.hits.filter((t) => now - t < span).length >= max) return Response.json({ allowed: false }, { status: 429 });
    }
    this.hits.push(now);
    return Response.json({ allowed: true });
  }
}
