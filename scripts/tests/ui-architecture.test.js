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

const polishSource = await fs.readFile(path.join(projectRoot, "app-ui-polish.js"), "utf8");
assert.ok(polishSource.includes("TOOLTIP_MAP"), "ui polish debe centralizar tooltips");
assert.ok(polishSource.includes("trapFocus"), "ui polish debe exponer trap de foco");
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
  "Naming Conventions"
]) {
  assert.ok(architecture.includes(token), `arquitectura debe documentar ${token}`);
}

const contributing = await fs.readFile(path.join(projectRoot, "CONTRIBUTING_INTERNAL.md"), "utf8");
assert.ok(contributing.includes("startup assets"), "guia interna debe mencionar presupuestos");
assert.ok(contributing.includes("UI / UX Rules"), "guia interna debe cubrir UX");
assert.ok(contributing.includes("Architecture Rules"), "guia interna debe cubrir arquitectura");

const indexHtml = await fs.readFile(path.join(projectRoot, "index.html"), "utf8");
assert.ok(indexHtml.includes("app-store.js"), "shell debe cargar store central");
assert.ok(!indexHtml.includes("app-ui-polish.js"), "polish UI debe quedar fuera del shell inicial");
assert.ok(indexHtml.includes("Alt+C"), "ayuda debe documentar atajos de hubs");

const script = await fs.readFile(path.join(projectRoot, "script.js"), "utf8");
assert.ok(script.includes("appStore?.setState"), "runtime debe publicar estado al store central");
assert.ok(script.includes("uiPolish: \"./app-ui-polish.js"), "runtime debe declarar polish UI como modulo diferido");
assert.ok(script.includes("uiPolish.init"), "runtime debe inicializar polish UI");
assert.ok(!indexHtml.includes("style-polish.css"), "estilos de paneles no deben bloquear el mapa inicial");
assert.ok(script.includes("event.key.toLowerCase() === \"p\""), "runtime debe exponer atajo de presentacion");
assert.ok(script.includes("event.altKey && event.key.toLowerCase() === \"n\""), "runtime debe exponer atajo de noticias");

console.log("ui-architecture.test.js ok");
