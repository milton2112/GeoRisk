import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";

const source = await fs.readFile(new URL("../../script.js", import.meta.url), "utf8");
const context = vm.createContext({});
vm.runInContext(source.slice(source.indexOf("function mergeCountryCuration("), source.indexOf("function sanitizeCountryData(")), context);
for (const payload of [
  '{"__proto__":{"geoRiskProbe":"polluted"}}',
  '{"general":{"__proto__":{"geoRiskProbe":"polluted"}}}',
  '{"constructor":{"prototype":{"geoRiskProbe":"polluted"}}}',
  '{"items":[{"__proto__":{"geoRiskProbe":"polluted"}},[{"constructor":{"prototype":{"geoRiskProbe":"polluted"}}}]]}'
]) {
  context.payload = payload;
  vm.runInContext("result = mergeCountryCuration({}, JSON.parse(payload))", context);
  assert.equal(vm.runInContext("({}).geoRiskProbe", context), undefined, "JSON must not pollute Object.prototype");
  assert.doesNotMatch(JSON.stringify(context.result), /__proto__|constructor|prototype/, "reserved keys must not survive nested clones");
}
vm.runInContext(`
  const inherited = { general: { population: 1 } };
  const target = Object.create(inherited);
  mergeCountryCuration(target, { general: { population: 2 } });
  inheritedPopulation = inherited.general.population;
  merged = mergeCountryCuration({ general: { capital: "Buenos Aires" }, items: [1] },
    { general: { population: 4 }, items: [{ name: "valid" }, [2, 3]] });
`, context);
assert.equal(context.inheritedPopulation, 1, "must not mutate inherited objects");
assert.deepEqual(JSON.parse(JSON.stringify(context.merged)), {
  general: { capital: "Buenos Aires", population: 4 }, items: [{ name: "valid" }, [2, 3]]
});

const storeContext = vm.createContext({ window: {} });
vm.runInContext(await fs.readFile(new URL("../../app-store.js", import.meta.url), "utf8"), storeContext);
const { readPreferences } = storeContext.window.GeoRiskStore;
const keys = Object.fromEntries(["language", "appMode", "presentation", "filters", "views", "favorites", "searchHistory", "savedSearches"].map(key => [key, key]));
const values = new Map();
const read = () => readPreferences(key => values.get(key), keys, ["default", "riskRadar"]);
const plain = value => JSON.parse(JSON.stringify(value));
for (const invalid of ["null", "{}", "7", '"text"', "[", "[null,7,[],{}]"]) {
  for (const key of ["filters", "views", "favorites", "searchHistory", "savedSearches"]) values.set(key, invalid);
  const preferences = read();
  for (const key of ["savedFilters", "savedViews", "favoriteViews", "searchHistory", "savedSearches"]) assert.deepEqual(plain(preferences[key]), [], invalid);
}
values.clear();
values.set("language", "constructor");
values.set("appMode", "__proto__");
values.set("views", JSON.stringify([null, {
  name: "Valid view", mapMode: {}, appMode: "unknown", theme: "constructor", selectedCode: "__proto__", filters: { minPopulation: "Infinity", system: {} }
}]));
values.set("favorites", JSON.stringify([{
  name: "Argentina", mapMode: "2d", appMode: "analysis", theme: "riskRadar", selectedCode: "ARG", filters: { continent: "America", minPopulation: 1e6 }
}]));
values.set("searchHistory", "[");
let preferences = read();
assert.equal(preferences.language, "es");
assert.equal(preferences.appMode, "default");
assert.equal(preferences.savedViews[0].mapMode, "3d");
assert.equal(preferences.savedViews[0].theme, "default");
assert.equal(preferences.savedViews[0].selectedCode, "");
assert.equal(preferences.savedViews[0].filters.minPopulation, 0);
assert.equal(preferences.favoriteViews[0].selectedCode, "ARG", "valid favorites survive an invalid history");
assert.equal(preferences.favoriteViews[0].filters.minPopulation, 1e6);
assert.equal(preferences.favoriteViews[0].mapMode, "2d");
values.set("views", '[{"name":"Valid","__proto__":{"bad":true},"filters":{"constructor":{"prototype":{"bad":true}}}}]');
assert.doesNotMatch(JSON.stringify(read()), /__proto__|constructor|prototype/, "preferences whitelist must drop unknown keys");
values.set("searchHistory", JSON.stringify(Array(150).fill("x".repeat(500))));
preferences = read();
assert.equal(preferences.searchHistory.length, 10);
assert.equal(preferences.searchHistory[0].length, 200);
values.set("searchHistory", JSON.stringify(["x".repeat(131073)]));
assert.equal(read().searchHistory.length, 0, "oversized JSON is ignored before parsing");
assert.equal(readPreferences(() => { throw new Error("storage denied"); }, keys).language, "es");

const preferencesContext = vm.createContext({
  window: storeContext.window, STORAGE_KEYS: keys, THEME_STYLES: { default: {} },
  localStorage: { getItem: key => values.get(key) }, document: { body: { classList: { toggle() {} } } }
});
vm.runInContext(source.slice(source.indexOf("function readLocalPreference("), source.indexOf("function getMedian(")), preferencesContext);
preferencesContext.loadSavedPreferences();
assert.equal(preferencesContext.currentLanguage, "es");
assert.equal(preferencesContext.savedViews.length, 1);
preferencesContext.localStorage.getItem = () => { throw new Error("storage denied"); };
assert.equal(preferencesContext.readLocalPreference("any"), null);
assert.doesNotThrow(() => preferencesContext.loadSavedPreferences());

const importsContext = vm.createContext({
  CONFLICT_DETAIL_OVERRIDES: {}, normalizeWikipediaConflictDetail: value => value,
  mergeConflictParticipants: (a, b) => [...a, ...b], mergeConflictChronology: (a, b) => [...a, ...b]
});
vm.runInContext(source.slice(source.indexOf("function mergeImportedConflictDetails("), source.indexOf("const mapEventListeners")), importsContext);
importsContext.mergeImportedConflictDetails(JSON.parse('{"__proto__":{"cause":"bad"},"constructor":{},"Valid":{"cause":"valid"}}'));
assert.equal(Object.getPrototypeOf(importsContext.CONFLICT_DETAIL_OVERRIDES), Object.prototype);
assert.equal(Object.hasOwn(importsContext.CONFLICT_DETAIL_OVERRIDES, "constructor"), false);
assert.equal(importsContext.CONFLICT_DETAIL_OVERRIDES.Valid.cause, "valid");

const urlContext = vm.createContext({
  URL, window: { location: { href: "https://milton2112.github.io/GeoRisk/" } },
  currentLanguage: "es", repairMojibake: value => value
});
vm.runInContext(source.slice(source.indexOf("function escapeHtml("), source.indexOf("function levenshteinDistance(")), urlContext);
vm.runInContext(source.slice(source.indexOf("function getSafeConflictSourceUrl("), source.indexOf("function getConflictModalContent(")), urlContext);
vm.runInContext(source.slice(source.indexOf("function getSafeNewsUrl("), source.indexOf("function renderNewsArticle(")), urlContext);
const fallbackUrl = "https://news.google.com/search?q=Argentina";
for (const value of [undefined, null, "", " \n\t", 0, {}, "/ruta", "articulo", "#nota", "//fuente.example/",
  "javascript:alert(1)", "data:text/html,test", "mailto:test@example.org", "ftp://fuente.example/", "https://",
  "https://editorial.example@destino.example/noticia", "https://user:password@fuente.example/",
  { toString: () => "https://fuente.example/" }]) {
  assert.equal(urlContext.getSafeConflictSourceUrl(value), "", "una fuente invalida no debe enlazar a la app");
  assert.equal(urlContext.getSafeNewsUrl(value, fallbackUrl), fallbackUrl, "noticias invalidas usan la busqueda externa");
}
for (const value of ["https://fuente.example/nota?a=1&b=2#seccion", "http://archivo.example/documento.pdf",
  " HTTPS://FUENTE.EXAMPLE/nota ", "https://fuente.example/2136*.html"]) {
  assert.equal(urlContext.getSafeConflictSourceUrl(value), new URL(value.trim()).href);
  assert.equal(urlContext.getSafeNewsUrl(value, fallbackUrl), new URL(value.trim()).href);
}
const sourceMarkup = urlContext.renderConflictHierarchySources([
  "Referencia bibliografica sin URL", { label: "Sin enlace", url: "" },
  { label: "<img src=x onerror=alert(1)>", url: "https://fuente.example/nota?a=1&b=2" }
]);
assert.equal((sourceMarkup.match(/<a /g) || []).length, 1);
assert.ok(sourceMarkup.includes("Referencia bibliografica sin URL"));
assert.ok(sourceMarkup.includes("a=1&amp;b=2"));
assert.ok(sourceMarkup.includes("&lt;img"));
assert.doesNotMatch(sourceMarkup, /<img|github\.io/);

console.log("Runtime input security: prototypes, bounded preferences and external links OK.");
