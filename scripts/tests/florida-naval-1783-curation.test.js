import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";
import { normalizeConflictKey, isProvisionalConflictHierarchy } from "../lib/conflict-cleaning.js";
import { buildConflictAuditReport } from "../lib/conflict-audit.js";
import {
  FLORIDA_NAVAL_1783_CONFLICT_DETAIL_FIXES,
  FLORIDA_NAVAL_1783_CONFLICT_POST_MERGE_OVERRIDES,
  FLORIDA_NAVAL_1783_CONFLICT_RENAMES
} from "../lib/conflict-curation-florida-naval-1783.js";

const NAME = "Acción naval del Alliance y el Sybil (10 de marzo de 1783)";
const PARENT = "Guerra de Independencia de Estados Unidos";
const equivalent = (a, b) => normalizeConflictKey(a) === normalizeConflictKey(b);
const read = async file => JSON.parse(await fs.readFile(new URL(`../../${file}`, import.meta.url), "utf8"));

function check(detail) {
  assert.ok(detail, "the sourced Florida naval action must survive generation");
  assert.equal(detail.parent, PARENT);
  assert.equal(detail.war, PARENT);
  assert.equal(detail.startYear, 1783);
  assert.equal(detail.endYear, 1783);
  assert.equal(detail.startDay, "1783-03-10");
  assert.equal(detail.endDay, "1783-03-10");
  assert.equal(detail.datePrecision, FLORIDA_NAVAL_1783_CONFLICT_DETAIL_FIXES[NAME].datePrecision);
  assert.equal(detail.type, "combate naval");
  assert.equal(detail.conflictType, "independencia");
  assert.equal(detail.scale, "regional");
  assert.equal(detail.campaign, undefined, "do not infer a formal campaign");
  assert.equal(isProvisionalConflictHierarchy(detail), false);
  assert.match(detail.region, /costa este de Florida/);
  assert.match(detail.cause, /Alliance y Duc de Lauzun.*La Habana.*Filadelfia/);
  assert.match(detail.outcome, /Sybil.*retiró.*continuaron su viaje/);
  assert.match(detail.sourceDispute, /Cape Canaveral.*más de 140 millas/);
  assert.match(detail.sourceDispute, /no se consolidan/);
  assert.match(detail.consequences, /Filadelfia.*Newport/);
  for (const field of ["participants", "hierarchySources", "sourceDispute", "chronology"]) {
    assert.deepEqual(detail[field], FLORIDA_NAVAL_1783_CONFLICT_DETAIL_FIXES[NAME][field], field);
  }
  assert.equal(detail.participants.length, 2);
  assert.deepEqual(detail.participants[0].members, ["Alliance", "Duc de Lauzun"]);
  assert.deepEqual(detail.participants[1].members, ["Sybil", "Alarm", "Tobago"]);
  assert.match(detail.participants[1].casualties, /2 muertos y 6 heridos.*37 muertos y 40 heridos/);
  assert.deepEqual(detail.treaties, []);
  assert.deepEqual(detail.hierarchySources.map(source => new URL(source.url).hostname), [
    "apps.flheritage.com", "myfloridahistory.org", "allthingsliberty.com"
  ]);
}

assert.equal(FLORIDA_NAVAL_1783_CONFLICT_DETAIL_FIXES[NAME].startDay, "1783-03-10");
assert.deepEqual(FLORIDA_NAVAL_1783_CONFLICT_POST_MERGE_OVERRIDES[NAME], ["campaign"]);
assert.equal(FLORIDA_NAVAL_1783_CONFLICT_RENAMES["combat off the coast of Florida"], NAME);
assert.equal(FLORIDA_NAVAL_1783_CONFLICT_RENAMES["Combate frente a la costa de Florida"], NAME);
assert.equal(FLORIDA_NAVAL_1783_CONFLICT_RENAMES["Combat off the coast of Florida"], NAME);

const raw = await read("data/raw/conflicts.json");
assert.ok(raw.USA.some(entry => entry.name === "combat off the coast of Florida"), "preserve the original import");

const full = await read("data/countries_full.json");
for (const code of ["USA", "GBR"]) {
  for (const entries of [full[code].conflicts, full[code].military.conflicts]) {
    const matches = entries.filter(entry => equivalent(entry.name, NAME));
    assert.equal(matches.length, 1, code);
    check(matches[0]);
    assert.equal(entries.some(entry => equivalent(entry.name, "Combate frente a la costa de Florida")), false);
  }
  const profile = await read(`data/countries/${code}.json`);
  const entries = profile.metadata.publicProfile.conflictsSharded
    ? await read(`data/countries/conflicts/${code}.json`)
    : profile.military.conflicts;
  assert.equal(entries.filter(entry => equivalent(entry.name, NAME)).length, 1);
  assert.equal(entries.find(entry => equivalent(entry.name, NAME)).hierarchySources, undefined,
    "deep source evidence stays deferred");
}

const generated = await read("data/conflict_details.generated.json");
check(Object.entries(generated.conflicts).find(([name]) => equivalent(name, NAME))?.[1]);
const detailsIndex = await read("data/conflicts/details_index.json");
const refs = detailsIndex.conflicts.filter(entry => equivalent(entry.name, NAME));
assert.equal(refs.length, 1);
check(await read(refs[0].path));

const conflictsIndex = await read("data/conflicts_index.json");
const indexed = conflictsIndex.filter(entry => equivalent(entry.name, NAME));
assert.equal(indexed.length, 1);
assert.deepEqual(indexed[0].countries.slice().sort(), ["GBR", "USA"]);
assert.equal(indexed[0].startYear, 1783);
assert.equal(indexed[0].endYear, 1783);

const timeline = await read("data/timeline_index.json");
for (const code of ["USA", "GBR"]) {
  assert.equal(timeline.filter(entry => entry.country === code && entry.year === 1783 && entry.title === NAME).length, 1);
}

const window = {};
vm.runInNewContext(await fs.readFile(new URL("../../app-conflict-aliases.js", import.meta.url), "utf8"), { window });
for (const alias of ["Combate frente a la costa de Florida", "Combat off the coast of Florida", "Alliance-Sybil Engagement", "Combat de l'Alliance et de la Sybil"]) {
  assert.equal(window.GeoRiskConflictAliases.entries.find(([pattern]) => pattern.test(alias))?.[1], NAME);
}

const report = buildConflictAuditReport({ countries: full });
assert.equal(report.summary.provisional_parent, 2);
assert.equal(report.topAdvisories.some(entry => equivalent(entry.name, NAME)), false);
console.log("florida-naval-1783-curation.test.js ok: dated Alliance-Sybil action with contested location and casualty sources");
