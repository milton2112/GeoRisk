import assert from "node:assert/strict";
import fs from "node:fs";
import { curateConflictEntry } from "../lib/conflict-batch-curation.js";

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
  /\b(Invasion|Campana|Accion|Pacificacion)\b/.test(String(item.value || ""))
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
assert.deepEqual(
  {
    ARM: countries.ARM.general.capital.name,
    CRI: countries.CRI.general.capital.name,
    HTI: countries.HTI.general.capital.name,
    LAO: countries.LAO.general.capital.name,
    SAU: countries.SAU.general.capital.name,
    SRB: countries.SRB.general.capital.name,
    SRB_CITY: countries.SRB.general.cities[0]?.name,
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

console.log("data-language-quality.test.js ok");
