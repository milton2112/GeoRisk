import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";

const source = await fs.readFile(new URL("../../script.js", import.meta.url), "utf8");
const loader = source.slice(source.indexOf("function loadScriptOnce("), source.indexOf("async function hydrateCountriesData("));

function fixture() {
  const scripts = [], attached = [], warnings = [], messages = [], merges = [];
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
  return { context, scripts, attached, warnings, messages, merges,
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

const missing = fixture();
const notReady = missing.script("./app-curation.js", "GeoRiskCuration");
const notReadyResult = assert.rejects(notReady, /No se pudo cargar/);
missing.scripts[0].dispatch("load");
await notReadyResult;
assert.equal(missing.attached.length, 0, "a load event without the expected API is not a successful load");
assert.equal(missing.scripts[0].listeners(), 0);

const append = fixture();
append.failAppend(true);
await assert.rejects(append.script("./app-curation.js", "GeoRiskCuration"));
assert.equal(append.scripts[0].listeners(), 0, "synchronous append failures also release listeners");
append.failAppend(false);
const plain = append.script("./plain.js");
append.scripts[1].dispatch("load");
assert.equal(await plain, true, "scripts without a global flag retain their existing contract");
assert.equal(await append.script("./plain.js"), true);
assert.equal(append.scripts.length, 2);

const english = fixture();
english.context.currentLanguage = "en";
const failed = english.load();
english.scripts.forEach(script => script.dispatch("error"));
await failed;
assert.match(english.messages[0], /historical data/i);
assert.equal(english.context.loadRuntimeCurationPromise, null);
console.log("Curation recovery: OK (explicit retry, partial loads, concurrency and listener cleanup)");
