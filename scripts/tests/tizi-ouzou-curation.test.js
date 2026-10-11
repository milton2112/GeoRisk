import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { normalizeConflictKey, isProvisionalConflictHierarchy } from "../lib/conflict-cleaning.js";
import { resolveWikipediaConflictTitle } from "../lib/wikipedia-conflicts.js";
import { TIZI_OUZOU_CONFLICT_RENAMES } from "../lib/conflict-curation-tizi-ouzou.js";

const read = async file => JSON.parse(await fs.readFile(new URL("../../" + file, import.meta.url), "utf8"));
const full = await read("data/countries_full.json");
const original = full.FRA.conflicts.find(entry => /^Batalla de Tizi Ouzou(?: |$)/.test(entry.name));
assert.ok(original, "preserve the imported Tizi Ouzou episode");
assert.equal(original.startYear, 1845, "Robin dates the Boukhalfa encounter to early June 1845");
const name = "Batalla de Tizi Ouzou (1845)";
const oldName = "Batalla de Tizi Ouzou";
const matches = entry => normalizeConflictKey(entry.name) === normalizeConflictKey(name);
function check(entry) {
  assert.ok(entry, "one dated episode must survive generation");
  assert.equal(entry.startYear, 1845);
  assert.equal(entry.endYear, 1845);
  assert.equal(entry.datePrecision, "Primeros dias de junio de 1845; sin dia exacto consolidado");
  assert.equal(entry.parent, "Conquista francesa de Argelia");
  assert.equal(entry.war, entry.parent);
  assert.equal(entry.conflictType, "colonial");
  assert.equal(isProvisionalConflictHierarchy(entry), false);
  assert.match(entry.normalizedRegion, /Boukhalfa.*Cabilia.*Argelia.*[A\u00c1]frica/);
  assert.equal(entry.active, false);
  assert.equal(entry.ongoing, false);
  assert.equal(entry.dataConfidence, "parcial");
  assert.doesNotMatch(JSON.stringify(entry), /Conflicto regional de|fecha no consolidada|Actor registrado|Oponente o fuerza local/);
  assert.equal(entry.participants.length, 2);
  assert.match(entry.participants[0].side, /Contingentes locales aliados/);
  assert.match(entry.participants[1].side, /Resistencia local/);
  assert.ok(entry.participants.every(side => side.members.length && /sin total|Sin recuento/.test(side.casualties)));
  assert.ok(entry.participants.every(side => !side.members.some(member => /Gentil|Bugeaud|Estado.*Argelia/.test(member))), "nearby commanders and modern states are not inferred combatants");
  assert.match(entry.sourceDispute, /Gentil.*Beni-Aicha/);
  assert.match(entry.curationNote, /relato colonial retrospectivo/);
  assert.match(entry.curationNote, /no se consultaron/);
  assert.match(entry.curationNote, /no el Estado actual/);
  assert.equal(entry.chronology.length, 2);
  assert.ok(entry.chronology.every(event => event.year === 1845));
  assert.match(entry.chronology[1].event, /primeros dias de junio/i);
  assert.deepEqual(entry.treaties, []);
  assert.deepEqual(entry.hierarchySources.map(source => new URL(source.url).hostname), ["cinumedpub.mmsh.fr", "en.wikipedia.org"]);
}
check(original);
for (const alias of [name, oldName, "Battle of Tizi Ouzou"]) {
  if (alias !== name) assert.equal(TIZI_OUZOU_CONFLICT_RENAMES[alias], name);
  assert.equal((await resolveWikipediaConflictTitle(alias)).pageTitle, "Battle_Of_Tizi_Ouzou_(1845)", "use an exact local override without remote discovery");
}
assert.equal(TIZI_OUZOU_CONFLICT_RENAMES["Batalla de Tizi Ouzou (1857)"], undefined);
assert.equal(TIZI_OUZOU_CONFLICT_RENAMES["Batalla de Vinh"], undefined);
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
assert.deepEqual(indexed[0].countries.slice().sort(), ["DZA", "FRA"]);
assert.equal(indexed[0].startYear, 1845);
assert.equal(index.some(entry => entry.name === oldName), false);
const timeline = await read("data/timeline_index.json");
const countriesIndex = await read("data/countries_index.json");
const searchIndex = await read("data/search_index.json");
for (const code of ["FRA", "DZA"]) {
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
  assert.equal(entry.startYear, 1845);
  assert.equal(entry.parent, original.parent);
  assert.equal(entry.normalizedRegion, original.normalizedRegion);
  for (const field of ["participants", "hierarchySources", "curationNote", "sourceDispute"]) {
    assert.equal(entry[field], undefined, "deep sources and qualifications stay on demand");
  }
  assert.equal(timeline.filter(entry => entry.country === code && entry.year === 1845 && matches({ name: entry.title })).length, 1);
  const count = full[code].military.conflicts.length;
  assert.equal(countriesIndex[code].military.conflictCount, count);
  assert.equal(searchIndex.find(entry => entry.code === code).metrics.conflicts, count);
}
const raw = await read("data/raw/conflicts.json");
assert.ok(raw.FRA.some(entry => entry.name === "Battle of Tizi Ouzou"), "retain the original undated source import");
assert.ok(full.FRA.conflicts.some(entry => entry.name === "Batalla de Vinh"), "do not identify unrelated ambiguous imports");
console.log("tizi-ouzou-curation.test.js ok: dated African episode, local forces, lazy sources and retained uncertainties");
