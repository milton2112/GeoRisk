import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";

const source = await fs.readFile(new URL("../../script.js", import.meta.url), "utf8");
const block = (start, end) => source.slice(source.indexOf(start), source.indexOf(end, source.indexOf(start)));
const deferred = () => {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
};
const flush = async () => { for (let i = 0; i < 16; i += 1) await Promise.resolve(); };

function harness() {
  const panel = { innerHTML: "previous profile" };
  const modal = { hidden: false };
  const effects = [];
  const profiles = Object.fromEntries(["ARG", "ESP"].map(code => [code, { code, name: code, general: {}, military: {} }]));
  const state = {
    countryPanelRenderToken: 0,
    currentPanelState: { type: "country", code: "ARG", countryLoadedSections: ["country-section-general", "country-section-military"] },
    countriesData: profiles, currentLanguage: "es", countryPanelUi: {}, timelineConflictUi: {},
    appStore: { setState: () => effects.push("store") },
    ensureDeferredUiModule: async () => {}, ensureConflictAliasesLoaded: async () => {},
    getCountryCodeByObject: country => country.code, getCountrySymbolAssets: () => ({}),
    getLinkedCodes: () => [], getConflictsSinceFormation: () => [],
    loadCountryDetail: async code => { effects.push("load"); return profiles[code]; },
    document: { getElementById: id => id === "country-modal" ? modal : panel },
    syncModalOpenState() {}, syncMobilePanelControlState() {},
    console: { error: () => effects.push("error") },
    renderFull(country) { effects.push("profile"); panel.innerHTML = country.code; modal.hidden = false; },
    renderFallback(country) { effects.push("fallback"); panel.innerHTML = "fallback " + country.code; modal.hidden = false; },
    renderReplacement(type) { panel.innerHTML = type; modal.hidden = false; }
  };
  vm.createContext(state);
  // Keep the real ownership/await/catch boundaries; isolate the expensive HTML builders.
  const catchStart = source.indexOf("  } catch (error) {", source.indexOf("async function renderCountry"));
  const catchPrefix = source.slice(catchStart, source.indexOf("    const countryCode = getCountryCodeByObject(country);", catchStart));
  vm.runInContext(block("async function renderCountry", "  const conflictGroups = ") +
    "renderFull(country);\n" + catchPrefix + "renderFallback(country);\n}\n}", state);
  vm.runInContext(block("function closeCountryModal", "function getReligionSummaryLabel"), state);
  for (const [start, end, type] of [
    ["function renderContinent", "  const totalPopulation", "continent"],
    ["function renderReligionSelection", "  const denominationMode", "religion"],
    ["function renderGroupSelection", "  const totalPopulation", "group"],
    ["function renderEmpty", '  document.getElementById("country-panel")', "empty"]
  ]) {
    vm.runInContext(block(start, end) + `renderReplacement("${type}");${type === "empty" ? "closeCountryModal();" : ""}\n}`, state);
  }
  const actions = {
    continent: () => state.renderContinent("Europe", []),
    religion: () => state.renderReligionSelection("Recorded religion", [], 0),
    group: () => state.renderGroupSelection("Recorded group", "Context", []),
    empty: () => state.renderEmpty("Missing profile"),
    close: () => state.closeCountryModal(),
    country: () => state.renderCountry(profiles.ESP, "ESP")
  };
  return { state, panel, modal, effects, actions };
}

for (const type of ["continent", "religion", "group", "empty", "close", "country"]) {
  const { state, panel, modal, effects, actions } = harness();
  const held = deferred();
  state.ensureDeferredUiModule = () => held.promise;
  const pending = state.renderCountry(state.countriesData.ARG, "ARG");
  state.ensureDeferredUiModule = async () => {};
  await actions[type]();
  const chosenHtml = panel.innerHTML;
  const chosenState = state.currentPanelState;
  const chosenHidden = modal.hidden;
  effects.length = 0;
  held.resolve();
  await pending;
  assert.equal(panel.innerHTML, chosenHtml, "module completion respects " + type);
  assert.equal(state.currentPanelState, chosenState);
  assert.equal(modal.hidden, chosenHidden);
  assert.deepEqual(effects, [], "stale modules do not build profiles, fetch details or update selection");
}

for (const reject of [false, true]) {
  for (const type of ["continent", "religion", "group", "empty", "close", "country", "unchanged"]) {
    const { state, panel, modal, effects, actions } = harness();
    const held = deferred();
    let aliasCalls = 0;
    if (type === "unchanged") modal.hidden = true;
    state.ensureConflictAliasesLoaded = () => { aliasCalls++; return held.promise; };
    const pending = state.renderCountry(state.countriesData.ARG, "ARG");
    await flush();
    assert.equal(aliasCalls, 1, "the fixture really reaches the late alias await");
    if (type !== "unchanged") await actions[type]();
    const chosenHtml = panel.innerHTML;
    const chosenState = state.currentPanelState;
    const chosenHidden = modal.hidden;
    effects.length = 0;
    if (reject) held.reject(new Error("alias load failed"));
    else held.resolve();
    await pending;
    if (type === "unchanged") {
      assert.equal(panel.innerHTML, reject ? "fallback ARG" : "ARG", "current requests retain their normal render/fallback");
      assert.deepEqual(effects, reject ? ["error", "fallback"] : ["profile"]);
      assert.equal(modal.hidden, false);
    } else {
      assert.equal(panel.innerHTML, chosenHtml, "alias completion/rejection respects " + type);
      assert.equal(state.currentPanelState, chosenState);
      assert.equal(modal.hidden, chosenHidden);
      assert.deepEqual(effects, [], "a stale failure does not render an error over the latest choice");
    }
  }
}
console.log("country-render-ownership.test.js ok: module/alias races respect every panel owner and close");
