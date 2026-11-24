import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";
import { normalizeConflictKey, isProvisionalConflictHierarchy } from "../lib/conflict-cleaning.js";
import { buildConflictAuditReport } from "../lib/conflict-audit.js";
import {
  SIRANAYA_1904_CONFLICT_DETAIL_FIXES,
  SIRANAYA_1904_COUNTRY_CONFLICT_ADDITIONS,
  SIRANAYA_1904_CONFLICT_RENAMES
} from "../lib/conflict-curation-siranaya-1904.js";

const NAME = "Batalla de Siranaya (1904)";
const WAR = "Rebelión moro";
const read = async file => JSON.parse(await fs.readFile(new URL(`../../${file}`, import.meta.url), "utf8"));
const equivalent = (a, b) => normalizeConflictKey(a) === normalizeConflictKey(b);

function check(detail) {
  assert.ok(detail, "the sourced Siranaya action must survive generation");
  assert.equal(detail.parent, WAR);
  assert.equal(detail.war, WAR);
  assert.equal(detail.campaign, undefined, "no formal campaign name is established by the sources");
  assert.equal(detail.startYear, 1904);
  assert.equal(detail.endYear, 1904);
  assert.equal(detail.datePrecision, SIRANAYA_1904_CONFLICT_DETAIL_FIXES[NAME].datePrecision);
  assert.equal(detail.type, "batalla");
  assert.equal(detail.conflictType, "colonial");
  assert.equal(detail.scale, "local");
  assert.equal(isProvisionalConflictHierarchy(detail), false);
  assert.equal(detail.normalizedRegion, "Siranaya (también Seranaya), valle del Río Grande de Mindanao, Cotabato, Filipinas");
  assert.equal(detail.startDay, undefined);
  assert.equal(detail.endDay, undefined);
  assert.match(detail.outcome, /bombardeó el fuerte.*no permite fijar el día/);
  assert.match(detail.consequences, /continuaron en Mindanao durante 1905/);
  assert.match(detail.sourceDispute, /Siranaya o Seranaya.*no fija qué día/);
  assert.equal(detail.participants.length, 2);
  assert.deepEqual(detail.participants[0].members, ["Estados Unidos", "Leonard Wood"]);
  assert.deepEqual(detail.participants[1].members, ["Datu Ali", "Defensores del fuerte de Seranaya"]);
  assert.deepEqual(detail.treaties, []);
  assert.deepEqual(detail.hierarchySources.map(source => new URL(source.url).hostname), [
    "www.biodiversitylibrary.org", "history.army.mil", "www.1-22infantry.org"
  ]);
}

assert.equal(SIRANAYA_1904_CONFLICT_DETAIL_FIXES[NAME].startYear, 1904);
assert.equal(SIRANAYA_1904_CONFLICT_RENAMES["Batalla de Siranaya"], NAME);
assert.equal(SIRANAYA_1904_CONFLICT_RENAMES["Batalla de SIranaya"], NAME);
assert.equal(SIRANAYA_1904_CONFLICT_RENAMES["Battle of Siranaya"], NAME);
assert.deepEqual(SIRANAYA_1904_COUNTRY_CONFLICT_ADDITIONS["Filipinas"], [NAME]);

const raw = await read("data/raw/conflicts.json");
assert.ok(raw.USA.some(entry => entry.name === "Batalla de Siranaya"), "preserve the original import");

const full = await read("data/countries_full.json");
for (const code of ["USA", "PHL"]) {
  for (const entries of [full[code].conflicts, full[code].military.conflicts]) {
    const matches = entries.filter(entry => equivalent(entry.name, NAME));
    assert.equal(matches.length, 1, `${code} should expose the action once`);
    check(matches[0]);
    assert.equal(entries.some(entry => equivalent(entry.name, "Batalla de Siranaya")), false);
  }
  const profile = await read(`data/countries/${code}.json`);
  const entries = profile.metadata.publicProfile.conflictsSharded
    ? await read(`data/countries/conflicts/${code}.json`) : profile.military.conflicts;
  assert.equal(entries.filter(entry => equivalent(entry.name, NAME)).length, 1);
  assert.equal(entries.find(entry => equivalent(entry.name, NAME)).hierarchySources, undefined, "source detail stays deferred");
}

const generated = await read("data/conflict_details.generated.json");
check(Object.entries(generated.conflicts).find(([name]) => equivalent(name, NAME))?.[1]);
const detailIndex = await read("data/conflicts/details_index.json");
const refs = detailIndex.conflicts.filter(entry => equivalent(entry.name, NAME));
assert.equal(refs.length, 1);
check(await read(refs[0].path));

const index = await read("data/conflicts_index.json");
const indexed = index.filter(entry => equivalent(entry.name, NAME));
assert.equal(indexed.length, 1);
assert.deepEqual(indexed[0].countries.slice().sort(), ["PHL", "USA"]);
assert.equal(indexed[0].startYear, 1904);
assert.equal(index.some(entry => equivalent(entry.name, "Batalla de Siranaya")), false);

const window = {};
vm.runInNewContext(await fs.readFile(new URL("../../app-conflict-aliases.js", import.meta.url), "utf8"), { window });
for (const alias of ["Batalla de Siranaya", "Battle of Siranaya"]) {
  assert.equal(window.GeoRiskConflictAliases.entries.find(([pattern]) => pattern.test(alias))?.[1], NAME);
}

const report = buildConflictAuditReport({ countries: full });
assert.equal(report.summary.provisional_parent, 3);
assert.equal(report.topAdvisories.some(entry => equivalent(entry.name, NAME)), false);

console.log("siranaya-curation.test.js ok: sourced 1904 action, Moro hierarchy, historical-territory profile and cautious date precision");
