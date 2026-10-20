import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { isProvisionalConflictHierarchy, normalizeConflictKey } from "../lib/conflict-cleaning.js";
import { buildConflictAuditReport } from "../lib/conflict-audit.js";
import { OCHAMCHIRA_CONFLICT_DETAIL_FIXES } from "../lib/conflict-curation-ochamchira.js";

const read = async file => JSON.parse(await fs.readFile(new URL("../../" + file, import.meta.url), "utf8"));
const name = "Batalla de Ochamchira";
const parent = "Guerra de Abjasia";
const matches = entry => normalizeConflictKey(entry?.name) === normalizeConflictKey(name);
const fix = OCHAMCHIRA_CONFLICT_DETAIL_FIXES[name];
const full = await read("data/countries_full.json");

function check(entry) {
  assert.ok(entry, "the Ochamchira record must survive generation");
  for (const field of [
    "startYear", "endYear", "datePrecision", "parent", "war", "campaign", "type", "conflictType",
    "scale", "normalizedRegion", "cause", "outcome", "consequences", "participants", "chronology",
    "hierarchySources", "sourceDispute", "curationNote", "dataConfidence", "treaties"
  ]) {
    assert.deepEqual(entry[field], fix[field], field + " survives full and lazy generation");
  }
  assert.equal(entry.startYear, 1992);
  assert.equal(entry.endYear, 1994, "winter 1993-94 is represented at annual precision");
  assert.equal(entry.parent, parent);
  assert.equal(entry.war, parent);
  assert.equal(entry.conflictType, "civil");
  assert.equal(entry.normalizedRegion, "Ochamchira, Abjasia, Georgia");
  assert.equal(isProvisionalConflictHierarchy(entry), false);
  assert.ok(entry.participants.every(side => side.casualties === undefined), "do not invent battle-level casualties");
  assert.match(entry.sourceDispute, /no una sola acción/);
  assert.deepEqual(entry.hierarchySources.map(source => new URL(source.url).hostname), ["www.hrw.org", "documents.un.org"]);
}

for (const entries of [full.GEO.conflicts, full.GEO.military.conflicts]) {
  assert.equal(entries.filter(matches).length, 1, "keep one Ochamchira record for Georgia");
  check(entries.find(matches));
}

const generated = await read("data/conflict_details.generated.json");
check(generated.conflicts[name]);
const detailsIndex = await read("data/conflicts/details_index.json");
const detailRefs = detailsIndex.conflicts.filter(matches);
assert.equal(detailRefs.length, 1);
check(await read(detailRefs[0].path));

const conflictsIndex = await read("data/conflicts_index.json");
const indexed = conflictsIndex.filter(matches);
assert.equal(indexed.length, 1);
assert.deepEqual(indexed[0].countries, ["GEO"]);
assert.equal(indexed[0].startYear, 1992);

const timeline = await read("data/timeline_index.json");
assert.equal(timeline.filter(entry => entry.country === "GEO" && entry.year === 1992 && matches({ name: entry.title })).length, 1);

const profile = await read("data/countries/GEO.json");
const lightConflicts = profile.metadata.publicProfile.conflictsSharded
  ? await read("data/countries/conflicts/GEO.json")
  : profile.military.conflicts;
assert.equal(lightConflicts.filter(matches).length, 1);
const light = lightConflicts.find(matches);
assert.equal(light.startYear, 1992);
assert.equal(light.parent, parent);
for (const field of ["participants", "hierarchySources", "curationNote", "sourceDispute"]) {
  assert.equal(light[field], undefined, "deep source evidence stays in the existing on-demand layer");
}

const countriesIndex = await read("data/countries_index.json");
const searchIndex = await read("data/search_index.json");
assert.equal(countriesIndex.GEO.military.conflictCount, full.GEO.military.conflicts.length);
assert.equal(searchIndex.find(entry => entry.code === "GEO").metrics.conflicts, full.GEO.military.conflicts.length);

const report = buildConflictAuditReport({ countries: full });
assert.equal(report.summary.provisional_parent, 8);
assert.equal(report.topAdvisories.some(entry => matches({ name: entry.name })), false);
console.log("ochamchira-curation.test.js ok: sourced regional fighting, Abkhazia hierarchy and lazy evidence");
