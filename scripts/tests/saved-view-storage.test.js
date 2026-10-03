import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";

const source = await fs.readFile(new URL("../../script.js", import.meta.url), "utf8");
const window = {};
vm.runInNewContext(await fs.readFile(new URL("../../app-store.js", import.meta.url), "utf8"), { window });
assert.equal(window.GeoRiskStore.getSavedEntry([], "0"), undefined);
assert.equal(window.GeoRiskStore.getSavedEntry(null, "0"), undefined);

function changeHandler(control) {
  const marker = `${control}.addEventListener("change", `;
  const start = source.indexOf(marker);
  assert.ok(start >= 0, control + " must retain its change handler");
  return source.slice(start + marker.length, source.indexOf("\n  });", start) + 4);
}

for (const [control, collection] of [
  ["select?", "savedViews"], ["favoriteSelect?", "favoriteViews"], ["savedFiltersSelect", "savedFilters"]
]) {
  const entries = [{ name: "First", filters: {} }, { name: "Second", filters: {} }];
  const applied = [];
  const elements = new Map();
  const context = {
    window, [collection]: entries,
    applySavedView: view => applied.push(view.name),
    applyFilters: () => applied.push("filters"),
    document: { getElementById: id => {
      if (!elements.has(id)) elements.set(id, { value: "unchanged" });
      return elements.get(id);
    } }
  };
  const handler = vm.runInNewContext(`(${changeHandler(control)})`, context);
  for (const value of ["", " ", "-1", "2", "0.0", "+0", "00", "0e0", "Infinity", "9007199254740992", "constructor", null, 0]) {
    await handler({ target: { value } });
    assert.equal(applied.length, 0, `${collection}: ${JSON.stringify(value)} must not apply a saved entry`);
    assert.equal(elements.size, 0, "invalid selection must not mutate filter controls");
  }
  await handler({ target: { value: "1" } });
  assert.deepEqual(applied, [collection === "savedFilters" ? "filters" : "Second"]);
  await handler({ target: { value: "0" } });
  assert.equal(applied.length, 2, "the first actual entry remains selectable");
}

const filters = { continent: "Asia", minPopulation: 0 };
const country = { name: "Test country", history: { summary: "x".repeat(100000) } };
const panel = { type: "continent", continent: "Asia", countries: [country] };
const viewContext = {
  currentPanelState: panel, countriesData: { TST: country }, currentTheme: "default",
  appMode: "analysis", currentMapMode: "2d", getFilterState: () => filters
};
vm.runInNewContext(source.slice(source.indexOf("function getCurrentViewState("), source.indexOf("async function applySavedView(")), viewContext);
const view = viewContext.getCurrentViewState();
assert.equal(Object.hasOwn(view, "panelState"), false, "saved configurations must not retain country datasets unused by restoration");
assert.equal(view.selectedCode, "");
assert.equal(view.filters.continent, "Asia");
assert.equal(view.mapMode, "2d");
assert.equal(view.appMode, "analysis");
assert.ok(JSON.stringify(view).length < 1000, "a large open group must not inflate the saved configuration");
panel.countries.push(panel);
assert.doesNotThrow(() => JSON.stringify(viewContext.getCurrentViewState()), "irrelevant panel references must not break persistence");

const legacy = { ...view, panelState: { countries: [country] } };
const keys = { views: "views", favorites: "favorites", filters: "filters" };
const preferences = window.GeoRiskStore.readPreferences(key => key === "views" ? JSON.stringify([legacy]) : null, keys, ["default"]);
assert.equal(preferences.savedViews[0].name, view.name, "legacy saved views remain readable without their unused dataset");
assert.equal(Object.hasOwn(preferences.savedViews[0], "panelState"), false);
viewContext.currentPanelState = { type: "country", code: "TST" };
const countryView = viewContext.getCurrentViewState();
assert.equal(countryView.selectedCode, "TST");
const recent = viewContext.storeViewEntry([], countryView, 10);
assert.equal(viewContext.storeViewEntry(recent, { ...countryView, savedAt: "new" }, 10).length, 1, "signature deduplication remains intact");
assert.equal(viewContext.storeViewEntry(Array.from({ length: 12 }, (_, index) => ({ ...countryView, selectedCode: String(index) })), countryView, 8).length, 8);

console.log("Saved views: placeholder isolation, bounded configuration and legacy restoration OK.");
