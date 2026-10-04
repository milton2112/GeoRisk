import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { normalizeConflictKey, isProvisionalConflictHierarchy } from "../lib/conflict-cleaning.js";
import { resolveWikipediaConflictTitle } from "../lib/wikipedia-conflicts.js";
import { US_GLOBAL_FOLLOWUP_CONFLICT_DETAIL_FIXES, US_GLOBAL_FOLLOWUP_SAFE_CONFLICT_RENAMES } from "../lib/conflict-curation-us-global-followup.js";

const read = async file => JSON.parse(await fs.readFile(new URL("../../" + file, import.meta.url), "utf8"));
const full = await read("data/countries_full.json");
const name = "Batalla de Ambos Nogales (1918)";
const aliases = ["batalla del 27 de agosto", "Batalla del 27 de agosto", "Batalla del 27 de agosto de 1918", "Batalla del 27 de agosto (1918)"];
const matches = entry => normalizeConflictKey(entry.name) === normalizeConflictKey(name);
assert.equal(full.USA.military.conflicts.some(entry => aliases.includes(entry.name)), false,
  "the imported August 27 alias must not count as a second, undated battle");
const fix = US_GLOBAL_FOLLOWUP_CONFLICT_DETAIL_FIXES[name];
function check(entry) {
  assert.ok(entry);
  for (const field of ["parent", "war", "campaign", "startYear", "endYear", "datePrecision", "region", "normalizedRegion", "participants", "chronology", "hierarchySources", "sourceDispute", "curationNote", "dataConfidence", "treaties"]) {
    assert.deepEqual(entry[field], fix[field], field + " survives alias merging and lazy generation");
  }
  assert.equal(entry.startYear, 1918);
  assert.equal(entry.endYear, 1918);
  assert.match(entry.datePrecision, /27 de agosto de 1918/);
  assert.equal(isProvisionalConflictHierarchy(entry), false);
  assert.equal(entry.ongoing, false);
  assert.equal(entry.active, false);
  assert.equal(entry.parent, "Revoluci\u00f3n mexicana");
  assert.equal(entry.conflictType, "frontera");
  assert.equal(entry.participants.length, 2, "discard generic sides rather than appending them to the curated participants");
  assert.deepEqual(entry.participants.flatMap(side => side.members), ["Estados Unidos", "M\u00e9xico"]);
  assert.match(entry.sourceDispute, /asesores alemanes/);
  assert.match(entry.sourceDispute, /no permiten confirmar/);
  assert.match(entry.curationNote, /denominaciones del mismo episodio/);
  assert.equal(entry.dataConfidence, "parcial", "an identified date does not resolve disputed casualty and combatant claims");
  assert.deepEqual(entry.treaties, [], "do not invent a closing treaty");
  assert.equal(entry.hierarchySources.length, 3);
  assert.equal(new URL(entry.hierarchySources[2].url).hostname, "heroicanogales.gob.mx");
}
for (const alias of aliases) {
  assert.equal(US_GLOBAL_FOLLOWUP_SAFE_CONFLICT_RENAMES[alias], name);
  assert.equal((await resolveWikipediaConflictTitle(alias)).pageTitle, "Battle_of_Ambos_Nogales", "exact aliases resolve locally without remote search");
}
for (const unrelated of ["Batalla del 27 de agosto (1863)", "Batalla de Nogales (1929)", "Batalla de SIranaya"]) {
  assert.equal(US_GLOBAL_FOLLOWUP_SAFE_CONFLICT_RENAMES[unrelated], undefined, "do not infer identity from a date or shared location");
}
const details = await read("data/conflict_details.generated.json");
check(details.conflicts[name]);
for (const alias of aliases) assert.equal(details.conflicts[alias], undefined);
const detailIndex = await read("data/conflicts/details_index.json");
assert.equal(detailIndex.conflicts.filter(matches).length, 1);
check(await read(detailIndex.conflicts.find(matches).path));
const index = await read("data/conflicts_index.json");
assert.equal(index.filter(matches).length, 1);
assert.deepEqual(index.find(matches).countries.slice().sort(), ["MEX", "USA"]);
assert.equal(index.some(entry => aliases.includes(entry.name)), false);
const timeline = await read("data/timeline_index.json");
const light = await read("data/countries_index.json");
const search = await read("data/search_index.json");
for (const code of ["MEX", "USA"]) {
  for (const entries of [full[code].conflicts, full[code].military.conflicts]) {
    assert.equal(entries.filter(matches).length, 1);
    assert.equal(entries.some(entry => aliases.includes(entry.name)), false);
    check(entries.find(matches));
  }
  const profile = await read(`data/countries/${code}.json`);
  const entries = profile.metadata.publicProfile.conflictsSharded
    ? await read(`data/countries/conflicts/${code}.json`) : profile.military.conflicts;
  assert.equal(entries.filter(matches).length, 1);
  assert.equal(entries.some(entry => aliases.includes(entry.name)), false);
  assert.equal(entries.find(matches).startYear, 1918);
  for (const field of ["hierarchySources", "participants", "sourceDispute"]) {
    assert.equal(entries.find(matches)[field], undefined, "deep evidence remains on demand");
  }
  assert.equal(timeline.filter(entry => entry.country === code && entry.year === 1918 && normalizeConflictKey(entry.title) === normalizeConflictKey(name)).length, 1);
  assert.equal(light[code].military.conflictCount, full[code].military.conflicts.length);
  assert.equal(search.find(entry => entry.code === code).metrics.conflicts, full[code].military.conflicts.length);
}
assert.deepEqual(Object.keys(full).filter(code => full[code].military.conflicts.some(matches)).sort(), ["MEX", "USA"]);
console.log("nogales-alias-curation.test.js ok: one source-backed episode, qualified claims and consistent lazy/count indexes");
