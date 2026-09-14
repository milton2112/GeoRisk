import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { GATA_HALIFAX_CONFLICT_DETAIL_FIXES, GATA_HALIFAX_CONFLICT_RENAMES } from "../lib/conflict-curation-gata-halifax.js";
import { normalizeConflictKey, isProvisionalConflictHierarchy } from "../lib/conflict-cleaning.js";
import { resolveWikipediaConflictTitle } from "../lib/wikipedia-conflicts.js";

const read = async path => JSON.parse(await fs.readFile(new URL("../../" + path, import.meta.url), "utf8"));
const full = await read("data/countries_full.json");
const index = await read("data/conflicts_index.json");
const detailsIndex = await read("data/conflicts/details_index.json");
const generated = await read("data/conflict_details.generated.json");
const equivalent = (a, b) => normalizeConflictKey(a) === normalizeConflictKey(b);
const cases = [
  { name: "Batalla del cabo de Gata (1815)", old: "Batalla del cabo de Gata", year: 1815, codes: ["DZA", "ESP", "USA"], location: /Espa\u00f1a/, page: "Battle_off_Cape_Gata" },
  { name: "Batalla naval frente a Halifax (1782)", old: "Batalla naval de Halifax", year: 1782, codes: ["CAN", "GBR", "USA"], location: /Nueva Escocia/, page: "Battle_off_Halifax_(1782)" }
];
for (const item of cases) {
  assert.equal(GATA_HALIFAX_CONFLICT_RENAMES[item.old], item.name);
  assert.equal((await resolveWikipediaConflictTitle(item.name)).pageTitle, item.page);
  const fixes = GATA_HALIFAX_CONFLICT_DETAIL_FIXES[item.name];
  const assertDetail = detail => {
    assert.equal(detail.startYear, item.year);
    assert.equal(detail.endYear, item.year);
    assert.equal(detail.parent, detail.war);
    assert.equal(isProvisionalConflictHierarchy(detail), false);
    assert.match(detail.region, item.location);
    assert.equal(detail.sourceDispute, true);
    assert.equal(detail.dataConfidence, "parcial");
    assert.ok(detail.datePrecision && detail.curationNote);
    assert.deepEqual(detail.hierarchySources.map(source => source.url), fixes.hierarchySources.map(source => source.url));
    assert.equal(detail.participants.length, 2);
    assert.ok(detail.participants.every(side => side.members.length && !/actor registrado|oponente o fuerza local/i.test(side.side)));
    assert.ok(detail.chronology.length >= 2);
    assert.doesNotMatch(JSON.stringify(detail), /Conflicto regional de|fecha no consolidada/);
  };
  const indexed = index.filter(conflict => equivalent(conflict.name, item.name));
  assert.equal(indexed.length, 1);
  assert.deepEqual([...indexed[0].countries].sort(), item.codes);
  assert.equal(indexed[0].startYear, item.year);
  assert.equal(index.some(conflict => equivalent(conflict.name, item.old)), false);
  const refs = detailsIndex.conflicts.filter(conflict => equivalent(conflict.name, item.name));
  assert.equal(refs.length, 1);
  assertDetail(await read(refs[0].path));
  assertDetail(generated.conflicts[item.name]);
  for (const code of item.codes) {
    for (const entries of [full[code].conflicts, full[code].military.conflicts]) {
      const matches = entries.filter(conflict => equivalent(conflict.name, item.name));
      assert.equal(matches.length, 1, code + " debe contener una sola entrada canonica");
      assert.equal(entries.some(conflict => equivalent(conflict.name, item.old)), false);
      assertDetail(matches[0]);
    }
    const profile = await read(`data/countries/${code}.json`);
    const publicEntries = profile.metadata.publicProfile.conflictsSharded
      ? await read(`data/countries/conflicts/${code}.json`) : profile.military.conflicts;
    const publicMatches = publicEntries.filter(conflict => equivalent(conflict.name, item.name));
    assert.equal(publicMatches.length, 1);
    assert.equal(publicMatches[0].startYear, item.year);
    assert.ok(equivalent(publicMatches[0].parent, fixes.parent));
    assert.match(publicMatches[0].normalizedRegion, item.location);
    assert.equal(publicEntries.some(conflict => equivalent(conflict.name, item.old)), false);
    assert.equal(publicMatches[0].hierarchySources, undefined, "las fuentes profundas siguen bajo demanda");
  }
}
const gata = generated.conflicts[cases[0].name];
assert.equal(gata.treaties.length, 1);
assert.match(gata.curationNote, /no como bando/);
assert.ok(!gata.participants.some(side => side.members.some(name => equivalent(name, "Espana"))));
const halifax = generated.conflicts[cases[1].name];
assert.deepEqual(halifax.treaties, []);
assert.match(halifax.chronology[0].event, /28 de mayo/);
assert.match(halifax.chronology[1].event, /29 de mayo/);
assert.ok(!halifax.participants.some(side => side.members.some(name => equivalent(name, "Canada"))));
console.log("gata-halifax-curation.test.js ok");
