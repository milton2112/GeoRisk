import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";

const source = await fs.readFile(new URL("../lib/wikipedia-conflicts.js", import.meta.url), "utf8");
const requestSource = source.slice(source.indexOf("const WIKIPEDIA_HEADERS ="), source.indexOf("function decodeHtmlEntities("));

function harness(fetch) {
  const timers = new Map();
  let nextId = 0;
  const context = vm.createContext({
    fetch, AbortController, AbortSignal, Error,
    setTimeout(callback, ms) { const id = ++nextId; timers.set(id, { callback, ms }); return id; },
    clearTimeout(id) { timers.delete(id); }
  });
  vm.runInContext(requestSource, context);
  return { timers, request: options => context.fetchWikipediaJson("https://example.invalid/api", 1, options) };
}

// Headers have arrived, but the body stalls. The same deadline must still abort it.
let bodyStarted;
const started = new Promise(resolve => { bodyStarted = resolve; });
const stalled = harness(async (_url, { signal }) => ({
  ok: true,
  json: () => new Promise((_resolve, reject) => {
    signal.addEventListener("abort", () => reject(signal.reason), { once: true });
    bodyStarted();
  })
}));
const pending = stalled.request({ timeoutMs: 25 });
const timedOut = assert.rejects(pending, /excedio 25ms/);
await started;
assert.equal(stalled.timers.size, 1, "response headers must not cancel the body deadline");
const timer = [...stalled.timers.values()][0];
assert.equal(timer.ms, 25);
timer.callback();
await timedOut;
assert.equal(stalled.timers.size, 0);

const successful = harness(async () => ({ ok: true, json: async () => ({ query: { pages: [] } }) }));
assert.deepEqual(await successful.request(), { query: { pages: [] } });
assert.equal(successful.timers.size, 0, "success must clear its timer");

const malformed = harness(async () => ({ ok: true, json: async () => { throw new SyntaxError("invalid JSON"); } }));
await assert.rejects(malformed.request(), /invalid JSON/);
assert.equal(malformed.timers.size, 0, "parse failure must clear its timer");

let cancelledBodyStarted;
const cancellationStarted = new Promise(resolve => { cancelledBodyStarted = resolve; });
const caller = new AbortController();
const cancelled = harness(async (_url, { signal }) => ({
  ok: true,
  json: () => new Promise((_resolve, reject) => {
    signal.addEventListener("abort", () => reject(signal.reason), { once: true });
    cancelledBodyStarted();
  })
}));
const reason = new Error("caller stopped import");
const cancelledRequest = assert.rejects(cancelled.request({ signal: caller.signal }), error => error === reason);
await cancellationStarted;
caller.abort(reason);
await cancelledRequest;
assert.equal(cancelled.timers.size, 0, "caller cancellation must clear the body deadline");

let destroyed = 0;
const rejected = harness(async () => ({ ok: false, status: 503, body: { destroy() { destroyed++; } } }));
await assert.rejects(rejected.request(), /503/);
assert.equal(destroyed, 1, "unused HTTP error bodies must be released");
assert.equal(rejected.timers.size, 0);

let attempts = 0;
let retryBodyDestroyed = 0;
let notifyRetry;
const retryReady = new Promise(resolve => { notifyRetry = resolve; });
const retried = harness(async () => ++attempts === 1
  ? { ok: false, status: 429, headers: { get: () => "1" }, body: { destroy() { retryBodyDestroyed++; notifyRetry(); } } }
  : { ok: true, json: async () => ({ retried: true }) });
const retryResult = retried.request();
await retryReady;
assert.equal(retryBodyDestroyed, 1, "release the rate-limit response before retrying");
assert.equal(retried.timers.size, 1);
const [retryId, retryTimer] = [...retried.timers.entries()][0];
assert.equal(retryTimer.ms, 1000, "preserve the existing Retry-After behavior");
retried.timers.delete(retryId);
retryTimer.callback();
assert.deepEqual(await retryResult, { retried: true });
assert.equal(attempts, 2);
assert.equal(retried.timers.size, 0);

let notifyWaiting;
const waiting = new Promise(resolve => { notifyWaiting = resolve; });
const retryCaller = new AbortController();
let cancelledAttempts = 0;
const waitingRetry = harness(async () => {
  cancelledAttempts++;
  return { ok: false, status: 429, headers: { get: () => "10" }, body: { destroy() { notifyWaiting(); } } };
});
const retryCancelled = assert.rejects(waitingRetry.request({ signal: retryCaller.signal }), error => error === reason);
await waiting;
assert.equal(waitingRetry.timers.size, 1);
retryCaller.abort(reason);
assert.equal(waitingRetry.timers.size, 0, "cancelling backoff must clear its timer immediately");
await retryCancelled;
assert.equal(cancelledAttempts, 1, "cancellation must not send another request");

const excessive = harness(async () => ({
  ok: false, status: 429, headers: { get: () => "86400" }, body: { destroy() {} }
}));
await assert.rejects(excessive.request(), /Retry-After/);
assert.equal(excessive.timers.size, 0, "excessive waits must fail instead of scheduling or retrying early");

console.log("wikipedia-request-lifecycle.test.js ok: body deadline, cancellation, bounded retries and cleanup");
