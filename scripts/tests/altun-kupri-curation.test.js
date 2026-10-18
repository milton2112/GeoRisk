import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";
import { normalizeConflictKey, isProvisionalConflictHierarchy } from "../lib/conflict-cleaning.js";
import { resolveWikipediaConflictTitle } from "../lib/wikipedia-conflicts.js";

const NAME = "Batalla de Altun Kupri (Pirde, 2017)";
const PARENT = "Conflicto kurdo-iraqu\u00ed de 2017";
const read = async path => JSON.parse(await fs.readFile(new URL("../../" + path, import.meta.url), "utf8"));
const index = await read("data/conflicts_index.json");
const equivalent = (a, b) => normalizeConflictKey(a) === normalizeConflictKey(b);
const indexed = index.filter(conflict => equivalent(conflict.name, NAME));
assert.equal(indexed.length, 1, "Altun Kupri/Pirde must be one dated, discoverable episode");
assert.deepEqual(indexed[0].countries, ["IRQ"], "training or alleged foreign support does not add another national belligerent");
assert.equal(indexed[0].startYear, 2017);
assert.deepEqual(indexed[0].types, ["civil"]);
assert.equal(index.some(conflict => equivalent(conflict.name, "Batalla de Pirde")), false);
assert.equal((await resolveWikipediaConflictTitle(NAME)).pageTitle, "Battle_of_Altun_Kupri_(2017)");

function assertDetail(detail, source = "Curadur\u00eda con Reuters y Associated Press; comunicado peshmerga para alias y fecha") {
  assert.equal(detail.startYear, 2017);
  assert.equal(detail.endYear, 2017);
  assert.equal(detail.parent, PARENT);
  assert.equal(detail.war, PARENT);
  assert.equal(isProvisionalConflictHierarchy(detail), false);
  assert.equal(detail.conflictType, "civil");
  assert.equal(detail.active, false);
  assert.equal(detail.ongoing, false);
  assert.equal(detail.dataConfidence, "parcial");
  assert.match(detail.datePrecision, /20 de octubre de 2017/);
  assert.match(detail.region, /Altun Kupri.*Kirkuk.*Irak/);
  assert.doesNotMatch(JSON.stringify(detail), /Conflicto regional de|fecha no consolidada|Actor registrado|Oponente o fuerza local/);
  assert.equal(detail.participants.length, 2);
  assert.ok(detail.participants.every(side => side.members.length && /no equivale a cero/.test(side.casualties)));
  assert.match(detail.consequences, /AP.*6 civiles muertos y 15 heridos.*no son un total/);
  assert.match(detail.curationNote, /fuente de parte/);
  assert.match(detail.curationNote, /no como beligerantes/);
  assert.equal(detail.chronology.length, 2);
  assert.ok(detail.chronology.every(event => event.year === 2017));
  assert.deepEqual(detail.treaties, []);
  assert.deepEqual(detail.hierarchySources.map(source => new URL(source.url).hostname), [
    "archive.cyprus-mail.com", "www.spokesman.com", "efile.fara.gov"
  ]);
  assert.equal(detail.source, source);
}

const full = await read("data/countries_full.json");
for (const entries of [full.IRQ.conflicts, full.IRQ.military.conflicts]) {
  const matches = entries.filter(conflict => equivalent(conflict.name, NAME));
  assert.equal(matches.length, 1);
  assert.equal(entries.some(conflict => equivalent(conflict.name, "Batalla de Pirde")), false);
  assertDetail(matches[0]);
}
const generated = await read("data/conflict_details.generated.json");
assertDetail(generated.conflicts[NAME], "Curaduria GeoRisk");
const detailIndex = await read("data/conflicts/details_index.json");
const refs = detailIndex.conflicts.filter(conflict => equivalent(conflict.name, NAME));
assert.equal(refs.length, 1);
assert.equal(refs[0].source, "Curaduria GeoRisk");
assertDetail(await read(refs[0].path), "Curaduria GeoRisk");
const profile = await read("data/countries/IRQ.json");
const entries = profile.metadata.publicProfile.conflictsSharded
  ? await read("data/countries/conflicts/IRQ.json") : profile.military.conflicts;
const publicMatches = entries.filter(conflict => equivalent(conflict.name, NAME));
assert.equal(publicMatches.length, 1);
assert.equal(publicMatches[0].startYear, 2017);
assert.equal(publicMatches[0].parent, PARENT);
assert.equal(publicMatches[0].hierarchySources, undefined, "deep evidence remains on demand");

const window = {};
vm.runInNewContext(await fs.readFile(new URL("../../app-conflict-aliases.js", import.meta.url), "utf8"), { window });
for (const name of ["Batalla de Pirde", "Battle of Pirde", "Battle of Altun Kupri (2017)"]) {
  assert.equal(window.GeoRiskConflictAliases.entries.find(([pattern]) => pattern.test(name))?.[1], NAME);
}
console.log("altun-kupri-curation.test.js ok: dated internal conflict, qualified civilian counts, aliases and lazy evidence consistency");
