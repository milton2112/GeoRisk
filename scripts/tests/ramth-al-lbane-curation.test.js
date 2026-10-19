import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";
import { normalizeConflictKey, isProvisionalConflictHierarchy } from "../lib/conflict-cleaning.js";
import { RAMTH_AL_LBANE_CONFLICT_RENAMES } from "../lib/conflict-curation-ramth-al-lbane.js";

const NAME = "Combates de Ramth al-Lbane (1979)";
const OLD_NAME = "Batalla de Ramth-al-Lbane";
const PARENT = "Guerra del Sahara Occidental";
const read = async path => JSON.parse(await fs.readFile(new URL("../../" + path, import.meta.url), "utf8"));
const equivalent = (a, b) => normalizeConflictKey(a) === normalizeConflictKey(b);

function check(detail) {
  assert.equal(detail.startYear, 1979);
  assert.equal(detail.endYear, 1979);
  assert.match(detail.datePrecision, /12 de marzo de 1979/);
  assert.equal(detail.parent, PARENT);
  assert.equal(detail.war, PARENT);
  assert.equal(detail.campaign, "Ofensivas del Frente Polisario de 1979");
  assert.equal(detail.conflictType, "independencia");
  assert.equal(isProvisionalConflictHierarchy(detail), false);
  assert.equal(detail.region, "Ramth Al Lbane, Sahara Occidental");
  assert.equal(detail.active, false);
  assert.equal(detail.ongoing, false);
  assert.equal(detail.dataConfidence, "parcial");
  assert.match(detail.sourceDispute, /Le Monde.*martes 13.*ONU.*el 12/);
  assert.match(detail.sourceDispute, /sin una verificación independiente/);
  assert.match(detail.curationNote, /sin adjudicar soberanía/);
  assert.match(detail.curationNote, /no se fijan vencedor, bajas ni control territorial/);
  assert.equal(detail.participants.length, 2);
  assert.deepEqual(detail.participants.map(side => side.members[0]), ["Marruecos", "Frente Polisario"]);
  assert.ok(detail.participants.every(side => side.casualties));
  assert.equal(detail.chronology.length, 2);
  assert.ok(detail.chronology.every(event => event.year === 1979));
  assert.deepEqual(detail.treaties, []);
  assert.deepEqual(detail.hierarchySources.map(source => new URL(source.url).hostname), [
    "documents.un.org", "www.lemonde.fr"
  ]);
}

for (const alias of [
  OLD_NAME,
  "Bataille de Ramth-al-Lbane",
  "Battle of Ramth-al-Lbane",
  "Battle of Ramth al-Lbane"
]) assert.equal(RAMTH_AL_LBANE_CONFLICT_RENAMES[alias], NAME);

const raw = await read("data/raw/conflicts.json");
assert.ok(raw.MAR.some(entry => equivalent(entry.name, OLD_NAME)), "retain the imported source record");

const full = await read("data/countries_full.json");
for (const code of ["MAR", "ESH"]) {
  for (const entries of [full[code].conflicts, full[code].military.conflicts]) {
    const matches = entries.filter(entry => equivalent(entry.name, NAME));
    assert.equal(matches.length, 1);
    check(matches[0]);
    assert.equal(entries.some(entry => entry.name === OLD_NAME), false);
  }
}

const generated = await read("data/conflict_details.generated.json");
check(generated.conflicts[NAME]);
assert.equal(generated.conflicts[OLD_NAME], undefined);

const detailIndex = await read("data/conflicts/details_index.json");
const refs = detailIndex.conflicts.filter(entry => equivalent(entry.name, NAME));
assert.equal(refs.length, 1);
check(await read(refs[0].path));

const index = await read("data/conflicts_index.json");
const indexed = index.filter(entry => equivalent(entry.name, NAME));
assert.equal(indexed.length, 1);
assert.deepEqual(indexed[0].countries.slice().sort(), ["ESH", "MAR"]);
assert.equal(indexed[0].startYear, 1979);
assert.equal(index.some(entry => entry.name === OLD_NAME), false);

const timeline = await read("data/timeline_index.json");
const countriesIndex = await read("data/countries_index.json");
const searchIndex = await read("data/search_index.json");
for (const code of ["MAR", "ESH"]) {
  assert.equal(timeline.filter(entry => entry.country === code && entry.year === 1979 && equivalent(entry.title, NAME)).length, 1);
  const conflictCount = full[code].military.conflicts.length;
  assert.equal(countriesIndex[code].military.conflictCount, conflictCount);
  assert.equal(searchIndex.find(entry => entry.code === code).metrics.conflicts, conflictCount);
  const profile = await read("data/countries/" + code + ".json");
  const entries = profile.metadata.publicProfile.conflictsSharded
    ? await read("data/countries/conflicts/" + code + ".json") : profile.military.conflicts;
  const matches = entries.filter(entry => equivalent(entry.name, NAME));
  assert.equal(matches.length, 1);
  assert.equal(matches[0].startYear, 1979);
  assert.equal(matches[0].parent, PARENT);
  assert.equal(matches[0].hierarchySources, undefined, "deep evidence stays deferred");
}

const window = {};
vm.runInNewContext(await fs.readFile(new URL("../../app-conflict-aliases.js", import.meta.url), "utf8"), { window });
for (const alias of [OLD_NAME, "Bataille de Ramth-al-Lbane", "Battle of Ramth-al-Lbane", "Battle of Ramth al-Lbane"]) {
  assert.equal(window.GeoRiskConflictAliases.entries.find(([pattern]) => pattern.test(alias))?.[1], NAME);
}
assert.equal(RAMTH_AL_LBANE_CONFLICT_RENAMES["Batalla de Ramth al-Lbane (1980)"], undefined);
assert.ok(full.USA.conflicts.some(entry => entry.name === "Batalla de Kasumi"), "leave unrelated imports unchanged");
console.log("ramth-al-lbane-curation.test.js ok: 1979 combat, source date caveat, neutral territorial treatment and lazy evidence");
