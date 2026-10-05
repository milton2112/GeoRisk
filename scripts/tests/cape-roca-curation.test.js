import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { normalizeConflictKey, isProvisionalConflictHierarchy } from "../lib/conflict-cleaning.js";
import { resolveWikipediaConflictTitle } from "../lib/wikipedia-conflicts.js";

const read = async file => JSON.parse(await fs.readFile(new URL("../../" + file, import.meta.url), "utf8"));
const full = await read("data/countries_full.json");
const original = full.FRA.conflicts.find(entry => /^Batalla del cabo de la Roca(?: |$)/.test(entry.name));
assert.ok(original, "the existing episode is retained");
assert.equal(original.startYear, 1703, "the contemporary report dates the previously undated naval encounter");
const { CAPE_ROCA_CONFLICT_DETAIL_FIXES, CAPE_ROCA_CONFLICT_RENAMES } = await import("../lib/conflict-curation-cape-roca.js");
const name = "Batalla del cabo de la Roca (1703)";
const oldName = "Batalla del cabo de la Roca";
const matches = entry => normalizeConflictKey(entry.name) === normalizeConflictKey(name);
const fix = CAPE_ROCA_CONFLICT_DETAIL_FIXES[name];
function check(entry) {
  assert.ok(entry, "the curated episode exists");
  for (const field of ["startYear", "endYear", "datePrecision", "parent", "war", "campaign", "type", "conflictType", "scale", "normalizedRegion", "cause", "outcome", "consequences", "dataConfidence", "participants", "hierarchySources", "hierarchyConfidence", "chronology", "sourceDispute", "curationNote", "treaties"]) {
    assert.deepEqual(entry[field], fix[field], field + " survives full/lazy generation");
  }
  assert.equal(isProvisionalConflictHierarchy(entry), false);
  assert.equal(entry.active, false);
  assert.equal(entry.ongoing, false);
  assert.equal(entry.type, "combate naval");
  assert.equal(entry.datePrecision, "22 de mayo de 1703");
  assert.match(entry.war, /Sucesi\u00f3n Espa\u00f1ola/);
  assert.match(entry.normalizedRegion, /Portugal.*Atl\u00e1ntico/);
  assert.match(entry.sourceDispute, /parte franc\u00e9s/);
  assert.match(entry.sourceDispute, /no un recuento independiente/);
  assert.match(entry.curationNote, /no el Estado moderno/);
  assert.match(entry.curationNote, /no acredita una escolta brit\u00e1nica/);
  assert.match(entry.curationNote, /Portugal es la referencia geogr\u00e1fica, no un beligerante/);
  assert.match(entry.curationNote, /campa\u00f1a es una agrupaci\u00f3n editorial/);
  assert.deepEqual(entry.participants.map(side => side.members[0]), ["Francia", "Rep\u00fablica de los Siete Pa\u00edses Bajos Unidos"]);
  assert.match(entry.participants[0].members.join(" "), /Co\u00ebtlogon/);
  assert.match(entry.participants[1].members.join(" "), /Roemer Vlacq/);
  for (const side of entry.participants) {
    assert.match(side.casualties, /Sin total.*no equivale a cero/);
    assert.doesNotMatch(side.casualties, /\d/, "ship complements are not human casualties");
  }
  assert.doesNotMatch(JSON.stringify(entry), /Conflicto regional de|Actor registrado|Oponente o fuerza local|golfo de Vizcaya/i);
  assert.deepEqual(entry.treaties, []);
  assert.deepEqual(entry.hierarchySources.map(source => new URL(source.url).hostname), ["m.shabretagne.com", "www.servicehistorique.sga.defense.gouv.fr", "en.wikipedia.org"]);
}
for (const alias of [name, oldName, "Battle of Cap de la Roque", "Bataille du cap de la Roque"]) {
  if (alias !== name) assert.equal(CAPE_ROCA_CONFLICT_RENAMES[alias], name);
  assert.equal((await resolveWikipediaConflictTitle(alias)).pageTitle, "Battle_of_Cap_de_la_Roque", "exact local alias without a remote lookup");
}
for (const unrelated of ["Batalla del cabo de la Roca (1704)", "Batalla del cabo de Gata", "Battle of Cape Rachado"]) {
  assert.equal(CAPE_ROCA_CONFLICT_RENAMES[unrelated], undefined, "no fuzzy merge with another episode/date");
}
const generated = await read("data/conflict_details.generated.json");
check(generated.conflicts[name]);
assert.equal(generated.conflicts[oldName], undefined);
const detailsIndex = await read("data/conflicts/details_index.json");
const refs = detailsIndex.conflicts.filter(matches);
assert.equal(refs.length, 1, "one shared on-demand detail");
check(await read(refs[0].path));
const indexed = (await read("data/conflicts_index.json")).filter(matches);
assert.equal(indexed.length, 1);
assert.deepEqual(indexed[0].countries.slice().sort(), ["FRA", "NLD"]);
assert.equal(indexed[0].startYear, 1703);
const timeline = await read("data/timeline_index.json");
const countriesIndex = await read("data/countries_index.json");
const searchIndex = await read("data/search_index.json");
for (const code of ["FRA", "NLD"]) {
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
  assert.equal(entry.startYear, 1703);
  assert.equal(entry.normalizedRegion, fix.normalizedRegion);
  for (const field of ["participants", "hierarchySources", "curationNote", "sourceDispute"]) {
    assert.equal(entry[field], undefined, "deep source notes remain on demand");
  }
  assert.equal(timeline.filter(entry => entry.country === code && entry.year === 1703 && normalizeConflictKey(entry.title) === normalizeConflictKey(name)).length, 1);
  const count = full[code].military.conflicts.length;
  assert.equal(countriesIndex[code].military.conflictCount, count);
  assert.equal(searchIndex.find(entry => entry.code === code).metrics.conflicts, count);
}
for (const code of ["PRT", "GBR"]) assert.equal(full[code].conflicts.some(matches), false, "geography/merchant flags do not establish a military belligerent");
console.log("cape-roca-curation.test.js ok: 1703 naval hierarchy, historical participants, source qualifications and lazy consistency");
