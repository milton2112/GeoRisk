import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { NOTCH_PUNK_HILL_CONFLICT_DETAIL_FIXES, NOTCH_PUNK_HILL_CONFLICT_RENAMES } from "../lib/conflict-curation-notch-punk-hill.js";
import { normalizeConflictKey, isProvisionalConflictHierarchy } from "../lib/conflict-cleaning.js";
import { resolveWikipediaConflictTitle } from "../lib/wikipedia-conflicts.js";

const read = async file => JSON.parse(await fs.readFile(new URL("../../" + file, import.meta.url), "utf8"));
const full = await read("data/countries_full.json");
const index = await read("data/conflicts_index.json");
const detailsIndex = await read("data/conflicts/details_index.json");
const generated = await read("data/conflict_details.generated.json");
const equivalent = (a, b) => normalizeConflictKey(a) === normalizeConflictKey(b);
const cases = [
  { old: "Batalla de Notch", name: "Batalla del paso de Chungam-ni (Notch, 1950)", year: 1950,
    codes: ["KOR", "PRK", "USA"], region: /Corea del Sur/, date: "2 de agosto de 1950", page: "Battle_of_the_Notch" },
  { old: "Batalla de Punk Hill", name: "Combate de Punk Hill (1777)", year: 1777,
    codes: ["GBR", "USA"], region: /Nueva Jersey/, date: "8 de marzo de 1777", page: "Battle_of_Punk_Hill" }
];
for (const item of cases) {
  const fix = NOTCH_PUNK_HILL_CONFLICT_DETAIL_FIXES[item.name];
  assert.equal(NOTCH_PUNK_HILL_CONFLICT_RENAMES[item.old], item.name);
  for (const name of [item.old, item.name]) assert.equal((await resolveWikipediaConflictTitle(name)).pageTitle, item.page);
  const assertDetail = detail => {
    assert.ok(detail, item.name);
    assert.equal(detail.startYear, item.year);
    assert.equal(detail.endYear, item.year);
    assert.equal(detail.parent, fix.parent);
    assert.equal(detail.war, fix.parent);
    assert.equal(isProvisionalConflictHierarchy(detail), false);
    assert.match(detail.normalizedRegion, item.region);
    assert.equal(detail.datePrecision, item.date);
    assert.equal(detail.dataConfidence, "parcial");
    assert.deepEqual(detail.hierarchySources, fix.hierarchySources);
    assert.deepEqual(detail.participants, fix.participants);
    assert.equal(detail.chronology.length, 2);
    assert.deepEqual(detail.treaties, []);
    assert.doesNotMatch(JSON.stringify(detail), /Conflicto regional de|fecha no consolidada|Actor registrado|Oponente o fuerza local/);
  };
  assertDetail(generated.conflicts[item.name]);
  const indexed = index.filter(entry => equivalent(entry.name, item.name));
  assert.equal(indexed.length, 1);
  assert.deepEqual(indexed[0].countries.slice().sort(), item.codes);
  assert.equal(indexed[0].startYear, item.year);
  assert.equal(index.some(entry => equivalent(entry.name, item.old)), false);
  const refs = detailsIndex.conflicts.filter(entry => equivalent(entry.name, item.name));
  assert.equal(refs.length, 1);
  assertDetail(await read(refs[0].path));
  for (const code of item.codes) {
    for (const entries of [full[code].conflicts, full[code].military.conflicts]) {
      const matches = entries.filter(entry => equivalent(entry.name, item.name));
      assert.equal(matches.length, 1, `${code}: una sola entrada canonica`);
      assertDetail(matches[0]);
      assert.equal(entries.some(entry => equivalent(entry.name, item.old)), false);
    }
    const profile = await read(`data/countries/${code}.json`);
    const entries = profile.metadata.publicProfile.conflictsSharded
      ? await read(`data/countries/conflicts/${code}.json`) : profile.military.conflicts;
    const matches = entries.filter(entry => equivalent(entry.name, item.name));
    assert.equal(matches.length, 1);
    assert.equal(matches[0].startYear, item.year);
    assert.match(matches[0].normalizedRegion, item.region);
    assert.equal(matches[0].hierarchySources, undefined, "fuentes profundas solo bajo demanda");
    assert.equal(entries.some(entry => equivalent(entry.name, item.old)), false);
  }
}
const notch = generated.conflicts[cases[0].name];
assert.match(notch.participants[0].casualties, /90 bajas estadounidenses/);
assert.doesNotMatch(notch.participants[0].casualties, /90 muertos/);
assert.match(notch.curationNote, /Chindong-ni/);
const punk = generated.conflicts[cases[1].name];
assert.match(punk.participants[0].casualties, /no equivale a cero/);
assert.equal(NOTCH_PUNK_HILL_CONFLICT_RENAMES["Batalla de Chindong-ni"], undefined, "no fusionar combates distintos");
console.log("notch-punk-hill-curation.test.js ok");
