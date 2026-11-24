import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";
import { normalizeConflictKey, isProvisionalConflictHierarchy } from "../lib/conflict-cleaning.js";
import { buildConflictAuditReport } from "../lib/conflict-audit.js";
import {
  KASUMI_CONFLICT_DETAIL_FIXES,
  KASUMI_COUNTRY_CONFLICT_ADDITIONS,
  KASUMI_CONFLICT_RENAMES
} from "../lib/conflict-curation-kasumi-1945.js";

const NAME = "Acciones navales frente a Kasumi (1945)";
const PARENT = "Segunda Guerra Mundial";
const read = async file => JSON.parse(await fs.readFile(new URL("../../" + file, import.meta.url), "utf8"));
const equivalent = (a, b) => normalizeConflictKey(a) === normalizeConflictKey(b);

function check(entry) {
  assert.ok(entry, "the sourced Kasumi actions must survive generation");
  assert.equal(entry.startYear, 1945);
  assert.equal(entry.endYear, 1945);
  assert.match(entry.datePrecision, /14 de agosto de 1945/);
  assert.equal(entry.parent, PARENT);
  assert.equal(entry.war, PARENT);
  assert.equal(entry.campaign, "Operaciones submarinas aliadas en el mar de Japón (1945)");
  assert.equal(entry.type, "acción naval");
  assert.equal(entry.conflictType, "interestatal");
  assert.equal(entry.scale, "local");
  assert.equal(isProvisionalConflictHierarchy(entry), false);
  assert.equal(entry.region, "Frente a Kasumi Ko, costa occidental de Honshu, Japón");
  assert.equal(entry.active, false);
  assert.equal(entry.ongoing, false);
  assert.equal(entry.dataConfidence, "parcial");
  assert.match(entry.outcome, /CD-47.*CD-13/);
  assert.match(entry.outcome, /mercante no tuvo éxito/);
  assert.match(entry.sourceDispute, /Kasumi Ko.*Maizuru/);
  assert.match(entry.curationNote, /campaña indicada es descriptiva/);
  assert.equal(entry.participants.length, 2);
  assert.deepEqual(entry.participants[0].members, ["Estados Unidos", "USS Torsk"]);
  assert.deepEqual(entry.participants[1].members, ["Japón", "CD-47", "CD-13"]);
  assert.match(entry.participants[1].casualties, /28.*CD-13/);
  assert.equal(entry.chronology.length, 2);
  assert.ok(entry.chronology.every(event => event.year === 1945));
  assert.deepEqual(entry.treaties, []);
  assert.deepEqual(entry.hierarchySources.map(source => new URL(source.url).hostname), [
    "www.history.navy.mil", "www.history.navy.mil"
  ]);
}

assert.equal(KASUMI_CONFLICT_DETAIL_FIXES[NAME].startYear, 1945);
assert.deepEqual(KASUMI_COUNTRY_CONFLICT_ADDITIONS["Japón"], [NAME]);
for (const alias of ["Batalla de Kasumi", "Battle of Kasumi"]) {
  assert.equal(KASUMI_CONFLICT_RENAMES[alias], NAME);
}

const raw = await read("data/raw/conflicts.json");
assert.ok(raw.USA.some(entry => entry.name === "Battle of Kasumi"), "retain the original source import");

const full = await read("data/countries_full.json");
for (const code of ["USA", "JPN"]) {
  for (const entries of [full[code].conflicts, full[code].military.conflicts]) {
    const matches = entries.filter(entry => equivalent(entry.name, NAME));
    assert.equal(matches.length, 1, `${code} should expose the action once`);
    check(matches[0]);
    assert.equal(entries.some(entry => equivalent(entry.name, "Batalla de Kasumi")), false);
  }
}

const generated = await read("data/conflict_details.generated.json");
check(generated.conflicts[NAME]);
const detailIndex = await read("data/conflicts/details_index.json");
const refs = detailIndex.conflicts.filter(entry => equivalent(entry.name, NAME));
assert.equal(refs.length, 1);
check(await read(refs[0].path));

const index = await read("data/conflicts_index.json");
const indexed = index.filter(entry => equivalent(entry.name, NAME));
assert.equal(indexed.length, 1);
assert.deepEqual(indexed[0].countries.slice().sort(), ["JPN", "USA"]);
assert.equal(indexed[0].startYear, 1945);
assert.equal(index.some(entry => entry.name === "Batalla de Kasumi"), false);

const timeline = await read("data/timeline_index.json");
const countriesIndex = await read("data/countries_index.json");
const searchIndex = await read("data/search_index.json");
for (const code of ["USA", "JPN"]) {
  assert.equal(timeline.filter(entry => entry.country === code && entry.year === 1945 && equivalent(entry.title, NAME)).length, 1);
  const conflictCount = full[code].military.conflicts.length;
  assert.equal(countriesIndex[code].military.conflictCount, conflictCount);
  assert.equal(searchIndex.find(entry => entry.code === code).metrics.conflicts, conflictCount);
  const profile = await read(`data/countries/${code}.json`);
  const entries = profile.metadata.publicProfile.conflictsSharded
    ? await read(`data/countries/conflicts/${code}.json`) : profile.military.conflicts;
  const light = entries.filter(entry => equivalent(entry.name, NAME));
  assert.equal(light.length, 1);
  assert.equal(light[0].startYear, 1945);
  assert.equal(light[0].parent, PARENT);
  for (const field of ["participants", "hierarchySources", "curationNote", "sourceDispute"]) {
    assert.equal(light[0][field], undefined, "deep evidence stays deferred");
  }
}

const window = {};
vm.runInNewContext(await fs.readFile(new URL("../../app-conflict-aliases.js", import.meta.url), "utf8"), { window });
for (const alias of ["Batalla de Kasumi", "Battle of Kasumi"]) {
  assert.equal(window.GeoRiskConflictAliases.entries.find(([pattern]) => pattern.test(alias))?.[1], NAME);
}

const report = buildConflictAuditReport({ countries: full });
assert.equal(report.summary.provisional_parent, 4);
assert.equal(report.topAdvisories.some(entry => equivalent(entry.name, NAME)), false);

console.log("kasumi-curation.test.js ok: dated submarine actions, source limits, Japan profile and deferred evidence");
