import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const projectRoot = process.cwd();
const source = await fs.readFile(path.join(projectRoot, "app-search.js"), "utf8");
const context = { window: {} };
vm.runInNewContext(source, context);

const search = context.window.GeoRiskSearch;
assert.ok(search, "app-search debe exponer GeoRiskSearch");

const index = [
  {
    code: "ARG",
    name: "Argentina",
    continent: "America",
    aliases: ["Argentina", "Republica Argentina", "Buenos Aires", "Mercosur"],
    facets: ["Mercosur", "Cristianismo"]
  },
  {
    code: "IDN",
    name: "Indonesia",
    continent: "Asia",
    aliases: ["Indonesia", "Islam", "ASEAN"],
    facets: ["Islam", "ASEAN"]
  }
];

const aliases = search.buildAliasEntriesFromSearchIndex(index);
assert.ok(aliases.some(item => item.label === "Argentina" && item.value === "ARG"), "debe crear aliases desde el indice generado");

const suggestions = search.groupSuggestions(
  search.rankSuggestions([
    { label: "Argentina", type: "country", value: "ARG", subtitle: "America", aliases: ["Buenos Aires"] },
    { label: "Mercosur", type: "bloc", value: "Mercosur", subtitle: "Bloque" }
  ], "merco", { limit: 5 }),
  "es"
);
assert.equal(suggestions[0].type, "bloc", "debe rankear aliases cercanos");
assert.ok(suggestions[0].groupLabel, "debe agrupar sugerencias por tipo");

const exactCountryCollision = search.rankSuggestions([
  { label: "Estados Unidos", type: "origin", value: "Estados Unidos", subtitle: "Origen historico" },
  { label: "Estados Unidos", type: "country", value: "USA", subtitle: "Pais" },
  { label: "Estados Unidos", type: "unknown_future_type", value: "future", subtitle: "Otro" }
], "Estados Unidos", { limit: 5 });
assert.equal(exactCountryCollision[0].type, "country", "una coincidencia exacta de pais debe ganar ante origenes y tipos auxiliares");
assert.equal(exactCountryCollision.at(-1).type, "unknown_future_type", "tipos futuros desconocidos deben quedar al final, no antes que paises");
assert.equal(search.groupSuggestions([{ type: "origin" }], "es")[0].groupLabel, "Origenes historicos", "sugerencias no deben mostrar claves tecnicas de origen");
assert.equal(search.groupSuggestions([{ type: "metropole" }], "en")[0].groupLabel, "Former metropoles", "metropolis deben tener grupo legible en ingles");

const natural = search.parseNaturalQuery("paises de Asia con mas conflictos", {
  continents: [["asia", "Asia"]],
  religions: [["islam", "Islamismo"]],
  systems: [],
  organizations: [],
  blocs: [],
  rivals: []
});
assert.equal(natural.metric, "conflicts", "debe detectar ranking de conflictos");
assert.equal(natural.filters.continent, "Asia", "debe detectar continente");

const naturalOrganizations = search.parseNaturalQuery("paises con mas organizaciones", {
  continents: [],
  religions: [],
  systems: [],
  organizations: [],
  blocs: [],
  rivals: []
});
assert.equal(naturalOrganizations.metric, "organizations", "debe resolver rankings de organizaciones sin fallback duplicado");

const aliasContext = {
  countries: new Map([["argentina", "ARG"]]),
  countryNames: { ARG: { name: "Argentina" } },
  continents: new Map([["america del sur", "South America"]]),
  religions: new Map([["cristianismo", "Cristianismo"]]),
  religionDenominations: new Map([["catolicismo", "Catolicismo"]]),
  rivals: new Map([["argentina", "Argentina"]]),
  translateContinentName: value => value === "South America" ? "America del Sur" : value
};
const countryAliasResult = search.resolveAliasResult("Argentina", aliasContext);
assert.equal(countryAliasResult.label, "Argentina", "aliases exactos deben conservar el nombre publico");
assert.equal(countryAliasResult.type, "country", "aliases exactos deben priorizar paises");
assert.equal(countryAliasResult.value, "ARG", "aliases exactos deben conservar el codigo de pais");
const continentAliasResult = search.resolveAliasResult("America del Sur", aliasContext);
assert.equal(continentAliasResult.label, "America del Sur", "aliases de continente deben usar la traduccion visible");
assert.equal(continentAliasResult.type, "continent", "aliases de continente deben conservar su tipo");
assert.equal(continentAliasResult.value, "South America", "aliases de continente deben conservar el valor canonico");
assert.equal(
  search.resolveAliasResult("Argentina", aliasContext, { types: ["rival"] }).type,
  "rival",
  "resolucion por fases debe respetar los tipos permitidos"
);
assert.equal(search.resolveAliasResult("desconocido", aliasContext), null, "alias desconocidos no deben fabricar resultados");

const semanticContext = {
  continents: [["asia", "Asia"], ["america", "America"]],
  religions: [["islam", "Islam"], ["cristianismo", "Cristianismo"]],
  systems: [],
  organizations: [["otan", "OTAN"]],
  languages: [["espanol", "Espanol"]],
  blocs: [],
  metropoles: [],
  conflicts: [["guerra civil", "Guerra civil"]],
  periods: [],
  historyTypes: [],
  origins: [],
  rivals: []
};
const semanticReligion = search.parseSemanticFilters("paises islamicos de Asia con mas de 50 millones", semanticContext);
assert.equal(semanticReligion.continent, "Asia", "filtros semanticos deben resolver continente");
assert.equal(semanticReligion.religion, "Islam", "filtros semanticos deben resolver religion");
assert.equal(semanticReligion.minPopulation, 50000000, "filtros semanticos deben resolver poblacion minima");

const semanticContinentOnly = search.parseSemanticFilters("paises de Asia", semanticContext);
assert.equal(semanticContinentOnly.continent, "Asia", "una consulta simple por continente debe abrir el grupo de paises");

const semanticReligionOnly = search.parseSemanticFilters("paises islamicos", semanticContext);
assert.equal(semanticReligionOnly.religion, "Islam", "una consulta simple por religion debe abrir el grupo de paises");

const semanticSystem = search.parseSemanticFilters("monarquias constitucionales de Asia", semanticContext);
assert.equal(semanticSystem.system, "Monarquia constitucional", "debe reconocer sistemas politicos naturales");

const semanticHistory = search.parseSemanticFilters("paises de Asia del siglo XXI", semanticContext);
assert.equal(semanticHistory.period, "Siglo XXI", "debe reconocer periodos historicos");

const semanticConflict = search.parseSemanticFilters("paises de Asia en guerra civil", semanticContext);
assert.equal(semanticConflict.conflict, "Guerra civil", "debe reconocer conflictos desde aliases diferidos");

const publicConflict = await search.findPublicConflictIndexEntry("Guerra de las Malvinas", {
  appVersion: "test",
  translateConflictName: value => value,
  fetchResourceCached: async (url, type) => {
    assert.ok(url.includes("data/conflicts_index.json"), "debe cargar indice publico de conflictos");
    assert.equal(type, "json", "debe pedir el indice como json");
    return [
      { name: "Guerra de las Malvinas", countries: ["ARG", "GBR", "FLK"] },
      { name: "Batalla de Khaz Oruzgan", countries: ["AUS", "USA"] }
    ];
  }
});
assert.deepEqual(publicConflict.countries, ["ARG", "GBR", "FLK"], "debe resolver paises desde conflicts_index bajo demanda");

const partialConflict = await search.findPublicConflictIndexEntry("Khaz Oruzgan", {
  appVersion: "test",
  translateConflictName: value => value,
  fetchResourceCached: async () => []
});
assert.equal(partialConflict.name, "Batalla de Khaz Oruzgan", "debe resolver un conflicto sin exigir que la consulta incluya 'batalla'");
assert.equal(
  await search.findPublicConflictIndexEntry("x", { fetchResourceCached: async () => [] }),
  null,
  "consultas demasiado cortas no deben cargar el indice diferido"
);

console.log("search-module.test.js ok");
