import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { normalizeConflictKey, isProvisionalConflictHierarchy } from "../lib/conflict-cleaning.js";
import { SANTORINI_CONFLICT_DETAIL_FIXES, SANTORINI_CONFLICT_RENAMES } from "../lib/conflict-curation-santorini.js";
import { resolveWikipediaConflictTitle } from "../lib/wikipedia-conflicts.js";

const read = async file => JSON.parse(await fs.readFile(new URL("../../" + file, import.meta.url), "utf8"));
const full = await read("data/countries_full.json");
const original = full.GBR.conflicts.find(entry => /^Incursion sobre Santorini(?: |$)/.test(entry.name));
assert.ok(original, "the existing Santorini episode is retained");
assert.equal(original.startYear, 1944, "institutional sources place the episode in WWII, not an undated generic European war");
const name = "Incursion sobre Santorini (1944)";
const oldName = "Incursion sobre Santorini";
const matches = entry => normalizeConflictKey(entry.name) === normalizeConflictKey(name);
const fix = SANTORINI_CONFLICT_DETAIL_FIXES[name];
function check(entry) {
  assert.ok(entry, "the curated episode exists");
  for (const field of ["startYear", "endYear", "datePrecision", "parent", "war", "campaign", "type", "conflictType", "scale", "normalizedRegion", "cause", "outcome", "consequences", "dataConfidence", "participants", "hierarchySources", "hierarchyConfidence", "chronology", "sourceDispute", "curationNote", "treaties"]) {
    assert.deepEqual(entry[field], fix[field], field + " survives full/lazy generation");
  }
  assert.equal(isProvisionalConflictHierarchy(entry), false);
  assert.equal(entry.active, false);
  assert.equal(entry.ongoing, false);
  assert.match(entry.datePrecision, /Abril de 1944/);
  assert.match(entry.datePrecision, /exacto no consolidado/);
  assert.match(entry.sourceDispute, /22 de abril/);
  assert.match(entry.sourceDispute, /24 de abril/);
  assert.match(entry.curationNote, /cifras de la serie de incursiones no se atribuyen a Santorini/);
  assert.match(entry.curationNote, /Grecia vincula el territorio, no una unidad griega confirmada/);
  assert.match(entry.curationNote, /transcripci\u00f3n de terceros/);
  assert.match(entry.curationNote, /PDF institucional no pudo descargarse/);
  for (const side of entry.participants) {
    assert.match(side.casualties, /Sin total exclusivo.*no equivale a cero/);
    assert.doesNotMatch(side.casualties, /\d/, "multi-island totals must not be attributed to this one raid");
  }
  assert.deepEqual(entry.participants.map(side => side.members[0]), ["Reino Unido", "Alemania"]);
  assert.doesNotMatch(JSON.stringify(entry), /Conflicto regional de|fecha no consolidada|Actor registrado|Oponente o fuerza local/);
  assert.deepEqual(entry.treaties, []);
  assert.deepEqual(entry.hierarchySources.map(source => new URL(source.url).hostname), ["www.nam.ac.uk", "hdl.handle.net", "studyres.com", "en.wikipedia.org"]);
}
for (const alias of [name, oldName, "Incursi\u00f3n sobre Santorini", "Raid on Santorini"]) {
  if (alias !== name) assert.equal(SANTORINI_CONFLICT_RENAMES[alias], name);
  assert.equal((await resolveWikipediaConflictTitle(alias)).pageTitle, "Raid_on_Santorini", "exact local alias, no remote lookup");
}
assert.equal(SANTORINI_CONFLICT_RENAMES["Incursion sobre Santorini (1943)"], undefined);
assert.equal(SANTORINI_CONFLICT_RENAMES["Raid on Symi"], undefined);
const generated = await read("data/conflict_details.generated.json");
check(generated.conflicts[name]);
assert.equal(generated.conflicts[oldName], undefined);
const detailsIndex = await read("data/conflicts/details_index.json");
const refs = detailsIndex.conflicts.filter(matches);
assert.equal(refs.length, 1, "one shared on-demand detail");
check(await read(refs[0].path));
const index = await read("data/conflicts_index.json");
const indexed = index.filter(matches);
assert.equal(indexed.length, 1);
assert.deepEqual(indexed[0].countries.slice().sort(), ["DEU", "GBR", "GRC"]);
assert.equal(indexed[0].startYear, 1944);
const timeline = await read("data/timeline_index.json");
const countriesIndex = await read("data/countries_index.json");
const searchIndex = await read("data/search_index.json");
for (const code of ["GBR", "DEU", "GRC"]) {
  for (const entries of [full[code].conflicts, full[code].military.conflicts]) {
    assert.equal(entries.filter(matches).length, 1);
    check(entries.find(matches));
    assert.equal(entries.some(entry => entry.name === oldName), false);
  }
  const profile = await read(`data/countries/${code}.json`);
  const entries = profile.metadata.publicProfile.conflictsSharded
    ? await read(`data/countries/conflicts/${code}.json`) : profile.military.conflicts;
  const entry = entries.find(matches);
  assert.equal(entries.filter(matches).length, 1);
  assert.equal(entry.startYear, 1944);
  assert.equal(entry.normalizedRegion, fix.normalizedRegion);
  for (const field of ["participants", "hierarchySources", "curationNote", "sourceDispute"]) {
    assert.equal(entry[field], undefined, "deep source notes remain on demand");
  }
  assert.equal(timeline.filter(entry => entry.country === code && entry.year === 1944 && normalizeConflictKey(entry.title) === normalizeConflictKey(name)).length, 1);
  const count = full[code].military.conflicts.length;
  assert.equal(countriesIndex[code].military.conflictCount, count);
  assert.equal(searchIndex.find(entry => entry.code === code).metrics.conflicts, count);
}
assert.equal(full.ITA.conflicts.some(matches), false, "the mixed-garrison encyclopedia claim is not promoted to a confirmed Italian belligerent");
console.log("santorini-curation.test.js ok: WWII hierarchy, month-level date, territorial link and no multi-raid casualty totals");
