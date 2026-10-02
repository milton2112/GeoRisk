import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";

const source = await fs.readFile("script.js", "utf8");
const storageHelpers = source.slice(source.indexOf("function readLocalPreference("), source.indexOf("function loadSavedPreferences("));
assert.doesNotMatch(source.replace(storageHelpers, ""), /\blocalStorage\b/, "runtime storage access must use the guarded helpers");
const values = new Map([["existing", "keep"]]);
const messages = [];
let renders = 0;
const context = vm.createContext({
  localStorage: { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) },
  uiPolish: { showToast: message => messages.push(message) }, currentLanguage: "es",
  searchHistory: [], savedSearches: [], STORAGE_KEYS: { searchHistory: "history", savedSearches: "saved" },
  normalizeText: value => value.trim().toLowerCase(), renderSearchMemory: () => { renders += 1; }
});
vm.runInContext(storageHelpers + source.slice(source.indexOf("function pushSearchHistory("), source.indexOf("function renderSearchQueryChips(")), context);
assert.equal(context.readLocalPreference("existing"), "keep");
assert.equal(context.readLocalPreference("missing", false), null);
assert.equal(context.writeLocalPreference("new", "value"), true);
assert.equal(values.get("new"), "value");
const storage = context.localStorage;
storage.setItem = () => { throw new Error("quota"); };
assert.equal(context.writeLocalPreference("existing", "replacement", false), false);
assert.equal(values.get("existing"), "keep");
assert.equal(messages.length, 0);
assert.doesNotThrow(() => context.pushSearchHistory("Argentina"));
assert.equal(context.searchHistory[0], "Argentina");
assert.equal(renders, 1);
assert.equal(messages.length, 0, "automatic history persistence must not spam notices");
assert.doesNotThrow(() => context.saveCurrentSearch("Argentina"));
assert.equal(renders, 2);
assert.match(messages.at(-1), /No se pudo guardar/);
Object.defineProperty(context, "localStorage", { configurable: true, get() { throw new Error("denied getter"); } });
assert.equal(context.readLocalPreference("existing"), null);
assert.equal(context.readLocalPreference("existing", false), false);
assert.equal(context.writeLocalPreference("existing", "replacement"), false);
Object.defineProperty(context, "localStorage", { value: storage });
storage.setItem = (key, value) => values.set(key, value);
assert.equal(context.writeLocalPreference("existing", "recovered"), true, "a later action can retry after storage recovers");
context.quizState = { bestStreak: 5 };
vm.runInContext(source.slice(source.indexOf("function getQuizBestStreak("), source.indexOf("function updateQuizMeta(")), context);
for (const value of [null, "2", "NaN", "Infinity", "-4", "3.8"]) {
  values.set("geo-risk-quiz-best-streak", value);
  assert.equal(context.getQuizBestStreak(), 5, "an older or corrupt record must not hide the current session record");
}
values.set("geo-risk-quiz-best-streak", "8");
assert.equal(context.getQuizBestStreak(), 8);

const panelContext = vm.createContext({ window: {} });
vm.runInContext(await fs.readFile("app-country-panel.js", "utf8"), panelContext);
for (const [storageOption, saved] of [[undefined, false], [{ setItem() { throw new Error("quota"); } }, false],
  [{ setItem: () => false }, false], [{ setItem: () => {} }, true]]) {
  let message;
  await panelContext.window.GeoRiskCountryPanel.handleInteraction({ target: {
    closest: selector => selector === "[data-country-favorite]" ? { dataset: { countryFavorite: "ARG" } } : null
  } }, { storage: storageOption, getCountriesData: () => ({ ARG: { name: "Argentina" } }), showToast: value => { message = value; } });
  if (saved) assert.match(message, /Pais guardado/);
  else assert.match(message, /No se pudo guardar/, "failed or absent storage must not claim a saved favorite");
}
console.log("storage-resilience.test.js ok: blocked access, full quota, in-memory actions and recovery");
