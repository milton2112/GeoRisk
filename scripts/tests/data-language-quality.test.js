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
const normalizeDataLabel = value => String(value || "")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .trim();
const historicalLabelsInPoliticalSystems = new Set([
  "legal y pacifica",
  "independencia",
  "union",
  "disolucion de otro estado",
  "revolucion",
  "guerra civil",
  "tratado internacional"
]);
const servedPoliticalSystemIssues = Object.entries(countries)
  .filter(([, country]) => historicalLabelsInPoliticalSystems.has(normalizeDataLabel(country.politics?.system)))
  .map(([code, country]) => ({ code, system: country.politics?.system }));
assert.deepEqual(servedPoliticalSystemIssues, [], `El top de sistemas no debe mezclar tipos historicos: ${JSON.stringify(servedPoliticalSystemIssues.slice(0, 10))}`);
const servedOrganizationDisplays = Object.values(countries).flatMap(country =>
  (country.politics?.organizations || []).map(organization =>
    organization?.abbreviation ? `${organization.name} (${organization.abbreviation})` : organization?.name || ""
  )
);
for (const staleLabel of [
  "ABCANZ Armies",
  "Air Force Interoperability Consejo",
  "ASEAN Regional Forum",
  "Combined Communications-Electronics Board",
  "Multinational Joint Task Force",
  "Commonwealth",
  "Francofonia",
  "Tratado Antartico"
]) {
  assert.ok(
    !servedOrganizationDisplays.some(label => label.toLocaleLowerCase("es").includes(staleLabel.toLocaleLowerCase("es"))),
    `Etiqueta visible de top sin normalizar: ${staleLabel}`
  );
}
const canonicalOrganizationAbbreviations = new Map([
  ["organizacion de las naciones unidas", "ONU"],
  ["organizacion de los estados americanos", "OEA"],
  ["organizacion de paises exportadores de petroleo", "OPEP"],
  ["organizacion mundial de aduanas", "OMA"],
  ["fondo monetario internacional", "FMI"],
  ["union africana", "UA"],
  ["union europea", "UE"],
  ["organizacion mundial de la salud", "OMS"],
  ["organizacion mundial del comercio", "OMC"],
  ["banco internacional de reconstruccion y fomento", "BIRF"],
  ["union internacional de telecomunicaciones", "UIT"],
  ["organizacion meteorologica mundial", "OMM"],
  ["organizacion para la prohibicion de armas quimicas", "OPAQ"],
  ["organismo multilateral de garantia de inversiones", "OMGI"],
  ["tratado de no proliferacion nuclear", "TNP"],
  ["asociacion internacional de fomento", "AIF"],
  ["centro internacional de arreglo de diferencias relativas a inversiones", "CIADI"],
  ["organizacion hidrografica internacional", "OHI"],
  ["organizacion internacional de proteccion civil", "OIPC"],
  ["organizacion para la cooperacion islamica", "OCI"],
  ["banco asiatico de desarrollo", "BAsD"],
  ["grupo de abastecedores nucleares", "GSN"],
  ["consejo de europa", "CdE"],
  ["organizacion para la cooperacion y el desarrollo economico", "OCDE"],
  ["regimen de control de tecnologia misilistica", "RCTM"],
  ["otan", "OTAN"]
]);
const organizationAbbreviationIssues = Object.entries(countries).flatMap(([code, country]) =>
  (country.politics?.organizations || [])
    .filter(organization => {
      const expected = canonicalOrganizationAbbreviations.get(normalizeDataLabel(organization?.name));
      return expected && organization?.abbreviation !== expected;
    })
    .map(organization => ({
      code,
      name: organization.name,
      abbreviation: organization.abbreviation,
      expected: canonicalOrganizationAbbreviations.get(normalizeDataLabel(organization?.name))
    }))
);
assert.deepEqual(organizationAbbreviationIssues, [], `Siglas duplicadas o no traducidas en tops: ${JSON.stringify(organizationAbbreviationIssues.slice(0, 10))}`);
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
  "First Chad (FROLINAT) Rebellion",
  "Alho Skirmish",
  "Swirling Clash",
  "Felsőőri Skirmish",
  "First skirmish at Ágfalva",
  "Karácsfa Skirmish",
  "Mosonbánfalvi Skirmish",
  "Pinkafői Skirmish"
]) {
  assert.ok(!servedConflictNames.includes(staleName), `Nombre de conflicto visible sin normalizar: ${staleName}`);
}
const technicalOrganizations = Object.entries(countries).flatMap(([code, country]) =>
  (country.politics?.organizations || [])
    .filter(organization => /^Q\d+$/i.test(organization?.name || ""))
    .map(organization => ({ code, name: organization.name }))
);
assert.deepEqual(technicalOrganizations, [], `No deben quedar identificadores Wikidata visibles en organizaciones: ${JSON.stringify(technicalOrganizations.slice(0, 10))}`);
const rawTechnicalOrganizations = Object.entries(politics).flatMap(([code, entry]) =>
  (entry?.organizations || [])
    .filter(organization => /^Q\d+$/i.test(organization?.name || ""))
    .map(organization => ({ code, name: organization.name }))
);
assert.deepEqual(rawTechnicalOrganizations, [], `Raw politico no debe conservar organizaciones tecnicas visibles: ${JSON.stringify(rawTechnicalOrganizations.slice(0, 10))}`);
const shoutingCities = Object.entries(countries).flatMap(([code, country]) =>
  [...(country.general?.cities || []), ...(country.general?.capitals || [])]
    .map(city => ({ code, name: typeof city === "string" ? city : city?.name || "" }))
    .filter(city => /^[A-ZÀ-Ý\s.'-]{4,}$/.test(city.name) && /[A-ZÀ-Ý]{3}/.test(city.name))
);
assert.deepEqual(shoutingCities, [], `No deben quedar ciudades visibles en mayusculas crudas: ${JSON.stringify(shoutingCities.slice(0, 10))}`);
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
