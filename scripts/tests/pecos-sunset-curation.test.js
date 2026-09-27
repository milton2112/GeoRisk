import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { PECOS_SUNSET_CONFLICT_DETAIL_FIXES as fixes, PECOS_SUNSET_CONFLICT_RENAMES as renames } from "../lib/conflict-curation-pecos-sunset.js";
import { normalizeConflictKey, isProvisionalConflictHierarchy } from "../lib/conflict-cleaning.js";
import { CONFLICT_WIKIPEDIA_TITLE_OVERRIDES, resolveWikipediaConflictTitle } from "../lib/wikipedia-conflicts.js";

const read = async file => JSON.parse(await fs.readFile(new URL("../../" + file, import.meta.url), "utf8"));
const full = await read("data/countries_full.json");
const index = await read("data/conflicts_index.json");
const detailsIndex = await read("data/conflicts/details_index.json");
const generated = await read("data/conflict_details.generated.json");
const countryShard = await read("data/countries/conflicts/USA.json");
const timeline = await read("data/timeline_index.json");
const cases = [
  ["Batalla de Pecos River", "Combate del r\u00edo Pecos (1864)", 1864, "Guerras navajo", "Battle_of_Pecos_River"],
  ["Batalla de Sunset Pass", "Combate de Sunset Pass (1874)", 1874, "Guerras apaches", "Battle_of_Sunset_Pass"]
];

for (const [oldName, name, year, parent, pageTitle] of cases) {
  const fix = fixes[name];
  const matches = entry => normalizeConflictKey(entry.name) === normalizeConflictKey(name);
  assert.equal(renames[oldName], name);
  for (const label of new Set([oldName, name, name.replace("r\u00edo", "rio")])) {
    assert.equal(CONFLICT_WIKIPEDIA_TITLE_OVERRIDES[label], pageTitle, "alias local, sin consultas de red en la prueba");
    assert.equal((await resolveWikipediaConflictTitle(label)).pageTitle, pageTitle);
  }
  function check(detail) {
    assert.ok(detail, name);
    assert.equal(detail.startYear, year);
    assert.equal(detail.endYear, year);
    assert.equal(detail.parent, parent);
    assert.equal(detail.war, parent);
    assert.equal(detail.type, "combate");
    assert.equal(detail.conflictType, "colonial");
    assert.equal(detail.active, false);
    assert.equal(detail.dataConfidence, "parcial");
    assert.equal(detail.hierarchyConfidence, "alta");
    assert.equal(isProvisionalConflictHierarchy(detail), false);
    for (const field of ["normalizedRegion", "datePrecision", "hierarchySources", "participants", "chronology", "curationNote", "treaties"]) {
      assert.deepEqual(detail[field], fix[field], name + ": " + field);
    }
    assert.deepEqual(detail.treaties, []);
    assert.doesNotMatch(JSON.stringify(detail), /Conflicto regional de|fecha no consolidada|Actor registrado|Oponente o fuerza local/);
  }
  check(generated.conflicts[name]);
  const refs = detailsIndex.conflicts.filter(matches);
  assert.equal(refs.length, 1);
  check(await read(refs[0].path));
  assert.equal(index.filter(matches).length, 1);
  assert.deepEqual(index.find(matches).countries, ["USA"]);
  assert.equal(index.find(matches).startYear, year);
  for (const entries of [full.USA.conflicts, full.USA.military.conflicts]) {
    assert.equal(entries.filter(matches).length, 1);
    check(entries.find(matches));
  }
  for (const entries of [index, full.USA.conflicts, full.USA.military.conflicts, countryShard]) {
    assert.equal(entries.some(entry => entry.name === oldName), false);
  }
  assert.equal(countryShard.filter(matches).length, 1);
  const publicEntry = countryShard.find(matches);
  assert.equal(publicEntry.startYear, year);
  assert.equal(publicEntry.normalizedRegion, fix.normalizedRegion);
  assert.equal(publicEntry.hierarchySources, undefined, "fuentes profundas solo bajo demanda");
  assert.equal(publicEntry.curationNote, undefined, "notas profundas solo bajo demanda");
  assert.equal(timeline.filter(entry => entry.country === "USA" && entry.year === year && normalizeConflictKey(entry.title) === normalizeConflictKey(name)).length, 1, "evento fechable unico en el timeline: " + name);
}

const pecos = fixes[cases[0][1]];
assert.match(pecos.datePrecision, /^5 de enero de 1864/);
assert.match(pecos.participants[0].casualties, /2 apaches heridos leves/);
assert.match(pecos.participants[0].casualties, /congelaci\u00f3n/);
assert.match(pecos.participants[1].casualties, /40 muertos reportados/);
assert.match(pecos.participants[1].casualties, /25 muertos o heridos graves no localizados/);
assert.doesNotMatch(pecos.participants[1].casualties, /65 muertos|25 heridos confirmados/);
assert.match(pecos.curationNote, /16 de diciembre de 1863/);
const sunset = fixes[cases[1][1]];
assert.equal(sunset.datePrecision, "1 de noviembre de 1874");
assert.match(sunset.participants[0].casualties, /no se presenta ese caso como el total/);
assert.match(sunset.participants[1].casualties, /no equivale a cero/);
assert.match(sunset.curationNote, /novela Sunset Pass/);
assert.match(sunset.consequences, /12 de abril de 1875/);
console.log("pecos-sunset-curation.test.js ok: dates, source limits, aliases and lazy data consistency");
