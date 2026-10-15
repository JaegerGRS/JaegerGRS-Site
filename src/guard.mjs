// Tiny per-visitor rate limiter. The Worker asks one Guard object per hashed visitor key.
// Limits: 3 messages per 10 minutes and 8 per day. Hits are persisted so limits survive the object being evicted.
const WINDOWS = [[10 * 60 * 1000, 3], [24 * 60 * 60 * 1000, 8]];

export class Guard {
  constructor(state) {
    this.state = state;
    this.hits = [];
    state?.blockConcurrencyWhile?.(async () => { this.hits = (await state.storage.get('hits')) || []; });
  }

  async fetch() {
    const now = Date.now();
    this.hits = this.hits.filter((t) => now - t < WINDOWS[1][0]);
    for (const [span, max] of WINDOWS) {
      if (this.hits.filter((t) => now - t < span).length >= max) return Response.json({ allowed: false }, { status: 429 });
    }
    this.hits.push(now);
    await this.state?.storage?.put('hits', this.hits);
    return Response.json({ allowed: true });
  }
}
