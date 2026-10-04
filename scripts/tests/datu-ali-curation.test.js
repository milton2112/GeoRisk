import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { normalizeConflictKey, isProvisionalConflictHierarchy } from "../lib/conflict-cleaning.js";
import { resolveWikipediaConflictTitle } from "../lib/wikipedia-conflicts.js";

const read = async file => JSON.parse(await fs.readFile(new URL("../../" + file, import.meta.url), "utf8"));
const full = await read("data/countries_full.json");
const name = "Combate contra Datu Ali (1905)";
const oldName = "Batalla del r\u00edo Malalag";
const matches = entry => normalizeConflictKey(entry.name) === normalizeConflictKey(name);
const existing = full.USA.conflicts.find(entry => matches(entry) || entry.name === oldName);
assert.ok(existing, "retain the imported episode rather than replacing an unrelated event");
assert.equal(existing.startYear, 1905, "the regimental account dates the encounter to 22 October 1905");

const { DATU_ALI_CONFLICT_DETAIL_FIXES, DATU_ALI_CONFLICT_RENAMES } = await import("../lib/conflict-curation-datu-ali.js");
const fix = DATU_ALI_CONFLICT_DETAIL_FIXES[name];
function check(entry) {
  assert.ok(entry, "the corrected episode exists");
  for (const field of ["startYear", "endYear", "datePrecision", "parent", "war", "campaign", "type", "conflictType", "normalizedRegion", "cause", "outcome", "consequences", "participants", "chronology", "hierarchySources", "sourceDispute", "curationNote", "dataConfidence", "treaties"]) {
    assert.deepEqual(entry[field], fix[field], field + " survives full and lazy generation");
  }
  assert.equal(isProvisionalConflictHierarchy(entry), false);
  assert.equal(entry.active, false);
  assert.match(entry.normalizedRegion, /Mindanao, Filipinas/);
  assert.doesNotMatch(entry.normalizedRegion, /Am[e\u00e9]rica|Davao del Sur/);
  assert.equal(entry.conflictType, "colonial");
  assert.match(entry.participants[0].casualties, /1 muerto en el acto y 2 heridos, uno de los cuales falleci/);
  assert.match(entry.participants[0].casualties, /no son 3 muertos/);
  assert.match(entry.participants[1].casualties, /Datu Ali muri/);
  assert.match(entry.participants[1].casualties, /Sin total consolidado/);
  assert.match(entry.sourceDispute, /Malala\/Malola/);
  assert.match(entry.curationNote, /no un gobierno independiente beligerante/);
  assert.match(entry.curationNote, /calificaciones coloniales/);
  assert.equal(entry.hierarchySources.length, 2);
  assert.equal(new URL(entry.hierarchySources[0].url).hostname, "www.1-22infantry.org");
  assert.equal(new URL(entry.hierarchySources[1].url).hostname, "www.army.mil");
}
for (const alias of [name, oldName, "Batalla del rio Malalag", "Battle of the Malalag River", "Battle of the Malala River"]) {
  if (alias !== name) assert.equal(DATU_ALI_CONFLICT_RENAMES[alias], name);
  assert.equal((await resolveWikipediaConflictTitle(alias)).pageTitle, "Battle_of_the_Malalag_River", "local alias resolution must not query a remote service");
}
assert.equal(DATU_ALI_CONFLICT_RENAMES["Expedicion de Taraca (1904)"], undefined);
const details = await read("data/conflict_details.generated.json");
check(details.conflicts[name]);
assert.equal(details.conflicts[oldName], undefined);
const detailIndex = await read("data/conflicts/details_index.json");
const refs = detailIndex.conflicts.filter(matches);
assert.equal(refs.length, 1);
check(await read(refs[0].path));
const index = await read("data/conflicts_index.json");
const indexed = index.filter(matches);
assert.equal(indexed.length, 1);
assert.deepEqual(indexed[0].countries.slice().sort(), ["PHL", "USA"]);
assert.equal(indexed[0].startYear, 1905);
const timeline = await read("data/timeline_index.json");
const light = await read("data/countries_index.json");
const search = await read("data/search_index.json");
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
  assert.equal(entries.find(matches).startYear, 1905);
  for (const field of ["participants", "hierarchySources", "curationNote", "sourceDispute"]) {
    assert.equal(entries.find(matches)[field], undefined, "deep references stay in on-demand detail");
  }
  assert.equal(timeline.filter(entry => entry.country === code && entry.year === 1905 && normalizeConflictKey(entry.title) === normalizeConflictKey(name)).length, 1);
  assert.equal(light[code].military.conflictCount, full[code].military.conflicts.length);
  assert.equal(search.find(entry => entry.code === code).metrics.conflicts, full[code].military.conflicts.length);
}
assert.deepEqual(Object.keys(full).filter(code => full[code].conflicts.some(matches)).sort(), ["PHL", "USA"]);
console.log("datu-ali-curation.test.js ok: date, colonial hierarchy, qualified casualties and lazy data consistency");
