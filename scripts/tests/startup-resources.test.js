import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";

const source = await fs.readFile("script.js", "utf8");
const block = (start, end) => source.slice(source.indexOf(start), source.indexOf(end, source.indexOf(start)));
const realIndex = JSON.parse(await fs.readFile("data/countries_index.json", "utf8"));
const aliases = JSON.parse(await fs.readFile("data/geo_aliases.json", "utf8"));
const deferred = () => {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
};
const flush = async () => { for (let i = 0; i < 12; i += 1) await Promise.resolve(); };

function fixture(fetchResource = async url => url.includes("countries_index") ? realIndex : aliases) {
  const timers = new Map();
  const calls = [];
  const state = {
    currentLanguage: "es", APP_VERSION: "test", loadDataPromise: null,
    mapNameAliasOverrides: {}, mapNameAliasIndex: {}, worldBankNameAliasOverrides: {},
    deferredDataStatus: { countryIndex: false },
    setTimeout(callback, ms) { assert.equal(ms, 20000); const id = {}; timers.set(id, callback); return id; },
    clearTimeout(id) { timers.delete(id); }, measureBootStep: async (name, fn) => fn(),
    fetchResourceCached: async url => { calls.push(url); return fetchResource(url); },
    buildNormalizedAliasIndex: value => value,
    async hydrateCountriesData(data) { state.data = data; },
    setupCriticalCountrySearchIndex() { calls.push("search-ready"); },
    refreshLoadedCountryLayers() {}, updateAppStatusPanel() {}
  };
  vm.createContext(state);
  vm.runInContext(block("async function waitForStartupResources(", "function completeBootMetrics("), state);
  vm.runInContext(block("function validateStartupCountryIndex(", "function refreshGlobalStats("), state);
  return { state, timers, calls };
}

const success = fixture();
assert.doesNotThrow(() => success.state.validateStartupCountryIndex(realIndex), "el indice real incluye Kosovo y Somalilandia con codigos propios");
await success.state.loadData();
assert.equal(success.state.deferredDataStatus.countryIndex, true);
assert.equal(success.calls.filter(call => call.includes("countries_index")).length, 1);
await success.state.loadData();
assert.equal(success.calls.filter(call => call.includes("countries_index")).length, 1, "reutilizar una carga valida");
for (const invalid of [null, [], {}, "wrong", { ARG: null }, { ARG: { name: "Argentina" } }, { ARG: { name: " ", general: {} } }]) {
  assert.throws(() => success.state.validateStartupCountryIndex(invalid), /indice de paises/);
}

let fail = true;
const retry = fixture(async url => {
  if (fail && url.includes("countries_index")) throw new Error("network failure");
  return url.includes("countries_index") ? realIndex : aliases;
});
await assert.rejects(retry.state.loadData(), /network failure/);
assert.equal(retry.state.loadDataPromise, null, "no conservar una promesa rechazada");
assert.equal(retry.state.deferredDataStatus.countryIndex, false);
assert.ok(!retry.calls.some(url => url.includes("countries_full")));
fail = false;
await retry.state.loadData();
assert.equal(retry.state.deferredDataStatus.countryIndex, true);
for (const invalid of [null, [], {}, { mapNameAliases: [], worldBankNameAliases: {} }, { mapNameAliases: { a: 1 }, worldBankNameAliases: {} }]) {
  const aliasFailure = fixture(async url => url.includes("countries_index") ? realIndex : invalid);
  await assert.rejects(aliasFailure.state.loadData(), /alias geograficos/);
  assert.equal(aliasFailure.state.data, undefined, "no hidratar un arranque con aliases invalidos");
  assert.equal(aliasFailure.state.deferredDataStatus.countryIndex, false);
}

const gate = fixture();
const data = deferred();
const map = deferred();
let ready = false;
const waiting = gate.state.waitForStartupResources([data.promise, map.promise]).then(() => { ready = true; });
data.resolve();
await flush();
assert.equal(ready, false, "los paises solos no completan el mapa");
map.resolve();
await waiting;
assert.equal(ready, true);
assert.equal(gate.timers.size, 0);

const hanging = deferred();
const timeout = gate.state.waitForStartupResources([hanging.promise]);
const rejected = assert.rejects(timeout, /tardando demasiado/);
[...gate.timers.values()][0]();
await rejected;
assert.equal(gate.timers.size, 0);
hanging.reject(new Error("late network failure"));
await flush();

const later = deferred();
await assert.rejects(gate.state.waitForStartupResources([Promise.reject(new Error("map failed")), later.promise]), /map failed/);
assert.equal(gate.timers.size, 0);
later.reject(new Error("second failure"));
await flush();
const init = block("async function init()", "\ninit();");
assert.ok(init.indexOf("await measureBootStep(\"startupResources\"") < init.indexOf("const bootDeferredUi"));
assert.match(init, /waitForStartupResources\(\[\s*bootReadyPromise, overlayLoadPromise, dataLoadPromise/);
console.log("startup-resources.test.js ok");
