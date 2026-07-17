import assert from "node:assert/strict";
import fs from "node:fs";
import { curateConflictEntry } from "../lib/conflict-batch-curation.js";
import { normalizeVisibleValue } from "../lib/visible-data-corrections.js";

const history = JSON.parse(fs.readFileSync("data/raw/history.json", "utf8"));
const politics = JSON.parse(fs.readFileSync("data/raw/politics_details.json", "utf8"));
const rawReligion = JSON.parse(fs.readFileSync("data/raw/religion.json", "utf8"));
const rawReligionDetails = JSON.parse(fs.readFileSync("data/raw/religion_details.json", "utf8"));
const countries = JSON.parse(fs.readFileSync("data/countries_full.json", "utf8"));
const conflictDetails = JSON.parse(fs.readFileSync("data/conflict_details.generated.json", "utf8"));
const englishSignal = /\b(of|the|for|realm|british|cameroon|republic|federation|strategic|capability|commission)\b/i;
const religionEnglishSignal = /\b(christian|muslim|jewish|buddhist|hindu|folk|unaffiliated|other religions|atheist|agnostic|shinto|sunni|shiite|catholic|orthodox|protestant|evangelical)\b/i;
const staleReligionTextSignal = /Judaismo|Hindues|Catolicos|Sintoistas|agnosticos|afiliacion|Sin religion|Sin poblacion|alevies/i;
const mojibakeSignal = /Ã|Â|â€|�/;

assert.equal(normalizeVisibleValue("Guerra indo-Pakistan\u00ed de 1971"), "Guerra indo-pakistan\u00ed de 1971");
assert.equal(normalizeVisibleValue("Frontera de Pakistan"), "Frontera de Pakist\u00e1n");

const timorConflicts = countries.TLS.military.conflicts;
for (const name of [
  "Invasión indonesia de Timor Oriental (1975)",
  "Ocupación indonesia de Timor Oriental",
  "Crisis de Timor Oriental de 2006",
  "Batalla de Aidabasalala"
]) {
  assert.equal(timorConflicts.filter(entry => entry.name === name).length, 1, `${name} debe aparecer una sola vez en Timor Oriental`);
}
for (const entry of timorConflicts.filter(item => /Timor Oriental|Aidabasalala/.test(item.name))) {
  assert.notEqual(entry.parent, "Segunda Guerra Mundial", `${entry.name} no debe heredar la Segunda Guerra Mundial`);
  assert.notEqual(entry.campaign, "Guerra del Pacífico de la Segunda Guerra Mundial", `${entry.name} no debe heredar la campaña del Pacífico`);
}
assert.ok(countries.BEL.military.conflicts.some(entry => entry.name === "Batalla de Broodseinde"), "Bélgica debe vincular Broodseinde");
assert.ok(countries.FRA.military.conflicts.some(entry => entry.name === "Primera batalla de Dernancourt"), "Francia debe vincular Dernancourt");
assert.ok(countries.DEU.military.conflicts.some(entry => entry.name === "Batalla de Schleswig (1848)"), "Alemania debe vincular Schleswig de 1848");
assert.ok(countries.DEU.military.conflicts.some(entry => entry.name === "Batalla de Isted"), "Alemania debe vincular Isted");

const usaConflicts = countries.USA.military.conflicts;
const curatedUsIndigenousNames = [
  "Masacre de Peskeompskut (1676)",
  "Combate de Sudbury (1676)",
  "Batalla del cañón de Ojo Caliente (1854)",
  "Ataque a Fort Buchanan (1865)",
  "Batalla de Dry Lake (1873)",
  "Batalla de Turret Peak (1873)",
  "Combate de Sugar Point (1898)",
  "Masacre de Kelley Creek (1911)",
  "Combate de Bear Valley (1918)"
];
for (const name of curatedUsIndigenousNames) {
  const matches = usaConflicts.filter(entry => entry.name === name);
  assert.equal(matches.length, 1, `${name} debe aparecer una sola vez en Estados Unidos`);
  assert.ok(Number.isInteger(matches[0].startYear), `${name} debe conservar una fecha estructurada`);
  assert.ok(matches[0].hierarchySources?.length >= 1, `${name} debe exponer fuentes de jerarquía`);
  assert.doesNotMatch(matches[0].parent || "", /^Conflicto regional de /, `${name} no debe conservar jerarquía provisional`);
}
for (const oldName of [
  "Batalla de Turner's Falls",
  "Batalla de Sudbury",
  "Batalla de Ojo Caliente Canyon",
  "Batalla de Fort Buchanan",
  "Batalla de Dry Lake",
  "Batalla de Sand Butte",
  "Batalla de Turret Peak",
  "Batalla de Sugar Point",
  "Batalla de Kelley Creek",
  "Batalla de Bear Valley"
]) {
  assert.equal(usaConflicts.some(entry => entry.name === oldName), false, `${oldName} no debe reaparecer después de la curaduría`);
}

const curatedUsRevolutionThirdNames = [
  "Batalla de Kemp's Landing (1775)",
  "Ataque a Lindley's Fort (1776)",
  "Batalla de Longue-Pointe (1775)",
  "Batalla de Saint-Pierre (1776)",
  "Incursión de Norwalk (1779)",
  "Batalla de San Luis (1780)",
  "Combate de Mobley's Meeting House (1780)",
  "Batalla de Shallow Ford (1780)",
  "Escaramuza de Wetzell's Mill (1781)",
  "Asalto a Fort Slongo (1781)"
];
for (const name of curatedUsRevolutionThirdNames) {
  const matches = usaConflicts.filter(entry => entry.name === name);
  assert.equal(matches.length, 1, `${name} debe aparecer una sola vez en Estados Unidos`);
  assert.ok(Number.isInteger(matches[0].startYear), `${name} debe conservar una fecha estructurada`);
  assert.ok(matches[0].hierarchySources?.length >= 1, `${name} debe exponer fuentes de jerarquía`);
  assert.doesNotMatch(matches[0].parent || "", /^Conflicto regional de /, `${name} no debe conservar jerarquía provisional`);
}
for (const oldName of [
  "Batalla de Kemp's Landing",
  "Batalla de Lindley's Fort",
  "Batalla de Longue-Pointe",
  "Batalla de Saint-Pierre",
  "Batalla de Norwalk",
  "Batalla de San Luis",
  "Batalla de Mobley's Meeting House",
  "Batalla de Shallow Ford",
  "Batalla de Wetzell's Mill",
  "Batalla de Fort Slongo"
]) {
  assert.equal(usaConflicts.some(entry => entry.name === oldName), false, `${oldName} no debe reaparecer después de la tercera tanda revolucionaria`);
}
assert.equal(
  usaConflicts.find(entry => entry.name === "Incursión de Norwalk (1779)")?.type,
  "incursión y quema",
  "Norwalk debe mostrarse como incursión destructiva"
);
assert.equal(
  usaConflicts.find(entry => entry.name === "Escaramuza de Wetzell's Mill (1781)")?.type,
  "escaramuza",
  "Wetzell's Mill debe mostrarse como escaramuza"
);

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
const canonicalContinents = new Set(["Africa", "America", "Antarctica", "Asia", "Europe", "Oceania"]);
const nonCanonicalContinents = Object.entries(countries)
  .filter(([, country]) => !canonicalContinents.has(country.continent))
  .map(([code, country]) => ({ code, continent: country.continent }));
assert.deepEqual(
  nonCanonicalContinents,
  [],
  `Los continentes internos deben ser canonicos para filtros/rankings: ${JSON.stringify(nonCanonicalContinents.slice(0, 10))}`
);
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
const malformedDevelopmentOrganizations = [
  ...Object.entries(countries).flatMap(([code, country]) =>
    (country.politics?.organizations || []).map(organization => ({ code, value: organization?.name || "", source: "served" }))
  ),
  ...Object.entries(politics).flatMap(([code, entry]) =>
    (entry?.organizations || []).map(organization => ({ code, value: organization?.name || "", source: "raw" }))
  )
].filter(item => /\bDesarroll\u00f3\b/.test(item.value));
assert.deepEqual(
  malformedDevelopmentOrganizations,
  [],
  `Organizaciones politicas usan Desarrolló como verbo: ${JSON.stringify(malformedDevelopmentOrganizations.slice(0, 10))}`
);
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
const staleVisibleDataLabels = new Set([
  "Ingles",
  "Mandarin",
  "Chino mandarin",
  "Guarani",
  "Arabe",
  "Arabe egipcio",
  "Arabe estandar",
  "Azeri",
  "Hungaro",
  "Irlandes",
  "Somali",
  "Tigrina",
  "Tartaro",
  "Tartaro de Crimea",
  "Catalan",
  "Bengali",
  "Cantones",
  "Javanes",
  "Sundanes",
  "Madures",
  "Maltes",
  "Tailandes",
  "Taiwanes",
  "Hokkien taiwanes",
  "Pemon",
  "Portunol fronterizo",
  "Amarico",
  "Baoule",
  "Bete",
  "Gaelico escoces",
  "Gales",
  "Kiche",
  "Qeqchi",
  "Ngabere",
  "Japon",
  "Etiopia",
  "Niger",
  "Canada",
  "Mexico",
  "Espana",
  "Tunez",
  "Barein",
  "Reunion",
  "Islas Caiman",
  "Cordoba",
  "Sao Paulo",
  "Valparaiso",
  "Concepcion",
  "Medellin",
  "Camaguey",
  "Holguin",
  "Alejandria",
  "Encarnacion",
  "Paysandu",
  "Milan",
  "Napoles",
  "Turin",
  "Amsterdam"
]);
const visibleDataTextItems = Object.entries(countries).flatMap(([code, country]) => {
  const relations = country.politics?.relations || {};
  return [
    { code, field: "name", value: country.name || "" },
    { code, field: "officialName", value: country.general?.officialName || "" },
    { code, field: "capital", value: country.general?.capital?.name || "" },
    ...(country.general?.languages || []).map(value => ({ code, field: "language", value })),
    ...(country.general?.cities || []).map(city => ({ code, field: "city", value: typeof city === "string" ? city : city?.name || "" })),
    ...(country.general?.capitals || []).map(city => ({ code, field: "capitalProfile", value: typeof city === "string" ? city : city?.name || "" })),
    ...(country.politics?.rivals || []).map(rival => ({ code, field: "rival", value: rival?.name || rival || "" })),
    ...(relations.currentRivals || []).map(value => ({ code, field: "currentRival", value })),
    ...(relations.historicalRivals || []).map(value => ({ code, field: "historicalRival", value })),
    ...(relations.rivalStates || []).map(value => ({ code, field: "rivalState", value })),
    ...(country.military?.conflicts || []).map(conflict => ({ code, field: "conflict", value: conflict?.name || conflict || "" }))
  ];
});
const staleVisibleDataIssues = visibleDataTextItems.filter(item =>
  staleVisibleDataLabels.has(String(item.value || "").trim()) ||
  /\b(Invasion|Campana|Operacion|Intervencion|Insurreccion|Rebelion|Expedicion|Accion|Ocupacion|Liberacion|Pacificacion)\b/.test(String(item.value || ""))
);
assert.deepEqual(
  staleVisibleDataIssues,
  [],
  `Quedan etiquetas visibles sin tildes o sin normalizar: ${JSON.stringify(staleVisibleDataIssues.slice(0, 12))}`
);
const narrativeAccentSignal = /\b(Confrontacion|historico|politico|posicion|comparacion|presion|brasilena|brasileno|intervencion|accion|operacion|navegacion|tactico|tactica|soberania|curaduria|habia|America|Mexico|Antartida|Confederacion|Rio Parana|Rio de la Plata|anglo-frances|especifica|especificas|especificos|Mediterraneo|Persico|Peninsula|Contribuyo|evolucion|busco|Facilito|facilito|consolidacion|campana|Campanas|Afganistan|Pakistan|Los Angeles)\b/;
const narrativeTextFields = new Set([
  "campaign",
  "cause",
  "consequences",
  "curationNote",
  "event",
  "historicalNames",
  "members",
  "name",
  "normalizedRegion",
  "officialName",
  "outcome",
  "parent",
  "region",
  "related",
  "side",
  "summary",
  "text",
  "treaties",
  "war"
]);
const narrativeTextItems = [];
function collectNarrativeText(value, pathParts = [], code = "") {
  if (typeof value === "string") {
    const lastKey = String(pathParts.at(-1) || "");
    if (narrativeTextFields.has(lastKey)) {
      narrativeTextItems.push({ code, field: pathParts.join("."), value });
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectNarrativeText(item, pathParts.concat(String(index)), code));
    return;
  }
  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, item]) => collectNarrativeText(item, pathParts.concat(key), code));
  }
}
Object.entries(countries).forEach(([code, country]) => collectNarrativeText(country, [], code));
collectNarrativeText(conflictDetails, [], "CONFLICT_DETAILS");
const narrativeAccentIssues = narrativeTextItems.filter(item => narrativeAccentSignal.test(item.value));
assert.deepEqual(
  narrativeAccentIssues,
  [],
  `Textos narrativos visibles conservan palabras sin tilde: ${JSON.stringify(narrativeAccentIssues.slice(0, 12))}`
);
const badSpanishParticles = visibleDataTextItems.filter(item =>
  ["name", "officialName", "rival", "currentRival", "historicalRival", "rivalState"].includes(item.field) &&
  /\b(Y|De|Del|En)\b/.test(item.value)
);
assert.deepEqual(
  badSpanishParticles,
  [],
  `Particulas internas deben ir en minuscula: ${JSON.stringify(badSpanishParticles.slice(0, 12))}`
);
const servedReligionTextIssues = Object.entries(countries).flatMap(([code, country]) => [
  { code, value: country.religion?.summary || "" },
  ...(country.religion?.composition || []).map(entry => ({ code, value: entry?.name || "" }))
]).filter(item =>
  mojibakeSignal.test(item.value) ||
  religionEnglishSignal.test(item.value) ||
  staleReligionTextSignal.test(item.value)
);
assert.deepEqual(servedReligionTextIssues, [], `Religiones servidas sin normalizar: ${JSON.stringify(servedReligionTextIssues.slice(0, 10))}`);
const rawReligionTextIssues = [
  ...Object.entries(rawReligion).map(([code, value]) => ({ code, value: value || "" })),
  ...Object.entries(rawReligionDetails).flatMap(([code, entry]) =>
    (entry?.composition || []).map(item => ({ code, value: item?.name || "" }))
  )
].filter(item =>
  mojibakeSignal.test(item.value) ||
  religionEnglishSignal.test(item.value) ||
  staleReligionTextSignal.test(item.value)
);
assert.deepEqual(rawReligionTextIssues, [], `Raw religion conserva textos visibles sin normalizar: ${JSON.stringify(rawReligionTextIssues.slice(0, 10))}`);
const duplicateReligionLabels = Object.entries(countries).flatMap(([code, country]) => {
  const seen = new Map();
  return (country.religion?.composition || []).flatMap(entry => {
    const key = normalizeDataLabel(entry?.name).replace(/[^a-z0-9]+/g, " ").trim();
    if (!key) return [];
    const duplicate = seen.get(key);
    seen.set(key, entry?.name);
    return duplicate ? [{ code, labels: [duplicate, entry?.name] }] : [];
  });
});
assert.deepEqual(duplicateReligionLabels, [], `Religiones duplicadas por ficha: ${JSON.stringify(duplicateReligionLabels.slice(0, 10))}`);
const redundantReligionBranchLabels = new Set([
  "cristianos protestantes",
  "cristianos evangelicos",
  "evangelicos",
  "otros cristianos",
  "protestantes",
  "protestantismo"
]);
const redundantReligionLabels = Object.entries(countries).flatMap(([code, country]) =>
  (country.religion?.composition || [])
    .filter(entry => redundantReligionBranchLabels.has(normalizeDataLabel(entry?.name)))
    .map(entry => ({
      code,
      label: entry.name,
      canonical: normalizeDataLabel(entry?.name) === "otros cristianos"
        ? "Otras denominaciones cristianas"
        : "Protestantes y evang\u00e9licos"
    }))
);
assert.deepEqual(
  redundantReligionLabels,
  [],
  `No deben quedar ramas protestantes redundantes en fichas o tops: ${JSON.stringify(redundantReligionLabels.slice(0, 10))}`
);
const redundantReligionSummaries = Object.entries(countries).flatMap(([code, country]) => {
  const summary = normalizeDataLabel(country.religion?.summary).replace(/[^a-z0-9]+/g, " ").trim();
  const compositionKeys = (country.religion?.composition || []).map(entry =>
    normalizeDataLabel(entry?.name).replace(/[^a-z0-9]+/g, " ").trim()
  );
  const hasDetailedBranch = compositionKeys.some(key =>
    /catolic|protest|evangelic|ortodox|anglican|copto|kimbangu|mormon|luteran|metod|sunita|chiita|alauita|alevi|ibadi/.test(key)
  );
  const repeatsBranch =
    /^(cristianismo|islam) (catolicismo|protestantismo|ortodoxo|anglicano|luterano|metodista|sunismo|chiismo|suni|chii)/.test(summary);
  return hasDetailedBranch && repeatsBranch
    ? [{ code, summary: country.religion?.summary, composition: country.religion?.composition?.map(entry => entry.name) || [] }]
    : [];
});
assert.deepEqual(
  redundantReligionSummaries,
  [],
  `El resumen religioso no debe repetir ramas que ya aparecen en composicion: ${JSON.stringify(redundantReligionSummaries.slice(0, 10))}`
);
const religionTotalIssues = Object.entries(countries).flatMap(([code, country]) => {
  const composition = country.religion?.composition || [];
  const total = composition.reduce((sum, entry) => sum + (Number(entry?.percentage) || 0), 0);
  return composition.length && (total < 98 || total > 102)
    ? [{ code, total: Number(total.toFixed(1)) }]
    : [];
});
assert.deepEqual(religionTotalIssues, [], `Composiciones religiosas fuera de rango: ${JSON.stringify(religionTotalIssues.slice(0, 10))}`);
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
  "Bombing de Gaza Strip",
  "Iranian bombings en Iraqi Kurdistan en 2022",
  "Moscow City drone attacks",
  "Aden Emergency",
  "Attack on Åbo",
  "Bahía incident",
  "Ethiopian-Somalí border conflict",
  "Friendly fire incident at Sangin",
  "Israeli-British clash de January 7, 1949",
  "Skirmish at Andemose",
  "Chinese Invasión de Taiwán",
  "Felsőőri Skirmish",
  "First skirmish at Ágfalva",
  "Karácsfa Skirmish",
  "Mosonbánfalvi Skirmish",
  "Pinkafői Skirmish",
  "Birmingham Blitz",
  "Bristol Blitz",
  "Cardiff Blitz",
  "Liverpool Blitz",
  "Manchester Blitz",
  "Newcastle Blitz",
  "Plymouth Blitz",
  "Southampton Blitz",
  "Baedeker Blitz",
  "Cherry Valley massacre",
  "Combat off coast de Florida",
  "Landing at Kip's Bay"
]) {
  assert.ok(!servedConflictNames.includes(staleName), `Nombre de conflicto visible sin normalizar: ${staleName}`);
}
assert.ok(
  !servedConflictNames.includes("Invasión china de Taiwán"),
  "No debe servirse como conflicto historico una invasion china de Taiwan sin fecha/fuente consolidada"
);
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
assert.deepEqual(
  {
    ARM: countries.ARM.general.capital.name,
    CRI: countries.CRI.general.capital.name,
    HTI: countries.HTI.general.capital.name,
    LAO: countries.LAO.general.capital.name,
    SAU: countries.SAU.general.capital.name,
    SRB: countries.SRB.general.capital.name,
    SRB_CITY: countries.SRB.general.cities[0]?.name,
    DZA: countries.DZA.general.capital.name,
    DZA_CITY: countries.DZA.general.cities[0]?.name,
    AZE: countries.AZE.general.capital.name,
    BEL_CITY: countries.BEL.general.cities[0]?.name,
    CHN_CITY: countries.CHN.general.cities.find(city => city.name === "Pekín")?.name,
    USA: countries.USA.general.cities.find(city => city.name.includes("Los"))?.name,
    AFG: countries.AFG.general.cities.find(city => city.name.includes("Mazar"))?.name
  },
  {
    ARM: "Erev\u00e1n",
    CRI: "San Jos\u00e9",
    HTI: "Puerto Pr\u00edncipe",
    LAO: "Vienti\u00e1n",
    SAU: "Riad",
    SRB: "Belgrado",
    SRB_CITY: "Novi Sad",
    DZA: "Argel",
    DZA_CITY: "Wahran (Oran)",
    AZE: "Bakú",
    BEL_CITY: "Bruselas",
    CHN_CITY: "Pekín",
    USA: "Los \u00c1ngeles",
    AFG: "Mazar-e Sharif"
  },
  "Capitales y ciudades visibles deben usar nombres normalizados en espanol"
);
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
assert.deepEqual(
  {
    currentRivals: countries.SRB.politics.relations.currentRivals,
    disputedTerritories: countries.SRB.politics.relations.disputedTerritories,
    rivals: countries.SRB.politics.rivals.map(rival => rival.name || rival)
  },
  {
    currentRivals: ["Kosovo"],
    disputedTerritories: ["Kosovo"],
    rivals: ["Kosovo", "OTAN", "Croacia", "Bosnia y Herzegovina"]
  },
  "Serbia debe tener relaciones y rivalidades visibles curadas"
);

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
assert.deepEqual(
  {
    DEU: countries.DEU.history.year,
    ESH: countries.ESH.history.year,
    FRA: countries.FRA.history.year,
    GBR: countries.GBR.history.year,
    HUN: countries.HUN.history.year,
    RUS: countries.RUS.history.year,
    SWE: countries.SWE.history.year,
    TLS: countries.TLS.history.year,
    VNM: countries.VNM.history.year
  },
  {
    DEU: 1990,
    ESH: 1976,
    FRA: 1958,
    GBR: 1707,
    HUN: 1989,
    RUS: 1991,
    SWE: 1523,
    TLS: 2002,
    VNM: 1976
  },
  "Los overrides historicos curados deben tener prioridad sobre anios crudos validos pero no docentes"
);
assert.equal(countries.ESH.history.type, "Territorio disputado");
assert.deepEqual(
  {
    BGD: countries.BGD.history.type,
    BEN: countries.BEN.history.type,
    CMR: countries.CMR.history.type,
    IND: countries.IND.history.type,
    IDN: countries.IDN.history.type,
    MAR: countries.MAR.history.type,
    PAK: countries.PAK.history.type
  },
  {
    BGD: "Independencia",
    BEN: "Independencia",
    CMR: "Independencia",
    IND: "Independencia",
    IDN: "Independencia",
    MAR: "Independencia",
    PAK: "Independencia"
  },
  "Las independencias coloniales deben servirse como tipo historico, no como legal generico"
);
assert.deepEqual(
  {
    ARM: countries.ARM.history.type,
    AZE: countries.AZE.history.type,
    BLR: countries.BLR.history.type,
    UKR: countries.UKR.history.type,
    UZB: countries.UZB.history.type
  },
  {
    ARM: "Disolución de otro estado",
    AZE: "Disolución de otro estado",
    BLR: "Disolución de otro estado",
    UKR: "Disolución de otro estado",
    UZB: "Disolución de otro estado"
  },
  "Las salidas de la URSS deben servirse como disolucion de otro estado"
);

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

const islamicStateWar = curateConflictEntry({
  name: "Guerra contra el Estado Islámico",
  startYear: 2014,
  ongoing: true,
  region: "Oceania",
  normalizedRegion: "Oceania",
  curationBatch: "safe-structured-conflict-curation-2026-06"
}, { country: { name: "Australia", continent: "Oceania" } });
assert.equal(islamicStateWar.active, true);
assert.equal(islamicStateWar.ongoing, true);
assert.equal(islamicStateWar.normalizedRegion, "Oriente Medio y Norte de Africa");

const staleTacticalBattle = curateConflictEntry({
  name: "Batalla de Suoi Tre",
  startYear: 1967,
  ongoing: true,
  region: "America",
  normalizedRegion: "America",
  curationBatch: "safe-structured-conflict-curation-2026-06"
}, { country: { name: "Estados Unidos", continent: "America" } });
assert.equal(staleTacticalBattle.active, false);
assert.equal(staleTacticalBattle.ongoing, false);
assert.equal(staleTacticalBattle.endYear, 1967);
assert.equal(staleTacticalBattle.parent, "Guerra de Vietnam");
assert.equal(staleTacticalBattle.normalizedRegion, "Sudeste asiatico");

const saadahConflict = curateConflictEntry({
  name: "Conflicto de Sa'dah",
  startYear: 2004,
  ongoing: true,
  region: "America",
  normalizedRegion: "America",
  curationBatch: "safe-structured-conflict-curation-2026-06"
}, { country: { name: "Estados Unidos", continent: "America" } });
assert.equal(saadahConflict.normalizedRegion, "Oriente Medio");

const northwestPakistanConflict = curateConflictEntry({
  name: "Guerra en el noroeste de Pakistan",
  startYear: 2004,
  ongoing: true,
  region: "Europa",
  normalizedRegion: "Europa",
  curationBatch: "safe-structured-conflict-curation-2026-06"
}, { country: { name: "Reino Unido", continent: "Europa" } });
assert.equal(northwestPakistanConflict.normalizedRegion, "Asia del Sur");

const closedServedConflictsMarkedActive = Object.entries(countries).flatMap(([code, country]) =>
  (country.military?.conflicts || []).map(conflict => ({ code, ...conflict }))
).filter(conflict =>
  Number.isFinite(conflict.endYear) &&
  conflict.endYear < 2026 &&
  (conflict.ongoing === true || conflict.active === true || conflict.status === "activo")
);
assert.deepEqual(
  closedServedConflictsMarkedActive,
  [],
  `No deben servirse conflictos cerrados como activos: ${JSON.stringify(closedServedConflictsMarkedActive.slice(0, 10))}`
);

const explicitInactiveConflictsMarkedActive = Object.entries(countries).flatMap(([code, country]) =>
  (country.military?.conflicts || []).map(conflict => ({ code, ...conflict }))
).filter(conflict => conflict.ongoing === false && (conflict.active === true || conflict.status === "activo"));
assert.deepEqual(
  explicitInactiveConflictsMarkedActive,
  [],
  `No deben convivir ongoing:false con active/status activo: ${JSON.stringify(explicitInactiveConflictsMarkedActive.slice(0, 10))}`
);

const sourcedHierarchyExpectations = [
  { name: "Batalla de Triangle Hill", parent: "Guerra de Corea" },
  { name: "Batalla de Martinica", parent: "Guerras anglo-francesas del Caribe" },
  { name: "Batalla del río Ch'ongch'on", parent: "Guerra de Corea" }
];
for (const expectation of sourcedHierarchyExpectations) {
  const entries = Object.values(countries).flatMap(country => country.military?.conflicts || [])
    .filter(conflict => conflict.name === expectation.name);
  assert.ok(entries.length > 0, `Debe existir ${expectation.name} para validar su jerarquia importada`);
  assert.ok(
    entries.every(conflict => conflict.parent === expectation.parent && conflict.war === expectation.parent),
    `${expectation.name} debe reutilizar la guerra padre respaldada por el detalle importado`
  );
}

const visibleHierarchyExpectations = [
  { name: "Batalla de Cheonpyeong", parent: "Guerra de Corea", startYear: 1950 },
  { name: "Batalla de Joybar", parent: "Guerra de Afganist\u00e1n", startYear: 2011 },
  { name: "Combate de Buenavista", parent: "Guerra del Pac\u00edfico", startYear: 1880 },
  { name: "Combate de El Manzano", parent: "Guerra del Pac\u00edfico", startYear: 1880 },
  { name: "Batalla de Long Tan", parent: "Guerra de Vietnam", startYear: 1966 },
  { name: "Batalla de Bubiyan", parent: "Guerra del Golfo", startYear: 1991 },
  { name: "Batalla de Walong", parent: "Guerra sino-india", startYear: 1962 }
];
for (const expectation of visibleHierarchyExpectations) {
  const entries = Object.values(countries).flatMap(country => country.military?.conflicts || [])
    .filter(conflict => conflict.name === expectation.name);
  assert.ok(entries.length > 0, `Debe existir ${expectation.name} tras la tanda visible`);
  assert.ok(
    entries.every(conflict => conflict.parent === expectation.parent && conflict.startYear === expectation.startYear),
    `${expectation.name} debe conservar fecha y guerra padre verificadas`
  );
  const detail = conflictDetails.conflicts?.[expectation.name];
  assert.equal(detail?.hierarchyConfidence, "alta", `${expectation.name} debe declarar confianza de jerarquia`);
  assert.ok(detail?.hierarchySources?.[0]?.url, `${expectation.name} debe publicar la fuente de su jerarquia`);
}

const japanKoreaNavalExpectations = [
  { name: "Acción naval de Happo (1592)", startYear: 1592, type: "acción naval" },
  { name: "Ataque al fondeadero de Jeokjinpo (1592)", startYear: 1592, type: "ataque a fondeadero" },
  { name: "Batalla naval de Sacheon (1592)", startYear: 1592, type: "batalla naval" },
  { name: "Batalla naval de Dangpo (1592)", startYear: 1592, type: "batalla naval" },
  { name: "Primera batalla naval de Danghangpo (1592)", startYear: 1592, type: "batalla naval" },
  { name: "Batalla naval de Yulpo (1592)", startYear: 1592, type: "batalla naval" },
  { name: "Acción naval de Hwajungumi (1592)", startYear: 1592, type: "acción naval" },
  { name: "Batalla naval de Busan (1592)", startYear: 1592, type: "batalla naval" },
  { name: "Escaramuza naval de Eoranpo (1597)", startYear: 1597, type: "escaramuza naval" },
  { name: "Batalla naval de Myeongnyang (1597)", startYear: 1597, type: "batalla naval" },
  { name: "Batalla naval de Jeolido (1598)", startYear: 1598, type: "batalla naval" },
  { name: "Batalla naval de Noryang (1598)", startYear: 1598, type: "batalla naval" }
];
const getConflictDetailByVisibleName = name => Object.entries(conflictDetails.conflicts || {})
  .find(([key, detail]) => normalizeDataLabel(detail?.pageTitle || key) === normalizeDataLabel(name))?.[1];
for (const expectation of japanKoreaNavalExpectations) {
  const entries = Object.values(countries).flatMap(country => country.military?.conflicts || [])
    .filter(conflict => conflict.name === expectation.name);
  assert.ok(entries.length >= 2, `${expectation.name} debe vincularse al menos con Japón y Corea del Sur`);
  assert.ok(
    entries.every(conflict =>
      conflict.parent === "Invasiones japonesas de Corea (1592-1598)"
        && conflict.war === conflict.parent
        && conflict.startYear === expectation.startYear
        && conflict.endYear === expectation.startYear
        && conflict.type === expectation.type
    ),
    `${expectation.name} debe conservar fecha, tipo y guerra padre documentados`
  );
  const detail = getConflictDetailByVisibleName(expectation.name);
  assert.equal(
    detail?.curationBatch,
    "source-backed-japan-korea-naval-followup-2026-07",
    `${expectation.name} debe conservar el lote editorial`
  );
  assert.equal(detail?.hierarchyConfidence, "alta", `${expectation.name} debe declarar confianza de jerarquia`);
  assert.ok(detail?.hierarchySources?.length >= 2, `${expectation.name} debe publicar fuentes múltiples`);
  assert.ok(detail?.curationNote, `${expectation.name} debe explicar la decisión editorial`);
  assert.equal(detail?.pageTitle, expectation.name, `${expectation.name} debe conservar su ortografía pública canónica`);
}
const koreanConflictNames = new Set(countries.KOR.military.conflicts.map(conflict => conflict.name));
assert.ok(
  japanKoreaNavalExpectations.every(expectation => koreanConflictNames.has(expectation.name)),
  "Corea del Sur debe exponer las doce acciones navales de Imjin"
);
assert.ok(
  countries.CHN.military.conflicts.some(conflict => conflict.name === "Batalla naval de Noryang (1598)"),
  "China debe vincular Noryang por la intervención de la flota Ming"
);
assert.deepEqual(
  getConflictDetailByVisibleName("Batalla naval de Noryang (1598)")?.participants?.[0]?.members,
  ["Reino de Joseon", "Imperio Ming"],
  "Noryang debe conservar a Joseon y Ming en el bando aliado"
);
assert.equal(
  getConflictDetailByVisibleName("Batalla naval de Busan (1592)")?.sourceDispute,
  true,
  "Busan debe advertir que las cifras y el alcance estratégico están discutidos"
);
const staleJapanKoreaNavalNames = Object.values(countries).flatMap(country => country.military?.conflicts || [])
  .filter(conflict => [
    "Batalla de Happo",
    "Batalla de Jeokjinpo",
    "Batalla de Sacheon",
    "Batalla de Dangpo",
    "Batalla de Danghangpo",
    "Batalla de Yulpo",
    "Batalla de Hwajungumi",
    "Batalla de Busan",
    "Batalla de Eoranpo",
    "Batalla de Myeongnyang",
    "Batalla de Jeolido",
    "Batalla de Noryang"
  ].includes(conflict.name));
assert.deepEqual(staleJapanKoreaNavalNames, [], "los nombres navales ambiguos o sin año no deben reaparecer");

const franceFollowupExpectations = [
  { name: "Batalla naval de la bahía de Bantry (1689)", parent: "Guerra de los Nueve Años", startYear: 1689, type: "batalla naval" },
  { name: "Sitio de Bomarsund (1854)", parent: "Guerra de Crimea", startYear: 1854, type: "sitio y operación anfibia" },
  { name: "Batalla de Camaret (1694)", parent: "Guerra de los Nueve Años", startYear: 1694, type: "asalto anfibio" },
  { name: "Batalla naval de Cap-Français (1757)", parent: "Guerra de los Siete Años", startYear: 1757, type: "batalla naval" },
  { name: "Asedio y captura de Chandannagar (1757)", parent: "Guerra de los Siete Años", startYear: 1757, type: "asedio y asalto fluvial" },
  { name: "Batalla de Craonne (1814)", parent: "Guerra de la Sexta Coalición (1813-1814)", startYear: 1814, type: "batalla" },
  { name: "Batalla de Golymin (1806)", parent: "Guerra de la Cuarta Coalición (1806-1807)", startYear: 1806, type: "batalla" },
  { name: "Batalla naval de la isla de Granada (1779)", parent: "Guerra de Independencia de Estados Unidos", startYear: 1779, type: "batalla naval" },
  { name: "Batalla naval de Groix (1795)", parent: "Guerras revolucionarias francesas", startYear: 1795, type: "batalla naval" },
  { name: "Batalla de Heilsberg (1807)", parent: "Guerra de la Cuarta Coalición (1806-1807)", startYear: 1807, type: "batalla" },
  { name: "Batalla naval de la bahía de Chesapeake (1781)", parent: "Guerra de Independencia de Estados Unidos", startYear: 1781, type: "batalla naval" },
  { name: "Batalla naval de la bahía de Quiberon (1759)", parent: "Guerra de los Siete Años", startYear: 1759, type: "batalla naval" }
];
for (const expectation of franceFollowupExpectations) {
  const entries = Object.values(countries).flatMap(country => country.military?.conflicts || [])
    .filter(conflict => conflict.name === expectation.name);
  assert.ok(entries.length >= 2, `${expectation.name} debe vincularse con Francia y al menos otro país pertinente`);
  assert.ok(
    entries.every(conflict =>
      conflict.parent === expectation.parent
        && conflict.war === expectation.parent
        && conflict.startYear === expectation.startYear
        && conflict.endYear === expectation.startYear
        && conflict.type === expectation.type
    ),
    `${expectation.name} debe conservar fecha, tipo y guerra padre documentados`
  );
  const detail = getConflictDetailByVisibleName(expectation.name);
  assert.equal(
    detail?.curationBatch,
    "source-backed-france-followup-2026-07",
    `${expectation.name} debe conservar el lote editorial`
  );
  assert.equal(detail?.hierarchyConfidence, "alta", `${expectation.name} debe declarar confianza de jerarquía`);
  assert.ok(detail?.hierarchySources?.length >= 2, `${expectation.name} debe publicar fuentes múltiples`);
  assert.ok(detail?.curationNote, `${expectation.name} debe explicar la decisión editorial`);
  assert.equal(detail?.pageTitle, expectation.name, `${expectation.name} debe conservar su nombre público canónico`);
}
const franceConflictNames = new Set(countries.FRA.military.conflicts.map(conflict => conflict.name));
assert.ok(
  franceFollowupExpectations.every(expectation => franceConflictNames.has(expectation.name)),
  "Francia debe conservar las doce acciones curadas"
);
const countryConflictsByName = countryName => Object.values(countries)
  .find(country => country.name === countryName)?.military?.conflicts || [];
assert.ok(
  countryConflictsByName("Reino Unido").filter(conflict => franceFollowupExpectations.some(item => item.name === conflict.name)).length >= 9,
  "Reino Unido debe vincular las nueve acciones franco-británicas pertinentes"
);
assert.ok(
  countryConflictsByName("Rusia").filter(conflict => [
    "Sitio de Bomarsund (1854)",
    "Batalla de Craonne (1814)",
    "Batalla de Golymin (1806)",
    "Batalla de Heilsberg (1807)"
  ].includes(conflict.name)).length === 4,
  "Rusia debe vincular las cuatro acciones en las que participó"
);
assert.ok(
  countryConflictsByName("Estados Unidos").some(conflict => conflict.name === "Batalla naval de la bahía de Chesapeake (1781)"),
  "Estados Unidos debe vincular Chesapeake por ubicación y consecuencia histórica"
);
for (const name of [
  "Batalla naval de la bahía de Bantry (1689)",
  "Batalla de Heilsberg (1807)",
  "Batalla naval de la bahía de Chesapeake (1781)"
]) {
  assert.equal(getConflictDetailByVisibleName(name)?.sourceDispute, true, `${name} debe publicar la cautela editorial`);
}
assert.match(
  getConflictDetailByVisibleName("Batalla naval de Groix (1795)")?.curationNote || "",
  /Cornwallis/,
  "Groix debe distinguir la batalla del 23 de junio de la retirada previa"
);
const staleFranceFollowupNames = new Set([
  "Batalla de Bantry Bay",
  "Batalla de Bomarsund",
  "Batalla de Camaret",
  "Batalla de Cap-Français",
  "Batalla de Chandannagar",
  "Batalla de Craonne",
  "Batalla de Golymin",
  "Batalla de Grenada",
  "Batalla de Groix",
  "Batalla de Heilsberg",
  "Batalla de la Bahía de Chesapeake",
  "Batalla de Quiberon Bay"
]);
assert.deepEqual(
  Object.values(countries).flatMap(country => country.military?.conflicts || [])
    .filter(conflict => staleFranceFollowupNames.has(conflict.name)),
  [],
  "los nombres franceses ambiguos, sin año o parcialmente ingleses no deben reaparecer"
);

const usGlobalFollowupExpectations = [
  { name: "Combate de Carrizal (1916)", parent: "Expedición punitiva estadounidense en México (1916-1917)", startYear: 1916, type: "combate fronterizo" },
  { name: "Batalla de Hamel (1918)", parent: "Primera Guerra Mundial", startYear: 1918, type: "batalla" },
  { name: "Batalla de la colina 282 (1950)", parent: "Guerra de Corea", startYear: 1950, type: "batalla por una altura" },
  { name: "Batalla de Ambos Nogales (1918)", parent: "Revolución mexicana", startYear: 1918, type: "combate fronterizo" },
  { name: "Combate naval del lago Pontchartrain (1779)", parent: "Guerra de Independencia de Estados Unidos", startYear: 1779, type: "combate naval" },
  { name: "Batalla de Puerto Príncipe (1919)", parent: "Ocupación estadounidense de Haití (1915-1934)", startYear: 1919, type: "ataque urbano" },
  { name: "Batalla naval del estrecho de Shimonoseki (1863)", parent: "Crisis de Shimonoseki (1863-1864)", startYear: 1863, type: "batalla naval" },
  { name: "Bombardeo multinacional de Shimonoseki (1864)", parent: "Crisis de Shimonoseki (1863-1864)", startYear: 1864, type: "bombardeo naval" },
  { name: "Bombardeo de San Juan de Puerto Rico (1898)", parent: "Guerra hispano-estadounidense", startYear: 1898, type: "bombardeo naval" }
];
for (const expectation of usGlobalFollowupExpectations) {
  const entries = Object.values(countries).flatMap(country => country.military?.conflicts || [])
    .filter(conflict => conflict.name === expectation.name);
  assert.ok(entries.length >= 2, `${expectation.name} debe vincularse con Estados Unidos y al menos otro país pertinente`);
  assert.ok(
    entries.every(conflict =>
      conflict.parent === expectation.parent
        && conflict.war === expectation.parent
        && conflict.startYear === expectation.startYear
        && conflict.endYear === expectation.startYear
        && conflict.type === expectation.type
    ),
    `${expectation.name} debe conservar fecha, tipo y guerra padre documentados`
  );
  const detail = getConflictDetailByVisibleName(expectation.name);
  assert.equal(
    detail?.curationBatch,
    "source-backed-us-global-followup-2026-07",
    `${expectation.name} debe conservar el lote editorial`
  );
  assert.equal(detail?.hierarchyConfidence, "alta", `${expectation.name} debe declarar confianza de jerarquía`);
  assert.ok(detail?.hierarchySources?.length >= 2, `${expectation.name} debe publicar fuentes múltiples`);
  assert.ok(detail?.curationNote, `${expectation.name} debe explicar la decisión editorial`);
  assert.equal(detail?.pageTitle, expectation.name, `${expectation.name} debe conservar su nombre público canónico`);
}
const usaGlobalConflictNames = new Set(countries.USA.military.conflicts.map(conflict => conflict.name));
assert.ok(
  usGlobalFollowupExpectations.every(expectation => usaGlobalConflictNames.has(expectation.name)),
  "Estados Unidos debe conservar las nueve acciones globales curadas"
);
assert.deepEqual(
  countryConflictsByName("México").filter(conflict => [
    "Combate de Carrizal (1916)",
    "Batalla de Ambos Nogales (1918)"
  ].includes(conflict.name)).map(conflict => conflict.name).sort(),
  ["Batalla de Ambos Nogales (1918)", "Combate de Carrizal (1916)"],
  "México debe vincular los dos combates fronterizos documentados"
);
assert.ok(
  countryConflictsByName("Reino Unido").filter(conflict => [
    "Batalla de Hamel (1918)",
    "Batalla de la colina 282 (1950)",
    "Combate naval del lago Pontchartrain (1779)",
    "Bombardeo multinacional de Shimonoseki (1864)"
  ].includes(conflict.name)).length === 4,
  "Reino Unido debe acumular las asociaciones nuevas sin perder las tandas previas"
);
assert.ok(
  countryConflictsByName("Haití").some(conflict => conflict.name === "Batalla de Puerto Príncipe (1919)"),
  "Haití debe vincular el ataque de Puerto Príncipe de 1919"
);
assert.ok(
  countryConflictsByName("Japón").filter(conflict => /Shimonoseki/.test(conflict.name)).length >= 2,
  "Japón debe distinguir las acciones de Shimonoseki de 1863 y 1864"
);
assert.equal(
  countries.USA.military.conflicts.filter(conflict => conflict.name === "Bombardeo de San Juan de Puerto Rico (1898)").length,
  1,
  "San Juan debe unificar sus dos rótulos navales de 1898 sin duplicarse en Estados Unidos"
);
for (const name of [
  "Batalla de la colina 282 (1950)",
  "Batalla de Ambos Nogales (1918)",
  "Batalla de Puerto Príncipe (1919)"
]) {
  assert.equal(getConflictDetailByVisibleName(name)?.sourceDispute, true, `${name} debe publicar la cautela editorial`);
}
assert.match(
  getConflictDetailByVisibleName("Bombardeo de San Juan de Puerto Rico (1898)")?.curationNote || "",
  /colinas de San Juan/i,
  "San Juan debe distinguir el bombardeo naval de las colinas de Cuba"
);
const staleUsGlobalFollowupNames = new Set([
  "Batalla de El Carrizal",
  "Batalla de Hamel",
  "Batalla de Hill 282",
  "Batalla de Nogales",
  "Batalla del Lago Pontchartrain",
  "Batalla de Port-au-Prince",
  "Batalla de Shimonoseki Straits",
  "Bombardeo de Shimonoseki",
  "Segunda batalla de San Juan",
  "Bombardeo de San Juan"
]);
assert.deepEqual(
  Object.values(countries).flatMap(country => country.military?.conflicts || [])
    .filter(conflict => staleUsGlobalFollowupNames.has(conflict.name)),
  [],
  "los rótulos estadounidenses ambiguos, duplicados o parcialmente ingleses no deben reaparecer"
);

const britishGlobalFollowupExpectations = [
  { name: "Batalla de Carillon (1758)", parent: "Guerra franco-india (1754-1763)", startYear: 1758, type: "asalto a fortificacion" },
  { name: "Batalla de Monongahela (1755)", parent: "Guerra franco-india (1754-1763)", startYear: 1755, type: "batalla" },
  { name: "Batalla de Wandiwash (1760)", parent: "Guerra de los Siete Anos", startYear: 1760, type: "batalla campal" },
  { name: "Batalla de Omdurmán (1898)", parent: "Guerra mahdista (1881-1899)", startYear: 1898, type: "batalla" },
  { name: "Batalla de Qurna (1914)", parent: "Primera Guerra Mundial", startYear: 1914, type: "batalla fluvial" },
  { name: "Batalla naval de Jumunjin (1950)", parent: "Guerra de Corea", startYear: 1950, type: "batalla naval" },
  { name: "Batalla de la bahía de Heligoland (1914)", parent: "Primera Guerra Mundial", startYear: 1914, type: "batalla naval" },
  { name: "Primera batalla de Maryang San (1951)", parent: "Guerra de Corea", startYear: 1951, type: "batalla por una altura" }
];
for (const expectation of britishGlobalFollowupExpectations) {
  const entries = Object.values(countries).flatMap(country => country.military?.conflicts || [])
    .filter(conflict => conflict.name === expectation.name);
  assert.ok(entries.length >= 1, `${expectation.name} debe conservarse en al menos una ficha nacional`);
  assert.ok(
    entries.every(conflict =>
      conflict.parent === expectation.parent
        && conflict.war === expectation.parent
        && conflict.startYear === expectation.startYear
        && conflict.endYear === expectation.startYear
        && conflict.type === expectation.type
    ),
    `${expectation.name} debe conservar fecha, tipo y guerra padre documentados`
  );
  const detail = getConflictDetailByVisibleName(expectation.name);
  assert.equal(
    detail?.curationBatch,
    "source-backed-british-global-followup-2026-07",
    `${expectation.name} debe conservar el lote editorial`
  );
  assert.equal(detail?.hierarchyConfidence, "alta", `${expectation.name} debe declarar confianza de jerarquia`);
  assert.ok(detail?.hierarchySources?.length >= 2, `${expectation.name} debe publicar fuentes multiples`);
  assert.ok(detail?.curationNote, `${expectation.name} debe explicar la decision editorial`);
  assert.equal(detail?.pageTitle, expectation.name, `${expectation.name} debe conservar su nombre publico canonico`);
}
const unitedKingdomGlobalConflicts = new Set(countries.GBR.military.conflicts.map(conflict => conflict.name));
assert.ok(
  britishGlobalFollowupExpectations.every(expectation => unitedKingdomGlobalConflicts.has(expectation.name)),
  "Reino Unido debe conservar las ocho acciones globales curadas"
);
assert.deepEqual(
  countryConflictsByName("Francia").filter(conflict => [
    "Batalla de Carillon (1758)",
    "Batalla de Monongahela (1755)",
    "Batalla de Wandiwash (1760)"
  ].includes(conflict.name)).map(conflict => conflict.name).sort(),
  ["Batalla de Carillon (1758)", "Batalla de Monongahela (1755)", "Batalla de Wandiwash (1760)"],
  "Francia debe vincular sus tres participaciones historicas documentadas"
);
assert.ok(
  countryConflictsByName("República Popular China").some(conflict => conflict.name === "Primera batalla de Maryang San (1951)"),
  "Republica Popular China debe vincular la primera batalla de Maryang San"
);
const staleBritishGlobalFollowupNames = new Set([
  "Batalla de Fort Carillon",
  "Batalla de Monongahela",
  "Batalla de Wandiwash",
  "Batalla de Omdurman",
  "Batalla de Omdurmán",
  "Batalla de Qurna",
  "Batalla de Jumunjin",
  "Batalla de la bahia de Heligoland",
  "Batalla de la bahía de Heligoland",
  "Primera Batalla de Maryang San"
]);
assert.deepEqual(
  Object.values(countries).flatMap(country => country.military?.conflicts || [])
    .filter(conflict => staleBritishGlobalFollowupNames.has(conflict.name)),
  [],
  "los rotulos britanicos sin fecha o con jerarquia provisional no deben reaparecer"
);

const frontierSecondFollowupExpectations = [
  { name: "Ataque a Kenapacomaqua (1791)", parent: "Guerra indígena del Noroeste", startYear: 1791 },
  { name: "Masacre de Claremore Mound (1817)", parent: "Conflicto osage-cheroqui", startYear: 1817 },
  { name: "Combate de Sink Hole (1815)", parent: "Guerra anglo-estadounidense de 1812", startYear: 1815 },
  { name: "Combate atribuido de Bandera Pass (c. 1842)", parent: "Guerras comanches", startYear: 1842 },
  { name: "Escaramuza de Cooke's Spring (1857)", parent: "Guerras apaches", startYear: 1857 },
  { name: "Batalla de Pima Butte (1857)", parent: "Conflicto quechan-maricopa", startYear: 1857 },
  { name: "Combate del río Devils (1857)", parent: "Guerras comanches", startYear: 1857 },
  { name: "Batalla del río Owyhee (1866)", parent: "Guerra Snake", startYear: 1866 },
  { name: "Combate de Prairie Dog Creek (1867)", parent: "Guerra de Hancock", startYear: 1867 },
  { name: "Combate de Honsinger Bluff (1873)", parent: "Guerras sioux", startYear: 1873 }
];
for (const expectation of frontierSecondFollowupExpectations) {
  const entries = Object.values(countries).flatMap(country => country.military?.conflicts || [])
    .filter(conflict => conflict.name === expectation.name);
  assert.ok(entries.length > 0, `Debe existir ${expectation.name} tras la nueva tanda fronteriza`);
  assert.ok(
    entries.every(conflict =>
      conflict.parent === expectation.parent
        && conflict.war === expectation.parent
        && conflict.startYear === expectation.startYear
        && conflict.endYear === expectation.startYear
    ),
    `${expectation.name} debe conservar fecha y jerarquia documentadas`
  );
  const detail = conflictDetails.conflicts?.[expectation.name];
  assert.equal(
    detail?.curationBatch,
    "source-backed-us-frontier-second-followup-2026-07",
    `${expectation.name} debe conservar el lote editorial`
  );
  assert.ok(detail?.hierarchySources?.[0]?.url, `${expectation.name} debe publicar al menos una fuente`);
}
assert.equal(
  conflictDetails.conflicts?.["Combate atribuido de Bandera Pass (c. 1842)"]?.sourceDispute,
  true,
  "Bandera Pass debe advertir que su historicidad está discutida"
);
assert.match(
  conflictDetails.conflicts?.["Batalla de Pima Butte (1857)"]?.curationNote || "",
  /únicamente geográfica/i,
  "Pima Butte debe aclarar que Estados Unidos es una asociación geográfica"
);
const staleFrontierSecondFollowupNames = Object.values(countries).flatMap(country => country.military?.conflicts || [])
  .filter(conflict => [
    "Batalla de Kenapacomaqua",
    "Batalla de Claremore Mound",
    "Batalla de Sink Hole",
    "Batalla de Bandera Pass",
    "Batalla de Cooke's Spring",
    "Batalla de Pima Butte",
    "Batalla de Devil's River",
    "Batalla de Owyhee River",
    "Batalla de Prairie Dog Creek",
    "Batalla de Honsinger Bluff"
  ].includes(conflict.name));
assert.deepEqual(
  staleFrontierSecondFollowupNames,
  [],
  "los nombres fronterizos reemplazados no deben reaparecer en los datos servidos"
);

const staleVisibleConflictNames = Object.values(countries).flatMap(country => country.military?.conflicts || [])
  .filter(conflict => [
    "Batalla de Cheonpyeong Valley",
    "Guerra de Malvinas (1982)",
    "Guerra indo-Pakist\u00e1n\u00ed de 1965",
    "Guerra indo-Pakist\u00e1n\u00ed de 1971"
  ].includes(conflict.name));
assert.deepEqual(staleVisibleConflictNames, [], "nombres visibles duplicados o con capitalizacion incorrecta deben canonicalizarse");

const invalidConflictYearRanges = Object.entries(countries).flatMap(([code, country]) =>
  (country.military?.conflicts || []).map(conflict => ({ code, ...conflict }))
).filter(conflict =>
  Number.isFinite(conflict.startYear) &&
  Number.isFinite(conflict.endYear) &&
  conflict.endYear < conflict.startYear
);
assert.deepEqual(
  invalidConflictYearRanges,
  [],
  `No deben servirse conflictos con endYear menor que startYear: ${JSON.stringify(invalidConflictYearRanges.slice(0, 10))}`
);

const historicalActionPattern = /\b(batalla|battle|sitio|siege|combate|asalto|raid|incursion|incursi[o\u00f3]n|ofensiva|operacion|operaci[o\u00f3]n|operation|campana|campa[n\u00f1]a|desembarco|bombardeo|ataque)\b/i;
const openHistoricalActions = Object.entries(countries).flatMap(([code, country]) =>
  (country.military?.conflicts || []).map(conflict => ({ code, ...conflict }))
).filter(conflict =>
  historicalActionPattern.test(`${conflict.name || ""} ${conflict.type || ""}`) &&
  Number.isFinite(conflict.startYear) &&
  conflict.startYear < 2020 &&
  !Number.isFinite(conflict.endYear) &&
  (conflict.ongoing === true || conflict.active === true || conflict.status === "activo")
);
assert.deepEqual(
  openHistoricalActions,
  [],
  `Las batallas/operaciones historicas no deben quedar activas por falta de endYear: ${JSON.stringify(openHistoricalActions.slice(0, 10))}`
);

const suspectServedConflictRegions = Object.entries(countries).flatMap(([code, country]) =>
  (country.military?.conflicts || []).map(conflict => ({ code, ...conflict }))
).filter(conflict =>
  /Afganist|Irak|Estado Isl|Siria|Kivu|Kosovo|Vietnam|Corea|Sa['’]?dah|Pakist|Cachemira|Gaza|Israel|Iran|Irano|Kachin|Laos|Tailandia|Camerun|Camer\u00fan/i.test(conflict.name || "") &&
  /Oceania|America del Sur|Europa occidental|Africa occidental|Europa$|America$/i.test(conflict.normalizedRegion || conflict.region || "")
);
assert.deepEqual(
  suspectServedConflictRegions,
  [],
  `Los conflictos no deben heredar regiones continentales sospechosas: ${JSON.stringify(suspectServedConflictRegions.slice(0, 10))}`
);

const expectedServedConflictCuration = [
  {
    name: "Ataques a\u00e9reos del valle de la Becaa de 2024",
    parent: "Conflicto Israel-Hezbola de 2023-2024",
    region: "Valle de la Becaa, L\u00edbano"
  },
  {
    name: "Batalla frente a Endau",
    parent: "Segunda Guerra Mundial",
    region: "Malaya"
  },
  {
    name: "Batalla del Monte Calvo",
    parent: "Guerra de Corea",
    region: "Pen\u00ednsula coreana"
  },
  {
    name: "Bombardeos aliados de \u00c1msterdam-Noord",
    parent: "Segunda Guerra Mundial",
    region: "\u00c1msterdam-Noord, Pa\u00edses Bajos"
  },
  {
    name: "Incursi\u00f3n de abril de 2009 frente a Somalia",
    parent: "Pirater\u00eda frente a Somalia",
    region: "Cuerno de \u00c1frica"
  },
  {
    name: "Ofensiva de Sirte de 2016",
    parent: "Segunda guerra civil libia",
    region: "Sirte, Libia"
  },
  {
    name: "Asalto a los acorazados Cabral y Lima Barros (1868)",
    parent: "Guerra de la Triple Alianza",
    region: "Rio Paraguay, cerca de Humaita, Paraguay"
  },
  {
    name: "Batalla de Dieppe (1942)",
    parent: "Segunda Guerra Mundial",
    region: "Dieppe, Sena Maritimo, Francia ocupada"
  },
  {
    name: "Batalla de Heligoland (1864)",
    parent: "Segunda guerra de Schleswig (1864)",
    region: "Mar del Norte, frente a Heligoland"
  },
  {
    name: "Batalla de la Bahía de Hudson (1697)",
    parent: "Guerra de los Nueve Anos (1688-1697)",
    region: "Bahia de Hudson, America del Norte"
  },
  {
    name: "Batalla de la Haya (1940)",
    parent: "Segunda Guerra Mundial",
    region: "La Haya y los aerodromos de Valkenburg, Ypenburg y Ockenburg, Paises Bajos"
  },
  {
    name: "Batalla de Rumaila (1991)",
    parent: "Guerra del Golfo",
    region: "Campo petrolero de Rumaila, sur de Irak"
  },
  {
    name: "Batalla de Solebay (1672)",
    parent: "Tercera guerra anglo-neerlandesa (1672-1674)",
    region: "Solebay, costa de Suffolk, mar del Norte"
  }
];
const servedConflictsByName = new Map();
Object.values(countries).forEach(country => {
  (country.military?.conflicts || []).forEach(conflict => {
    const key = normalizeDataLabel(conflict?.name);
    if (!key) return;
    const entries = servedConflictsByName.get(key) || [];
    entries.push(conflict);
    servedConflictsByName.set(key, entries);
  });
});
const servedConflictCurationIssues = expectedServedConflictCuration.flatMap(expected => {
  const entries = servedConflictsByName.get(normalizeDataLabel(expected.name)) || [];
  if (!entries.length) return [{ name: expected.name, reason: "no encontrado" }];
  return entries
    .filter(entry =>
      normalizeDataLabel(entry.parent || entry.war) !== normalizeDataLabel(expected.parent) ||
      normalizeDataLabel(entry.normalizedRegion || entry.region) !== normalizeDataLabel(expected.region)
    )
    .map(entry => ({
      name: entry.name,
      parent: entry.parent || entry.war || null,
      region: entry.normalizedRegion || entry.region || null,
      expectedParent: expected.parent,
      expectedRegion: expected.region
    }));
});
assert.deepEqual(
  servedConflictCurationIssues,
  [],
  `Conflictos visibles con jerarquia o region curada incorrecta: ${JSON.stringify(servedConflictCurationIssues.slice(0, 10))}`
);

const nullNarrativeConflictDetails = Object.entries(conflictDetails.conflicts || {}).flatMap(([name, detail]) =>
  ["cause", "outcome"].flatMap(field => String(detail?.[field] || "").trim().toLowerCase() === "null" ? [{ name, field }] : [])
);
assert.deepEqual(
  nullNarrativeConflictDetails,
  [],
  `Los detalles de conflictos no deben mostrar "null" como texto narrativo: ${JSON.stringify(nullNarrativeConflictDetails.slice(0, 10))}`
);

const conflictDetailShardIssues = collectJsonFiles("data/conflicts/details").flatMap(file => {
  const detail = JSON.parse(fs.readFileSync(file, "utf8"));
  const issues = [];
  const detailSignal = /\b(Date\s+\d|January|February|March|April|May|June|July|August|September|October|November|December|Beqaa Valley|off Endau|20 miles|Sirte District|Japanese victory|Franco-German victory|GNA victory|At least \d+ (?:killed|injured)|Government of National Accord|United Kingdom Special Forces|Libyan Army|Somali pirates)\b/i;
  const coordinateSignal = /\d+°\d+|\/\s*-?\d{1,3}\.\d{3,}/;
  function visit(value, pathParts = []) {
    if (typeof value === "string") {
      const fieldName = pathParts.at(-1);
      if (
        fieldName !== "language" &&
        fieldName !== "url" &&
        !pathParts.includes("commanders") &&
        (detailSignal.test(value) || coordinateSignal.test(value))
      ) {
        issues.push({ file, name: detail.name || file, path: pathParts.join("."), value });
      }
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item, index) => visit(item, pathParts.concat(String(index))));
      return;
    }
    if (value && typeof value === "object") {
      Object.entries(value).forEach(([key, item]) => visit(item, pathParts.concat(key)));
    }
  }
  visit(detail);
  return issues;
});
assert.deepEqual(
  conflictDetailShardIssues,
  [],
  `Los shards de detalle no deben conservar campos importados en ingles o coordenadas crudas: ${JSON.stringify(conflictDetailShardIssues.slice(0, 10))}`
);

console.log("data-language-quality.test.js ok");
