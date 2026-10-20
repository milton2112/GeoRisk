import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { isProvisionalConflictHierarchy } from "../lib/conflict-cleaning.js";
import { buildConflictAuditReport } from "../lib/conflict-audit.js";
import { curateConflictEntry } from "../lib/conflict-batch-curation.js";

const read = async file => JSON.parse(await fs.readFile(new URL("../../" + file, import.meta.url), "utf8"));
const name = "Batalla de Petaling";
const parent = "Revolución indonesia";

const omittedCampaign = curateConflictEntry({
  name: "Batalla sin campaña de prueba",
  type: "batalla",
  campaign: undefined
});
assert.equal(omittedCampaign.campaign, undefined, "explicitly omitted campaigns must not receive a generated placeholder");
const full = await read("data/countries_full.json");

function check(entry) {
  assert.ok(entry, "the sourced Petaling battle must survive generation");
  assert.equal(entry.startYear, 1946);
  assert.equal(entry.endYear, 1946);
  assert.match(entry.datePrecision, /14 de febrero de 1946/);
  assert.equal(entry.parent, parent);
  assert.equal(entry.war, parent);
  assert.equal(entry.campaign, undefined, "do not invent an unsupported campaign");
  assert.equal(entry.conflictType, "independencia");
  assert.equal(isProvisionalConflictHierarchy(entry), false);
  assert.equal(entry.hierarchyConfidence, "media");
  assert.equal(entry.dataConfidence, "parcial");
  assert.match(entry.curationNote, /no son partes contemporáneos/);
  assert.match(entry.sourceDispute, /varios contactos/);
  assert.doesNotMatch(JSON.stringify(entry), /Conflicto regional de|Campaña vinculada a|Actor registrado|Oponente o fuerza local/);
  assert.deepEqual(entry.participants[0].members, ["TRI de Belinyu", "TRI de Pangkalpinang"]);
  assert.deepEqual(entry.participants[1].members, ["South East Asia Command (SEAC)", "Netherlands Indies Civil Administration (NICA)"]);
  assert.ok(entry.participants.every(side => /Sin balance|No se agrega una cifra/.test(side.casualties)));
  assert.deepEqual(entry.hierarchySources.map(source => new URL(source.url).hostname),
    ["www.antaranews.com", "babelpos.bacakoran.co"]);
}

const fullEntry = full.IDN.conflicts.find(entry => entry.name === name);
check(fullEntry);
check(full.IDN.military.conflicts.find(entry => entry.name === name));

const generated = await read("data/conflict_details.generated.json");
check(generated.conflicts[name]);
const detailsIndex = await read("data/conflicts/details_index.json");
const detailRefs = detailsIndex.conflicts.filter(entry => entry.name === name);
assert.equal(detailRefs.length, 1);
check(await read(detailRefs[0].path));

const conflictsIndex = await read("data/conflicts_index.json");
const indexed = conflictsIndex.filter(entry => entry.name === name);
assert.equal(indexed.length, 1);
assert.deepEqual(indexed[0].countries, ["IDN"]);
assert.equal(indexed[0].startYear, 1946);

const timeline = await read("data/timeline_index.json");
assert.equal(timeline.filter(entry => entry.country === "IDN" && entry.year === 1946 && entry.title === name).length, 1);

const profile = await read("data/countries/IDN.json");
const lightConflicts = profile.metadata.publicProfile.conflictsSharded
  ? await read("data/countries/conflicts/IDN.json")
  : profile.military.conflicts;
const light = lightConflicts.find(entry => entry.name === name);
assert.ok(light);
assert.equal(light.startYear, 1946);
assert.equal(light.parent, parent);
for (const field of ["participants", "hierarchySources", "curationNote", "sourceDispute"]) {
  assert.equal(light[field], undefined, "deep source evidence stays in the existing on-demand layer");
}

const countriesIndex = await read("data/countries_index.json");
const searchIndex = await read("data/search_index.json");
assert.equal(countriesIndex.IDN.military.conflictCount, full.IDN.military.conflicts.length);
assert.equal(searchIndex.find(entry => entry.code === "IDN").metrics.conflicts, full.IDN.military.conflicts.length);

const raw = await read("data/raw/conflicts.json");
assert.ok(raw.IDN.some(entry => entry.name.toLowerCase() === name.toLowerCase()), "preserve the original import");
const report = buildConflictAuditReport({ countries: full });
assert.equal(report.summary.provisional_parent, 7);
assert.equal(report.topAdvisories.some(entry => entry.name === name), false);
console.log("petaling-curation.test.js ok: sourced 1946 date, Indonesia hierarchy and lazy evidence");
