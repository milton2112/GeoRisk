import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { normalizeConflictKey, isProvisionalConflictHierarchy } from "../lib/conflict-cleaning.js";
import { resolveWikipediaConflictTitle } from "../lib/wikipedia-conflicts.js";

const read = async file => JSON.parse(await fs.readFile(new URL("../../" + file, import.meta.url), "utf8"));
const full = await read("data/countries_full.json");
const original = full.USA.conflicts.find(entry => /Steen'?s Mountain/.test(entry.name));
assert.ok(original, "preserve the imported Steens Mountain episode");
assert.equal(original.startYear, 1867, "the regimental record dates this encounter to 1867");
const name = "Batalla de Steens Mountain (1867)";
const oldName = "Batalla de Steen's Mountain";
const matches = entry => normalizeConflictKey(entry.name) === normalizeConflictKey(name);
function check(entry) {
  assert.ok(entry, "one dated episode must survive generation");
  assert.equal(entry.startYear, 1867);
  assert.equal(entry.endYear, 1867);
  assert.match(entry.datePrecision, /29 de enero de 1867.*registro regimental/);
  assert.equal(entry.parent, "Guerra Snake (1864-1868)");
  assert.equal(entry.war, entry.parent);
  assert.equal(entry.conflictType, "colonial");
  assert.equal(isProvisionalConflictHierarchy(entry), false);
  assert.match(entry.normalizedRegion, /Steens Mountain.*Oregon.*emplazamiento exacto no consolidado/);
  assert.equal(entry.active, false);
  assert.equal(entry.ongoing, false);
  assert.equal(entry.dataConfidence, "parcial");
  assert.equal(entry.hierarchyConfidence, "media");
  assert.doesNotMatch(JSON.stringify(entry), /Conflicto regional de|Actor registrado|Oponente o fuerza local/);
  assert.equal(entry.participants.length, 2);
  assert.deepEqual(entry.participants[0].members, ["Compania M del 1.er Regimiento de Caballeria de Estados Unidos"]);
  assert.match(entry.participants[0].casualties, /Sin balance consolidado.*no equivale a cero/);
  assert.match(entry.participants[1].side, /Paiutes.*identificacion enciclopedica/);
  assert.match(entry.participants[1].casualties, /Wainwright registra 60 muertos y 27 capturados.*parte militar.*no.*independiente/);
  assert.ok(entry.participants.every(side => !side.members.some(member => /Crook|Paulina|Paunina/.test(member))),
    "do not infer individual presence from the surrounding campaign");
  assert.match(entry.sourceDispute, /Stein's Mountain, I\. T\./);
  assert.match(entry.sourceDispute, /no se resuelve/);
  assert.match(entry.curationNote, /no se identifica.*enero.*Owyhee/);
  assert.match(entry.curationNote, /no se consultaron.*partes originales.*testimonios paiutes/i);
  assert.match(entry.curationNote, /no.*presencia personal.*Crook.*Paulina/i);
  assert.deepEqual(entry.treaties, []);
  assert.deepEqual(entry.hierarchySources.map(source => new URL(source.url).hostname),
    ["history.army.mil", "history.idaho.gov", "en.wikipedia.org"]);
}
check(original);
const { STEENS_MOUNTAIN_CONFLICT_RENAMES: renames } = await import("../lib/conflict-curation-steens-mountain.js");
for (const alias of [name, oldName, "Battle of Steen's Mountain"]) {
  if (alias !== name) assert.equal(renames[alias], name);
  assert.equal((await resolveWikipediaConflictTitle(alias)).pageTitle, "Battle_of_Steen's_Mountain",
    "use exact local aliases without remote discovery");
}
assert.equal(renames["Batalla de Steens Mountain (1860)"], undefined);
assert.equal(renames["Batalla de Kasumi"], undefined);
const generated = await read("data/conflict_details.generated.json");
check(generated.conflicts[name]);
assert.equal(generated.conflicts[oldName], undefined);
const detailsIndex = await read("data/conflicts/details_index.json");
const refs = detailsIndex.conflicts.filter(matches);
assert.equal(refs.length, 1);
check(await read(refs[0].path));
const index = await read("data/conflicts_index.json");
const indexed = index.filter(matches);
assert.equal(indexed.length, 1);
assert.deepEqual(indexed[0].countries, ["USA"]);
assert.equal(indexed[0].startYear, 1867);
assert.equal(index.some(entry => entry.name === oldName), false);
for (const entries of [full.USA.conflicts, full.USA.military.conflicts]) {
  assert.equal(entries.filter(matches).length, 1);
  check(entries.find(matches));
  assert.equal(entries.some(entry => entry.name === oldName), false);
}
const profile = await read("data/countries/USA.json");
const entries = profile.metadata.publicProfile.conflictsSharded
  ? await read("data/countries/conflicts/USA.json") : profile.military.conflicts;
const light = entries.filter(matches);
assert.equal(light.length, 1);
assert.equal(light[0].startYear, 1867);
assert.equal(light[0].parent, original.parent);
for (const field of ["participants", "hierarchySources", "curationNote", "sourceDispute"]) {
  assert.equal(light[0][field], undefined, "deep evidence stays on demand");
}
const timeline = await read("data/timeline_index.json");
assert.equal(timeline.filter(entry => entry.country === "USA" && entry.year === 1867 && matches({ name: entry.title })).length, 1);
const countriesIndex = await read("data/countries_index.json");
const searchIndex = await read("data/search_index.json");
assert.equal(countriesIndex.USA.military.conflictCount, full.USA.military.conflicts.length);
assert.equal(searchIndex.find(entry => entry.code === "USA").metrics.conflicts, full.USA.military.conflicts.length);
const raw = await read("data/raw/conflicts.json");
assert.ok(raw.USA.some(entry => entry.name === oldName), "retain the original undated source import");
assert.ok(full.USA.conflicts.some(entry => entry.name === "Batalla de Kasumi"), "preserve unrelated ambiguous imports");
console.log("steens-mountain-curation.test.js ok: dated record, attributed losses, qualified location and lazy evidence");
