import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";

const context = vm.createContext({ window: {} });
vm.runInContext(await fs.readFile(new URL("../../app-country-panel.js", import.meta.url), "utf8"), context);
const panel = context.window.GeoRiskCountryPanel;
const section = (html, key) => {
  const match = html.match(new RegExp(`<li data-source-section="${key}">([\\s\\S]*?)<\\/li>`));
  assert.ok(match, "section evidence must retain a stable section identity: " + key);
  return match[1];
};
const payload = '<img src=x onerror="window.sourceInjected=true">';

for (const language of ["es", "en"]) {
  const html = panel.renderDataQuality({}, { currentLanguage: language });
  assert.ok(!/2026-04-(06|16)/.test(html), "missing metadata must not fabricate a dataset date");
  assert.ok(!/checks currently pass|chequeos locales.*pasando/.test(html), "a renderer cannot certify unseen validation evidence");
  assert.ok(!/Banco Mundial|World Bank|GeoJSON/.test(html), "a missing section source cannot inherit a generic attribution");
  assert.equal((html.match(/data-source-section=/g) || []).length, 8);
  assert.ok(html.includes(language === "en" ? "No assessment recorded" : "Sin evaluacion registrada"));
  assert.ok(html.includes(language === "en" ? "does not certify accuracy or freshness" : "no certifica exactitud ni vigencia"));
  assert.ok(!html.includes("[object Object]"));
  const known = panel.renderDataQuality({ metadata: {
    updatedAt: "2026-01-02",
    sources: { general: ["population.csv", " population.csv ", payload], economy: ["", null, {}] },
    provenance: { sections: { symbols: { status: "fallback" } } },
    quality: { score: 92, estimatedFields: [], missingFields: [], confirmedFields: ["general.population"],
      curatedFields: [], sectionStatus: { general: "confirmed", history: "base", economy: "mixed", politics: "curated", religion: payload } }
  } }, { currentLanguage: language, organizationCount: 0, conflictCount: 0 });
  assert.ok(known.includes("92/100"));
  assert.ok(known.includes("2026-01-02"), "a recorded date remains intact");
  assert.equal((section(known, "general").match(/population\.csv/g) || []).length, 1, "equivalent source strings must not repeat");
  assert.ok(section(known, "general").includes(language === "en" ? "Reported as confirmed" : "Declarado confirmado"));
  assert.ok(section(known, "history").includes(language === "en" ? "Review pending" : "Revision pendiente"));
  assert.ok(section(known, "economy").includes(language === "en" ? "Mixed: includes estimates" : "Mixto: incluye estimaciones"));
  assert.ok(section(known, "politics").includes(language === "en" ? "Internally reviewed" : "Revisado internamente"));
  assert.ok(section(known, "symbols").includes(language === "en" ? "Fallback data" : "Dato de respaldo"));
  assert.ok(section(known, "history").includes(language === "en" ? "No section sources recorded" : "Sin fuentes de seccion registradas"));
  assert.ok(!section(known, "history").includes("population.csv"), "sources cannot migrate between sections");
  assert.ok(!known.includes(payload), "sources/statuses must remain escaped literal text");
  assert.ok(known.includes("&lt;img"));
  assert.ok(known.includes(language === "en" ? "None recorded" : "Ninguno registrado"));
  const highlights = context.renderQualityHighlights({}, {
    language, formatNumber: value => "count:" + value, escapeHtml: context.escapeCountryLoadingText, noData: "unknown"
  });
  assert.ok(!/2026-04-16|count:0/.test(highlights), "absent highlight metadata is unknown, not a date or zero");
  assert.ok(highlights.includes("unknown"));
  const legacyDate = panel.renderDataQuality({ metadata: { lastUpdated: "2025-12-31" } }, { currentLanguage: language });
  assert.ok(legacyDate.includes("2025-12-31"));
}

for (const [score, expected] of [[92, 92], [-1, 0], [101, 100], [91.7, 92], [null, null], ["92", null], [NaN, null], [Infinity, null]]) {
  const country = { metadata: { quality: { score } } };
  assert.equal(context.getCountryPanelQualityScore(country), expected);
}
const oversized = panel.renderProfile({ country: { metadata: { quality: { score: 999 } } }, loadedSections: ["country-section-sources"] });
assert.ok(!oversized.includes("999/100"), "all three score surfaces share the bounded indicator");
assert.ok(oversized.includes("100/100"));
const counts = panel.renderDataQuality({}, { organizationCount: 0, conflictCount: 0, formatNumber: value => "count:" + value });
assert.equal((counts.match(/count:0/g) || []).length, 2, "explicit zero counts stay distinct from absent arrays/assessments");
assert.equal(context.getProvenanceLabel("constructor", "es"), "constructor", "unknown status names cannot resolve inherited dictionary entries");
assert.equal(context.formatProvenanceValue({ sections: { history: { status: "base" } } }, "es"), "Secciones: Historia: Revision pendiente");

console.log("Country sources: recorded evidence, translated status, bounded indicators and unknown/zero separation OK.");
