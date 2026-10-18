import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";

const source = await fs.readFile(new URL("../../script.js", import.meta.url), "utf8");
const loader = source.slice(source.indexOf("function loadScriptOnce("), source.indexOf("async function hydrateCountriesData("));

function fixture() {
  const scripts = [], attached = [], warnings = [], messages = [], merges = [];
  const timers = new Map();
  let clock = 0, timerId = 0;
  let appendError = false;
  const context = vm.createContext({
    APP_VERSION: "fixture", loadRuntimeCurationPromise: null,
    deferredDataStatus: { runtimeCuration: false }, countriesData: { ARG: {} },
    console: { warn: (...args) => warnings.push(args) },
    uiPolish: { showToast: message => messages.push(message) }, currentLanguage: "es",
    measureBootStep: (name, action) => action(),
    mergeRuntimeConflictRules: value => merges.push(value),
    mergeCountryCuration() {}, sanitizeCountryData() {}, mergeImportedConflictDetails() {},
    invalidateCountryDerivedCaches() {}, refreshLoadedCountryLayers() {}, refreshGlobalStats() {},
    updateAppStatusPanel() {}, rerenderCurrentPanel() {},
    setTimeout(action, delay) {
      const id = ++timerId;
      timers.set(id, { action, at: clock + delay });
      return id;
    },
    clearTimeout(id) { timers.delete(id); },
    document: {
      querySelector: selector => attached.find(script => selector === `script[data-dynamic-src="${script.dataset.dynamicSrc}"]`),
      createElement(tag) {
        assert.equal(tag, "script");
        const events = new Map();
        const script = {
          dataset: {},
          addEventListener(name, action, options) {
            const listeners = events.get(name) || [];
            listeners.push({ action, once: options?.once });
            events.set(name, listeners);
          },
          removeEventListener(name, action) {
            events.set(name, (events.get(name) || []).filter(listener => listener.action !== action));
          },
          dispatch(name) {
            for (const listener of [...(events.get(name) || [])]) {
              if (listener.once) this.removeEventListener(name, listener.action);
              listener.action();
            }
          },
          listeners: () => [...events.values()].reduce((sum, list) => sum + list.length, 0),
          remove() { const index = attached.indexOf(this); if (index >= 0) attached.splice(index, 1); }
        };
        scripts.push(script);
        return script;
      },
      body: { appendChild(script) {
        if (appendError) throw new Error("Cannot append script");
        attached.push(script);
      } }
    }
  });
  context.window = context;
  vm.runInContext(loader, context);
  return { context, scripts, attached, warnings, messages, merges, timers,
    advance(ms) {
      clock += ms;
      for (const [id, timer] of [...timers]) {
        if (timer.at <= clock) { timers.delete(id); timer.action(); }
      }
    },
    load: () => context.loadRuntimeCuration(),
    script: (src, flag) => context.loadScriptOnce(src, flag),
    failAppend: value => { appendError = value; } };
}

const test = fixture();
const first = test.load();
const concurrent = test.load();
assert.equal(test.scripts.length, 2, "concurrent curation consumers share the two script downloads");
test.context.GeoRiskConflictRules = { fixture: true };
test.scripts[0].dispatch("load");
test.scripts[1].dispatch("error");
await first;
await concurrent;
assert.equal(test.context.loadRuntimeCurationPromise, null, "failed curation must not remain cached for the entire session");
assert.equal(test.attached.length, 1, "a failed script cannot trap subsequent requests on an already dispatched error");
assert.equal(test.scripts[0].listeners(), 0);
assert.equal(test.scripts[1].listeners(), 0);
assert.equal(test.context.deferredDataStatus.runtimeCuration, false);
assert.equal(test.merges.length, 0, "do not apply a partial pair of curation scripts");
assert.equal(test.warnings.length, 1);
assert.equal(test.messages.length, 1);
assert.match(test.messages[0], /datos historicos/i);
assert.equal(test.scripts.length, 2, "failure does not launch an automatic retry");

const retry = test.load();
const retryConcurrent = test.load();
assert.equal(test.scripts.length, 3, "a new request retries only the failed script");
test.context.GeoRiskCuration = { COUNTRY_CURATION_OVERRIDES: {} };
test.scripts[2].dispatch("load");
assert.equal(await retry, test.context.GeoRiskCuration);
assert.equal(await retryConcurrent, test.context.GeoRiskCuration);
assert.equal(await test.load(), test.context.GeoRiskCuration);
assert.equal(test.context.deferredDataStatus.runtimeCuration, true);
assert.equal(test.merges.length, 1, "successful curation is applied once");
assert.equal(test.scripts.length, 3);
assert.ok(test.scripts.every(script => script.listeners() === 0));
assert.equal(test.timers.size, 0, "success and error release every deadline");

const stalled = fixture();
const stalledRequests = Promise.allSettled([
  stalled.script("./app-performance-ui.js", "GeoRiskPerformanceUi"),
  stalled.script("./app-performance-ui.js", "GeoRiskPerformanceUi")
]);
assert.equal(stalled.scripts.length, 1, "a hung request still shares one script element");
assert.equal(stalled.timers.size, 2, "each consumer has a finite deadline");
stalled.advance(19999);
assert.equal(stalled.attached.length, 1, "slow requests remain eligible before the deadline");
stalled.advance(1);
assert.ok((await stalledRequests).every(result => result.status === "rejected" && /No se pudo cargar/.test(result.reason.message)));
assert.equal(stalled.attached.length, 0);
assert.equal(stalled.scripts[0].listeners(), 0, "timeout releases all consumers' listeners");
assert.equal(stalled.timers.size, 0);
assert.equal(stalled.scripts.length, 1, "timeout must not trigger an automatic retry");
stalled.scripts[0].dispatch("load");
stalled.scripts[0].dispatch("error");
const stalledRetry = stalled.script("./app-performance-ui.js", "GeoRiskPerformanceUi");
assert.equal(stalled.scripts.length, 2, "the user's next action can retry a timed-out script");
stalled.context.GeoRiskPerformanceUi = { ready: true };
stalled.scripts[1].dispatch("load");
assert.equal(await stalledRetry, stalled.context.GeoRiskPerformanceUi);
assert.equal(stalled.timers.size, 0);

const slowSuccess = fixture();
const slowLoad = slowSuccess.script("./plain.js");
slowSuccess.advance(19999);
slowSuccess.scripts[0].dispatch("load");
assert.equal(await slowLoad, true, "a slow successful request before the deadline is accepted");
slowSuccess.advance(1);
assert.equal(slowSuccess.attached.length, 1, "a cleared deadline cannot remove a successful script");
assert.equal(slowSuccess.timers.size, 0);
assert.equal(slowSuccess.scripts[0].listeners(), 0);

const partialTimeout = fixture();
const partialLoad = partialTimeout.load();
partialTimeout.context.GeoRiskConflictRules = { ready: true };
partialTimeout.scripts[0].dispatch("load");
partialTimeout.advance(20000);
await partialLoad;
assert.equal(partialTimeout.context.loadRuntimeCurationPromise, null);
assert.equal(partialTimeout.context.deferredDataStatus.runtimeCuration, false);
assert.equal(partialTimeout.merges.length, 0, "timeout never applies partial curation");
assert.equal(partialTimeout.attached.length, 1, "retain the successfully loaded sibling");
assert.equal(partialTimeout.messages.length, 1);
assert.equal(partialTimeout.timers.size, 0);
const partialRetry = partialTimeout.load();
assert.equal(partialTimeout.scripts.length, 3, "retry downloads only the timed-out sibling");
partialTimeout.context.GeoRiskCuration = { COUNTRY_CURATION_OVERRIDES: {} };
partialTimeout.scripts[2].dispatch("load");
assert.equal(await partialRetry, partialTimeout.context.GeoRiskCuration);
assert.equal(partialTimeout.merges.length, 1);
assert.equal(partialTimeout.timers.size, 0);

const classic = fixture();
const pending = classic.script("./app-performance-ui.js", "GeoRiskPerformanceUi");
const pendingAgain = classic.script("./app-performance-ui.js", "GeoRiskPerformanceUi");
assert.equal(classic.scripts.length, 1);
const rejected = Promise.allSettled([pending, pendingAgain]);
classic.scripts[0].dispatch("error");
assert.ok((await rejected).every(result => result.status === "rejected"));
assert.equal(classic.attached.length, 0);
assert.equal(classic.scripts[0].listeners(), 0, "all consumers remove both event listeners after failure");
const recovered = classic.script("./app-performance-ui.js", "GeoRiskPerformanceUi");
classic.context.GeoRiskPerformanceUi = { ready: true };
classic.scripts[1].dispatch("load");
assert.equal(await recovered, classic.context.GeoRiskPerformanceUi);
assert.equal(await classic.script("./app-performance-ui.js", "GeoRiskPerformanceUi"), classic.context.GeoRiskPerformanceUi);
assert.equal(classic.scripts.length, 2);
assert.equal(classic.scripts[1].listeners(), 0);
assert.equal(classic.timers.size, 0, "ready globals must not allocate deadlines");

const missing = fixture();
const notReady = missing.script("./app-curation.js", "GeoRiskCuration");
const notReadyResult = assert.rejects(notReady, /No se pudo cargar/);
missing.scripts[0].dispatch("load");
await notReadyResult;
assert.equal(missing.attached.length, 0, "a load event without the expected API is not a successful load");
assert.equal(missing.scripts[0].listeners(), 0);
assert.equal(missing.timers.size, 0);

const append = fixture();
append.failAppend(true);
await assert.rejects(append.script("./app-curation.js", "GeoRiskCuration"));
assert.equal(append.scripts[0].listeners(), 0, "synchronous append failures also release listeners");
assert.equal(append.timers.size, 0);
append.failAppend(false);
const plain = append.script("./plain.js");
append.scripts[1].dispatch("load");
assert.equal(await plain, true, "scripts without a global flag retain their existing contract");
assert.equal(await append.script("./plain.js"), true);
assert.equal(append.scripts.length, 2);
assert.equal(append.timers.size, 0, "ready plain scripts must not allocate deadlines");

const english = fixture();
english.context.currentLanguage = "en";
const failed = english.load();
english.scripts.forEach(script => script.dispatch("error"));
await failed;
assert.match(english.messages[0], /historical data/i);
assert.equal(english.context.loadRuntimeCurationPromise, null);

for (const [file, name] of [
  ["app-curation.js", "GeoRiskCuration"],
  ["app-conflict-rules.js", "GeoRiskConflictRules"],
  ["app-performance-ui.js", "GeoRiskPerformanceUi"]
]) {
  const actualSource = await fs.readFile(new URL("../../" + file, import.meta.url), "utf8");
  const repeated = vm.createContext({ window: {} });
  vm.runInContext(actualSource, repeated);
  const api = repeated.window[name];
  assert.ok(api, file + " publishes its actual API");
  const fields = Object.entries(api);
  vm.runInContext(actualSource, repeated);
  assert.equal(repeated.window[name], api, file + " tolerates a late duplicate without replacing the API");
  for (const [key, value] of fields) assert.equal(api[key], value, file + " keeps loaded data/function identity");
}
console.log("Curation recovery: OK (bounded waits, explicit retry, partial loads, concurrency and listener/deadline cleanup)");
