import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { normalizeConflictKey } from "../lib/conflict-cleaning.js";
import { KRAMATORSK_2022_CONFLICT_DETAIL_FIXES, KRAMATORSK_2022_CONFLICT_RENAMES } from "../lib/conflict-curation-kramatorsk-2022.js";
import { resolveWikipediaConflictTitle } from "../lib/wikipedia-conflicts.js";

const read = async file => JSON.parse(await fs.readFile(new URL("../../" + file, import.meta.url), "utf8"));
const name = "Ataque a la estaci\u00f3n de Kramatorsk (2022)";
const oldName = "Bombardeo de la estaci\u00f3n de tren de Kramatorsk";
const matches = entry => normalizeConflictKey(entry.name) === normalizeConflictKey(name);
const full = await read("data/countries_full.json");
const fix = KRAMATORSK_2022_CONFLICT_DETAIL_FIXES[name];
function checkSources(entry) {
  for (const field of ["hierarchySources", "participants", "chronology", "sourceDispute", "curationNote", "treaties"]) {
    assert.deepEqual(entry[field], fix[field], field + " is retained in full/lazy detail");
  }
  assert.equal(entry.hierarchySources.length, 2);
  assert.match(entry.hierarchySources[0].url, /^https:\/\/ukraine\.un\.org\//);
  assert.match(entry.hierarchySources[1].url, /^https:\/\/www\.hrw\.org\//);
  assert.match(entry.participants[0].side, /atribuci\u00f3n de HRW\/SITU/);
  assert.match(entry.participants[1].side, /^Civiles en evacuaci\u00f3n/);
  assert.match(entry.participants[1].casualties, /60 civiles muertos y 111 heridos/);
  assert.match(entry.participants[1].casualties, /al menos 58 civiles muertos y m\u00e1s de 100 heridos/);
  assert.match(entry.participants[1].casualties, /no cifras que deban sumarse/);
  assert.match(entry.curationNote, /2023/);
  assert.deepEqual(entry.treaties, []);
  assert.doesNotMatch(JSON.stringify(entry), /fecha no consolidada|Actor registrado|Oponente o fuerza local/);
}
for (const alias of [name, oldName, "Bombardeo de la estacion de tren de Kramatorsk", "Kramatorsk railway station attack"]) {
  if (alias !== name) assert.equal(KRAMATORSK_2022_CONFLICT_RENAMES[alias], name);
  assert.equal((await resolveWikipediaConflictTitle(alias)).pageTitle, "Kramatorsk_railway_station_attack", "local alias, no remote search");
}
const generated = await read("data/conflict_details.generated.json");
checkSources(generated.conflicts[name]);
assert.equal(generated.conflicts[oldName], undefined);
const detailsIndex = await read("data/conflicts/details_index.json");
const refs = detailsIndex.conflicts.filter(matches);
assert.equal(refs.length, 1);
checkSources(await read(refs[0].path));
const index = await read("data/conflicts_index.json");
const indexed = index.filter(matches);
assert.equal(indexed.length, 1);
assert.equal(indexed[0].startYear, 2022);
assert.deepEqual(indexed[0].countries.slice().sort(), ["RUS", "UKR"]);
assert.equal(index.some(entry => entry.name === oldName), false);
const timeline = await read("data/timeline_index.json");
for (const code of ["RUS", "UKR"]) {
  for (const entries of [full[code].conflicts, full[code].military.conflicts]) {
    assert.equal(entries.filter(matches).length, 1, code + ": unique dated station attack");
    const entry = entries.find(matches);
    assert.equal(entry.startYear, 2022);
    assert.equal(entry.endYear, 2022);
    assert.equal(entry.datePrecision, "8 de abril de 2022");
    assert.equal(entry.parent, "Invasi\u00f3n rusa de Ucrania de 2022");
    assert.equal(entry.war, entry.parent);
    assert.equal(entry.type, "bombardeo");
    assert.equal(entry.active, false, "a completed attack does not mark its parent war as closed");
    assert.equal(entry.dataConfidence, "parcial");
    assert.match(entry.normalizedRegion, /Donetsk, Ucrania/);
    assert.equal(entries.some(item => item.name === oldName), false);
    checkSources(entry);
  }
  const profile = await read(`data/countries/${code}.json`);
  const entries = profile.metadata.publicProfile.conflictsSharded
    ? await read(`data/countries/conflicts/${code}.json`) : profile.military.conflicts;
  assert.equal(entries.filter(matches).length, 1);
  const entry = entries.find(matches);
  assert.equal(entry.startYear, 2022);
  assert.equal(entry.normalizedRegion, fix.normalizedRegion);
  for (const field of ["hierarchySources", "participants", "curationNote", "sourceDispute"]) {
    assert.equal(entry[field], undefined, "deep content stays out of the country profile");
  }
  assert.equal(timeline.filter(entry => entry.country === code && entry.year === 2022 && normalizeConflictKey(entry.title) === normalizeConflictKey(name)).length, 1);
}
console.log("kramatorsk-curation.test.js ok: date, country links, attributed civilian counts and lazy consistency");
