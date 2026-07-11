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
      { name: "Guerra de las Malvinas", countries: ["ARG", "GBR", "FLK"] }
    ];
  }
});
assert.deepEqual(publicConflict.countries, ["ARG", "GBR", "FLK"], "debe resolver paises desde conflicts_index bajo demanda");

console.log("search-module.test.js ok");
