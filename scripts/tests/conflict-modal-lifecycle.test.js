import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";

const script = await fs.readFile(new URL("../../script.js", import.meta.url), "utf8");
function block(start, end) {
  const offset = script.indexOf(start);
  assert.ok(offset >= 0 && script.indexOf(end, offset) > offset);
  return script.slice(offset, script.indexOf(end, offset));
}

function harness() {
  const modal = { hidden: false };
  const body = { innerHTML: "current" };
  const entry = { conflict: { name: "A" } };
  const renders = [];
  let finish;
  const state = {
    currentLanguage: "es", conflictModalRenderToken: 1,
    conflictModalRegistry: new Map([["a", entry]]),
    document: { getElementById: id => id === "conflict-modal" ? modal : body },
    loadWikipediaConflictDetails: () => new Promise(resolve => { finish = resolve; }),
    getConflictModalContent: conflict => ({ title: conflict.name }),
    openConflictModal: key => renders.push(key), syncModalOpenState() {}, console,
    escapeHtml: value => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
  };
  vm.createContext(state);
  vm.runInContext(block("function renderConflictCurationNotes", "function openConflictModal"), state);
  vm.runInContext(block("function closeConflictModal", "function clearSelection"), state);
  return { state, modal, body, entry, renders, resolve: async () => { finish({ source: "loaded" }); await Promise.resolve(); } };
}

for (const action of ["same", "another", "closed", "reopened-same", "replaced-entry", "missing-modal"]) {
  const test = harness();
  test.state.maybeEnhanceOpenConflictModal("a", test.entry);
  if (action === "another") test.state.conflictModalRenderToken += 1;
  if (action === "closed" || action === "reopened-same") {
    test.state.closeConflictModal();
    assert.equal(test.body.innerHTML, "");
    if (action === "reopened-same") test.modal.hidden = false;
  }
  if (action === "replaced-entry") test.state.conflictModalRegistry.set("a", { conflict: { name: "B" } });
  if (action === "missing-modal") test.state.document.getElementById = () => null;
  await test.resolve();
  assert.deepEqual(test.renders, action === "same" ? ["a"] : [], action + ": no reemplazar una sesion distinta");
}

const { state } = harness();
state.normalizeText = value => String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
state.CONFLICT_CAMPAIGN_MARKERS = ["frente", "campana", "ofensiva", "operacion"];
vm.runInContext(block("function inferConflictType", "function getConflictRegionFilterKey"), state);
vm.runInContext(block("function inferConflictLevel", "function getConflictLevelLabel"), state);
assert.equal(state.inferConflictLevel({ name: "Batalla naval frente a Halifax (1782)", type: "batalla naval" }), "battle");
assert.equal(state.inferConflictLevel({ name: "Campana del Atlantico" }), "campaign");
assert.equal(state.inferConflictLevel({ name: "Primera ofensiva del Somme" }), "campaign");
assert.equal(state.inferConflictLevel({ name: "Frente oriental" }), "campaign");
assert.equal(state.inferConflictScope({ scale: "internacional" }), "internacional");
assert.equal(state.inferConflictScope({ scale: "local" }, { scale: "mundial" }), "mundial");
assert.equal(state.inferConflictType({ type: "batalla naval" }), "batalla naval");
assert.equal(state.inferConflictRegion({ normalizedRegion: "Espana" }, {}, "Estados Unidos"), "Espana");
assert.equal(state.inferConflictRegion({ normalizedRegion: "Espana" }, { region: "Mediterraneo" }), "Mediterraneo");
state.formatHistoricalYear = year => year < 0 ? `${-year} a. C.` : String(year);
vm.runInContext(block("function formatConflictPeriod", "function extractYearsFromText"), state);
for (const year of [undefined, null, "", " "]) {
  assert.match(state.formatConflictPeriod({ startYear: year }), /fecha pendiente/);
}
assert.equal(state.formatConflictTitle({ name: "Gata (1815)", startYear: 1815 }), "Gata (1815)");
assert.equal(state.formatConflictTitle({ name: "Gata", startYear: 1815 }), "Gata (1815)");
assert.equal(state.formatConflictTitle({ name: "Guerra (1812\u20131815)", startYear: 1812, endYear: 1815 }), "Guerra (1812\u20131815)");
assert.equal(state.formatConflictTitle({ name: "Accion (57 a. C.)", startYear: -57 }), "Accion (57 a. C.)");
assert.equal(state.formatConflictTitle({ name: "Otra (1814)", startYear: 1815 }), "Otra (1814) (1815)", "no ocultar discrepancias distintas de duplicacion exacta");
assert.equal(state.renderConflictCurationNotes({}), "");
assert.equal(state.renderConflictTreaties({ treaties: [null, {}, " "] }), "");
const notes = state.renderConflictCurationNotes({ datePrecision: "<b>fecha</b>", curationNote: '<img src=x onerror="alert(1)">' });
assert.match(notes, /&lt;b&gt;fecha/);
assert.doesNotMatch(notes, /<img|<b>fecha/);
const treaties = state.renderConflictTreaties({ treaties: [" Acuerdo ", "Acuerdo", "<script>x</script>"] });
assert.equal((treaties.match(/<li>Acuerdo<\/li>/g) || []).length, 1);
assert.doesNotMatch(treaties, /<script>/);
state.currentLanguage = "en";
assert.match(state.renderConflictCurationNotes({ curationNote: "note" }), /Curation notes/);
assert.match(state.renderConflictTreaties({ treaties: ["treaty"] }), /Treaties and agreements/);

const open = block("function openConflictModal", "function closeConflictModal");
assert.match(open, /const renderToken = \+\+conflictModalRenderToken/);
assert.match(open, /maybeEnhanceOpenConflictModal\(key, entry, renderToken\)/);
assert.match(open, /renderConflictCurationNotes\(detail\)/);
assert.match(open, /renderConflictTreaties\(detail\)/);
console.log("conflict-modal-lifecycle.test.js ok");
