import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";

const source = await fs.readFile(new URL("../../script.js", import.meta.url), "utf8");
function block(start, end) {
  const offset = source.indexOf(start);
  assert.ok(offset >= 0 && source.indexOf(end, offset) > offset, start);
  return source.slice(offset, source.indexOf(end, offset));
}

function harness(type) {
  const modal = { hidden: false };
  const ranks = { open: false };
  const renders = [];
  const timers = [];
  let writes = 0;
  let population = "";
  const total = {
    get textContent() { return population; },
    set textContent(value) { population = value; writes += 1; }
  };
  const state = {
    document: { visibilityState: "visible", getElementById: id => ({ "country-modal": modal, "rankings-panel": ranks, "world-population-total": total })[id] },
    setTimeout(callback) { timers.push(callback); return timers.length; },
    currentPanelState: { type, code: "ARG", continent: "America", countries: [], religionName: "Islam", title: "Grupo" },
    countriesData: { ARG: { name: "Argentina" }, ESP: { name: "Espana" } },
    t: key => key,
    worldPopulationTotal: 123456, currentLanguage: "es", advancedRankingsReady: false,
    formatNumber: value => value.toLocaleString("es-AR")
  };
  for (const name of ["renderCountry", "renderContinent", "renderReligionSelection", "renderGroupSelection", "renderEmpty"]) {
    state[name] = (...args) => { renders.push({ name, args }); modal.hidden = false; };
  }
  vm.createContext(state);
  vm.runInContext(block("let rerenderCurrentPanelFrame = null;", "function loadSavedPreferences"), state);
  vm.runInContext(block("function runCriticalGlobalStats", "function runDeferredGlobalStatsBatch"), state);
  vm.runInContext(block("function generateWorldPopulation", "function generateTopPopulation"), state);
  vm.runInContext(block("async function generateAdvancedRankings", "function addCountryToCompare"), state);
  return { state, modal, ranks, renders, total, writes: () => writes, flush: () => { while (timers.length) timers.shift()(); }, timers };
}

for (const type of ["country", "continent", "religion", "group", "empty"]) {
  const test = harness(type);
  test.modal.hidden = true;
  test.state.rerenderCurrentPanel();
  assert.equal(test.timers.length, 0, `${type}: una ficha cerrada no agenda renders`);
  test.flush();
  assert.equal(test.renders.length, 0);
  assert.equal(test.modal.hidden, true);

  test.modal.hidden = false;
  test.state.rerenderCurrentPanel();
  test.state.rerenderCurrentPanel();
  assert.equal(test.timers.length, 1, `${type}: refrescos simultaneos se agrupan`);
  test.modal.hidden = true;
  test.flush();
  assert.equal(test.renders.length, 0, `${type}: cerrar invalida un render ya agendado`);
  assert.equal(test.modal.hidden, true);

  test.modal.hidden = false;
  test.state.rerenderCurrentPanel();
  test.flush();
  assert.equal(test.renders.length, 1, `${type}: las fichas visibles siguen actualizandose`);
}

{
  const test = harness("country");
  test.state.rerenderCurrentPanel();
  test.state.currentPanelState.code = "ESP";
  test.flush();
  assert.equal(test.renders[0].args[0].name, "Espana", "un refresco usa la seleccion actual");
}

{
  const test = harness("empty");
  test.state.runCriticalGlobalStats();
  assert.equal(test.writes(), 0, "Rankings cerrado no modifica el DOM");
  test.ranks.open = true;
  test.state.runCriticalGlobalStats();
  assert.equal(test.total.textContent, "123.456");
  test.state.runCriticalGlobalStats();
  assert.equal(test.writes(), 1, "un valor identico no se vuelve a insertar");
  test.ranks.open = false;
  test.state.worldPopulationTotal = 654321;
  test.state.runCriticalGlobalStats();
  assert.equal(test.writes(), 1);
  test.ranks.open = true;
  test.state.runCriticalGlobalStats();
  assert.equal(test.total.textContent, "654.321", "reabrir muestra el total vigente");
}

for (const action of ["closed", "hidden", "failed", "close-pending", "hide-pending", "current"]) {
  const test = harness("country");
  let requests = 0;
  let renders = 0;
  let release;
  test.state.ensureDeferredUiModule = () => { requests++; return new Promise(done => { release = done; }); };
  test.state.renderAdvancedRanking = () => { renders++; };
  test.ranks.open = action !== "closed";
  if (action === "hidden") test.state.document.visibilityState = "hidden";
  const pending = test.state.generateAdvancedRankings();
  if (action === "close-pending") test.ranks.open = false;
  if (action === "hide-pending") test.state.document.visibilityState = "hidden";
  release?.(action !== "failed");
  await pending;
  assert.equal(requests, ["closed", "hidden"].includes(action) ? 0 : 1,
    action + ": no optional ranking load while inactive");
  assert.equal(renders, action === "current" ? 6 : 0, action + ": no late/failed ranking calculations or DOM writes");
  assert.equal(test.state.advancedRankingsReady, action === "current", "only completed visible rankings are ready");
  if (action !== "current") {
    test.ranks.open = true;
    test.state.document.visibilityState = "visible";
    test.state.ensureDeferredUiModule = async () => true;
    await test.state.generateAdvancedRankings();
    assert.equal(renders, 6, action + ": explicit recovery renders all advanced rankings");
    assert.equal(test.state.advancedRankingsReady, true);
  }
}

assert.match(block("function setupRankingsPanel", "function setupRankingGroups"), /runCriticalGlobalStats/);
assert.match(block("function setupRankingsPanel", "function setupRankingGroups"), /else if \(!advancedRankingsReady\) generateAdvancedRankings\(\)/);
for (const mobile of [true, false]) {
  const toolbar = { open: true };
  const rankings = { open: true };
  const removed = [];
  let syncs = 0;
  const context = vm.createContext({
    document: { body: { classList: { remove: (...names) => removed.push(...names) } },
      getElementById: id => ({ "map-toolbar": toolbar, "rankings-panel": rankings })[id] },
    isMobileLayout: () => mobile, closeMobileMoreMenu() {}, syncMobilePanelControlState() { syncs++; }
  });
  vm.runInContext(block("function closeMobilePanels", "function openMobilePanel"), context);
  context.closeMobilePanels();
  assert.equal(rankings.open, !mobile, "mobile close must close native rankings, not just hide its CSS shell");
  assert.equal(toolbar.open, !mobile);
  assert.ok(removed.includes("mobile-left-open"));
  assert.equal(syncs, 1);
}
console.log("background-panels.test.js ok");
