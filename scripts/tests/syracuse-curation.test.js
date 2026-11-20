import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";
import { normalizeConflictKey, isProvisionalConflictHierarchy } from "../lib/conflict-cleaning.js";
import { buildConflictAuditReport } from "../lib/conflict-audit.js";
import {
  SYRACUSE_CONFLICT_DETAIL_FIXES,
  SYRACUSE_COUNTRY_CONFLICT_ADDITIONS,
  SYRACUSE_CONFLICT_RENAMES,
  SYRACUSE_CONFLICT_POST_MERGE_OVERRIDES
} from "../lib/conflict-curation-syracuse.js";

const NAME = "Acción naval de Cassard frente a Siracusa";
const PARENT = "Guerra de Sucesión Española";
const read = async file => JSON.parse(await fs.readFile(new URL("../../" + file, import.meta.url), "utf8"));
const equivalent = (a, b) => normalizeConflictKey(a) === normalizeConflictKey(b);

function check(entry) {
  assert.ok(entry, "the sourced Syracuse action must survive generation");
  assert.equal(entry.parent, PARENT);
  assert.equal(entry.war, PARENT);
  assert.equal(entry.type, "acción naval");
  assert.equal(entry.conflictType, "interestatal");
  assert.equal(entry.scale, "local");
  assert.equal(entry.startYear, undefined, "the source dispute does not support choosing a year");
  assert.equal(entry.endYear, undefined);
  assert.equal(entry.campaign, undefined, "do not add a campaign label without a stable source name");
  assert.equal(isProvisionalConflictHierarchy(entry), false);
  assert.equal(entry.normalizedRegion, "Frente a Siracusa, Sicilia, Italia");
  assert.equal(entry.active, false);
  assert.equal(entry.ongoing, false);
  assert.equal(entry.dataConfidence, "parcial");
  assert.match(entry.outcome, /HMS Pembroke.*HMS Falcon/);
  assert.match(entry.consequences, /llegó a Toulon.*no documentan consecuencias políticas/);
  assert.match(entry.sourceDispute, /1709.*1710/);
  assert.match(entry.curationNote, /no se añade una fecha/);
  assert.equal(entry.participants.length, 2);
  assert.deepEqual(entry.participants[0].members, ["Francia", "Reino de Francia", "Jacques Cassard"]);
  assert.deepEqual(entry.participants[1].members, ["Reino Unido", "Reino de Gran Bretaña", "HMS Pembroke", "HMS Falcon"]);
  assert.deepEqual(entry.treaties, []);
  assert.deepEqual(entry.hierarchySources.map(source => new URL(source.url).hostname), [
    "www.ac-sciences-et-lettres-montpellier.fr", "www.gutenberg.org"
  ]);
}

assert.equal(SYRACUSE_CONFLICT_DETAIL_FIXES[NAME].startYear, undefined);
assert.deepEqual(SYRACUSE_CONFLICT_POST_MERGE_OVERRIDES[NAME], ["campaign", "consequences"]);
assert.deepEqual(SYRACUSE_COUNTRY_CONFLICT_ADDITIONS["Reino Unido"], [NAME]);
assert.equal(SYRACUSE_CONFLICT_RENAMES["Batalla de Siracusa"], NAME);

const raw = await read("data/raw/conflicts.json");
assert.ok(raw.FRA.some(entry => entry.name === "Batalla de Siracusa"), "retain the original source import");

const full = await read("data/countries_full.json");
for (const code of ["FRA", "GBR"]) {
  for (const entries of [full[code].conflicts, full[code].military.conflicts]) {
    const matches = entries.filter(entry => equivalent(entry.name, NAME));
    assert.equal(matches.length, 1, `${code} should expose the action once`);
    check(matches[0]);
    assert.equal(entries.some(entry => equivalent(entry.name, "Batalla de Siracusa")), false);
  }
}

const generated = await read("data/conflict_details.generated.json");
check(Object.entries(generated.conflicts).find(([name]) => equivalent(name, NAME))?.[1]);
const detailIndex = await read("data/conflicts/details_index.json");
const refs = detailIndex.conflicts.filter(entry => equivalent(entry.name, NAME));
assert.equal(refs.length, 1);
check(await read(refs[0].path));

const index = await read("data/conflicts_index.json");
const indexed = index.filter(entry => equivalent(entry.name, NAME));
assert.equal(indexed.length, 0, "without a supported year, keep the action out of the dated conflict index");
assert.equal(index.some(entry => entry.name === "Batalla de Siracusa"), false);

const window = {};
vm.runInNewContext(await fs.readFile(new URL("../../app-conflict-aliases.js", import.meta.url), "utf8"), { window });
for (const alias of ["Batalla de Siracusa", "Battle of Syracuse"]) {
  assert.equal(window.GeoRiskConflictAliases.entries.find(([pattern]) => pattern.test(alias))?.[1], NAME);
}

const report = buildConflictAuditReport({ countries: full });
assert.equal(report.summary.provisional_parent, 5);
assert.equal(report.topAdvisories.some(entry => equivalent(entry.name, NAME)), false);

console.log("syracuse-curation.test.js ok: sourced hierarchy, cautious date handling and French/British profiles");
