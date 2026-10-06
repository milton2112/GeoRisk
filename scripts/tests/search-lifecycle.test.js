import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";

const source = await fs.readFile(new URL("../../script.js", import.meta.url), "utf8");
const start = source.indexOf("async function searchMap()");
const end = source.indexOf("async function searchByQuery(", start);
assert.ok(start >= 0 && end > start);
const deferred = () => {
  let resolve;
  const promise = new Promise(done => { resolve = done; });
  return { promise, resolve };
};

function fixture() {
  const input = { value: "Argentina" };
  const calls = { modules: 0, builds: 0, selected: [], empty: [], dismissed: 0 };
  const state = vm.createContext({
    searchRequestId: 0, countryPanelRenderToken: 0,
    countryAliases: new Map(), countriesData: { ARG: { name: "Argentina" } },
    document: { visibilityState: "visible", getElementById: () => input },
    ensureDeferredUiModule: async name => { assert.equal(name, "search"); calls.modules++; return true; },
    ensureSearchIndexReady() { calls.builds++; },
    normalizeText: value => String(value).trim().toLowerCase(),
    getSearchAliasContext: () => ({}), getSuggestions: () => [],
    searchCore: {
      resolveAliasResult: query => query === "Argentina" ? { type: "country", value: "ARG", label: query } : null
    },
    selectSearchResult: async result => { calls.selected.push(result); state.countryPanelRenderToken++; },
    renderEmpty: label => calls.empty.push(label), dismissSearchInput: () => { calls.dismissed++; },
    APP_VERSION: "test", fetchResourceCached() {}, translateConflictName: value => value
  });
  vm.runInContext(source.slice(start, end), state);
  return { state, input, calls };
}

{
  const test = fixture();
  test.state.countryAliases.set("argentina", "ARG");
  test.state.ensureDeferredUiModule = async () => { test.calls.modules++; return false; };
  await test.state.searchMap();
  assert.equal(test.calls.modules, 0, "a known exact country does not wait for or request the advanced module");
  assert.equal(test.calls.builds, 0);
  assert.equal(test.calls.selected[0].value, "ARG", "basic country lookup survives an unavailable advanced module");
}

{
  const test = fixture();
  test.state.ensureDeferredUiModule = async () => { test.calls.modules++; return false; };
  await test.state.searchMap();
  assert.equal(test.calls.builds, 0, "a failed module cannot build a search index, even with late globals available");
  assert.deepEqual(test.calls.selected, []);
  assert.deepEqual(test.calls.empty, [], "module failure is not a 'country not found' result");
  assert.equal(test.calls.dismissed, 0);
  test.state.ensureDeferredUiModule = async () => true;
  await test.state.searchMap();
  assert.equal(test.calls.builds, 1);
  assert.equal(test.calls.selected[0].value, "ARG", "an explicit recovered search still selects its country");
}

for (const action of ["empty", "hidden"]) {
  const test = fixture();
  if (action === "empty") test.input.value = "   ";
  else test.state.document.visibilityState = "hidden";
  await test.state.searchMap();
  assert.equal(test.calls.modules, 0, action + " searches do not load the optional module");
  assert.equal(test.calls.builds, 0);
}

for (const action of ["edit", "panel", "hidden", "blank-submit"]) {
  const test = fixture();
  const module = deferred();
  test.state.ensureDeferredUiModule = () => module.promise;
  const pending = test.state.searchMap();
  if (action === "edit") test.input.value = "Brasil";
  if (action === "panel") test.state.countryPanelRenderToken++;
  if (action === "hidden") test.state.document.visibilityState = "hidden";
  if (action === "blank-submit") { test.input.value = ""; await test.state.searchMap(); }
  module.resolve(true);
  await pending;
  assert.equal(test.calls.builds, 0, action + " invalidates work waiting for the module");
  assert.deepEqual(test.calls.selected, []);
  assert.equal(test.calls.dismissed, 0);
}

{
  const test = fixture();
  const module = deferred();
  test.state.ensureDeferredUiModule = () => module.promise;
  const old = test.state.searchMap();
  const latest = test.state.searchMap();
  module.resolve(true);
  await Promise.all([old, latest]);
  assert.equal(test.calls.builds, 1, "only the latest concurrent submit builds the index");
  assert.equal(test.calls.selected.length, 1);
}

for (const action of ["edit", "panel", "hidden", "new-search", "none"]) {
  const test = fixture();
  const lookup = deferred();
  let entered;
  const ready = new Promise(done => { entered = done; });
  test.input.value = "Batalla pendiente";
  test.state.searchCore.findPublicConflictIndexEntry = () => { entered(); return lookup.promise; };
  const pending = test.state.searchMap();
  await ready;
  if (action === "edit") test.input.value = "Brasil";
  if (action === "panel") test.state.countryPanelRenderToken++;
  if (action === "hidden") test.state.document.visibilityState = "hidden";
  if (action === "new-search") { test.input.value = "Argentina"; await test.state.searchMap(); }
  lookup.resolve({ name: "Batalla pendiente", countries: ["ARG"], startYear: 1978 });
  await pending;
  assert.equal(test.calls.selected.length, ["none", "new-search"].includes(action) ? 1 : 0);
  if (action === "new-search") assert.equal(test.calls.selected[0].type, "country", "a late conflict cannot replace a newer country");
  if (action === "none") assert.equal(test.calls.selected[0].type, "conflict", "a current conflict lookup still works");
  assert.deepEqual(test.calls.empty, []);
  assert.equal(test.calls.dismissed, 0);
}

{
  const test = fixture();
  test.input.value = "Sin coincidencias";
  await test.state.searchMap();
  assert.equal(test.calls.empty.length, 1, "a completed current search retains its genuine empty state");
  assert.equal(test.calls.dismissed, 1);
}

{
  const test = fixture();
  const { state, input, calls } = test;
  state.countriesData = JSON.parse(await fs.readFile(new URL("../../data/countries_index.json", import.meta.url), "utf8"));
  state.repairMojibake = value => String(value || "");
  state.registerSuggestion = () => {};
  state.window = {};
  const block = (from, to) => {
    const offset = source.indexOf(from);
    const limit = source.indexOf(to, offset);
    assert.ok(offset >= 0 && limit > offset);
    return source.slice(offset, limit);
  };
  vm.runInContext(block("function normalizeText(", "const HISTORICAL_FORMATION_TYPES")
    + block("function buildCountryLookupVariants(", "function buildNormalizedAliasIndex(")
    + block("function registerCountryAlias(", "function registerFeatureNameAliases(")
    + block("function registerCriticalCountrySearchEntries(", "function setupCriticalCountrySearchIndex("), state);
  vm.runInContext(await fs.readFile(new URL("../../app-search.js", import.meta.url), "utf8"), state);
  state.registerCriticalCountrySearchEntries();
  for (const [alias, code] of state.countryAliases) {
    input.value = alias;
    const expected = state.window.GeoRiskSearch.resolveAliasResult(alias,
      { countries: state.countryAliases, countryNames: state.countriesData }, { types: ["country"] });
    await state.searchMap();
    assert.deepEqual({ ...calls.selected.at(-1) }, { ...expected }, alias + " retains its existing country alias result");
    assert.equal(calls.selected.at(-1).value, code);
  }
  assert.equal(calls.selected.length, state.countryAliases.size);
  assert.equal(calls.modules, 0);
  assert.equal(calls.builds, 0, "all shipped critical aliases reuse the existing lightweight index");
}

console.log("search-lifecycle.test.js ok: critical country aliases, module failures, inactive submits and stale module/conflict results");
