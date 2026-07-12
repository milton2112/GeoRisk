import assert from "node:assert/strict";
import fs from "fs-extra";
import path from "node:path";

const projectRoot = path.resolve(process.cwd());
const script = await fs.readFile(path.join(projectRoot, "script.js"), "utf8");
const indexHtml = await fs.readFile(path.join(projectRoot, "index.html"), "utf8");
const css = await fs.readFile(path.join(projectRoot, "style.css"), "utf8");
const polishCss = await fs.readFile(path.join(projectRoot, "style-polish.css"), "utf8");
const countryPanelUi = await fs.readFile(path.join(projectRoot, "app-country-panel.js"), "utf8");

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
  /async function searchMap\(\)[\s\S]{0,140}ensureSearchIndexReady\(\)/.test(script),
  "busqueda de categorias debe completar alias al primer uso y no depender del idle de arranque"
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
  script.includes("handleCountryPanelInteraction(event)")
    && countryPanelUi.includes('getTrigger("[data-open-country]")')
    && countryPanelUi.includes("options.openCountryByCode"),
  "resultados dentro de la ficha deben conservar apertura de pais con carga diferida"
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
  /searchCore\.findPublicConflictIndexEntry\(rawQuery,[\s\S]{0,300}type: "conflict"[\s\S]{0,120}countries: indexedConflict\.countries/.test(script),
  "busqueda de conflictos debe usar conflicts_index bajo demanda cuando no hay preview inline"
);
assert.ok(
  /searchCore\.resolveAliasResult\(rawQuery, aliasContext,[\s\S]{0,260}selectSearchResult\(primaryAliasResult\)/.test(script),
  "busqueda exacta debe resolver aliases en el modulo diferido y conservar la seleccion central"
);
assert.ok(
  /const exactCountryResult = [\s\S]{0,260}types: \["country"\][\s\S]{0,220}selectSearchResult\(exactCountryResult\)[\s\S]{0,260}parseSemanticFilters/.test(script),
  "un pais exacto debe abrir ficha antes de que aliases de origen, rival o metropoli activen filtros semanticos"
);
assert.ok(
  /let activeIndex = -1;[\s\S]{0,2200}if \(activeIndex >= 0 && currentSuggestions\[activeIndex\]\)[\s\S]{0,420}await searchMap\(\)/.test(script),
  "Enter debe ejecutar la consulta escrita salvo que el usuario elija una sugerencia con el teclado"
);
assert.ok(
  /function inferConflictLevel[\s\S]{0,520}return "battle";[\s\S]{0,180}if \(!parentName\)/.test(script),
  "una batalla sin padre verificado debe conservar nivel batalla y mostrar la jerarquia como pendiente"
);
assert.ok(
  /if \(!parentName\) \{[\s\S]{0,260}level: inferConflictLevel\(conflict, detail, null\)/.test(script),
  "agrupador de conflictos no debe promover acciones huerfanas a guerras"
);
assert.ok(
  /const wars = groups\.filter\(group => group\.level === "war"\)\.length;/.test(script),
  "resumen militar debe contar como guerras solo los grupos clasificados como guerra"
);
assert.ok(
  !script.includes("for (const [pattern, replacement] of CONFLICT_NAME_ALIASES)"),
  "runtime no debe depender de la tabla pesada extraida"
);

console.log("critical-flows.test.js ok");
