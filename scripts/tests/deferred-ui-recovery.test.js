import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";

const source = await fs.readFile(new URL("../../script.js", import.meta.url), "utf8");
const loader = source.slice(source.indexOf("async function ensureDeferredUiModule("), source.indexOf("const QUALITY_PRESET_OVERRIDES"));
const waitBudget = source.match(/const DEFERRED_UI_WAIT_MS = (\d+);/);
assert.equal(Number(waitBudget?.[1]), 20000, "the UI wait budget must not silently grow");

{
  let indexBuilds = 0;
  let rerenders = 0;
  let release;
  const context = vm.createContext({
    searchCore: {},
    ensureDeferredUiModule: () => new Promise(resolve => { release = resolve; }),
    ensureSearchIndexReady() { indexBuilds++; },
    getSuggestions: () => [], renderSearchMemory() {},
    document: { getElementById: id => id === "map-search-input" ? { value: "Argentina" } : {} }
  });
  vm.runInContext(source.slice(source.indexOf("function renderSuggestions("), source.indexOf("function hideSuggestions(")), context);
  const render = context.renderSuggestions;
  context.renderSuggestions = () => { rerenders++; };
  render("Argentina");
  release(false);
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(indexBuilds, 0, "failed search loading must not build an index");
  assert.equal(rerenders, 0, "failed/expired search loading must not recursively reload itself");
  render("Argentina");
  release(true);
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(indexBuilds, 1);
  assert.equal(rerenders, 1, "an explicit successful retry still updates the current query");
}

function fixture() {
  const requests = [];
  const messages = [];
  const warnings = [];
  const pending = [];
  const timers = new Map();
  let now = 0;
  let timerId = 0;
  let refreshes = 0;
  const context = vm.createContext({
    DEFERRED_UI_MODULES: { exportShare: "./app-export-share.js?v=fixture", news: "./app-news-ui.js?v=fixture" },
    deferredUiModulePromises: new Map(), deferredUiModuleFailures: new Map(),
    deferredUiModuleLoads: new Map(), currentLanguage: "es",
    setTimeout(callback, delay) { const id = ++timerId; timers.set(id, { callback, at: now + delay }); return id; },
    clearTimeout(id) { timers.delete(id); },
    uiPolish: { showToast: message => messages.push(message) },
    console: { warn: (...args) => warnings.push(args) },
    refreshDeferredUiGlobals() { refreshes += 1; },
    importModule(url) {
      requests.push(url);
      return new Promise((resolve, reject) => pending.push({ resolve, reject }));
    }
  });
  vm.runInContext(waitBudget[0] + loader.replace("import(loadUrl)", "importModule(loadUrl)"), context);
  return { context, requests, messages, warnings, pending, timers, refreshes: () => refreshes,
    advance(ms) {
      now += ms;
      for (const [id, timer] of timers) {
        if (timer.at <= now) { timers.delete(id); timer.callback(); }
      }
    },
    load: name => context.ensureDeferredUiModule(name) };
}

const stalled = fixture();
const stalledFirst = stalled.load("news");
const stalledConcurrent = stalled.load("news");
assert.equal(stalled.timers.size, 1, "pending consumers share one bounded wait");
const oldTimeout = [...stalled.timers.values()][0].callback;
stalled.advance(19999);
assert.equal(stalled.messages.length, 0, "a slow download retains its full wait budget");
assert.equal(stalled.timers.size, 1);
stalled.advance(1);
assert.equal(await stalledFirst, false);
assert.equal(await stalledConcurrent, false);
assert.equal(stalled.timers.size, 0);
assert.equal(stalled.messages.length, 1, "a timeout reports once, not once per consumer");
assert.match(stalled.messages[0], /tarda demasiado/);
assert.equal(stalled.context.deferredUiModulePromises.has("news"), false);
assert.equal(stalled.context.deferredUiModuleLoads.size, 1, "native imports cannot be cancelled");
assert.equal(stalled.context.deferredUiModuleLoads.get("news").finish, null, "a completed wait releases its callback");
assert.equal(stalled.context.deferredUiModuleFailures.size, 0, "waiting is not a failed module URL");
for (let attempt = 0; attempt < 4; attempt += 1) {
  const next = stalled.load("news");
  assert.equal(stalled.timers.size, 1);
  stalled.advance(20000);
  assert.equal(await next, false);
  assert.equal(stalled.context.deferredUiModuleLoads.get("news").finish, null,
    "explicit repeated waits do not accumulate handlers on the native import");
  assert.equal(stalled.requests.length, 1);
}
const stalledRetry = stalled.load("news");
const stalledRetryConcurrent = stalled.load("news");
assert.equal(stalled.requests.length, 1, "retry joins the pending import without overlapping module side effects");
assert.equal(stalled.timers.size, 1);
oldTimeout();
assert.equal(stalled.timers.size, 1, "an obsolete callback cannot end a newer explicit wait");
assert.equal(typeof stalled.context.deferredUiModuleLoads.get("news").finish, "function");
stalled.pending[0].resolve({});
assert.equal(await stalledRetry, true);
assert.equal(await stalledRetryConcurrent, true);
assert.equal(stalled.timers.size, 0);
assert.equal(stalled.context.deferredUiModuleLoads.size, 0);
assert.equal(stalled.refreshes(), 1);
assert.equal(await stalled.load("news"), true);
assert.equal(stalled.timers.size, 0, "successful reuse does not start another deadline");

const independent = fixture();
const slowNews = independent.load("news");
independent.advance(10000);
const slowExport = independent.load("exportShare");
independent.advance(10000);
assert.equal(await slowNews, false);
assert.equal(independent.timers.size, 1, "another module keeps its own remaining wait");
independent.pending[1].resolve({});
assert.equal(await slowExport, true);
assert.equal(independent.timers.size, 0);
independent.pending[0].resolve({});
await new Promise(resolve => setImmediate(resolve));
assert.equal(independent.context.deferredUiModuleLoads.size, 0);

for (const withToast of [false, true]) {
  const timeout = fixture();
  timeout.context.currentLanguage = "en";
  if (!withToast) timeout.context.uiPolish = {};
  const result = timeout.load("news");
  timeout.advance(20000);
  assert.equal(await result, false, "early startup is safe even when the notice module is unavailable");
  if (withToast) assert.match(timeout.messages[0], /taking too long/);
  timeout.pending[0].resolve({});
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(timeout.context.deferredUiModuleLoads.size, 0);
}

const lateTools = fixture();
lateTools.context.window = { GeoRiskExportShare: { shareText() {} } };
lateTools.context.exportShareUi = {};
vm.runInContext(source.slice(source.indexOf("async function getExportShareTools("),
  source.indexOf("async function ensureExportLibraries(")), lateTools.context);
const timedOutTools = lateTools.context.getExportShareTools();
lateTools.advance(20000);
assert.equal(Object.keys(await timedOutTools).length, 0,
  "an expired action cannot use globals even if the module became available before its continuation");
lateTools.pending[0].resolve({});
await new Promise(resolve => setImmediate(resolve));
assert.equal(await lateTools.context.getExportShareTools(), lateTools.context.window.GeoRiskExportShare);

for (const lateFailure of [false, true]) {
  const late = fixture();
  const result = late.load("exportShare");
  late.advance(20000);
  assert.equal(await result, false);
  if (lateFailure) late.pending[0].reject(new TypeError("Failed to fetch dynamically imported module"));
  else late.pending[0].resolve({});
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(late.messages.length, 1, "late settlement must not replay feedback or the timed-out action");
  assert.equal(late.context.deferredUiModuleLoads.size, 0);
  assert.equal(late.timers.size, 0);
  assert.equal(late.refreshes(), 1);
  const next = late.load("exportShare");
  if (lateFailure) {
    assert.deepEqual(late.requests, ["./app-export-share.js?v=fixture", "./app-export-share.js?v=fixture&retry=1"]);
    late.pending[1].resolve({});
  } else assert.equal(late.requests.length, 1, "late success is cached for the next explicit action");
  assert.equal(await next, true);
  assert.equal(late.timers.size, 0);
}

const test = fixture();
assert.equal(await test.load("unknown"), undefined);
for (const name of ["__proto__", "constructor", "toString"]) assert.equal(await test.load(name), undefined);
assert.equal(test.requests.length, 0, "unknown modules cannot trigger downloads");
const first = test.load("exportShare");
const concurrent = test.load("exportShare");
assert.equal(test.requests.length, 1, "simultaneous consumers share a single download");
test.pending[0].reject(new TypeError("Failed to fetch dynamically imported module"));
assert.equal(await first, false);
assert.equal(await concurrent, false);
assert.equal(test.context.deferredUiModulePromises.has("exportShare"), false,
  "failed downloads must not remain cached for the entire session");
assert.equal(test.warnings.length, 1);
assert.equal(test.messages.length, 1, "one failure must not duplicate its feedback across consumers");
assert.match(test.messages[0], /Revisa tu conexion/);
assert.equal(test.requests.length, 1, "failure must not trigger speculative retries");

const retry = test.load("exportShare");
const retryConcurrent = test.load("exportShare");
assert.equal(test.requests.length, 2, "another request after failure can retry");
assert.equal(test.requests[1], test.requests[0] + "&retry=1", "one bounded URL variant bypasses the browser's failed import cache");
test.pending[1].resolve({});
assert.equal(await retry, true);
assert.equal(await retryConcurrent, true);
assert.equal(await test.load("exportShare"), true);
assert.equal(test.requests.length, 2, "successful modules are reused without further downloads");
assert.equal(test.refreshes(), 2);
assert.equal(test.timers.size, 0, "success and network failure clear their deadlines");
assert.equal(test.context.deferredUiModuleLoads.size, 0);

test.context.currentLanguage = "en";
const news = test.load("news");
test.pending[2].reject(new TypeError("error loading dynamically imported module"));
assert.equal(await news, false);
assert.match(test.messages[1], /Check your connection/);
assert.equal(await test.load("exportShare"), true, "one failed module must not evict another successful module");
test.context.uiPolish = {};
const noToast = test.load("news");
test.pending[3].reject(new TypeError("Importing a module script failed"));
assert.equal(await noToast, false, "early startup remains safe without the optional toast module");
assert.equal(test.requests.length, 4);
assert.equal(test.context.deferredUiModulePromises.size, 1);

const exhausted = fixture();
for (let attempt = 0; attempt < 3; attempt += 1) {
  const result = exhausted.load("news");
  exhausted.pending[attempt].reject(new TypeError("Failed to fetch dynamically imported module"));
  assert.equal(await result, false);
}
assert.match(exhausted.messages.at(-1), /Recarga la pagina/);
for (let attempt = 0; attempt < 10; attempt += 1) assert.equal(await exhausted.load("news"), false);
assert.equal(exhausted.requests.length, 3, "failed modules cannot grow an unbounded browser module cache");
assert.deepEqual(exhausted.requests, ["./app-news-ui.js?v=fixture", "./app-news-ui.js?v=fixture&retry=1", "./app-news-ui.js?v=fixture&retry=2"]);
assert.equal(exhausted.context.deferredUiModuleFailures.size, 1);
assert.equal(exhausted.context.deferredUiModulePromises.size, 0);
assert.equal(exhausted.timers.size, 0);
assert.equal(exhausted.context.deferredUiModuleLoads.size, 0);

for (const error of [new SyntaxError("Broken module"), new TypeError("Invalid runtime state")]) {
  const evaluation = fixture();
  const result = evaluation.load("news");
  evaluation.pending[0].reject(error);
  assert.equal(await result, false);
  assert.match(evaluation.messages[0], /Recarga la pagina/);
  assert.equal(await evaluation.load("news"), false);
  assert.equal(evaluation.requests.length, 1, "code failures must not re-evaluate possibly partial module side effects");
}
console.log("Deferred UI recovery: OK");
