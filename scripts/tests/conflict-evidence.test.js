import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";

const source = await fs.readFile(new URL("../../script.js", import.meta.url), "utf8");
function block(start, end) {
  const offset = source.indexOf(start);
  assert.ok(offset >= 0 && source.indexOf(end, offset) > offset);
  return source.slice(offset, source.indexOf(end, offset));
}
const normalizeText = value => String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
const state = {
  CONFLICT_DETAIL_OVERRIDES: {}, currentLanguage: "es", normalizeText, repairMojibake: String,
  uniqueNormalizedList: items => [...new Map(items.filter(Boolean).map(item => [normalizeText(item), item])).values()],
  inferConflictType: () => "guerra mundial", inferConflictScope: () => "mundial", inferConflictRegion: () => "Europa",
  getConflictParentName: () => "", getConflictHierarchyState: () => ({}), inferConflictLevel: () => "war",
  isConflictHierarchyProvisionalForDisplay: () => false,
  getCountryValues: () => [{ name: "Estados Unidos" }],
  getConflictCountryRelationship: detail => ({ sideLabels: detail.participants.flatMap(item => item.members.includes("Estados Unidos") ? [item.side] : []) }),
  formatConflictTitle: entry => entry.name, buildGenericRelatedConflicts: () => []
};
vm.createContext(state);
vm.runInContext(block("function normalizeText(value)", "const HISTORICAL_FORMATION_TYPES"), state);
vm.runInContext(block("function getConflictChronologyText", "function mergeConflictChronology"), state);
vm.runInContext(block("function inferConflictCoalitionLabel", "function getConflictChronologySortYear"), state);
vm.runInContext(block("function sanitizeConflictModalText", "function registerConflictModal"), state);
if (source.includes("function buildGenericConflictChronology")) {
  vm.runInContext(block("function buildGenericConflictChronology", "function conflictDedupKey"), state);
  vm.runInContext(block("function buildGenericConflictCause", "function buildGenericRelatedConflicts"), state);
}
if (source.includes("function getConflictRecordedField")) {
  vm.runInContext(block("function getConflictRecordedField", "function getConflictModalContent"), state);
}
vm.runInContext(block("function getConflictModalContent", "function sanitizeConflictModalText"), state);
const plain = value => JSON.parse(JSON.stringify(value));
const missing = state.getConflictModalContent({ name: "Prueba sin detalle", startYear: 1900, endYear: 1920 }, "Estados Unidos");
for (const field of ["cause", "outcome", "consequences"]) {
  assert.equal(missing[field], "", field + ": missing evidence must not become a historical claim");
}
assert.deepEqual(plain(missing.participants), [], "the selected country does not prove military participation");
assert.deepEqual(plain(missing.chronology), [], "date endpoints do not prove an internal or decisive phase");
assert.deepEqual(plain(missing.countryRelationship.sideLabels), []);
for (const member of ["Estados Unidos", "China", "Alemania", "Francia", "Argentina"]) {
  assert.equal(state.inferConflictCoalitionLabel("Bando 1", [member]), member, "no coalition inferred from " + member);
}
assert.equal(state.inferConflictCoalitionLabel("Aliados", ["Estados Unidos"]), "Aliados");
assert.equal(state.inferConflictCoalitionLabel("", []), "");
const partialSides = plain(state.dedupeConflictParticipants([
  { side: "Aliados", members: ["Francia"] }, { side: "Bando 2", troops: 1000, casualties: 0 }
]));
assert.equal(partialSides.length, 2, "a side with incomplete identity but recorded figures is not hidden");
assert.equal(partialSides[1].troops, "1000");
assert.equal(partialSides[1].casualties, "0", "an explicitly recorded zero is not a missing value");
assert.deepEqual(plain(state.dedupeConflictParticipants([
  { side: "Frente documentado A", members: [] }, { side: "Frente documentado B", members: [] }
])).map(item => item.side), ["Frente documentado A", "Frente documentado B"], "unnamed members do not merge distinct recorded sides");
const recorded = {
  name: "Prueba registrada", cause: "Causa registrada", outcome: "Resultado registrado", consequences: "Consecuencia registrada",
  participants: [{ side: "Bando 1", members: ["Estados Unidos"], casualties: "Sin total confirmado" }],
  chronology: [{ year: null, text: "Fecha pendiente" }, { year: -44, event: "Evento documentado" }, { year: " ", description: "Otro sin fecha" }]
};
const visible = state.getConflictModalContent(recorded);
assert.equal(visible.cause, recorded.cause);
assert.equal(visible.outcome, recorded.outcome);
assert.equal(visible.consequences, recorded.consequences);
assert.equal(visible.participants[0].side, "Estados Unidos");
assert.equal(visible.chronology[0].year, -44);
assert.deepEqual(plain(visible.chronology.slice(1).map(item => item.year)), [null, null], "blank years are not year zero");
state.CONFLICT_DETAIL_OVERRIDES[recorded.name] = { cause: "", outcome: {}, consequences: false, participants: [], chronology: [] };
const replaced = state.getConflictModalContent(recorded);
for (const field of ["cause", "outcome", "consequences"]) assert.equal(replaced[field], "", "explicit missing loaded data stays missing");
assert.deepEqual(plain(replaced.participants), []);
assert.deepEqual(plain(replaced.chronology), []);
for (const invalid of [null, true, {}, "incorrect array"]) {
  state.CONFLICT_DETAIL_OVERRIDES[recorded.name] = { participants: invalid, chronology: invalid };
  const result = state.getConflictModalContent(recorded);
  assert.deepEqual(plain(result.participants), []);
  assert.deepEqual(plain(result.chronology), []);
}
const structural = {
  name: "Prueba estructural", normalizedRegion: "Europa", curationBatch: "safe-structured-conflict-curation-2026-06",
  cause: "Confrontacion armada de 1900 entre actores estatales o fuerzas organizadas por control, seguridad o influencia en Europa.",
  outcome: "Desenlace tactico registrado dentro de Guerra de prueba; las cifras especificas se mantienen sin consolidar cuando no hay fuente fina en la ficha.",
  consequences: "Influyo en la seguridad regional, la diplomacia y la comparacion historica de conflictos en Europa.",
  participants: [{ side: "Actor registrado", members: ["Estados Unidos"], casualties: "No consolidado en fuentes livianas" },
    { side: "Oponente o fuerza local documentada", members: [], casualties: "No consolidado en fuentes livianas" }],
  chronology: [{ year: 1900, text: "Inicio registrado del conflicto o accion militar." }],
  treaties: ["Cierre o arreglo posterior pendiente de curaduria especifica (1900)"]
};
const placeholders = state.getConflictModalContent(structural);
for (const field of ["cause", "outcome", "consequences"]) assert.equal(placeholders[field], "", "known structural boilerplate is not episode evidence");
for (const field of ["participants", "chronology", "treaties"]) assert.deepEqual(plain(placeholders[field]), []);
const partial = state.getConflictModalContent({ ...structural,
  cause: "Causa especifica del episodio", outcome: "Resultado especifico",
  participants: [{ side: "Frente documentado", members: ["Francia"] }],
  chronology: [{ year: 1901, text: "Acuerdo documentado" }], treaties: ["Acuerdo documentado"]
});
assert.equal(partial.cause, "Causa especifica del episodio", "a structural batch can also contain genuine recorded fields");
assert.equal(partial.outcome, "Resultado especifico");
assert.equal(partial.participants[0].side, "Frente documentado");
assert.equal(partial.chronology[0].year, 1901);
assert.deepEqual(plain(partial.treaties), ["Acuerdo documentado"]);
const extended = state.getConflictModalContent({ ...structural, consequences: structural.consequences + " Una fuente describe un acuerdo concreto." });
assert.ok(extended.consequences.endsWith("acuerdo concreto."), "do not discard appended specific evidence");
assert.ok(state.getConflictModalContent({ ...structural, curationBatch: "source-backed" }).cause, "only identified batch templates are filtered");
const dataset = JSON.parse(await fs.readFile(new URL("../../data/conflict_details.generated.json", import.meta.url), "utf8"));
const france = dataset.conflicts["Batalla de Francia"];
assert.ok(france?.wikipedia?.casusBelli && france?.participants?.length, "exercise a real partially documented structural entry");
const recordedFrance = state.getConflictModalContent({ name: "Batalla de Francia", ...france });
assert.equal(recordedFrance.cause, state.sanitizeConflictModalText(france.cause));
assert.equal(recordedFrance.outcome, state.sanitizeConflictModalText(france.outcome));
assert.equal(recordedFrance.participants.length, france.participants.length);
assert.equal(recordedFrance.consequences, "", "only the generated consequence, not its sourced cause/result/sides, is hidden");
console.log("conflict-evidence.test.js ok: recorded facts, pending fields, no synthetic coalitions or chronology");
