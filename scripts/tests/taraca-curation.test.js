import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { TARACA_CONFLICT_DETAIL_FIXES, TARACA_CONFLICT_RENAMES } from "../lib/conflict-curation-taraca.js";
import { normalizeConflictKey, isProvisionalConflictHierarchy } from "../lib/conflict-cleaning.js";
import { resolveWikipediaConflictTitle } from "../lib/wikipedia-conflicts.js";

const read = async file => JSON.parse(await fs.readFile(new URL("../../" + file, import.meta.url), "utf8"));
const full = await read("data/countries_full.json");
const index = await read("data/conflicts_index.json");
const detailsIndex = await read("data/conflicts/details_index.json");
const generated = await read("data/conflict_details.generated.json");
const name = "Expedicion de Taraca (1904)";
const fix = TARACA_CONFLICT_DETAIL_FIXES[name];
const matches = entry => normalizeConflictKey(entry.name) === normalizeConflictKey(name);
assert.equal(TARACA_CONFLICT_RENAMES["Batalla de Taraca"], name);
assert.equal(TARACA_CONFLICT_RENAMES["Expedici\u00f3n de Taraca (1904)"], name);
for (const label of [name, "Batalla de Taraca", "Expedici\u00f3n de Taraca (1904)"]) {
  assert.equal((await resolveWikipediaConflictTitle(label)).pageTitle, "Battle_of_Taraca");
}
function check(detail) {
  assert.ok(detail, name);
  assert.equal(detail.startYear, 1904);
  assert.equal(detail.endYear, 1904);
  assert.equal(detail.parent, "Rebeli\u00f3n moro");
  assert.equal(detail.war, fix.parent);
  assert.equal(detail.type, "campa\u00f1a");
  assert.equal(detail.conflictType, "colonial");
  assert.equal(isProvisionalConflictHierarchy(detail), false);
  assert.equal(detail.normalizedRegion, fix.normalizedRegion);
  assert.equal(detail.datePrecision, fix.datePrecision);
  assert.equal(detail.dataConfidence, "parcial");
  assert.deepEqual(detail.hierarchySources, fix.hierarchySources);
  assert.deepEqual(detail.participants, fix.participants);
  assert.deepEqual(detail.chronology, fix.chronology);
  assert.deepEqual(detail.treaties, []);
  assert.doesNotMatch(JSON.stringify(detail), /Conflicto regional de|fecha no consolidada|Actor registrado|Oponente o fuerza local/);
}
check(generated.conflicts[name]);
const indexed = index.filter(matches);
assert.equal(indexed.length, 1);
assert.deepEqual(indexed[0].countries.slice().sort(), ["PHL", "USA"]);
assert.equal(indexed[0].startYear, 1904);
assert.equal(index.some(entry => entry.name === "Batalla de Taraca"), false);
const refs = detailsIndex.conflicts.filter(matches);
assert.equal(refs.length, 1);
check(await read(refs[0].path));
for (const code of ["USA", "PHL"]) {
  for (const entries of [full[code].conflicts, full[code].military.conflicts]) {
    assert.equal(entries.filter(matches).length, 1);
    check(entries.find(matches));
    assert.equal(entries.some(entry => entry.name === "Batalla de Taraca"), false);
  }
  const profile = await read(`data/countries/${code}.json`);
  const entries = profile.metadata.publicProfile.conflictsSharded
    ? await read(`data/countries/conflicts/${code}.json`) : profile.military.conflicts;
  assert.equal(entries.filter(matches).length, 1);
  const entry = entries.find(matches);
  assert.equal(entry.startYear, 1904);
  assert.equal(entry.normalizedRegion, fix.normalizedRegion);
  assert.equal(entry.hierarchySources, undefined, "fuentes profundas solo bajo demanda");
}
assert.match(fix.participants[0].casualties, /2 muertos en combate, 1 ahogado y 11 heridos/);
assert.match(fix.participants[1].casualties, /Sin total consolidado/);
assert.match(fix.curationNote, /Wheeler/);
assert.match(fix.curationNote, /v\u00ednculo territorial/);
assert.equal(TARACA_CONFLICT_RENAMES["Batalla de Paye"], undefined, "no desambiguar Paye sin evidencia de identidad");
console.log("taraca-curation.test.js ok: dates, hierarchy, location, casualties and lazy detail");
