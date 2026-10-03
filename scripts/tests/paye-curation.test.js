import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { normalizeConflictKey, isProvisionalConflictHierarchy } from "../lib/conflict-cleaning.js";
import { PAYE_CONFLICT_DETAIL_FIXES, PAYE_CONFLICT_RENAMES } from "../lib/conflict-curation-paye.js";
import { resolveWikipediaConflictTitle } from "../lib/wikipedia-conflicts.js";

const read = async file => JSON.parse(await fs.readFile(new URL("../../" + file, import.meta.url), "utf8"));
const full = await read("data/countries_full.json");
const original = full.USA.conflicts.find(entry => /^Batalla de Paye(?: |$)/.test(entry.name));
assert.ok(original, "the existing Paye episode is retained");
assert.equal(original.startYear, 1900, "NHCP dates the battle, not the marker, to 1900");
assert.equal(original.endYear, 1900);
assert.equal(original.parent, "Guerra filipino-estadounidense");
assert.match(original.normalizedRegion, /Boac, Marinduque, Filipinas/);
const name = "Batalla de Paye (1900)";
const oldName = "Batalla de Paye";
const matches = entry => normalizeConflictKey(entry.name) === normalizeConflictKey(name);
const fix = PAYE_CONFLICT_DETAIL_FIXES[name];
function check(entry) {
  assert.ok(entry, "the dated episode exists");
  for (const field of ["startYear", "endYear", "datePrecision", "parent", "war", "campaign", "type", "conflictType", "normalizedRegion", "cause", "outcome", "consequences", "dataConfidence", "participants", "hierarchySources", "chronology", "sourceDispute", "curationNote", "treaties"]) {
    assert.deepEqual(entry[field], fix[field], field + " survives full/lazy generation");
  }
  assert.equal(isProvisionalConflictHierarchy(entry), false);
  assert.equal(entry.active, false);
  assert.doesNotMatch(JSON.stringify(entry), /Conflicto regional de|fecha no consolidada|Actor registrado|Oponente o fuerza local/);
  assert.match(entry.participants[0].casualties, /2 cabos estadounidenses capturados/);
  assert.match(entry.participants[0].casualties, /no proporciona un total de muertos o heridos/);
  assert.match(entry.participants[1].casualties, /Sin recuento consolidado/);
  assert.match(entry.consequences, /civil ingl\u00e9s capturado, separado de los militares/);
  assert.match(entry.sourceDispute, /segundo combate/);
  assert.match(entry.sourceDispute, /primero oficialmente registrado/);
  assert.match(entry.curationNote, /San Mateo \(1899\)/);
  assert.deepEqual(entry.treaties, []);
  assert.equal(entry.hierarchySources.length, 3);
  assert.equal(new URL(entry.hierarchySources[0].url).hostname, "philhistoricsites.nhcp.gov.ph");
  assert.equal(new URL(entry.hierarchySources[1].url).hostname, "lawphil.net");
  assert.equal(new URL(entry.hierarchySources[2].url).hostname, "history.state.gov");
}
for (const alias of [name, oldName, "Battle of Paye", "Labanan sa Paye"]) {
  if (alias !== name) assert.equal(PAYE_CONFLICT_RENAMES[alias], name);
  assert.equal((await resolveWikipediaConflictTitle(alias)).pageTitle, "Battle_of_Paye", "exact local alias, no remote search");
}
assert.equal(PAYE_CONFLICT_RENAMES["Batalla de San Mateo (1899)"], undefined);
const generated = await read("data/conflict_details.generated.json");
check(generated.conflicts[name]);
assert.equal(generated.conflicts[oldName], undefined);
const detailsIndex = await read("data/conflicts/details_index.json");
const refs = detailsIndex.conflicts.filter(matches);
assert.equal(refs.length, 1);
check(await read(refs[0].path));
const index = await read("data/conflicts_index.json");
const indexed = index.filter(matches);
assert.equal(indexed.length, 1);
assert.deepEqual(indexed[0].countries.slice().sort(), ["PHL", "USA"]);
assert.equal(indexed[0].startYear, 1900);
assert.equal(index.some(entry => entry.name === oldName), false);
const timeline = await read("data/timeline_index.json");
const countriesIndex = await read("data/countries_index.json");
const searchIndex = await read("data/search_index.json");
for (const code of ["USA", "PHL"]) {
  for (const entries of [full[code].conflicts, full[code].military.conflicts]) {
    assert.equal(entries.filter(matches).length, 1);
    check(entries.find(matches));
    assert.equal(entries.some(entry => entry.name === oldName), false);
  }
  const profile = await read(`data/countries/${code}.json`);
  const entries = profile.metadata.publicProfile.conflictsSharded
    ? await read(`data/countries/conflicts/${code}.json`) : profile.military.conflicts;
  assert.equal(entries.filter(matches).length, 1);
  const entry = entries.find(matches);
  assert.equal(entry.startYear, 1900);
  assert.equal(entry.normalizedRegion, fix.normalizedRegion);
  for (const field of ["participants", "hierarchySources", "curationNote", "sourceDispute"]) {
    assert.equal(entry[field], undefined, "deep content stays on demand");
  }
  assert.equal(timeline.filter(entry => entry.country === code && entry.year === 1900 && normalizeConflictKey(entry.title) === normalizeConflictKey(name)).length, 1);
  const conflictCount = full[code].military.conflicts.length;
  assert.equal(countriesIndex[code].military.conflictCount, conflictCount, "startup metrics match the complete country");
  assert.equal(searchIndex.find(entry => entry.code === code).metrics.conflicts, conflictCount, "search metrics match the complete country");
}
assert.equal(full.GBR.conflicts.some(matches), false, "a captured civilian does not make Britain a military participant");
console.log("paye-curation.test.js ok: date, verified hierarchy, geography, captives and source limitations");
