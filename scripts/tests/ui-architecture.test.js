import assert from "node:assert/strict";
import fs from "fs-extra";
import path from "node:path";
import vm from "node:vm";

const projectRoot = process.cwd();

async function loadBrowserModule(file) {
  const source = await fs.readFile(path.join(projectRoot, file), "utf8");
  const context = { window: {}, document: { addEventListener() {} } };
  vm.runInNewContext(source, context);
  return context.window;
}

const storeWindow = await loadBrowserModule("app-store.js");
assert.ok(storeWindow.GeoRiskStore.createStore, "store central debe exponer factory");
assert.ok(storeWindow.GeoRiskStore.store, "store central debe exponer instancia");
storeWindow.GeoRiskStore.store.setState({ appMode: "presentation" }, "test");
assert.equal(storeWindow.GeoRiskStore.store.getState().appMode, "presentation");
assert.equal(storeWindow.GeoRiskStore.selectUiState().appMode, "presentation");

const countryPanelWindow = await loadBrowserModule("app-country-panel.js");
const countryPanel = countryPanelWindow.GeoRiskCountryPanel;
const qualityHtml = countryPanel.renderDataQuality({
  general: { cities: [{ name: "Buenos Aires" }, { name: "Cordoba" }] },
  religion: { composition: [{ name: "Cristianismo", percentage: 70 }] },
  metadata: {
    updatedAt: "2026-07-10",
    sources: { general: ["Fuente oficial"] },
    provenance: {
      general: { status: "confirmed" },
      sections: { general: { status: "curated" }, military: { status: "base" } }
    },
    quality: {
      score: 92,
      estimatedFields: ["economy.inflation"],
      curatedFields: ["general.cities"],
      confirmedFields: ["general.population"],
      missingFields: [],
      sectionStatus: { general: "curated" }
    }
  }
}, {
  currentLanguage: "es",
  organizationCount: 12,
  conflictCount: 3,
  formatNumber: value => String(value),
  escapeHtml: value => String(value),
  noData: "Sin datos"
});
assert.ok(qualityHtml.includes("Puntaje de calidad"), "ficha diferida debe renderizar calidad de datos");
assert.ok(qualityHtml.includes("92/100"), "ficha diferida debe mostrar score de calidad");
assert.ok(qualityHtml.includes("Fuente oficial"), "ficha diferida debe mostrar fuentes por seccion");
assert.ok(qualityHtml.includes("Organizaciones"), "ficha diferida debe conservar metricas de cobertura");
assert.ok(!qualityHtml.includes("[object Object]"), "procedencia anidada debe mostrarse como texto legible");
assert.ok(qualityHtml.includes("general: curated"), "procedencia debe resumir estados por seccion");

const textWindow = await loadBrowserModule("app-text.js");
const textUi = textWindow.GeoRiskText;
const textElements = {
  "compare-title": { textContent: "" },
  "compare-empty": { textContent: "" },
  "map-search-input": { placeholder: "" },
  "map-search-button": { textContent: "" },
  "theme-select": { options: [{ value: "gdpPerCapita", textContent: "" }] },
  "quiz-mode": { options: Array.from({ length: 5 }, () => ({ textContent: "" })) },
  "news-topic-select": { options: Array.from({ length: 5 }, () => ({ textContent: "" })) },
  "semantic-helper": { textContent: "" },
  "help-modal": { hidden: true }
};
const textDocument = {
  activeElement: null,
  body: { classList: { contains: () => false } },
  getElementById: id => textElements[id] || null,
  querySelector: () => null,
  querySelectorAll: () => []
};
let themePickerRuns = 0;
assert.equal(textUi.applyStaticText({
  document: textDocument,
  currentLanguage: "en",
  translate: key => ({ compareTitle: "Comparer", compareHint: "Add countries" }[key] || key),
  renderThemePicker: () => { themePickerRuns += 1; },
  getNewsTopicLabel: value => value
}), true, "modulo de textos debe aceptar documentos parciales");
assert.equal(textElements["compare-title"].textContent, "Comparer", "titulo del comparador debe traducirse");
assert.equal(textElements["map-search-input"].placeholder, "Search country, conflict, region or organization", "buscador debe traducir placeholder");
assert.equal(textElements["theme-select"].options[0].textContent, "GDP per capita", "capas deben traducirse desde app-text");
assert.equal(themePickerRuns, 1, "traduccion debe refrescar selector visual de capas");
assert.equal(textUi.applyExtendedStaticText({ document: textDocument, currentLanguage: "en" }), true, "textos extendidos deben tolerar DOM parcial");
assert.equal(textElements["quiz-mode"].options[4].textContent, "Teacher", "modos nuevos del quiz deben traducirse");
assert.equal(textElements["news-topic-select"].options[4].textContent, "Diplomacy", "tema diplomacia debe traducirse");

const polishSource = await fs.readFile(path.join(projectRoot, "app-ui-polish.js"), "utf8");
assert.ok(polishSource.includes("TOOLTIP_MAP"), "ui polish debe centralizar tooltips");
assert.ok(polishSource.includes("trapFocus"), "ui polish debe exponer trap de foco");
assert.ok(!polishSource.includes("installKeyboardA11y"), "ui polish no debe duplicar el listener principal de foco");
assert.ok(polishSource.includes("applyCompactLabels"), "ui polish debe soportar controles compactos");
assert.ok(polishSource.includes("loadPolishStyles"), "ui polish debe cargar estilos visuales bajo demanda");

const architecture = await fs.readFile(path.join(projectRoot, "ARCHITECTURE.md"), "utf8");
for (const token of [
  "app-store.js",
  "app-ui-polish.js",
  "app-map.js",
  "app-country-panel.js",
  "app-timeline-conflicts.js",
  "app-news-ui.js",
  "app-export-share.js",
  "data/countries/conflicts/*.json",
  "Naming Conventions"
]) {
  assert.ok(architecture.includes(token), `arquitectura debe documentar ${token}`);
}

const contributing = await fs.readFile(path.join(projectRoot, "CONTRIBUTING_INTERNAL.md"), "utf8");
assert.ok(contributing.includes("startup assets"), "guia interna debe mencionar presupuestos");
assert.ok(contributing.includes("UI / UX Rules"), "guia interna debe cubrir UX");
assert.ok(contributing.includes("Architecture Rules"), "guia interna debe cubrir arquitectura");

const indexHtml = await fs.readFile(path.join(projectRoot, "index.html"), "utf8");
const helpUi = await fs.readFile(path.join(projectRoot, "app-help-ui.js"), "utf8");
assert.ok(indexHtml.includes("app-store.js"), "shell debe cargar store central");
assert.ok(!indexHtml.includes("app-ui-polish.js"), "polish UI debe quedar fuera del shell inicial");
assert.ok(!indexHtml.includes("Alt+C"), "ayuda larga debe quedar fuera del shell inicial");
assert.ok(helpUi.includes("Alt+C"), "ayuda diferida debe documentar atajos de hubs");

const script = await fs.readFile(path.join(projectRoot, "script.js"), "utf8");
assert.ok(script.includes("appStore?.setState"), "runtime debe publicar estado al store central");
assert.ok(script.includes("uiPolish: `./app-ui-polish.js?v=${APP_VERSION}`"), "runtime debe declarar polish UI como modulo diferido versionado");
assert.ok(script.includes("uiPolish.init"), "runtime debe inicializar polish UI");
assert.ok(script.includes("function containModalKeyboardFocus"), "runtime principal debe contener foco modal");
assert.ok(!indexHtml.includes("style-polish.css"), "estilos de paneles no deben bloquear el mapa inicial");
assert.ok(script.includes("event.key.toLowerCase() === \"p\""), "runtime debe exponer atajo de presentacion");
assert.ok(script.includes("event.altKey && event.key.toLowerCase() === \"n\""), "runtime debe exponer atajo de noticias");

console.log("ui-architecture.test.js ok");
