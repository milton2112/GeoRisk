import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";

const source = await fs.readFile(new URL("../../script.js", import.meta.url), "utf8");
const context = vm.createContext({ window: {}, currentLanguage: "es" });
vm.runInContext(await fs.readFile(new URL("../../app-country-panel.js", import.meta.url), "utf8"), context);
Object.assign(context, {
  escapeHtml: context.escapeCountryLoadingText,
  repairMojibake: value => String(value ?? ""),
  normalizeText: value => String(value ?? "").toLowerCase(),
  formatNumber: value => Number(value).toLocaleString("es-AR"),
  formatPercentage: value => `${Number(value)}%`,
  t: () => "Sin datos"
});
for (const [start, end] of [
  ["function renderList(", "function renderCountryActionList("],
  ["function toDisplayTitleCase(", "function getCountryOverviewStats("],
  ["function renderOrganizations(", "function renderReligionMiniMetrics("],
  ["function getReligionSummaryLabel(", "function scrollCountrySectionIntoView("]
]) vm.runInContext(source.slice(source.indexOf(start), source.indexOf(end)), context);

const payload = '<img data-security-probe src=x onerror="window.geoRiskInjected=true">';
const literal = 'Port A & B <C> "D"';
const escaped = context.escapeHtml(payload);
const assertText = (html, label) => {
  assert.ok(!html.includes(payload), label + " must not interpret data as markup");
  assert.ok(html.includes(escaped), label + " must preserve the literal value");
};
const panel = context.window.GeoRiskCountryPanel;
for (const key of ["origin", "type", "year"]) {
  assertText(panel.renderProfile({
    country: { history: { [key]: payload } },
    loadedSections: ["country-section-history"],
    escapeHtml: context.escapeHtml,
    renderers: { translateHistoryText: context.translateHistoryText }
  }), "history." + key);
}
assertText(context.renderOrganizations([payload]), "organization string");
for (const key of ["name", "abbreviation", "startYear", "endYear"]) {
  assertText(context.renderOrganizations([{ name: "Organization", [key]: payload }]), "organization." + key);
}
assertText(context.renderReligion({ summary: payload, composition: [{ name: "Other", percentage: 100 }] }), "religion summary");
assertText(context.renderReligion({ composition: [{ name: payload, percentage: 100 }] }), "religion name");
assertText(context.renderReligion({ composition: [{ name: "Other", percentage: payload }] }), "religion percentage");
assertText(context.renderLanguages({ languages: [payload] }), "languages");
assertText(context.renderCities({ cities: [{ name: payload }] }), "cities");
assertText(context.renderRivals([{ name: payload, type: "actual" }]), "rivals");

const capital = context.renderCapitalProfiles({ capitals: [{ name: literal, role: literal, population: 1234 }] });
assert.ok(capital.includes(context.escapeHtml(literal)), "capital names and roles must be escaped exactly once");
assert.ok(!capital.includes("&amp;amp;"), "capital names must not show HTML entities");
assert.ok(capital.includes("1.234 hab."), "population formatting remains available");

assertText(panel.renderProfile({ country: { name: payload, general: { population: payload } } }), "profile without injected escape helper");
assertText(panel.renderDataQuality({ metadata: { sources: { general: [payload] } } }), "sources without injected escape helper");
assertText(panel.renderProfile({ country: { general: { population: payload } }, formatNumber: value => String(value) }), "formatted text");
const trustedMarkup = '<span class="trusted-renderer">Capital</span>';
assert.ok(panel.renderProfile({ renderers: { renderCapitalProfiles: () => trustedMarkup } }).includes(trustedMarkup), "trusted component HTML must remain markup");
console.log("country-render-security.test.js ok");
