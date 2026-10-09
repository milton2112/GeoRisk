const TILE_URL = /^https:\/\/services\.arcgisonline\.com\/ArcGIS\/rest\/services\/World_Imagery\/MapServer\/tile\/\d+\/\d+\/\d+$/;

export function createBrowserTileCache({ maxEntries = 256, maxBytes = 8 * 1024 ** 2,
  maxTileBytes = 256 * 1024, maxReads = 4, ttlMs = 600_000, now = Date.now } = {}) {
  for (const value of [maxEntries, maxBytes, maxTileBytes, maxReads, ttlMs]) {
    if (!Number.isSafeInteger(value) || value <= 0) throw new Error("Invalid tile cache limit.");
  }
  const entries = new Map();
  const replayedRequests = new WeakSet();
  let bytes = 0, reads = 0, closed = false, hits = 0, misses = 0, savedBytes = 0;
  const remove = url => {
    const entry = entries.get(url);
    if (entry) bytes -= entry.body.length;
    entries.delete(url);
  };
  const tileRequest = request => TILE_URL.test(request.url()) && request.method() === "GET" &&
    ["image", "fetch", "xhr"].includes(request.resourceType());
  const eligible = async request => {
    const headers = await request.allHeaders();
    return !Object.keys(headers).some(name => /^(authorization|cookie|range)$/i.test(name)) &&
      !/no-cache|no-store|max-age=0/i.test(headers["cache-control"] || "");
  };
  const lookup = async request => {
    if (closed || !tileRequest(request) || !await eligible(request) || closed) return null;
    const url = request.url();
    const entry = entries.get(url);
    if (!entry || entry.expiresAt <= now()) {
      remove(url);
      misses += 1;
      return null;
    }
    entries.delete(url);
    entries.set(url, entry);
    hits += 1;
    savedBytes += entry.body.length;
    return { status: 200, headers: entry.headers, body: entry.body };
  };
  const capture = async response => {
    const request = response.request();
    if (closed || reads >= maxReads || replayedRequests.has(request) || response.status() !== 200 || !tileRequest(request)) return;
    if (entries.get(request.url())?.expiresAt > now()) return;
    reads += 1;
    try {
      if (!await eligible(request) || closed) return;
      const headers = await response.allHeaders();
      const control = headers["cache-control"] || "";
      const maxAge = control.match(/(?:^|,)\s*max-age=(\d+)(?:\s*(?:,|$))/i);
      const age = Number(headers.age || 0);
      const length = Number(headers["content-length"]);
      if (!maxAge || /(?:no-cache|no-store|private)/i.test(control) || headers.vary || headers["set-cookie"] ||
        headers["content-encoding"] || !/^image\/(?:jpeg|png)(?:;|$)/i.test(headers["content-type"] || "") ||
        !Number.isFinite(age) || age < 0 || !Number.isSafeInteger(length) || length <= 0 ||
        length > Math.min(maxTileBytes, maxBytes)) return;
      const lifetime = Math.min(ttlMs, (Number(maxAge[1]) - age) * 1000);
      if (!(lifetime > 0)) return;
      const expiresAt = now() + lifetime;
      const body = await response.body();
      if (closed || expiresAt <= now() || body.length !== length) return;
      const url = response.request().url();
      remove(url);
      // Bodies are decoded by Playwright; retain only headers needed by the image consumer.
      const keptHeaders = Object.fromEntries(Object.entries(headers).filter(([name]) =>
        /^(content-type|access-control-[a-z-]+|cross-origin-resource-policy|x-content-type-options|cache-control|etag|last-modified)$/i.test(name)));
      entries.set(url, { body, headers: keptHeaders, expiresAt });
      bytes += body.length;
      while (entries.size > maxEntries || bytes > maxBytes) remove(entries.keys().next().value);
    } catch {
      // Closing a page or a failed body read is a cache miss, never a fabricated response.
    } finally { reads -= 1; }
  };
  return {
    lookup, capture,
    async attach(context) {
      await context.route(TILE_URL, async route => {
        const request = route.request();
        const entry = await lookup(request);
        if (entry) replayedRequests.add(request);
        return entry ? route.fulfill(entry) : route.continue();
      });
      context.on("response", capture);
      context.once("close", () => context.off("response", capture));
    },
    stats: () => ({ entries: entries.size, bytes, reads, hits, misses, savedBytes }),
    close() { closed = true; entries.clear(); bytes = 0; }
  };
}
