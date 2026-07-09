import assert from "node:assert/strict";
import fs from "fs-extra";
import path from "path";

const projectRoot = path.resolve(process.cwd());
const full = await fs.readJson(path.join(projectRoot, "data", "countries_full.json"));
const index = await fs.readJson(path.join(projectRoot, "data", "countries_index.json"));
const conflictsIndex = await fs.readJson(path.join(projectRoot, "data", "conflicts_index.json"));
const timelineIndex = await fs.readJson(path.join(projectRoot, "data", "timeline_index.json"));
const searchIndex = await fs.readJson(path.join(projectRoot, "data", "search_index.json"));
const countryWeights = await fs.readJson(path.join(projectRoot, "data", "country_weights.json"));
const dataManifest = await fs.readJson(path.join(projectRoot, "data", "data_manifest.json"));
const conflictDetailsIndex = await fs.readJson(path.join(projectRoot, "data", "conflicts", "details_index.json"));
const sw = await fs.readFile(path.join(projectRoot, "sw.js"), "utf8");
const indexHtml = await fs.readFile(path.join(projectRoot, "index.html"), "utf8");
const script = await fs.readFile(path.join(projectRoot, "script.js"), "utf8");
const appRuntime = await fs.readFile(path.join(projectRoot, "app-runtime.js"), "utf8");
const appBootScheduler = await fs.readFile(path.join(projectRoot, "app-boot-scheduler.js"), "utf8");
const appMap = await fs.readFile(path.join(projectRoot, "app-map.js"), "utf8");
const appMapStyles = await fs.readFile(path.join(projectRoot, "app-map-styles.js"), "utf8");
const appMapInteractions = await fs.readFile(path.join(projectRoot, "app-map-interactions.js"), "utf8");
const appStore = await fs.readFile(path.join(projectRoot, "app-store.js"), "utf8");
const appUiPolish = await fs.readFile(path.join(projectRoot, "app-ui-polish.js"), "utf8");
const stylePolish = await fs.readFile(path.join(projectRoot, "style-polish.css"), "utf8");
const rankingsWorker = await fs.readFile(path.join(projectRoot, "app-rankings-worker.js"), "utf8");
const searchWorker = await fs.readFile(path.join(projectRoot, "app-search-worker.js"), "utf8");
const appSearch = await fs.readFile(path.join(projectRoot, "app-search.js"), "utf8");
const appRankings = await fs.readFile(path.join(projectRoot, "app-rankings.js"), "utf8");
const appNews = await fs.readFile(path.join(projectRoot, "app-news-ui.js"), "utf8");
const appCompare = await fs.readFile(path.join(projectRoot, "app-compare-ui.js"), "utf8");
const appQuiz = await fs.readFile(path.join(projectRoot, "app-quiz-ui.js"), "utf8");
const perCountryDir = path.join(projectRoot, "data", "countries");
const perCountryConflictsDir = path.join(perCountryDir, "conflicts");
const perCountryFiles = (await fs.readdir(perCountryDir)).filter(file => file.endsWith(".json"));
const appShellMatch = sw.match(/const APP_SHELL = \[([\s\S]*?)\];/);
assert.ok(appShellMatch, "service worker debe declarar APP_SHELL");
const appShellBlock = appShellMatch[1];

assert.equal(Object.keys(index).length, Object.keys(full).length);
assert.equal(perCountryFiles.length, Object.keys(full).length);
assert.ok(Buffer.byteLength(JSON.stringify(index)) < Buffer.byteLength(JSON.stringify(full)) * 0.34);
assert.ok(Buffer.byteLength(JSON.stringify(index)) < 200000, "countries_index debe quedar por debajo de 200 KB");
const heavyIndexProfileFields = Object.entries(index).flatMap(([code, country]) => {
  const issues = [];
  if (country.general?.stateStructure) issues.push({ code, field: "general.stateStructure" });
  if (Array.isArray(country.general?.cities) && country.general.cities.length) issues.push({ code, field: "general.cities" });
  return issues;
});
assert.deepEqual(heavyIndexProfileFields, [], "countries_index no debe incluir campos de ficha que se cargan bajo demanda");
assert.ok(Array.isArray(conflictsIndex) && conflictsIndex.length > 1000, "debe existir indice liviano de conflictos");
assert.equal(conflictsIndex.filter(conflict => !Number.isFinite(conflict.startYear)).length, 0, "indice publico de conflictos no debe publicar entradas sin fecha");
assert.ok(Array.isArray(timelineIndex) && timelineIndex.length > 1000, "debe existir indice liviano de timeline");
assert.equal(searchIndex.length, Object.keys(full).length, "indice de busqueda debe cubrir todos los paises");
assert.ok(Buffer.byteLength(JSON.stringify(searchIndex)) < 220000, "search_index debe mantenerse liviano");
assert.equal(countryWeights.summary.totalCountries, Object.keys(full).length, "metadata de peso debe cubrir todos los paises");
assert.equal(countryWeights.summary.tooLargeCount, 0, "las fichas publicas deben quedar bajo el presupuesto de peso");
assert.ok(countryWeights.summary.largest.every(item => item.bytes < countryWeights.thresholdBytes), "ninguna ficha publica debe superar el umbral");
assert.ok(dataManifest.prodExcludes.includes("reports/*.json"), "build prod debe excluir reports/*.json");
assert.ok(dataManifest.internalTechnical.files.includes("data/countries_full.json"), "countries_full debe quedar marcado como tecnico interno");
assert.ok(dataManifest.productionPublic.files.includes("data/countries/conflicts/*.json"), "shards de conflictos por pais deben documentarse como datos publicos bajo demanda");
const curationAudit = await fs.readJson(path.join(projectRoot, "reports", "data-curation-audit.json"));
assert.ok(curationAudit.conflictDateQuality?.pendingCount > 0, "auditoria debe listar conflictos pendientes de fecha fuera del indice publico");
assert.ok(conflictDetailsIndex.conflicts.length > 100, "detalles de conflictos deben dividirse en shards bajo demanda");
assert.ok(script.includes("data/conflicts_index.json"), "runtime debe consultar el indice publico liviano de conflictos bajo demanda");
assert.ok(script.includes("data/conflicts/details_index.json"), "runtime debe consultar el indice liviano de detalles");
assert.equal((script.match(/conflict_details\.generated\.json/g) || []).length, 0, "runtime no debe descargar el monolito de conflictos");
for (const detail of conflictDetailsIndex.conflicts.slice(0, 10)) {
  assert.ok(await fs.pathExists(path.join(projectRoot, detail.path)), `shard faltante: ${detail.path}`);
}

let largestCountryShard = 0;
for (const file of perCountryFiles) {
  const countryShardPath = path.join(perCountryDir, file);
  const countryShard = await fs.readJson(countryShardPath);
  largestCountryShard = Math.max(largestCountryShard, (await fs.stat(countryShardPath)).size);
  assert.ok(!Object.hasOwn(countryShard, "conflicts"), `${file} no debe duplicar conflictos en raiz`);
  for (const conflict of countryShard.military?.conflicts || []) {
    assert.ok(!Object.hasOwn(conflict, "cause"), `${file} debe cargar causas por shard de conflicto`);
    assert.ok(!Object.hasOwn(conflict, "participants"), `${file} debe cargar participantes por shard de conflicto`);
    assert.ok(!Object.hasOwn(conflict, "chronology"), `${file} debe cargar cronologia por shard de conflicto`);
  }
}
assert.ok(largestCountryShard < 42000, `la ficha publica mas pesada debe quedar bajo 42 KB; actual ${largestCountryShard}`);
for (const code of ["USA", "GBR", "FRA"]) {
  const countryShard = await fs.readJson(path.join(perCountryDir, `${code}.json`));
  const conflictShardPath = path.join(perCountryConflictsDir, `${code}.json`);
  const conflictShard = await fs.readJson(conflictShardPath);
  assert.equal(countryShard.military.conflictsComplete, false, `${code} debe iniciar con conflictos bajo demanda`);
  assert.equal(countryShard.military.conflicts.length, countryShard.military.conflictsPreviewCount, `${code} debe exponer solo preview de conflictos`);
  assert.equal(conflictShard.length, countryShard.military.conflictCount, `${code} debe conservar lista completa en shard`);
  assert.ok((await fs.stat(conflictShardPath)).size > (await fs.stat(path.join(perCountryDir, `${code}.json`))).size, `${code} debe mover el peso militar al shard bajo demanda`);
}

for (const code of ["ATA", "GRL", "GUF", "TWN", "PSE", "-99"]) {
  assert.ok(index[code], `${code} debe existir en el indice liviano`);
  assert.ok(index[code].name, `${code} debe conservar nombre en el indice`);
  assert.ok(index[code].general?.officialName, `${code} debe conservar ficha basica`);
  assert.ok(await fs.pathExists(path.join(perCountryDir, `${code}.json`)), `${code} debe tener ficha bajo demanda`);
}

assert.ok(sw.includes("./data/countries_index.json"));
assert.ok(!appShellBlock.includes("countries_full.json"), "countries_full no debe entrar en APP_SHELL");
assert.ok(!appShellBlock.includes("conflict_details.generated.json"), "conflictos pesados no deben entrar en APP_SHELL");
assert.ok(!appShellBlock.includes("reports/"), "reportes internos no deben entrar en APP_SHELL");
assert.ok(!appShellBlock.includes("world_countries_simplified.geo.json"), "GeoJSON no debe entrar en APP_SHELL");
assert.ok(!appShellBlock.includes("assets/flags"), "banderas no deben entrar en APP_SHELL");
assert.ok(!appShellBlock.includes("assets/coats"), "escudos no deben entrar en APP_SHELL");
assert.ok(!sw.includes("./data/countries_full.json\""), "countries_full no debe precachearse en el shell inicial");
assert.ok(!sw.includes("./data/conflict_details.generated.json\""), "conflictos pesados no deben precachearse al inicio");
assert.ok(!sw.includes("./data/raw/history.json\""), "raw history debe cargarse bajo demanda");
assert.ok(!sw.includes("./data/raw/politics.json\""), "raw politics debe cargarse bajo demanda");
assert.ok(!sw.includes("./data/raw/inflation.json\""), "raw inflation debe cargarse bajo demanda");
assert.ok(!sw.includes("./data/raw/religion.json\""), "raw religion debe cargarse bajo demanda");
assert.ok(!sw.includes("./app-curation.js\""), "app-curation debe cargarse despues del arranque inicial");
assert.ok(!sw.includes("./app-news-ui.js\""), "noticias no debe precachearse en el shell inicial");
assert.ok(!sw.includes("./app-compare-ui.js\""), "comparador no debe precachearse en el shell inicial");
assert.ok(!sw.includes("./app-quiz-ui.js\""), "quiz no debe precachearse en el shell inicial");
assert.ok(!sw.includes("./app-conflict-aliases.js\""), "alias pesados de conflictos no deben precachearse en el shell inicial");
assert.ok(!sw.includes("./assets/coats/"), "escudos pesados deben cargarse bajo demanda");
assert.ok(!sw.includes("./assets/flags/"), "banderas deben cargarse bajo demanda");
assert.ok(!sw.includes("./data/world_countries_simplified.geo.json\""), "GeoJSON debe cachearse bajo demanda, no durante install");
assert.ok(sw.includes("Promise.allSettled"), "service worker debe tolerar fallas parciales de precache");
assert.ok(sw.includes("HEAVY_RUNTIME_PATHS"), "service worker debe reconocer datasets pesados bajo demanda");
assert.ok(sw.includes("RUNTIME_CACHEABLE_PATHS"), "service worker debe cachear GeoJSON, banderas y escudos solo bajo demanda");
assert.ok(sw.includes("RUNTIME_CACHE"), "service worker debe separar cache runtime del shell");
assert.ok(sw.includes("key.startsWith(\"geo-risk-\")"), "service worker debe borrar caches viejos de GeoRisk agresivamente");
assert.ok(sw.includes("MAX_RUNTIME_CACHE_ENTRIES"), "service worker debe limitar cache runtime");
assert.ok(/if \(isHeavyRuntimeRequest\(url\)\) \{\s*event\.respondWith\(fetch\(event\.request\)\)/.test(sw), "datasets pesados deben usar red sin guardarse en CacheStorage");
assert.ok(!sw.includes("https://cesium.com/downloads/cesiumjs/releases/1.127/Build/Cesium/Cesium.js\""), "Cesium remoto no debe precachearse en install");
assert.ok(!indexHtml.includes("app-curation.js"), "index.html no debe bloquear el arranque con app-curation");
assert.ok(!indexHtml.includes("fonts.googleapis.com"), "la fuente web no debe bloquear el primer render");
assert.ok(!indexHtml.includes("app-news-ui.js"), "noticias debe cargarse bajo demanda");
assert.ok(!indexHtml.includes("app-compare-ui.js"), "comparador debe cargarse bajo demanda");
assert.ok(!indexHtml.includes("app-quiz-ui.js"), "quiz debe cargarse bajo demanda");
assert.ok(!indexHtml.includes("app-risk-radar-ui.js"), "radar debe cargarse bajo demanda");
assert.ok(!indexHtml.includes("app-conflict-audit-ui.js"), "auditoria debe cargarse bajo demanda");
assert.ok(!indexHtml.includes("app-conflict-aliases.js"), "alias pesados de conflictos deben cargarse bajo demanda");
assert.ok(!indexHtml.includes("app-project-audit-ui.js"), "auditoria de proyecto debe cargarse bajo demanda");
assert.ok(!indexHtml.includes("html2canvas"), "html2canvas debe cargarse bajo demanda al exportar");
assert.ok(!indexHtml.includes("jspdf"), "jspdf debe cargarse bajo demanda al exportar PDF");
assert.ok(!indexHtml.includes("app-performance-ui.js"), "panel de rendimiento debe cargarse bajo demanda");
assert.ok(!sw.includes("html2canvas"), "html2canvas no debe precachearse en el shell inicial");
assert.ok(!sw.includes("jspdf"), "jspdf no debe precachearse en el shell inicial");
assert.ok(Buffer.byteLength(indexHtml) < 35000, "index.html debe mantenerse liviano");
assert.ok(Buffer.byteLength(sw) < 7000, "service worker debe mantenerse liviano");
assert.ok(indexHtml.includes("intro-runtime-grid"), "portada debe mostrar estado runtime");
assert.ok(indexHtml.includes("intro-data-grid"), "portada debe mostrar cobertura del dataset");
assert.ok(!indexHtml.includes("Como usar GeoRisk"), "guia larga no debe vivir en el HTML critico");
assert.ok(script.includes("setupIntroModalControls(modal)"), "portada debe conectar sus controles al abrirse");
assert.ok(script.includes("closeIntroModal?.(false)"), "inicio no debe marcar la portada como vista al cerrarla preventivamente");
assert.ok(script.includes('localStorage.getItem(STORAGE_KEYS.introSeen) !== "true"'), "portada automatica debe respetar si ya fue vista");
assert.ok(indexHtml.includes("open-performance-button"), "UI debe exponer panel interno de rendimiento");
assert.ok(indexHtml.includes("open-risk-radar-button"), "UI debe exponer radar de riesgo multiparametrico");
assert.ok(indexHtml.includes("open-conflict-audit-button"), "UI debe exponer auditoria interna de conflictos");
assert.ok(indexHtml.includes("open-project-audit-button"), "UI debe exponer auditoria interna del proyecto");
assert.ok(!indexHtml.includes("boot-floating-chip"), "la app no debe mostrar chip flotante de arranque");
assert.ok(!indexHtml.includes("boot-profile-chip"), "la app no debe mostrar chip de arranque en el panel principal");
assert.ok(indexHtml.includes('id="render-profile-chip" type="button"'), "chip de render debe ser accionable");
assert.ok(indexHtml.includes('id="dataset-health-chip" type="button"'), "chip de dataset debe ser accionable");
for (const id of ["intro-country-count", "intro-conflict-count", "intro-layer-count", "intro-special-count"]) {
  assert.ok(indexHtml.includes(id), `portada debe exponer ${id}`);
}
assert.ok(indexHtml.includes("clear-local-cache-button"), "UI debe permitir limpiar cache offline");
assert.ok(indexHtml.includes("Limpiar cache offline"), "boton de limpieza debe mencionar cache offline explicitamente");
assert.ok(indexHtml.includes("offline-cache-size"), "UI debe mostrar tamano aproximado del cache offline");
assert.ok(!indexHtml.includes("Ã—"), "botones de cierre no deben tener mojibake visible");
for (const token of ["AÃ", "Ãƒ", "Ã‚", "Â¿", "Â¡", "Ã—"]) {
  assert.ok(!indexHtml.includes(token), `index.html no debe exponer mojibake visible: ${token}`);
}
assert.ok(!script.includes(".then(() => loadFullCountryData())"), "countries_full no debe encadenarse al arranque inmediato");
assert.ok(!script.includes("scheduleFullCountryDataLoad"), "countries_full no debe precargarse automaticamente por scheduler");
assert.ok(!script.includes("startFullLoad"), "countries_full no debe tener disparador silencioso de runtime");
assert.ok(!script.includes("async function loadFullCountryData()"), "countries_full no debe conservar un loader global sin consumidores");
assert.equal((script.match(/countries_full\.json/g) || []).length, 1, "countries_full solo debe quedar como fallback del indice");
assert.ok(script.includes("async function loadCountryDetail"), "fichas deben cargar detalle por pais bajo demanda");
assert.ok(script.includes("async function loadCountryConflictDetail"), "conflictos completos por pais deben cargar bajo demanda");
assert.ok(script.includes("const detailedCountry = await loadCountryDetail(countryCode)"), "una ficha cacheada debe salir del skeleton al reabrirse");
assert.ok(script.includes("await loadCountryConflictDetail(currentPanelState.code)"), "seccion militar debe cargar su shard antes de renderizar detalle");
assert.ok(script.includes("sectionId === \"country-section-military\""), "curaduria profunda debe esperar a una seccion de historia o conflictos");
assert.ok(script.includes("data-country-load-section=\"country-section-military\""), "arbol militar debe renderizarse solo al abrir su seccion");
assert.ok(script.includes("const shouldRenderMilitaryDetail = countryLoadedSections.includes(\"country-section-military\")"), "jerarquia militar debe tener compuerta explicita por seccion abierta");
assert.ok(script.includes("shouldRenderMilitaryDetail ? buildConflictGroups(conflictsSinceFormation) : []"), "arbol de conflictos no debe armarse mientras la seccion militar esta cerrada");
assert.ok(script.includes("function renderConflicts(conflicts, prebuiltGroups = null)"), "render de conflictos debe poder reutilizar grupos ya calculados");
assert.ok(script.includes("warParticipationCountCache"), "conteo de participacion belica debe cachearse para rankings/radar");
assert.ok(/function invalidateCountryDerivedCaches\(\)[\s\S]{0,350}warParticipationCountCache\.clear\(\)/.test(script), "cache de participacion belica debe invalidarse con los datos derivados");
assert.ok(/mergeImportedConflictDetails\(curatedConflictDetailOverrides\);[\s\S]{0,120}invalidateCountryDerivedCaches\(\)/.test(script), "curaduria diferida debe invalidar caches de rankings y conflictos");
assert.ok(/function getFilteredCountries[\s\S]{0,120}getCountryValues\(\)\.filter/.test(script), "filtros principales deben reutilizar cache de paises");
assert.ok(/function generateTopPopulation[\s\S]{0,120}getCountryValues\(\)/.test(script), "rankings basicos deben reutilizar cache de paises");
assert.ok(script.includes("function renderDeferredCountrySectionPrompt"), "secciones cerradas de ficha no deben renderizar contenido pesado");
assert.ok(!script.includes("buildQuizQuestion = function buildQuizQuestion"), "quiz no debe pisar el generador avanzado con fallback legado");
assert.ok(/function buildQuizQuestion\(category\)[\s\S]{0,500}quizUi\.buildQuestionBank/.test(script), "quiz debe usar banco generado diferido cuando esta disponible");
assert.ok(/function buildQuizQuestion\(category\)[\s\S]{0,2200}category === "language"[\s\S]{0,450}category === "bloc"[\s\S]{0,450}category === "conflict"/.test(script), "quiz fallback debe conservar idiomas, bloques y conflictos");
assert.ok(script.includes("data-conflict-expand-children"), "campanas y batallas anidadas deben expandirse por tandas");
assert.ok(/function rerenderCurrentPanel\(\)[\s\S]{0,1500}setTimeout\(flush, 0\)/.test(script), "rerender de panel no debe depender de frames visibles");
assert.ok(!/bootHeavyDataEnhancements[\s\S]{0,500}loadRuntimeCuration/.test(script), "curaduria profunda no debe ejecutarse desde el arranque diferido");
assert.ok(/sectionId === "country-section-history"[\s\S]{0,220}loadRuntimeCuration/.test(script), "curaduria profunda debe activarse al abrir historia o conflictos");
assert.ok(script.includes("function setupCriticalCountrySearchIndex"), "busqueda de pais debe tener un indice critico liviano");
assert.ok(/await hydrateCountriesData\(countriesJson\);\s*setupCriticalCountrySearchIndex\(\);/.test(script), "indice critico de paises debe quedar listo al terminar la hidratacion inicial");
assert.ok(script.includes("async function openCountryByCode"), "interacciones deben centralizar apertura de ficha por codigo");
assert.ok(/if \(result\.type === "country"\)[\s\S]{0,180}await openCountryByCode\(countryCode, result\.label\)/.test(script), "busqueda de pais debe abrir ficha aunque la geometria siga cargando");
assert.ok(/function selectRankedCountry\(country\)[\s\S]{0,180}await openCountryByCode\(code/.test(script), "rankings deben abrir fichas con el mismo flujo que busqueda/mapa");
assert.ok(script.includes("function getCountryLayerByCodeOrName"), "seleccion de mapa debe resolver capas por codigo, alias o nombre");
assert.ok(/function getCountrySelectionLayers\(code, fallbackName = ""\)[\s\S]{0,260}getCountryLayerByCodeOrName/.test(script), "seleccion de pais debe tolerar capas con codigos o nombres alternativos");
assert.ok(script.includes("async function ensureCountryLayersReady"), "rankings y busqueda deben esperar capas si el mapa sigue cargando");
assert.ok(/function selectCountryLayersWhenReady[\s\S]{0,650}ensureCountryLayersReady\(\)/.test(script), "apertura de ficha debe marcar mapa cuando las capas quedan listas");
assert.ok(/let countrySelectionRequestId = 0[\s\S]{0,900}requestId !== countrySelectionRequestId/.test(script), "seleccion diferida no debe pisar la ultima ficha abierta");
assert.ok(/function selectCountryGroupLayers\(countries,[\s\S]{0,500}retryWhenReady[\s\S]{0,500}ensureCountryLayersReady/.test(script), "selecciones de continente/religion deben reintentar cuando el mapa aun no esta indexado");
assert.ok(/function getPickedCountryEntity\(picked\)[\s\S]{0,220}picked\.primitive\?\.id/.test(script), "click/hover de Cesium debe soportar entidades expuestas por primitive.id");
assert.ok(script.includes("const religionDenominationAliases = new Map()"), "busqueda debe indexar denominaciones religiosas como categoria propia");
assert.ok(script.includes("function getReligionDenominationMatches"), "denominaciones religiosas deben seleccionar paises sin degradar a familia general");
assert.ok(script.includes("function getReligionSelectionNominalPopulation"), "fichas de religion deben calcular familias y denominaciones con la metrica correcta");
assert.ok(/function getLayersForCountries\(countries\)[\s\S]{0,220}getRankedCountryCode\(country\)/.test(script), "resaltado de grupos no debe depender de identidad exacta de objetos");
assert.ok(script.includes("function renderSelectableCountryGroup"), "continentes/religiones/filtros deben poder renderizar resultados sin esperar capas");
assert.ok(/countryPanel\.addEventListener\("click"[\s\S]{0,260}data-open-country[\s\S]{0,180}openCountryByCode/.test(script), "listas grupales deben abrir fichas desde el panel");
assert.ok(/function setCountrySelection[\s\S]{0,700}requestMapRenderSafe\("country-selection"\)/.test(script), "seleccion de pais no debe asumir Cesium listo");
assert.ok(!script.includes("countryCode && countryLayers.has(countryCode) && countriesData[countryCode]"), "busqueda no debe depender de que la capa cartografica ya exista");
assert.ok(script.includes("./data/countries/${encodeURIComponent(normalizedCode)}.json"), "detalle por pais debe evitar hidratar countries_full");
assert.ok(script.includes("function scheduleWhenGlobeIsQuiet"), "tareas pesadas deben esperar a que el globo este quieto");
const geoJsonWarmupBody = script.slice(
  script.indexOf("function scheduleGeoJsonWarmup"),
  script.indexOf("function setNavigationQualityState")
);
assert.ok(!geoJsonWarmupBody.includes("category ==="), "precalentamiento GeoJSON no debe contener ramas del quiz");
assert.ok(geoJsonWarmupBody.includes("setTimeout(warm, 320)"), "precalentamiento GeoJSON debe tener fallback sin requestIdleCallback");
assert.ok(script.includes("function maybeEnhanceOpenConflictModal"), "conflictos enriquecidos deben cargarse bajo demanda al abrir modal");
assert.ok(!script.includes("scheduleWhenGlobeIsQuiet(() => {\r\n      loadWikipediaConflictDetails"), "conflictos enriquecidos no deben cargarse por temporizador de arranque");
assert.ok(script.includes("startLongTaskObserver"), "runtime debe medir bloqueos largos del hilo principal");
assert.ok(script.includes("viewer.scene.postRender.addEventListener"), "FPS debe medir renders reales de Cesium");
assert.ok(script.includes("const monitorDuration = 60000"), "monitor FPS inicial debe detenerse a los 60 segundos");
assert.ok(!script.includes("performanceMonitorId = requestAnimationFrame"), "monitor FPS no debe mantener un RAF infinito");
assert.ok(script.includes('!isMobileLayout() && activeImagerySignature.includes(":boot")'), "mobile no debe reemplazar la imagen inicial mientras se usa el globo");
assert.ok(indexHtml.includes("app-boot-scheduler.js"), "scheduler de arranque debe vivir en modulo separado");
assert.ok(indexHtml.includes("app-map.js"), "logica base de mapa debe vivir en modulo separado");
assert.ok(indexHtml.includes("app-map-styles.js"), "estilos de mapa deben vivir en modulo separado");
assert.ok(indexHtml.includes("app-map-interactions.js"), "interacciones de mapa deben vivir en modulo separado");
assert.ok(indexHtml.includes("app-store.js"), "estado compartido debe vivir en store central simple");
assert.ok(!indexHtml.includes("app-text.js"), "texto/formato debe usar fallback inicial");
assert.ok(!indexHtml.includes("app-ui-polish.js"), "polish UI/accesibilidad debe cargarse diferido");
assert.ok(script.includes("uiPolish: `./app-ui-polish.js?v=${APP_VERSION}`"), "polish UI/accesibilidad debe vivir en modulo separado versionado");
assert.ok(sw.includes("./app-map.js"), "modulo de mapa debe estar disponible offline");
assert.ok(sw.includes("./app-map-styles.js"), "modulo de estilos de mapa debe estar disponible offline");
assert.ok(sw.includes("./app-map-interactions.js"), "modulo de interacciones de mapa debe estar disponible offline");
assert.ok(sw.includes("./app-store.js"), "store central debe estar disponible offline");
assert.ok(!appShellBlock.includes("app-ui-polish.js"), "polish UI no debe entrar en APP_SHELL");
assert.ok(sw.includes("\"/app-\""), "modulos app diferidos deben quedar cacheables bajo demanda");
assert.ok(appStore.includes("createStore"), "store central debe exponer createStore");
assert.ok(appUiPolish.includes("trapFocus"), "polish UI debe exponer navegacion por teclado/foco");
assert.ok(appUiPolish.includes("style-polish.css"), "pulido visual debe cargar su hoja diferida");
assert.ok(stylePolish.includes("prefers-reduced-motion"), "pulido visual debe respetar movimiento reducido");
assert.ok(sw.includes("/style-polish.css"), "hoja visual diferida debe quedar disponible offline bajo demanda");
assert.ok(appBootScheduler.includes("scheduleWhenQuiet"), "modulo de scheduler debe exponer espera por quietud");
assert.ok(appBootScheduler.includes("PerformanceObserver"), "modulo de scheduler debe medir long tasks");
assert.ok(appBootScheduler.includes("budgetMs: 200"), "long tasks deben tener presupuesto de 200 ms");
assert.ok(appBootScheduler.includes("recordStartupFps"), "modulo de scheduler debe medir FPS inicial durante 60 segundos");
assert.ok(appMap.includes("getGeoJsonPathForMode"), "modulo de mapa debe decidir geometria 2D/3D");
assert.ok(appMap.includes("shouldDeferDetailedGeometry"), "modulo de mapa debe diferir geometria detallada");
assert.ok(appMap.includes("createDegradationLog"), "modulo de mapa debe registrar degradaciones automaticas");
assert.ok(appMapStyles.includes("createCountryStyleCache"), "modulo de estilos debe cachear pais + tema");
assert.ok(appMapStyles.includes("createStyleCacheKey"), "modulo de estilos debe crear clave estable");
assert.ok(appMapInteractions.includes("shouldEnableHover"), "modulo de interacciones debe optimizar hover mobile");
assert.ok(appMapInteractions.includes("shouldDisableLabelsForFps"), "modulo de interacciones debe cortar labels por FPS");
assert.ok(rankingsWorker.includes("rankings"), "worker de rankings debe preparar rankings fuera del hilo principal");
assert.ok(searchWorker.includes("aliases"), "worker de busqueda debe preparar aliases fuera del hilo principal");
assert.ok(appSearch.includes("parseNaturalQuery"), "busqueda debe vivir en modulo con consultas naturales");
assert.ok(appSearch.includes("groupSuggestions"), "busqueda debe agrupar sugerencias por tipo");
assert.ok(appRankings.includes("getRiskComponents"), "rankings/radar deben vivir en modulo con componentes explicables");
assert.ok(appRankings.includes("proxyFields"), "rankings deben separar metricas reales de proxies");
assert.ok(appCompare.includes("buildComparisonModel"), "comparador debe tener modelo separado");
assert.ok(appCompare.includes("buildProfessionalSections"), "comparador debe renderizar secciones profesionales desde modulo");
assert.ok(appQuiz.includes("buildQuestionBank"), "quiz debe generar banco de preguntas desde dataset");
assert.ok(appQuiz.includes("buildQuestionFromBank"), "quiz debe controlar dificultad y no repeticion");
assert.ok(script.includes("NEWS_CACHE_TTL_MS"), "noticias debe tener cache temporal");
assert.ok(script.includes("diplomacy"), "noticias debe incluir tema diplomacia");
assert.ok(script.includes("ensureDeferredUiModule(\"news\")"), "noticias debe cargar UI bajo demanda al abrir");
assert.ok(script.includes("function renderNewsArticle"), "noticias debe completar el estado de carga al recibir titulares o fallback");
assert.ok(script.includes("function getSafeNewsUrl"), "noticias debe validar URLs externas antes de renderizarlas");
assert.ok(script.includes("const listLimit = filterText ? 48 : (isMobileLayout() ? 18 : 32)"), "noticias debe limitar la lista inicial y evitar renderizar todos los paises");
assert.ok(appNews.includes("buildStateCard"), "noticias debe renderizar estados de carga/vacio desde modulo");
assert.ok(appNews.includes("news-external-link"), "noticias debe separar busqueda externa de seleccion interna");

for (const code of ["ARG", "BRA", "CHN", "ETH", "GBR", "IDN", "NGA", "USA"]) {
  assert.ok(full[code].general.languages.length >= 3, `${code} debe documentar diversidad linguistica prioritaria`);
}
for (const [code, city] of [["AFG", "Jalalabad"], ["ARM", "Vanadzor"], ["CYP", "Larnaca"], ["TUR", "Antalya"], ["VNM", "Can Tho"]]) {
  assert.ok(full[code].general.cities.some(entry => entry.name === city), `${code} debe incluir ${city}`);
}
assert.equal(full.CUB.general.capital.name, "La Habana", "capital de Cuba debe mostrarse en espanol");
for (const [code, country] of Object.entries(full)) {
  assert.ok(!(country.military?.conflicts || []).some(conflict => /^Q\d+$/i.test(conflict.name)), `${code} no debe exponer identificadores tecnicos como conflictos`);
}
assert.ok(script.includes("getCachedRanking"), "rankings deben cachearse por revision del dataset");
assert.ok(script.includes("countryStyleCache"), "estilos de pais deben cachearse");
assert.ok(script.includes("lastStyleRefreshSignature"), "UI debe evitar recalcular estilos si tema/firma no cambio");
assert.ok(script.includes("mapDegradationLog"), "runtime debe conservar logging interno de degradaciones");
assert.ok(script.includes("requestRenderMode: true"), "Cesium debe usar requestRenderMode");
assert.ok(script.includes("maximumRenderTimeChange"), "runtime debe limitar renders automaticos");
assert.ok(script.includes("function isRankingsPanelOpen"), "rankings no deben recalcularse si el panel esta cerrado");
assert.ok(script.includes("getCountryValues"), "UI debe reutilizar lista cacheada de paises");
assert.ok(script.includes("MAX_RESOURCE_CACHE_ENTRIES = 36"), "cache en memoria debe tener limite");
assert.ok(script.includes("resourceCache.delete(cacheKey)"), "descargas fallidas deben poder reintentarse");
assert.ok(script.includes("async function clearLocalGeoRiskCache()"), "runtime debe exponer limpieza segura de cache offline");
assert.ok(script.includes("async function estimateOfflineCacheSize()"), "runtime debe estimar tamano del cache offline");
assert.ok(script.includes("async function updateOfflineCacheSizeLabel()"), "runtime debe refrescar tamano visible del cache offline");
assert.ok(script.includes("function getIntroCoverageStats()"), "portada debe cachear metricas de cobertura");
assert.ok(script.includes("introCoverageCache"), "metricas de portada deben evitar recomputos innecesarios");
assert.ok(script.includes("async function ensureExportLibraries"), "exportaciones deben cargar librerias pesadas bajo demanda");
assert.ok(script.includes("function renderPerformancePanel()") || script.includes("async function renderPerformancePanel()"), "runtime debe exponer panel de rendimiento");
assert.ok(script.includes("app-performance-ui.js"), "panel de rendimiento debe vivir en modulo diferido");
assert.ok(script.includes("ensureDeferredUiModule"), "modulos secundarios deben cargarse bajo demanda");
assert.ok(script.includes("app-news-ui.js"), "noticias debe tener modulo diferido declarado");
assert.ok(script.includes("app-compare-ui.js"), "comparador debe tener modulo diferido declarado");
assert.ok(script.includes("const compareRendererReady"), "comparador debe tolerar que su modulo diferido siga cargando");
assert.ok(script.indexOf("const compareRendererReady") < script.indexOf("results.innerHTML = compareUi.buildLightCards"), "comparador debe validar el modulo antes de invocar sus renderers");
assert.ok(script.includes("app-quiz-ui.js"), "quiz debe tener modulo diferido declarado");
assert.ok(script.includes("app-export-share.js"), "exportar/compartir debe tener modulo diferido declarado");
assert.ok(script.includes('ensureDeferredUiModule("exportShare")'), "exportar/compartir debe cargarse al usarlo");
assert.ok(script.includes("app-risk-radar-ui.js"), "radar debe tener modulo diferido declarado");
assert.ok(script.includes("app-conflict-audit-ui.js"), "auditoria debe tener modulo diferido declarado");
assert.ok(script.includes("app-conflict-aliases.js"), "alias pesados de conflictos deben tener modulo diferido versionado");
assert.ok(script.includes("scheduleConflictAliasesLoad"), "alias pesados de conflictos deben cargarse en idle o bajo demanda");
assert.ok(script.includes("app-project-audit-ui.js"), "auditoria del proyecto debe tener modulo diferido declarado");
assert.ok(script.includes("function renderCountryCurationTodo"), "ficha pais debe exponer checklist de curaduria");
assert.ok(script.includes("function getCountryCurationActions"), "ficha pais debe exponer acciones de curaduria por seccion");
assert.ok(script.includes("function getCountryRiskRadarComponents"), "runtime debe exponer radar de riesgo explicable");
assert.ok(script.includes("function renderRiskRadarPanel"), "runtime debe exponer panel interno de radar de riesgo");
assert.ok(script.includes("function getCountryRiskDimension"), "runtime debe exponer capas por dimension de riesgo");
assert.ok(script.includes("async function renderConflictAuditPanel"), "runtime debe exponer panel interno de auditoria de conflictos");
assert.ok(script.includes("async function renderProjectAuditPanel"), "runtime debe exponer panel interno de auditoria del proyecto");
assert.ok(script.includes("getConflictLevelLabel(detail.level)"), "modal de conflicto debe mostrar nivel guerra/campana/batalla");
assert.ok(script.includes("detail.countryRelationship.sideLabels"), "modal de conflicto debe mostrar el bando del pais cuando se pueda inferir");
assert.ok(!script.includes("function getCountryClickTarget"), "helpers de seleccion de mapa sin uso no deben quedar en runtime critico");
assert.ok(script.includes("Que falta curar"), "ficha pais debe mostrar que falta curar");
assert.ok(appRuntime.includes(" - rendimiento"), "perfil runtime debe usar separador ASCII estable");
assert.ok(!appRuntime.includes("Â"), "app-runtime no debe exponer mojibake visible");
assert.ok(script.includes("fecha pendiente"), "conflictos sin fecha deben mostrar estado de curaduria pendiente");

for (const country of Object.values(index)) {
  const relations = country.politics?.relations || {};
  for (const [key, value] of Object.entries(relations)) {
    if (Array.isArray(value)) {
      assert.ok(value.length <= 2, `relacion ${key} debe venir resumida en el indice`);
    }
  }
  assert.ok(!Object.hasOwn(country, "conflicts"), "conflictos duplicados no deben vivir en raiz del indice");
  assert.ok(!Array.isArray(country.military?.conflicts) || country.military.conflicts.length === 0, "conflictos del indice deben vivir en shards e indices bajo demanda");
  assert.ok((country.religion?.composition || []).length <= 2, "religion del indice debe venir resumida");
}

assert.ok((full.GRC?.politics?.relations?.disputes || []).length >= 2, "Grecia debe documentar sus disputas territoriales prioritarias");
assert.ok(!(full.GRC?.politics?.relations?.blocs || []).includes("NATO"), "OTAN y NATO no deben duplicarse como bloques distintos");

console.log("startup-data.test.js ok");
