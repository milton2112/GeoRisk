import assert from "node:assert/strict";
import fs from "fs-extra";
import path from "node:path";

const projectRoot = path.resolve(process.cwd());
const script = await fs.readFile(path.join(projectRoot, "script.js"), "utf8");
const indexHtml = await fs.readFile(path.join(projectRoot, "index.html"), "utf8");
const css = await fs.readFile(path.join(projectRoot, "style.css"), "utf8");
const polishCss = await fs.readFile(path.join(projectRoot, "style-polish.css"), "utf8");

assert.ok(indexHtml.includes('id="layers-active-context"'), "capas debe mostrar el estado activo en el panel");
assert.ok(indexHtml.includes('id="ranking-active-summary"'), "rankings debe mostrar seleccion activa persistente");
assert.ok(polishCss.includes(".toolbar-state-card"), "estado de capas debe tener estilo diferido propio");
assert.ok(polishCss.includes(".ranking-active-summary.has-active"), "estado activo de rankings debe destacarse visualmente");
assert.ok(polishCss.includes(".theme-picker-button i"), "botones de capas deben marcar tipo de dato/proxy");
assert.ok(polishCss.includes(".rank-link.is-active"), "rankings deben resaltar el item activo");

assert.ok(
  /if \(result\.type === "country"\)[\s\S]{0,180}await openCountryByCode\(countryCode, result\.label\)/.test(script),
  "busqueda de pais debe abrir ficha y seleccionar mapa con openCountryByCode"
);
assert.ok(
  /if \(result\.type === "continent"\)[\s\S]{0,260}selectCountryGroupLayers\(countries\)[\s\S]{0,120}renderContinent/.test(script),
  "busqueda de continente debe marcar grupo de paises y renderizar panel"
);
assert.ok(
  /if \(result\.type === "religion"\)[\s\S]{0,260}selectCountryGroupLayers\(matches, \{ mode: "religion" \}\)[\s\S]{0,220}renderReligionSelection/.test(script),
  "busqueda de religion debe marcar paises y renderizar grupo"
);
assert.ok(
  /if \(result\.type === "religion_denomination"\)[\s\S]{0,260}selectCountryGroupLayers\(matches, \{ mode: "religion" \}\)[\s\S]{0,260}renderReligionSelection/.test(script),
  "busqueda de denominacion religiosa debe marcar paises y renderizar grupo"
);
assert.ok(
  /async function openCountryByCode[\s\S]{0,520}selectCountryLayersWhenReady\(code, country\.name \|\| fallbackName, options\)[\s\S]{0,120}await renderCountry/.test(script),
  "apertura central de pais debe marcar mapa antes de renderizar ficha"
);
assert.ok(
  /async function selectRankedCountry\(country\)[\s\S]{0,140}await openCountryByCode\(code, country\?\.name \|\| ""\)/.test(script),
  "click en ranking de pais debe usar el mismo flujo que busqueda/mapa"
);
assert.ok(
  (() => {
    const block = script.slice(
      script.indexOf("function renderInteractiveList"),
      script.indexOf("function getFilterState")
    );
    return block.includes("setActiveRankingItem(li, rankingKey)") && block.includes("selectRankedCountry(item.country)");
  })(),
  "listas de rankings deben activar estado visual y abrir pais"
);
assert.ok(
  /function setActiveRankingItem[\s\S]{0,520}syncRankingActiveSummary/.test(script),
  "estado activo de ranking debe sincronizar el resumen visible"
);
assert.ok(
  script.includes('themeQuickGrid?.addEventListener("click"') && script.includes("setTheme(button.dataset.themePicker"),
  "botones rapidos de capas deben compartir la logica del selector"
);
assert.ok(
  script.includes("getThemePickerHint") && script.includes("getThemeLayerKind") && script.includes("layers-active-note"),
  "capas deben publicar label, pista y tipo de dato/proxy"
);
assert.ok(
  /function translateConflictName[\s\S]{0,180}getConflictNameAliases\(\)/.test(script),
  "traduccion de conflictos debe usar alias diferidos cargables"
);
assert.ok(
  !script.includes("for (const [pattern, replacement] of CONFLICT_NAME_ALIASES)"),
  "runtime no debe depender de la tabla pesada extraida"
);

console.log("critical-flows.test.js ok");
