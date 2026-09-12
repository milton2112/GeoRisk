import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";

const script = await fs.readFile(new URL("../../script.js", import.meta.url), "utf8");
const panelSource = await fs.readFile(new URL("../../app-country-panel.js", import.meta.url), "utf8");
const block = (start, end) => script.slice(script.indexOf(start), script.indexOf(end, script.indexOf(start)));
const deferred = () => {
  let resolve;
  let reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
};
const flush = async () => { for (let i = 0; i < 16; i += 1) await Promise.resolve(); };
const response = (data, status = 200) => ({ ok: status === 200, status, json: async () => structuredClone(data) });
const profile = (code = "ARG") => ({
  name: code === "ARG" ? "Argentina" : code, general: {}, military: {}, metadata: { provenance: { code } }
});

function harness() {
  const calls = [];
  const timers = new Map();
  let timerId = 0;
  const panel = { innerHTML: "" };
  const modal = { hidden: true };
  const state = {
    window: {}, console: { warn() {} }, AbortController, APP_VERSION: "test",
    countriesData: Object.fromEntries(["ARG", "ESP"].map(code => [code, {
      name: code === "ARG" ? "Argentina" : "Espana", code, metadata: { isIndex: true }
    }])),
    countryDetailPromises: new Map(), countryConflictDetailPromises: new Map(),
    failedCountryDataRequests: new Set(), countryCodeLookup: new WeakMap(),
    invalidateCountryDerivedCaches() {}, sanitizeCountryData() {}, refreshLoadedCountryLayers() {},
    fetch: async (url, options) => { calls.push({ url, options }); return response(profile()); },
    setTimeout(fn, ms) { const id = ++timerId; timers.set(id, { fn, ms }); return id; },
    clearTimeout(id) { timers.delete(id); },
    countryPanelRenderToken: 0, currentPanelState: {}, currentLanguage: "es", appStore: null,
    ensureDeferredUiModule: async () => {}, timelineConflictUi: {},
    getCountryCodeByObject: country => country.code,
    document: { getElementById: id => id === "country-modal" ? modal : panel },
    openCountryModal() { modal.hidden = false; }, syncModalOpenState() {}, syncMobilePanelControlState() {},
    escapeHtml: value => String(value), renderFull: country => { panel.innerHTML = country.name; modal.hidden = false; }
  };
  vm.createContext(state);
  vm.runInContext(panelSource, state);
  state.countryPanelUi = state.window.GeoRiskCountryPanel;
  vm.runInContext(block("async function fetchCountryDataJson", "function shuffleArray"), state);
  vm.runInContext(block("function closeCountryModal", "function getReligionSummaryLabel"), state);
  vm.runInContext(block("async function renderCountry", "  const symbolAssets = getCountrySymbolAssets") + "renderFull(country);\n}", state);
  return { state, calls, timers, panel, modal };
}

for (const invalid of [null, {}, [], { name: "Wrong country" }, profile("ESP"),
  { ...profile(), general: [] }, { ...profile(), metadata: { isIndex: true, provenance: { code: "ARG" } } }]) {
  const { state, calls, timers } = harness();
  const original = state.countriesData.ARG;
  state.fetch = async (url, options) => { calls.push({ url, options }); return response(invalid); };
  assert.equal(await state.loadCountryDetail("ARG"), original, "datos invalidos conservan el indice");
  assert.equal(state.countriesData.ARG, original);
  assert.equal(state.countryDetailPromises.size, 0, "un resultado fallido no queda memorizado");
  state.fetch = async (url, options) => { calls.push({ url, options }); return response(profile()); };
  const loaded = await state.loadCountryDetail("ARG");
  assert.equal(loaded.metadata.isIndex, false);
  assert.equal(calls[1].options.cache, "reload", "el reintento debe evitar una respuesta offline corrupta");
  assert.equal(await state.loadCountryDetail("ARG"), loaded, "los datos completos se reutilizan");
  assert.equal(calls.length, 2);
  assert.equal(state.failedCountryDataRequests.size, 0);
  assert.equal(timers.size, 0);
}

for (const fail of [
  async () => response({}, 503),
  async () => { throw new TypeError("offline"); },
  async () => ({ ok: true, json: async () => { throw new SyntaxError("bad json"); } })
]) {
  const { state } = harness();
  state.fetch = fail;
  await state.renderCountry(state.countriesData.ARG, "Argentina");
  assert.equal(state.countriesData.ARG.metadata.isIndex, true);
  assert.equal(state.countryDetailPromises.size, 0);
}

{
  const { state, calls, timers } = harness();
  const held = deferred();
  state.fetch = async (url, options) => { calls.push({ url, options }); return held.promise; };
  const first = state.loadCountryDetail("ARG");
  const second = state.loadCountryDetail("ARG");
  assert.equal(calls.length, 1, "clics concurrentes comparten una descarga");
  held.resolve(response(profile()));
  assert.equal(await first, await second);
  assert.equal(timers.size, 0);
  assert.equal(state.countryDetailPromises.size, 0);
}

for (const stallBody of [false, true]) {
  const { state, timers } = harness();
  const held = deferred();
  let signal;
  state.fetch = async (_url, options) => {
    signal = options.signal;
    return stallBody ? { ok: true, json: () => held.promise } : held.promise;
  };
  const pending = state.loadCountryDetail("ARG");
  await flush();
  const timeout = [...timers.values()][0];
  assert.equal(timeout.ms, 20000);
  timeout.fn();
  assert.equal((await pending).metadata.isIndex, true);
  assert.equal(signal.aborted, true);
  assert.equal(state.countryDetailPromises.size, 0);
  state.fetch = async () => response({ ...profile(), name: "Correct retry" });
  await state.loadCountryDetail("ARG");
  held.resolve(stallBody ? profile() : response(profile()));
  await flush();
  assert.equal(state.countriesData.ARG.name, "Correct retry", "una respuesta vencida no pisa el nuevo intento");
  assert.equal(timers.size, 0);
}

{
  const { state } = harness();
  const original = state.countriesData.ARG;
  state.sanitizeCountryData = () => { throw new Error("invalid detail"); };
  assert.equal(await state.loadCountryDetail("ARG"), original, "solo se publica un perfil ya saneado");
}

for (const invalid of [{}, [], [null, null], [{ name: "Preview" }]]) {
  const { state } = harness();
  const country = profile();
  country.military = { conflicts: [{ name: "Preview" }], conflictCount: 2, conflictsComplete: false };
  state.countriesData.ARG = country;
  state.fetch = async () => response(invalid);
  await state.loadCountryConflictDetail("ARG");
  assert.equal(country.military.conflictsComplete, false);
  assert.equal(country.military.conflicts[0].name, "Preview");
  assert.equal(country.military.conflictCount, 2);
  assert.equal(state.countryConflictDetailPromises.size, 0);
  state.fetch = async () => response([{ name: "First", startYear: null }, { name: "Second" }]);
  await state.loadCountryConflictDetail("ARG");
  assert.equal(country.military.conflictsComplete, true, "fechas pendientes no invalidan un shard estructuralmente valido");
  assert.equal(country.military.conflicts.length, 2);
}

for (const action of ["close", "switch", "retry"]) {
  const { state, panel, modal } = harness();
  const held = deferred();
  state.fetch = async () => held.promise;
  const pending = state.renderCountry(state.countriesData.ARG, "Argentina");
  await flush();
  assert.match(panel.innerHTML, /aria-busy="true"/);
  if (action === "close") state.closeCountryModal();
  if (action === "switch") {
    state.fetch = async () => response(profile("ESP"));
    await state.renderCountry(state.countriesData.ESP, "Espana");
  }
  held.resolve(response({}, 503));
  await pending;
  if (action === "close") assert.equal(modal.hidden, true, "cerrar no debe reabrir la ficha al llegar la respuesta");
  if (action === "switch") assert.equal(panel.innerHTML, "ESP", "una respuesta anterior no pisa otro pais");
  if (action === "retry") {
    assert.match(panel.innerHTML, /data-country-retry/);
    assert.doesNotMatch(panel.innerHTML, /aria-busy="true"/);
    state.fetch = async () => response(profile());
    await state.renderCountry(state.countriesData.ARG, "Argentina");
    assert.equal(panel.innerHTML, "Argentina");
  }
}

{
  const { state, panel, modal } = harness();
  const held = deferred();
  state.ensureDeferredUiModule = () => held.promise;
  const pending = state.renderCountry(state.countriesData.ARG, "Argentina");
  state.closeCountryModal();
  held.resolve();
  await pending;
  assert.equal(modal.hidden, true, "cerrar tambien invalida la espera de modulos diferidos");
  assert.equal(panel.innerHTML, "");
  for (const language of ["es", "en"]) {
    const country = { name: '<img src=x onerror="alert(1)">' };
    for (const render of ["renderSkeleton", "renderLoadError"]) {
      assert.doesNotMatch(state.countryPanelUi[render](country, language), /<img/);
    }
  }
}

// Validate the contract against every shipped profile, including Kosovo and Somaliland.
for (const file of (await fs.readdir("data/countries")).filter(name => name.endsWith(".json"))) {
  const { state } = harness();
  const code = file.slice(0, -5);
  state.countriesData[code] = { metadata: { isIndex: true } };
  state.fetch = async url => response(JSON.parse(await fs.readFile(url.split("?")[0], "utf8")));
  const country = await state.loadCountryDetail(code);
  assert.equal(country.metadata.isIndex, false, file);
  await state.loadCountryConflictDetail(code);
  assert.notEqual(country.military.conflictsComplete, false, file + " debe aceptar su shard completo");
}

console.log("country-detail-loading.test.js ok");
