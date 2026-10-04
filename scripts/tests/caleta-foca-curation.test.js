import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { normalizeConflictKey, isProvisionalConflictHierarchy } from "../lib/conflict-cleaning.js";
import { resolveWikipediaConflictTitle } from "../lib/wikipedia-conflicts.js";

const read = async file => JSON.parse(await fs.readFile(new URL("../../" + file, import.meta.url), "utf8"));
const full = await read("data/countries_full.json");
const name = "Combate de Caleta Foca (1982)";
const oldName = "Combate de Caleta Foca";
const matches = entry => normalizeConflictKey(entry.name) === normalizeConflictKey(name);
const imported = full.GBR.conflicts.find(entry => matches(entry) || entry.name === oldName);
assert.ok(imported, "retain the imported naval episode");
assert.equal(imported.startYear, 1982, "COAC dates the encounter to 23 May 1982, not an undated European battle");

const { CALETA_FOCA_CONFLICT_DETAIL_FIXES, CALETA_FOCA_CONFLICT_RENAMES } = await import("../lib/conflict-curation-caleta-foca.js");
const fix = CALETA_FOCA_CONFLICT_DETAIL_FIXES[name];
function check(entry) {
  assert.ok(entry);
  for (const field of ["startYear", "endYear", "datePrecision", "parent", "war", "campaign", "type", "conflictType", "scale", "normalizedRegion", "cause", "outcome", "consequences", "participants", "chronology", "hierarchySources", "sourceDispute", "curationNote", "dataConfidence", "treaties"]) {
    assert.deepEqual(entry[field], fix[field], field + " survives full and lazy generation");
  }
  assert.equal(isProvisionalConflictHierarchy(entry), false);
  assert.equal(entry.active, false);
  assert.equal(entry.ongoing, false);
  assert.match(entry.normalizedRegion, /Malvinas\/Falkland, Atl\u00e1ntico Sur/);
  assert.doesNotMatch(entry.normalizedRegion, /Europa/);
  assert.equal(entry.parent, "Guerra de las Malvinas");
  assert.equal(entry.type, "combate naval");
  assert.equal(entry.scale, "local");
  assert.match(entry.participants[0].casualties, /algunos heridos leves/);
  assert.match(entry.participants[0].casualties, /No se fija un total/);
  assert.match(entry.participants[1].casualties, /no equivale a cero/);
  assert.match(entry.sourceDispute, /no confirma un derribo/);
  assert.match(entry.sourceDispute, /al sur de ensenada Luisa/);
  assert.match(entry.curationNote, /proyecto de resoluci\u00f3n, no una norma aprobada/);
  assert.match(entry.curationNote, /campa\u00f1a es descriptiva/);
  assert.equal(entry.hierarchySources.length, 2);
  assert.equal(new URL(entry.hierarchySources[0].url).hostname, "www.argentina.gob.ar");
  assert.equal(new URL(entry.hierarchySources[1].url).hostname, "rest.hcdn.gob.ar");
  assert.match(entry.outcome, /No se declara una victoria decisiva/);
  assert.doesNotMatch(entry.outcome, /helic\u00f3ptero derribado/);
}
for (const alias of [name, oldName, "Combate de caleta Foca", "Battle of Seal Cove"]) {
  if (alias !== name) assert.equal(CALETA_FOCA_CONFLICT_RENAMES[alias], name);
  assert.equal((await resolveWikipediaConflictTitle(alias)).pageTitle, "Battle_of_Seal_Cove", "exact aliases resolve locally without a remote search");
}
assert.equal(CALETA_FOCA_CONFLICT_RENAMES["Batalla de San Carlos"], undefined);
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
assert.deepEqual(indexed[0].countries.slice().sort(), ["ARG", "GBR"]);
assert.equal(indexed[0].startYear, 1982);
const timeline = await read("data/timeline_index.json");
const light = await read("data/countries_index.json");
const search = await read("data/search_index.json");
for (const code of ["ARG", "GBR"]) {
  for (const entries of [full[code].conflicts, full[code].military.conflicts]) {
    assert.equal(entries.filter(matches).length, 1);
    check(entries.find(matches));
    assert.equal(entries.some(entry => entry.name === oldName), false);
  }
  const profile = await read(`data/countries/${code}.json`);
  const entries = profile.metadata.publicProfile.conflictsSharded
    ? await read(`data/countries/conflicts/${code}.json`) : profile.military.conflicts;
  assert.equal(entries.filter(matches).length, 1);
  assert.equal(entries.find(matches).startYear, 1982);
  for (const field of ["participants", "hierarchySources", "curationNote", "sourceDispute"]) {
    assert.equal(entries.find(matches)[field], undefined, "deep references stay in on-demand detail");
  }
  assert.equal(timeline.filter(entry => entry.country === code && entry.year === 1982 && normalizeConflictKey(entry.title) === normalizeConflictKey(name)).length, 1);
  assert.equal(light[code].military.conflictCount, full[code].military.conflicts.length);
  assert.equal(search.find(entry => entry.code === code).metrics.conflicts, full[code].military.conflicts.length);
}
assert.deepEqual(Object.keys(full).filter(code => full[code].conflicts.some(matches)).sort(), ["ARG", "GBR"]);
console.log("caleta-foca-curation.test.js ok: source-backed South Atlantic date/hierarchy, qualified claims and lazy consistency");
