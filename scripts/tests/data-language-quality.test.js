import assert from "node:assert/strict";
import fs from "node:fs";
import { curateConflictEntry } from "../lib/conflict-batch-curation.js";

const history = JSON.parse(fs.readFileSync("data/raw/history.json", "utf8"));
const politics = JSON.parse(fs.readFileSync("data/raw/politics_details.json", "utf8"));
const countries = JSON.parse(fs.readFileSync("data/countries_full.json", "utf8"));
const englishSignal = /\b(of|the|for|realm|british|cameroon|republic|federation|strategic|capability|commission)\b/i;
const mojibakeSignal = /Ã|Â|â€|�/;

function collectJsonFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const fullPath = `${directory}/${entry.name}`;
    if (entry.isDirectory()) {
      return collectJsonFiles(fullPath);
    }
    return entry.isFile() && entry.name.endsWith(".json") ? [fullPath] : [];
  });
}

const origins = Object.entries(history).map(([code, entry]) => ({ code, value: entry?.origin || "" }));
const organizations = Object.entries(politics).flatMap(([code, entry]) =>
  (entry?.organizations || []).map(organization => ({ code, value: organization?.name || "" }))
);
const languageIssues = [...origins, ...organizations].filter(item => englishSignal.test(item.value));

assert.deepEqual(languageIssues, [], `Quedan textos visibles en ingles: ${JSON.stringify(languageIssues.slice(0, 10))}`);
const servedLanguageIssues = Object.entries(countries).flatMap(([code, country]) => [
  { code, value: country.history?.origin || "" },
  ...(country.politics?.organizations || []).map(organization => ({ code, value: organization?.name || "" }))
]).filter(item => englishSignal.test(item.value));
assert.deepEqual(servedLanguageIssues, [], `Los datos servidos conservan textos en ingles: ${JSON.stringify(servedLanguageIssues.slice(0, 10))}`);
const generatedMojibakeFiles = collectJsonFiles("data")
  .filter(file => mojibakeSignal.test(fs.readFileSync(file, "utf8")));
assert.deepEqual(generatedMojibakeFiles, [], `Los JSON servidos no deben tener mojibake: ${JSON.stringify(generatedMojibakeFiles.slice(0, 10))}`);
const servedConflictNames = Object.values(countries).flatMap(country =>
  [...(country.military?.conflicts || []), ...(country.conflicts || [])]
    .map(conflict => typeof conflict === "string" ? conflict : conflict?.name)
    .filter(Boolean)
);
for (const staleName of [
  "Second Cambodia Civil",
  "Vietnam Counteroffensive Phase II",
  "Vietnam Counteroffensive Phase III",
  "Northern France Campana",
  "Batalla de Phase Line Bullet",
  "First Chad (FROLINAT) Rebellion"
]) {
  assert.ok(!servedConflictNames.includes(staleName), `Nombre de conflicto visible sin normalizar: ${staleName}`);
}
const normalizeRelation = value => String(value || "")
  .normalize("NFD")
  .replace(/\p{Diacritic}/gu, "")
  .toLowerCase()
  .trim();
const contradictoryRelations = Object.entries(countries).flatMap(([code, country]) => {
  const relations = country.politics?.relations || {};
  const allyKeys = new Set((relations.allies || []).map(normalizeRelation));
  return (relations.currentRivals || [])
    .filter(rival => allyKeys.has(normalizeRelation(rival)))
    .map(rival => ({ code, rival }));
});
assert.deepEqual(contradictoryRelations, [], `Un aliado no puede figurar a la vez como rival actual: ${JSON.stringify(contradictoryRelations.slice(0, 10))}`);

const misleadingPerfectScores = Object.entries(countries).filter(([, country]) => {
  const quality = country.metadata?.quality || {};
  const hasWeakSection = Object.values(quality.sectionStatus || {}).some(status => ["base", "mixed"].includes(status));
  return quality.score === 100 && (hasWeakSection || (quality.missingFields || []).length || (quality.estimatedFields || []).length);
});
assert.deepEqual(misleadingPerfectScores, [], "Una ficha con secciones debiles no debe mostrar 100/100");
assert.equal(history.BHR.origin, "Protectorado británico de Baréin");
assert.equal(history.CMR.origin, "Camerún francés");
assert.equal(history.GIN.origin, "Guinea Francesa");
assert.equal(history.GRC.origin, "Imperio otomano");
assert.equal(history.MWI.origin, "Nyasalandia");
assert.equal(history.NGA.origin, "Federación de Nigeria");
assert.equal(history.SVK.origin, "Checoslovaquia");
assert.equal(history.ZAF.origin, "Colonia del Cabo, Natal, Transvaal y Colonia del Río Orange");
assert.equal(history.SWZ.origin, "Suazilandia británica");

const staleKivu = curateConflictEntry({
  name: "Guerra de Kivu",
  startYear: 2004,
  endYear: 2015,
  region: "Asia central",
  normalizedRegion: "Asia central",
  curationBatch: "safe-structured-conflict-curation-2026-06"
}, { country: { name: "Republica Democratica del Congo", continent: "Africa" } });
assert.equal(staleKivu.parent, undefined, "Una guerra no debe recibir padre solo por coincidir en fechas");
assert.equal(staleKivu.normalizedRegion, "Africa central");
assert.equal(staleKivu.region, "Africa central");

const anaconda = curateConflictEntry({ name: "Operacion Anaconda", startYear: 2002, endYear: 2002 });
assert.equal(anaconda.parent, "Guerra de Afganistan");
assert.equal(anaconda.normalizedRegion, "Asia central");

const tet = curateConflictEntry({ name: "Ofensiva del Tet", startYear: 1968, endYear: 1968 });
assert.equal(tet.parent, "Guerra de Vietnam");
assert.equal(tet.normalizedRegion, "Sudeste asiatico");

const belgrano = curateConflictEntry({ name: "Hundimiento del ARA General Belgrano", startYear: 1982, endYear: 1982 });
assert.equal(belgrano.parent, "Guerra de las Malvinas");
assert.equal(belgrano.normalizedRegion, "Atlantico Sur");

const deception = curateConflictEntry({ name: "Incidente de la Isla Decepción", startYear: 1952, endYear: 1952 });
assert.equal(deception.parent, "Disputas australes");
assert.equal(deception.normalizedRegion, "Atlantico Sur y Antartida");

const uruguay = curateConflictEntry({ name: "Invasion brasileña de 1864", startYear: 1864, endYear: 1865 });
assert.equal(uruguay.parent, "Guerra del Uruguay");
assert.equal(uruguay.normalizedRegion, "America del Sur");

const battleford = curateConflictEntry(
  {
    name: "Sitio de Battleford",
    startYear: 1885,
    endYear: 1885,
    parent: "Guerra del Pacifico",
    war: "Guerra del Pacifico",
    region: "America del Sur",
    normalizedRegion: "America del Sur",
    curationBatch: "safe-structured-conflict-curation-2026-06"
  },
  { country: { name: "Canada", continent: "America" } }
);
assert.equal(battleford.parent, "Rebelion del Noroeste");
assert.equal(battleford.normalizedRegion, "Canada");

const staleIraq = curateConflictEntry({
  name: "Guerra de Irak",
  parent: "Guerra del Golfo",
  war: "Guerra del Golfo",
  campaign: "Campanas del Golfo Persico",
  region: "Golfo Persico",
  normalizedRegion: "Golfo Persico",
  curationBatch: "safe-structured-conflict-curation-2026-06"
});
assert.equal(staleIraq.parent, undefined);
assert.equal(staleIraq.normalizedRegion, "Oriente Medio");

const deliberateForce = curateConflictEntry({
  name: "Operacion Deliberate Force",
  type: "batalla",
  parent: "Conflicto regional de Europe",
  war: "Conflicto regional de Europe",
  campaign: "Campana vinculada a Conflicto regional de Europe",
  region: "Europe",
  normalizedRegion: "Europe",
  curationBatch: "safe-structured-conflict-curation-2026-06"
}, { country: { name: "Belgica", continent: "Europe" } });
assert.equal(deliberateForce.parent, "Guerra de Bosnia");
assert.equal(deliberateForce.normalizedRegion, "Balcanes");

console.log("data-language-quality.test.js ok");
