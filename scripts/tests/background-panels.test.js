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
    document: { getElementById: id => ({ "country-modal": modal, "rankings-panel": ranks, "world-population-total": total })[id] },
    setTimeout(callback) { timers.push(callback); return timers.length; },
    currentPanelState: { type, code: "ARG", continent: "America", countries: [], religionName: "Islam", title: "Grupo" },
    countriesData: { ARG: { name: "Argentina" }, ESP: { name: "Espana" } },
    t: key => key,
    worldPopulationTotal: 123456,
    formatNumber: value => value.toLocaleString("es-AR")
  };
  for (const name of ["renderCountry", "renderContinent", "renderReligionSelection", "renderGroupSelection", "renderEmpty"]) {
    state[name] = (...args) => { renders.push({ name, args }); modal.hidden = false; };
  }
  vm.createContext(state);
  vm.runInContext(block("let rerenderCurrentPanelFrame = null;", "function loadSavedPreferences"), state);
  vm.runInContext(block("function runCriticalGlobalStats", "function runDeferredGlobalStatsBatch"), state);
  vm.runInContext(block("function generateWorldPopulation", "function generateTopPopulation"), state);
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

assert.match(block("function setupRankingsPanel", "function setupRankingGroups"), /runCriticalGlobalStats/);
console.log("background-panels.test.js ok");
