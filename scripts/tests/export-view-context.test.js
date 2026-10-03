import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";

const source = await fs.readFile(new URL("../../script.js", import.meta.url), "utf8");
const helpers = source.slice(source.indexOf("function getExportContextLabel("), source.indexOf("function getCompareSelectionList("));

function fixture() {
  const calls = [], imports = [];
  let release;
  const pending = new Promise(resolve => { release = resolve; });
  const filters = { continent: "", minPopulation: 0 };
  const node = { isConnected: true, hidden: false, closest() { return this.hidden ? {} : null; } };
  const record = async (target, filename, options) => {
    calls.push({ target, filename, options, valid: options.isCurrent() });
    return options.isCurrent();
  };
  const context = vm.createContext({
    currentLanguage: "es", currentTheme: "default", appMode: "explore",
    currentPanelState: { type: "country", code: "ARG" },
    countriesData: { ARG: { name: "Argentina" }, BRA: { name: "Brasil" } },
    compareSelection: ["ARG", "BRA"], compareBenchmarkMode: "world", activeRankingKey: "",
    getRankingsPanelFilters: () => filters,
    normalizeText: value => value, escapeHtml: value => value, loadScriptOnce() {},
    uiPolish: {}, exportShareUi: {},
    GeoRiskExportShare: { exportNodeAsImage: record, exportNodeAsPdf: record },
    ensureDeferredUiModule(name) { imports.push(name); return pending; }
  });
  context.window = context;
  vm.runInContext(helpers, context);
  return { context, node, calls, imports, filters, release,
    export: format => context[format === "pdf" ? "exportNodeAsPdf" : "exportNodeAsImage"](node, "report." + format) };
}

for (const format of ["png", "pdf"]) {
  const unchanged = fixture();
  const first = unchanged.export(format);
  assert.equal(unchanged.calls.length, 0);
  unchanged.release();
  assert.equal(await first, true);
  assert.equal(unchanged.calls.length, 1);
  assert.equal(unchanged.calls[0].valid, true);
  assert.equal(unchanged.calls[0].options.selectedCountryName, "Argentina");
  assert.deepEqual(unchanged.imports, ["exportShare"]);

  const changed = fixture();
  const original = changed.export(format);
  changed.context.currentPanelState.code = "BRA";
  changed.release();
  assert.equal(await original, false, "capture the requested context before waiting for the feature module");
  assert.equal(changed.calls[0].options.selectedCountryName, "Argentina", "do not silently retarget an export to the new selection");
  assert.equal(changed.calls[0].valid, false);
  assert.equal(await changed.export(format), true);
  assert.equal(changed.calls[1].options.selectedCountryName, "Brasil");
}

const mutations = [
  test => { test.context.currentLanguage = "en"; },
  test => { test.context.currentTheme = "religion"; },
  test => { test.context.appMode = "analysis"; },
  test => { test.context.currentPanelState = { type: "continent", continent: "Asia" }; },
  test => { test.context.countriesData.ARG.name = "Updated name"; },
  test => { test.context.compareSelection.push("ESP"); },
  test => { test.context.compareBenchmarkMode = "continent"; },
  test => { test.filters.continent = "Asia"; },
  test => { test.filters.minPopulation = 1000000; },
  test => { test.context.activeRankingKey = "population:ARG"; },
  test => { test.node.isConnected = false; },
  test => { test.node.hidden = true; }
];
for (const mutate of mutations) {
  const test = fixture();
  const options = test.context.getExportShareContext(test.node);
  assert.equal(options.isCurrent(), true);
  mutate(test);
  assert.equal(options.isCurrent(), false, "reject changed selection, filters, context, hidden or removed targets");
}

const sharing = fixture();
assert.equal(sharing.context.getExportShareContext().isCurrent, undefined, "text sharing does not acquire export state or DOM guards");
assert.equal(await sharing.context.exportNodeAsImage(null, "empty.png"), undefined);
assert.equal(sharing.imports.length, 0, "an empty target does not load modules");
console.log("Export view context: OK (module wait, action identity and explicit retry)");
