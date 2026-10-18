import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import { createBrowserTileCache } from "../lib/browser-tile-cache.js";

const url = index => `https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/1/0/${index}`;
const request = (index = 0, override = {}) => ({ url: () => url(index), method: () => "GET",
  resourceType: () => "image", allHeaders: async () => ({}), ...override });
const response = (index = 0, headers = {}, override = {}) => ({ status: () => 200,
  request: () => request(index), allHeaders: async () => ({ "content-type": "image/jpeg", "content-length": "3",
    "cache-control": "max-age=86400", age: "100", "access-control-allow-origin": "*", ...headers }),
  body: async () => Buffer.from([1, 2, 3]), ...override });

{
  let time = 0;
  const cache = createBrowserTileCache({ now: () => time, ttlMs: 1000 });
  assert.equal(await cache.lookup(request()), null);
  await cache.capture(response());
  const hit = await cache.lookup(request());
  assert.deepEqual([...hit.body], [1, 2, 3]);
  assert.equal(hit.status, 200);
  assert.equal(hit.headers["access-control-allow-origin"], "*");
  assert.equal(hit.headers["content-length"], undefined);
  assert.equal(hit.headers.age, undefined);
  assert.equal(cache.stats().savedBytes, 3);
  time = 1000;
  assert.equal(await cache.lookup(request()), null);
  assert.equal(cache.stats().bytes, 0);
  await cache.capture(response(0, { "cache-control": "max-age=1", age: "0.5" }));
  time += 500;
  assert.equal(await cache.lookup(request()), null, "the provider's remaining freshness bounds the TTL");
  cache.close();
  await cache.capture(response());
  assert.equal(await cache.lookup(request()), null);
  assert.equal(cache.stats().entries, 0);
}
{
  const cache = createBrowserTileCache({ maxEntries: 2, maxBytes: 6 });
  await cache.capture(response(0));
  await cache.capture(response(1));
  await cache.lookup(request(0));
  await cache.capture(response(2));
  assert.equal(await cache.lookup(request(1)), null, "LRU entry count stays bounded");
  assert.ok(await cache.lookup(request(0)));
  assert.ok(await cache.lookup(request(2)));
  assert.equal(cache.stats().bytes, 6);
  const small = createBrowserTileCache({ maxBytes: 4 });
  await small.capture(response(0));
  await small.capture(response(1));
  assert.equal(await small.lookup(request(0)), null, "the byte limit also evicts");
  assert.equal(small.stats().bytes, 3);
}
{
  for (const headers of [
    { "cache-control": "" }, { "cache-control": "no-store, max-age=100" },
    { "cache-control": "no-cache, max-age=100" }, { "cache-control": "private, max-age=100" },
    { "cache-control": "max-age=1", age: "1" }, { age: "invalid" }, { age: "-1" },
    { vary: "Origin" }, { "set-cookie": "session=value" }, { "content-encoding": "gzip" },
    { "content-type": "text/html" }, { "content-length": "" }, { "content-length": "invalid" },
    { "content-length": "1000000" }
  ]) {
    const cache = createBrowserTileCache();
    let reads = 0;
    await cache.capture(response(0, headers, { body: async () => { reads++; return Buffer.from([1, 2, 3]); } }));
    assert.equal(reads, 0, "ineligible bodies must not be read");
    assert.equal(cache.stats().entries, 0);
  }
  for (const override of [
    { url: () => "https://services.arcgisonline.com.evil.example/tile/1/0/0" },
    { url: () => url(0) + "?token=private" }, { url: () => url(0).replace("https:", "http:") },
    { url: () => "http://127.0.0.1/data/countries/ARG.json" }, { method: () => "POST" },
    { resourceType: () => "document" }, { allHeaders: async () => ({ authorization: "private" }) },
    { allHeaders: async () => ({ cookie: "private" }) }, { allHeaders: async () => ({ range: "bytes=0-1" }) },
    { allHeaders: async () => ({ "cache-control": "no-cache" }) }
  ]) {
    const cache = createBrowserTileCache();
    const invalid = request(0, override);
    let reads = 0;
    await cache.capture(response(0, {}, { request: () => invalid,
      body: async () => { reads++; return Buffer.from([1, 2, 3]); } }));
    assert.equal(reads, 0, "no body read for ineligible requests");
    assert.equal(await cache.lookup(invalid), null);
    assert.equal(cache.stats().entries, 0);
  }
  const cache = createBrowserTileCache();
  await cache.capture(response(0, {}, { status: () => 503 }));
  await cache.capture(response(0, {}, { body: async () => Buffer.from([1]) }));
  await cache.capture(response(0, {}, { body: async () => { throw new Error("closed"); } }));
  assert.equal(await cache.lookup(request()), null, "failed and incomplete responses remain real misses");
  assert.equal(cache.stats().reads, 0);
}
for (const type of ["fetch", "xhr"]) {
  const cache = createBrowserTileCache();
  const tile = request(0, { resourceType: () => type });
  await cache.capture(response(0, {}, { request: () => tile }));
  assert.ok(await cache.lookup(tile), "Cesium's blob/ImageBitmap requests are still imagery, not app data");
}
{
  const cache = createBrowserTileCache({ maxReads: 1 });
  let release;
  const pending = cache.capture(response(0, {}, { body: () => new Promise(resolve => { release = resolve; }) }));
  await new Promise(resolve => setImmediate(resolve));
  let extraReads = 0;
  await cache.capture(response(1, {}, { body: async () => { extraReads++; return Buffer.from([1, 2, 3]); } }));
  assert.equal(extraReads, 0, "bounded pending reads");
  assert.equal(cache.stats().reads, 1);
  cache.close();
  release(Buffer.from([1, 2, 3]));
  await pending;
  assert.equal(cache.stats().entries, 0, "late body reads cannot revive a closed cache");
  assert.equal(cache.stats().reads, 0);
}
{
  let time = 0;
  const cache = createBrowserTileCache({ now: () => time, ttlMs: 1000 });
  const context = new EventEmitter();
  context.route = async (pattern, handler) => { context.pattern = pattern; context.handler = handler; };
  await cache.attach(context);
  assert.equal(context.listenerCount("response"), 1);
  let continued = 0, fulfilled;
  const route = { request: () => request(), continue: async () => { continued++; },
    fulfill: async entry => { fulfilled = entry; } };
  await context.handler(route);
  assert.equal(continued, 1);
  await cache.capture(response());
  await context.handler(route);
  assert.equal(continued, 1);
  assert.deepEqual([...fulfilled.body], [1, 2, 3]);
  const replayed = request();
  await context.handler({ ...route, request: () => replayed });
  time = 1000;
  assert.equal(await cache.lookup(request()), null);
  let replayReads = 0;
  await cache.capture(response(0, {}, { request: () => replayed,
    body: async () => { replayReads++; return Buffer.from([1, 2, 3]); } }));
  assert.equal(replayReads, 0, "no reread or TTL renewal of replays");
  assert.equal(cache.stats().entries, 0);
  context.emit("close");
  assert.equal(context.listenerCount("response"), 0);
}
for (const key of ["maxEntries", "maxBytes", "maxTileBytes", "maxReads", "ttlMs"]) {
  for (const value of [0, -1, Infinity, NaN, 0.5]) assert.throws(() => createBrowserTileCache({ [key]: value }));
}
console.log("browser-tile-cache.test.js ok");
