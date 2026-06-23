import assert from "node:assert/strict";
import fs from "fs-extra";
import path from "node:path";

const projectRoot = path.resolve(process.cwd());
const visibleFiles = [
  "index.html",
  "style.css",
  "style-polish.css",
  "app-risk-radar-ui.js",
  "app-conflict-audit-ui.js",
  "app-project-audit-ui.js",
  "app-news-ui.js",
  "app-compare-ui.js",
  "app-quiz-ui.js",
  "app-performance-ui.js"
];

const forbiddenVisibleTokens = [
  "boot-floating-chip",
  "boot-profile-chip",
  "Arranque: pendiente",
  "Boot: pending",
  "Ãƒ",
  "Ã‚",
  "Â¿",
  "Â¡",
  "â–",
  "�"
];

for (const file of visibleFiles) {
  const text = await fs.readFile(path.join(projectRoot, file), "utf8");
  for (const token of forbiddenVisibleTokens) {
    assert.ok(!text.includes(token), `${file} no debe exponer token visual roto: ${token}`);
  }
}

const css = await fs.readFile(path.join(projectRoot, "style.css"), "utf8");
const polishCss = await fs.readFile(path.join(projectRoot, "style-polish.css"), "utf8");
assert.ok(/\[hidden\]\s*\{\s*display:\s*none\s*!important;/.test(css), "hidden debe prevalecer sobre layouts de modales y paneles");
assert.ok(css.includes("#map-toolbar .toolbar-content") || css.includes(".toolbar-content"));
assert.ok(css.includes("overflow-y: auto"), "panel de capas debe tener scroll vertical propio");
assert.ok(css.includes("overscroll-behavior: contain"), "panel de capas debe contener el scroll");
assert.ok(css.includes("position: sticky"), "cabecera del panel de capas debe quedar fija al scrollear");
assert.ok(css.includes(".performance-status-banner"), "panel de rendimiento debe exponer estado visual de arranque");
assert.ok(css.includes(".performance-recommendation-card"), "panel de rendimiento debe exponer recomendacion automatica");
assert.ok(polishCss.includes("--ui-radius: 8px"), "componentes diferidos deben usar radio visual compacto");
assert.ok(polishCss.includes("min-height: 44px"), "controles tactiles deben conservar un objetivo comodo");
assert.ok(polishCss.includes(".rank-link.is-active"), "rankings deben mostrar seleccion activa");
assert.ok(polishCss.includes(".country-title > .coat-visual"), "cabecera de ficha debe reservar espacio al escudo");
assert.ok(polishCss.includes(".conflict-trust-badge"), "modal de conflicto debe mostrar calidad de dato sin ocupar una seccion completa");

const performanceUi = await fs.readFile(path.join(projectRoot, "app-performance-ui.js"), "utf8");
assert.ok(performanceUi.includes("Recomendacion automatica"), "rendimiento debe explicar la recomendacion en espanol");
assert.ok(performanceUi.includes("Arranque sano"), "rendimiento debe distinguir estado sano");
assert.ok(performanceUi.includes("Degradaciones automaticas de render"), "rendimiento debe mostrar degradaciones automaticas");

const indexHtml = await fs.readFile(path.join(projectRoot, "index.html"), "utf8");
const script = await fs.readFile(path.join(projectRoot, "script.js"), "utf8");
const appMapInteractions = await fs.readFile(path.join(projectRoot, "app-map-interactions.js"), "utf8");
assert.ok(indexHtml.includes('id="map"'), "la pantalla principal debe conservar contenedor de mapa/canvas");
assert.ok(indexHtml.includes('id="map-mode-toggle"'), "la UI debe exponer cambio 2D/3D");
assert.ok(indexHtml.includes('id="intro-start-button"'), "la portada debe tener CTA para entrar al mapa");
assert.ok(indexHtml.includes('data-modal-initial-focus'), "la portada debe declarar un foco inicial accesible");
assert.ok(indexHtml.includes('aria-labelledby="country-panel-title" tabindex="-1"'), "ficha pais debe exponer semantica de dialogo");
assert.ok(indexHtml.includes('id="compare-hub-label"'), "los accesos inferiores deben usar etiquetas legibles");
assert.ok(indexHtml.includes('aria-controls="country-modal"'), "el acceso mobile a ficha debe declarar su dialogo controlado");
assert.ok(indexHtml.includes('aria-disabled="true" disabled'), "la ficha mobile debe iniciar deshabilitada sin pais seleccionado");
assert.ok(indexHtml.includes('id="mobile-more-menu" role="toolbar"'), "herramientas secundarias mobile deben vivir en un menu rapido");
assert.ok(indexHtml.includes('data-mobile-hub-target="compare-hub-panel"'), "menu mobile debe conservar acceso al comparador");
assert.ok(css.includes("body.modal-open #top-controls"), "los modales deben reducir distracciones del shell");
assert.ok(css.includes(".country-profile > .panel-actions-row"), "acciones de ficha deben usar una grilla compacta y estable");
assert.ok(css.includes(".country-title .coat-visual"), "encabezado mobile debe evitar que el escudo se superponga al cierre");
assert.ok(css.includes(".panel-section[open] summary::after"), "secciones desplegables deben indicar su estado");
assert.ok(script.includes("constrainedInitialDevice ? \"none\" : \"countries\""), "mobile debe arrancar con etiquetas reducidas");
assert.ok(script.includes("requestSceneRender = () =>"), "canvas debe usar scheduler de render");
assert.ok(script.includes("startPerformanceMonitor"), "canvas debe tener monitor FPS para detectar congelamiento");
assert.ok(script.includes("viewer.scene.postRender.addEventListener"), "monitor visual debe observar frames reales del canvas");
assert.ok(!script.includes("performanceMonitorId = requestAnimationFrame"), "monitor visual no debe sostener un loop RAF permanente");
assert.ok(script.includes("recordMapDegradation"), "canvas debe registrar degradaciones automaticas");
assert.ok(script.includes("searchMemory.hidden = true"), "memoria de busqueda debe iniciar cerrada hasta recibir foco");
assert.ok(script.includes('element.toggleAttribute("inert", hasOpenModal)'), "fondo modal debe quedar fuera de la navegacion por teclado");
assert.ok(script.includes("containModalKeyboardFocus"), "modales deben contener el foco de teclado");
assert.ok(script.includes("modalFocusReturnTarget"), "modales deben restaurar el foco al cerrarse");
assert.ok(script.includes("function syncMobilePanelControlState"), "controles mobile deben sincronizar disponibilidad y estado expandido");
assert.ok(script.includes('li.setAttribute("aria-pressed", "true")'), "seleccion de ranking debe anunciar su estado");
assert.ok(script.includes("activeRankingKey === rankingKey"), "seleccion de ranking debe sobrevivir al rerender de datos");
assert.ok(script.includes("function getUniqueDisplayLabels"), "filtros deben unificar etiquetas equivalentes por tildes y mayusculas");
assert.ok(script.includes("formatNumber(Math.round(capital.population))"), "poblacion de capital debe mostrarse como habitantes enteros");
assert.ok(script.includes("formatNumber(Math.round(city.population))"), "poblacion de ciudades debe mostrarse como habitantes enteros");
assert.ok(script.includes('button.setAttribute("aria-pressed", String(selected))'), "ficha debe confirmar cuando un pais esta en el comparador");
assert.ok(script.includes('button.classList.toggle("is-active", active)'), "navegacion de ficha debe mostrar la seccion elegida");
assert.ok(script.includes("function closeMobileHubPanels"), "paneles y hubs mobile deben abrirse de forma exclusiva");
assert.ok(script.includes("function toggleMobileMoreMenu"), "mobile debe agrupar herramientas secundarias bajo demanda");
assert.ok(script.includes('classList.toggle("mobile-more-open", shouldOpen)'), "menu rapido debe evitar superponerse al control 2D/3D");
assert.ok(script.includes('event => event.stopPropagation()'), "controles mobile no deben reenviar el toque al mapa");
assert.ok(script.includes('originalEvent?.target?.closest?.("#mobile-panel-controls, #mobile-more-menu")'), "mapa debe ignorar eventos nacidos en controles mobile");
assert.ok(script.includes('panel.querySelector("summary")?.focus'), "hub abierto desde mobile debe recibir foco visible");
assert.ok(css.includes("#mobile-more-menu"), "menu rapido mobile debe tener layout propio");
assert.ok(script.includes("openMobilePanel(panel)"), "toggle mobile debe usar el flujo completo de apertura");
assert.ok(script.includes("rankingsPanel.open = true"), "acceso mobile a rankings debe mostrar el contenido con un solo toque");
assert.ok(script.includes('focusedElement?.closest("#search-suggestions")'), "ficha abierta desde busqueda debe devolver foco al buscador");
assert.ok(appMapInteractions.includes("isMobile || mode === \"2d\""), "hover mobile/2D debe quedar reducido");
assert.ok(script.includes('applyMapMode("2d", false)'), "FPS critico sostenido debe poder degradar automaticamente a 2D");
assert.ok(script.includes("sustainedCriticalFpsWindows >= 3"), "degradacion critica debe exigir varias ventanas y evitar falsos positivos");
assert.ok(script.includes('declaredParent: typeof conflict === "object"'), "jerarquia de conflictos debe conservar padres explicitos curados");
assert.ok(script.includes("renderConflictTrustBadges"), "modal de conflicto debe exponer confianza y estado de curaduria");
const conflictParentResolver = script.slice(
  script.indexOf("function getConflictParentName"),
  script.indexOf("function inferConflictType")
);
assert.ok(!conflictParentResolver.includes("detail.related"), "conflictos relacionados no deben convertirse en padres jerarquicos");

console.log("visual-hygiene.test.js ok");
