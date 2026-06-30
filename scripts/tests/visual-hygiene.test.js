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
  "app-help-ui.js",
  "app-performance-ui.js",
  "app-ui-polish.js"
];

const forbiddenVisibleTokens = [
  "Ã—",
  "Â·",
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
assert.ok(css.includes("#startup-status"), "arranque debe mostrar estado visible mientras el mapa se inicializa");
assert.ok(css.includes("body.globe-loading #startup-status"), "estado de arranque debe depender del estado real de carga");
assert.ok(css.includes(".performance-status-banner"), "panel de rendimiento debe exponer estado visual de arranque");
assert.ok(css.includes(".performance-recommendation-card"), "panel de rendimiento debe exponer recomendacion automatica");
assert.ok(polishCss.includes("--ui-radius: 8px"), "componentes diferidos deben usar radio visual compacto");
assert.ok(polishCss.includes("min-height: 44px"), "controles tactiles deben conservar un objetivo comodo");
assert.ok(polishCss.includes(".product-start-card"), "portada debe exponer accesos guiados con estilo diferido");
assert.ok(polishCss.includes(".product-trust-strip"), "portada debe mostrar confianza de datos sin cargar mas CSS critico");
assert.ok(polishCss.includes(".rank-link.is-active"), "rankings deben mostrar seleccion activa");
assert.ok(polishCss.includes(".theme-picker-button.is-active"), "capas tematicas deben mostrar seleccion activa");
assert.ok(polishCss.includes(".rank-empty-state"), "rankings deben mostrar estado vacio no interactivo");
assert.ok(polishCss.includes(".country-title > .coat-visual"), "cabecera de ficha debe reservar espacio al escudo");
assert.ok(polishCss.includes(".conflict-trust-badge"), "modal de conflicto debe mostrar calidad de dato sin ocupar una seccion completa");
assert.ok(polishCss.includes("#offline-status.offline-state-inline"), "estado offline debe tener tratamiento visual diferido");
assert.ok(polishCss.includes("--ui-surface-raised"), "pulido diferido debe definir una superficie elevada reutilizable");
assert.ok(polishCss.includes(".panel-section[open]"), "secciones abiertas deben ganar jerarquia visual");
assert.ok(polishCss.includes("body.mobile-more-open #toggle-more-panel"), "controles mobile deben indicar que menu esta activo");
assert.ok(polishCss.includes(".timeline-item:hover"), "cards densas deben tener hover/foco visual consistente");
assert.ok(polishCss.includes("@keyframes countrySkeletonSweep"), "skeletons de ficha deben comunicar carga sin congelar la UI");

const performanceUi = await fs.readFile(path.join(projectRoot, "app-performance-ui.js"), "utf8");
const uiPolish = await fs.readFile(path.join(projectRoot, "app-ui-polish.js"), "utf8");
assert.ok(performanceUi.includes("Recomendacion automatica"), "rendimiento debe explicar la recomendacion en espanol");
assert.ok(performanceUi.includes("Arranque sano"), "rendimiento debe distinguir estado sano");
assert.ok(performanceUi.includes("Degradaciones automaticas de render"), "rendimiento debe mostrar degradaciones automaticas");

const indexHtml = await fs.readFile(path.join(projectRoot, "index.html"), "utf8");
const script = await fs.readFile(path.join(projectRoot, "script.js"), "utf8");
const normalizedScript = script.replace(/\r\n/g, "\n");
const appMapInteractions = await fs.readFile(path.join(projectRoot, "app-map-interactions.js"), "utf8");
assert.ok(indexHtml.includes('id="map"'), "la pantalla principal debe conservar contenedor de mapa/canvas");
assert.ok(indexHtml.includes('id="map-mode-toggle"'), "la UI debe exponer cambio 2D/3D");
assert.ok(indexHtml.includes('id="intro-start-button"'), "la portada debe tener CTA para entrar al mapa");
assert.ok(indexHtml.includes('id="help-modal-body"'), "guia rapida debe conservar contenedor accesible");
assert.ok(!indexHtml.includes("Como usar GeoRisk"), "contenido largo de guia debe cargarse bajo demanda");
assert.ok(indexHtml.includes('id="startup-status"'), "la pantalla inicial debe reservar feedback de arranque");
assert.ok(indexHtml.includes('class="startup-progress"'), "estado de arranque debe incluir progreso visual liviano");
assert.ok(indexHtml.includes('class="product-start-grid"'), "portada debe guiar los primeros flujos del usuario");
assert.ok(indexHtml.includes('data-intro-action="search"'), "portada debe ofrecer busqueda como flujo principal");
assert.ok(indexHtml.includes('data-intro-action="risk"'), "portada debe ofrecer radar de riesgo como flujo principal");
assert.ok(indexHtml.includes('data-intro-action="compare"'), "portada debe ofrecer comparador como flujo principal");
assert.ok(indexHtml.includes('data-intro-action="conflicts"'), "portada debe ofrecer conflictos como flujo principal");
assert.ok(indexHtml.includes('class="product-trust-strip"'), "portada debe resumir confianza y curaduria de datos");
assert.ok(indexHtml.includes('data-modal-initial-focus'), "la portada debe declarar un foco inicial accesible");
assert.ok(indexHtml.includes('aria-labelledby="country-panel-title" tabindex="-1"'), "ficha pais debe exponer semantica de dialogo");
assert.ok(indexHtml.includes('id="compare-hub-label"'), "los accesos inferiores deben usar etiquetas legibles");
assert.ok(indexHtml.includes('aria-controls="country-modal"'), "el acceso mobile a ficha debe declarar su dialogo controlado");
assert.ok(indexHtml.includes('aria-disabled="true" disabled'), "la ficha mobile debe iniciar deshabilitada sin pais seleccionado");
assert.ok(indexHtml.includes('id="mobile-more-menu" role="toolbar"'), "herramientas secundarias mobile deben vivir en un menu rapido");
assert.ok(indexHtml.includes('data-mobile-hub-target="compare-hub-panel"'), "menu mobile debe conservar acceso al comparador");
assert.ok(indexHtml.includes('id="layers-summary-active"'), "panel de capas debe mostrar la capa activa sin obligar a abrirlo");
assert.ok(indexHtml.includes('id="theme-filter-input"'), "panel de capas debe permitir filtrar capas tematicas");
assert.ok(indexHtml.includes('id="theme-quick-grid"'), "panel de capas debe exponer botones rapidos de capa");
assert.ok(css.includes("body.modal-open #top-controls"), "los modales deben reducir distracciones del shell");
assert.ok(css.includes("body.layers-panel-open #compare-hub-panel"), "panel de capas abierto debe ocultar hubs inferiores para evitar superposicion");
assert.ok(css.includes("body.layers-panel-open #news-hub-panel"), "panel de capas abierto debe ocultar noticias para evitar superposicion");
assert.ok(css.includes(".country-profile > .panel-actions-row"), "acciones de ficha deben usar una grilla compacta y estable");
assert.ok(css.includes(".country-title .coat-visual"), "encabezado mobile debe evitar que el escudo se superponga al cierre");
assert.ok(css.includes(".panel-section[open] summary::after"), "secciones desplegables deben indicar su estado");
assert.ok(script.includes("constrainedInitialDevice ? \"none\" : \"countries\""), "mobile debe arrancar con etiquetas reducidas");
assert.ok(script.includes("function setStartupStatus"), "arranque debe informar fases sin bloquear la UI");
assert.ok(script.includes("function runIntroAction"), "portada debe convertir acciones guiadas en flujo real");
assert.ok(script.includes('help: "./app-help-ui.js'), "guia rapida debe cargarse como modulo diferido");
assert.ok(script.includes("renderHelpModalContent"), "guia rapida debe renderizarse bajo demanda");
assert.ok(script.includes("setTheme(\"riskRadar\")"), "accion de riesgo debe activar la capa de radar");
assert.ok(script.includes("setTheme(\"conflicts\")"), "accion de conflictos debe activar la capa de conflictos");
assert.ok(script.includes("openCompareHubFromIntro"), "accion de comparador debe abrir el hub correcto");
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
assert.ok(normalizedScript.includes("if (!target) {\n    return;\n  }\n  target.innerHTML = \"\";"), "listas interactivas deben tolerar contenedores diferidos ausentes");
assert.ok(script.includes("rank-empty-state"), "listas interactivas deben mostrar un estado vacio claro");
assert.ok(uiPolish.includes("document.body.dataset.networkState"), "pulido visual debe exponer estado de red en el body");
assert.ok(uiPolish.includes('status.setAttribute("aria-live", "polite")'), "estado offline debe anunciar cambios sin interrumpir");
assert.ok(script.includes("function getUniqueDisplayLabels"), "filtros deben unificar etiquetas equivalentes por tildes y mayusculas");
assert.ok(script.includes("formatNumber(Math.round(capital.population))"), "poblacion de capital debe mostrarse como habitantes enteros");
assert.ok(script.includes("formatNumber(Math.round(city.population))"), "poblacion de ciudades debe mostrarse como habitantes enteros");
assert.ok(script.includes('button.setAttribute("aria-pressed", String(selected))'), "ficha debe confirmar cuando un pais esta en el comparador");
assert.ok(script.includes('button.classList.toggle("is-active", active)'), "navegacion de ficha debe mostrar la seccion elegida");
assert.ok(script.includes("function closeMobileHubPanels"), "paneles y hubs mobile deben abrirse de forma exclusiva");
assert.ok(script.includes("function syncLayersPanelState"), "panel de capas debe sincronizar hubs inferiores al abrir/cerrar");
assert.ok(script.includes('document.body.classList.toggle("layers-panel-open", isOpen)'), "panel de capas debe publicar estado abierto al CSS");
assert.ok(script.includes('themeQuickGrid?.addEventListener("click"'), "botones rapidos de capas deben tener handler propio");
assert.ok(script.includes("setTheme(button.dataset.themePicker"), "botones rapidos de capas deben aplicar la misma logica del selector");
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

const themeSelectStart = indexHtml.indexOf('<select id="theme-select"');
const themeSelectEnd = indexHtml.indexOf("</select>", themeSelectStart);
const themeOptions = [...indexHtml.slice(themeSelectStart, themeSelectEnd).matchAll(/<option value="([^"]+)"/g)].map(match => match[1]);
const pickerGroupBlock = script.match(/const THEME_PICKER_GROUPS = \[([\s\S]*?)\];/)?.[1] || "";
const pickerThemes = [...pickerGroupBlock.matchAll(/items:\s*\[([^\]]+)\]/g)]
  .flatMap(match => [...match[1].matchAll(/"([^"]+)"/g)].map(item => item[1]));
assert.deepEqual(new Set(pickerThemes), new Set(themeOptions), "cada capa del selector debe tener boton rapido equivalente");
assert.equal(pickerThemes.length, themeOptions.length, "los botones rapidos de capas no deben repetir opciones");

console.log("visual-hygiene.test.js ok");
