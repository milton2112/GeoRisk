import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";
import { KRAMATORSK_2022_CONFLICT_DETAIL_FIXES } from "../lib/conflict-curation-kramatorsk-2022.js";
import { PAYE_CONFLICT_DETAIL_FIXES } from "../lib/conflict-curation-paye.js";

const script = await fs.readFile(new URL("../../script.js", import.meta.url), "utf8");
function block(start, end) {
  const offset = script.indexOf(start);
  assert.ok(offset >= 0 && script.indexOf(end, offset) > offset);
  return script.slice(offset, script.indexOf(end, offset));
}

const modelBuilds = [];
const modelState = {
  conflictModalCounter: 0, conflictModalRegistry: new Map(), currentLanguage: "es", loadedRevision: 1,
  getConflictModalContent(conflict, countryName) {
    modelBuilds.push([conflict.name, countryName]);
    return { title: conflict.name, countryName, language: modelState.currentLanguage, revision: modelState.loadedRevision };
  }
};
vm.createContext(modelState);
vm.runInContext(block("function registerConflictModal", "function isConflictHierarchyProvisionalForDisplay"), modelState);
vm.runInContext(block("function getConflictModalEntryDetail", "function renderConflictCurationNotes"), modelState);
for (let i = 0; i < 1000; i += 1) modelState.registerConflictModal({ name: "Episode " + i }, "Context");
assert.equal(modelBuilds.length, 0, "registering links must not build 1000 unopened conflict profiles");
assert.equal(modelState.conflictModalRegistry.size, 1000);
const modelEntry = modelState.conflictModalRegistry.get("conflict-1");
assert.deepEqual(Object.keys(modelEntry).sort(), ["conflict", "countryName"], "retain the existing record/context, not a duplicate display model");
const firstModel = modelState.getConflictModalEntryDetail(modelEntry);
assert.equal(modelBuilds.length, 1);
assert.equal(firstModel.title, "Episode 0");
assert.equal(firstModel.countryName, "Context");
modelState.loadedRevision = 2;
modelState.currentLanguage = "en";
modelEntry.detail = { title: "Stale model", revision: 0 };
const nextModel = modelState.getConflictModalEntryDetail(modelEntry);
assert.equal(nextModel.revision, 2, "reopening uses current loaded evidence, not a snapshot from registering the link");
assert.equal(nextModel.language, "en");
assert.notEqual(firstModel, nextModel);
assert.equal(modelBuilds.length, 2);
assert.equal(modelState.getConflictModalEntryDetail(null), null);
const legacyDetail = { title: "Legacy direct model" };
assert.equal(modelState.getConflictModalEntryDetail(legacyDetail), legacyDetail);
assert.equal(modelState.getConflictModalEntryDetail({ detail: legacyDetail }), legacyDetail);
assert.equal(modelBuilds.length, 2, "legacy details need no new construction");

function harness() {
  const modal = { hidden: false };
  const body = { innerHTML: "current" };
  const entry = { conflict: { name: "A" } };
  const renders = [];
  const builds = [];
  let finish;
  const state = {
    currentLanguage: "es", conflictModalRenderToken: 1,
    conflictModalRegistry: new Map([["a", entry]]),
    document: { getElementById: id => id === "conflict-modal" ? modal : body },
    loadWikipediaConflictDetails: () => new Promise(resolve => { finish = resolve; }),
    getConflictModalContent: conflict => { builds.push(conflict.name); return { title: conflict.name }; },
    openConflictModal: key => renders.push(key), syncModalOpenState() {}, console,
    escapeHtml: value => String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
  };
  vm.createContext(state);
  vm.runInContext(block("function renderConflictCurationNotes", "function openConflictModal"), state);
  vm.runInContext(block("function closeConflictModal", "function clearSelection"), state);
  return { state, modal, body, entry, renders, builds, resolve: async () => { finish({ source: "loaded" }); await Promise.resolve(); } };
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
  assert.deepEqual(test.builds, [], "the loader callback schedules only the owner render, without prebuilding another model");
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
vm.runInContext(block("function cleanConflictName", "function normalizeConflictForDisplay"), state);
assert.equal(state.cleanConflictName("Batalla de Altun Kupri (Pirde, 2017)"), "Batalla de Altun Kupri (Pirde)", "date cleanup must preserve a geographic alias");
assert.equal(state.cleanConflictName("Batalla de Fayetteville (Arkansas, 1863)"), "Batalla de Fayetteville (Arkansas)");
assert.equal(state.cleanConflictName("Batalla de Gata (1815)"), "Batalla de Gata");
assert.equal(state.cleanConflictName("Batalla de Wenden (21-22 de octubre de 1578)"), "Batalla de Wenden");
assert.equal(state.formatConflictTitle({ name: state.cleanConflictName("Batalla de Altun Kupri (Pirde, 2017)"), startYear: 2017 }), "Batalla de Altun Kupri (Pirde) (2017)");
assert.equal(state.renderConflictCurationNotes({}), "");
const disputeOnly = state.renderConflictCurationNotes({ sourceDispute: "  Los relatos difieren  " });
assert.match(disputeOnly, /Diferencias entre fuentes/);
assert.match(disputeOnly, /Los relatos difieren/);
for (const sourceDispute of [true, false, null, {}, [], " "]) {
  assert.equal(state.renderConflictCurationNotes({ sourceDispute }), "", "flags and malformed values do not manufacture an explanation");
}
const sameNote = state.renderConflictCurationNotes({ curationNote: " Texto ", sourceDispute: "Texto" });
assert.equal((sameNote.match(/Texto/g) || []).length, 1, "identical trimmed notes are not repeated");
const unsafeDispute = state.renderConflictCurationNotes({ sourceDispute: '<img src=x onerror="alert(1)">&' });
assert.match(unsafeDispute, /&lt;img/);
assert.match(unsafeDispute, /&amp;/);
assert.doesNotMatch(unsafeDispute, /<img/);
assert.equal(state.renderConflictTreaties({ treaties: [null, {}, " "] }), "");
const kramatorskName = Object.keys(KRAMATORSK_2022_CONFLICT_DETAIL_FIXES)[0];
const kramatorsk = { name: kramatorskName, ...KRAMATORSK_2022_CONFLICT_DETAIL_FIXES[kramatorskName] };
assert.equal(state.inferConflictLevel(kramatorsk), "battle", "the attack is an episode, not a new war");
assert.equal(state.inferConflictType(kramatorsk), "bombardeo");
assert.equal(state.formatConflictTitle(kramatorsk), kramatorskName, "year is not duplicated in the visible title");
assert.equal(state.formatConflictPeriod(kramatorsk), " (2022)");
const kramatorskNotes = state.renderConflictCurationNotes(kramatorsk);
assert.match(kramatorskNotes, /8 de abril de 2022/);
assert.match(kramatorskNotes, /no como un segundo bando militar/);
assert.match(kramatorskNotes, /no el estado actual de la guerra madre/);
const paye = { name: "Batalla de Paye (1900)", ...PAYE_CONFLICT_DETAIL_FIXES["Batalla de Paye (1900)"] };
assert.equal(state.inferConflictLevel(paye), "battle");
assert.equal(state.formatConflictTitle(paye), paye.name);
assert.equal(state.formatConflictPeriod(paye), " (1900)");
const payeNotes = state.renderConflictCurationNotes(paye);
assert.match(payeNotes, /31 de julio de 1900/);
assert.match(payeNotes, /San Mateo \(1899\)/);
assert.match(payeNotes, /primer\/segundo combate/);
const notes = state.renderConflictCurationNotes({ datePrecision: "<b>fecha</b>", curationNote: '<img src=x onerror="alert(1)">' });
assert.match(notes, /&lt;b&gt;fecha/);
assert.doesNotMatch(notes, /<img|<b>fecha/);
const treaties = state.renderConflictTreaties({ treaties: [" Acuerdo ", "Acuerdo", "<script>x</script>"] });
assert.equal((treaties.match(/<li>Acuerdo<\/li>/g) || []).length, 1);
assert.doesNotMatch(treaties, /<script>/);
state.currentLanguage = "en";
assert.match(state.renderConflictCurationNotes({ curationNote: "note" }), /Curation notes/);
assert.match(state.renderConflictCurationNotes({ sourceDispute: "Different accounts" }), /Source discrepancies/);
assert.match(state.renderConflictTreaties({ treaties: ["treaty"] }), /Treaties and agreements/);

const open = block("function openConflictModal", "function closeConflictModal");
let guardBuilds = 0;
const guardState = {
  conflictModalRenderToken: 0, conflictModalRegistry: new Map([["valid", { conflict: { name: "A" } }]]),
  document: { getElementById: () => null },
  getConflictModalEntryDetail: () => { guardBuilds += 1; return null; }
};
vm.createContext(guardState);
vm.runInContext(open, guardState);
guardState.openConflictModal("valid", { enhance: false });
assert.equal(guardBuilds, 0, "missing DOM does not build a model");
guardState.document.getElementById = () => ({});
guardState.openConflictModal("missing", { enhance: false });
assert.equal(guardBuilds, 0, "missing registry entry does not build a model");
guardState.openConflictModal("valid", { enhance: false });
assert.equal(guardBuilds, 1);
assert.equal(guardState.conflictModalRenderToken, 0, "a failed model does not supersede another render");
assert.match(open, /const renderToken = \+\+conflictModalRenderToken/);
assert.match(open, /maybeEnhanceOpenConflictModal\(key, entry, renderToken\)/);
assert.match(open, /renderConflictCurationNotes\(detail\)/);
assert.match(open, /renderConflictTreaties\(detail\)/);

const contentState = {
  CONFLICT_DETAIL_OVERRIDES: {},
  inferConflictType: () => "batalla", inferConflictScope: () => "local", inferConflictRegion: () => "region",
  getConflictParentName: () => "parent", getConflictHierarchyState: () => ({}), inferConflictLevel: () => "battle",
  dedupeConflictParticipants: entries => entries,
  normalizeText: state.normalizeText, sanitizeConflictModalText: value => value,
  getConflictCountryRelationship: () => "participant",
  formatConflictTitle: entry => entry.name, buildGenericRelatedConflicts: () => []
};
vm.createContext(contentState);
vm.runInContext(block("function getConflictRecordedField", "function getConflictModalContent"), contentState);
vm.runInContext(block("function getConflictModalContent", "function sanitizeConflictModalText"), contentState);
assert.equal(contentState.getConflictModalContent({ name: "A", sourceDispute: "Original warning" }).sourceDispute, "Original warning");
contentState.CONFLICT_DETAIL_OVERRIDES.A = { sourceDispute: "Loaded warning" };
assert.equal(contentState.getConflictModalContent({ name: "A", sourceDispute: "Original warning" }).sourceDispute, "Loaded warning", "lazy detail must reach the renderer");
contentState.CONFLICT_DETAIL_OVERRIDES.A.sourceDispute = false;
assert.equal(contentState.getConflictModalContent({ name: "A", sourceDispute: "Original warning" }).sourceDispute, false, "an explicit loaded flag does not revive a stale textual warning");
console.log("conflict-modal-lifecycle.test.js ok");
