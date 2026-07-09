import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import nativeFs from "node:fs";
import fs from "fs-extra";
import path from "node:path";
import vm from "node:vm";
import { retryFileOperation } from "../lib/resilient-fs.js";

const projectRoot = process.cwd();
let transientAttempts = 0;
const recoveredFileOperation = await retryFileOperation(() => {
  transientAttempts += 1;
  if (transientAttempts < 3) {
    const error = new Error("OneDrive lock");
    error.code = "UNKNOWN";
    throw error;
  }
  return "ok";
}, { attempts: 3, delayMs: 10 });
assert.equal(recoveredFileOperation, "ok", "operaciones de release deben tolerar bloqueos transitorios");
assert.equal(transientAttempts, 3, "reintento debe detenerse al recuperarse");

const indexHtml = await fs.readFile(path.join(projectRoot, "index.html"), "utf8");
const script = await fs.readFile(path.join(projectRoot, "script.js"), "utf8");
const criticalStyle = await fs.readFile(path.join(projectRoot, "style.css"), "utf8");
const polishStyle = await fs.readFile(path.join(projectRoot, "style-polish.css"), "utf8");
const sw = await fs.readFile(path.join(projectRoot, "sw.js"), "utf8");
const packageJson = await fs.readJson(path.join(projectRoot, "package.json"));
const changelog = await fs.readFile(path.join(projectRoot, "CHANGELOG.md"), "utf8");
const uiPolish = await fs.readFile(path.join(projectRoot, "app-ui-polish.js"), "utf8");
const bootScheduler = await fs.readFile(path.join(projectRoot, "app-boot-scheduler.js"), "utf8");
const appMap = await fs.readFile(path.join(projectRoot, "app-map.js"), "utf8");
const timelineConflicts = await fs.readFile(path.join(projectRoot, "app-timeline-conflicts.js"), "utf8");
const cleanLocal = await fs.readFile(path.join(projectRoot, "scripts/cleanLocal.js"), "utf8");
const cleanStorage = await fs.readFile(path.join(projectRoot, "scripts/cleanStorage.js"), "utf8");
const releaseChecklist = await fs.readFile(path.join(projectRoot, "scripts/releaseChecklist.js"), "utf8");
const performanceSnapshot = await fs.readFile(path.join(projectRoot, "scripts/performanceSnapshot.js"), "utf8");
const dataAutomationAudit = await fs.readFile(path.join(projectRoot, "scripts/dataAutomationAudit.js"), "utf8");
const projectDoctor = await fs.readFile(path.join(projectRoot, "scripts/projectDoctor.js"), "utf8");
const maintenanceQuick = await fs.readFile(path.join(projectRoot, "scripts/maintenanceQuick.js"), "utf8");
const releaseStatus = await fs.readFile(path.join(projectRoot, "scripts/releaseStatus.js"), "utf8");
const releaseArtifacts = await fs.readFile(path.join(projectRoot, "scripts/auditReleaseArtifacts.js"), "utf8");
const featureHealth = await fs.readFile(path.join(projectRoot, "scripts/auditFeatureHealth.js"), "utf8");
const exportShare = await fs.readFile(path.join(projectRoot, "app-export-share.js"), "utf8");
const conflictRules = await fs.readFile(path.join(projectRoot, "app-conflict-rules.js"), "utf8");
const fixSourceText = await fs.readFile(path.join(projectRoot, "scripts/fixSourceText.js"), "utf8");
const releaseWorkflow = await fs.readFile(path.join(projectRoot, ".github/workflows/release-gate.yml"), "utf8");
const prePushHook = await fs.readFile(path.join(projectRoot, ".githooks/pre-push"), "utf8");
const gitignore = await fs.readFile(path.join(projectRoot, ".gitignore"), "utf8");

function bytes(file) {
  return fs.stat(path.join(projectRoot, file)).then(stat => stat.size);
}

const shellMatch = sw.match(/const APP_SHELL = \[([\s\S]*?)\];/);
assert.ok(shellMatch, "service worker debe declarar APP_SHELL");
const appShell = [...shellMatch[1].matchAll(/"([^"]+)"/g)].map(match => match[1]);
const appShellText = appShell.join("\n");
const initialLocalScripts = [...indexHtml.matchAll(/<script\s+src="([^"]+)"/g)]
  .map(match => match[1].split("?")[0])
  .filter(src => src && !/^https?:\/\//i.test(src));
const appVersion = script.match(/const APP_VERSION = "([^"]+)"/)?.[1];
const cacheVersion = sw.match(/const CACHE_VERSION = "([^"]+)"/)?.[1];
const themeStylesBlock = script.match(/const THEME_STYLES = \{([\s\S]*?)\};\n\nObject\.assign\(THEME_STYLES/)?.[1] || "";

assert.ok(appVersion, "script.js debe declarar APP_VERSION");
assert.ok(themeStylesBlock, "script.js debe conservar configuracion visual de capas");
assert.ok(!/cause:\s*"|participants:\s*\[|outcome:\s*"/.test(themeStylesBlock), "THEME_STYLES no debe mezclar detalles de conflictos");
assert.ok(!themeStylesBlock.includes("Guerra de Corea"), "detalles de conflictos no deben volver a THEME_STYLES");
assert.equal(cacheVersion, appVersion, "APP_VERSION y CACHE_VERSION deben estar sincronizados");
assert.ok(indexHtml.includes(`style.css?v=${appVersion}`), "style.css debe usar el stamp de version activo");
for (const src of initialLocalScripts) {
  assert.ok(indexHtml.includes(`${src}?v=${appVersion}`), `${src} debe usar el stamp de version activo`);
}
assert.ok(script.includes("window.GeoRiskAppVersion = APP_VERSION"), "script.js debe exponer APP_VERSION a modulos diferidos");
const deferredModulesBlock = script.match(/const DEFERRED_UI_MODULES = \{([\s\S]*?)\};/)?.[1] || "";
assert.ok(deferredModulesBlock.includes("APP_VERSION"), "modulos diferidos deben usar APP_VERSION");
assert.ok(!/release-\d/.test(deferredModulesBlock), "modulos diferidos no deben fijar stamps viejos de release");
assert.ok(uiPolish.includes("window.GeoRiskAppVersion"), "app-ui-polish debe leer el stamp de version activo");
assert.ok(uiPolish.includes("style-polish.css?v=${POLISH_VERSION}"), "style-polish.css diferido debe usar el stamp de version activo");
assert.ok(changelog.includes(`## v${packageJson.version}`), "CHANGELOG.md debe documentar la version del paquete");
assert.ok(packageJson.scripts["build:data"].includes("applyConflictAutofix.js"), "build:data debe reaplicar curaduria de conflictos tras regenerar el dataset");
assert.ok(packageJson.scripts["build:data"].includes("applyVisibleDataCorrections.js"), "build:data debe reaplicar limpieza visible tras regenerar el dataset");
assert.ok(packageJson.scripts["build:data"].includes("buildDataIndexes.js"), "build:data debe dejar indices publicos sincronizados");
assert.equal(packageJson.scripts["prepush:check"], "node scripts/prepushCheck.js", "debe existir puerta local pre-push");
assert.equal(packageJson.scripts["clean:storage"], "node scripts/cleanStorage.js", "debe existir limpieza local de almacenamiento");
assert.equal(packageJson.scripts["release:prepare"], "node scripts/prepareRelease.js", "debe existir preparacion automatica de release");
assert.equal(packageJson.scripts["release:status"], "node scripts/releaseStatus.js", "debe existir estado resumido de release");
assert.equal(packageJson.scripts["audit:data"], "node scripts/dataAutomationAudit.js", "debe existir auditoria programable de datos");
assert.equal(packageJson.scripts["audit:doctor"], "node scripts/projectDoctor.js", "debe existir doctor de producto");
assert.equal(packageJson.scripts["audit:release-artifacts"], "node scripts/auditReleaseArtifacts.js", "debe existir auditoria de artefactos de release");
assert.equal(packageJson.scripts["audit:features"], "node scripts/auditFeatureHealth.js", "debe existir auditoria de salud funcional");
assert.equal(packageJson.scripts["performance:snapshot"], "node scripts/performanceSnapshot.js", "debe existir snapshot de performance por release");
assert.equal(packageJson.scripts["maintain:quick"], "node scripts/maintenanceQuick.js", "debe existir mantenimiento rapido automatizado");
assert.equal(packageJson.scripts["fix:source-text"], "node scripts/fixSourceText.js", "debe existir normalizacion segura de fuentes de datos");
assert.equal(packageJson.scripts["test:text-normalization"], "node scripts/tests/text-normalization.test.js", "debe existir test especifico de mojibake");
assert.equal(packageJson.scripts["test:critical-flows"], "node scripts/tests/critical-flows.test.js", "debe existir QA automatizado de flujos criticos");
assert.ok(packageJson.scripts.test.includes("test:critical-flows"), "npm test debe incluir flujos criticos");
assert.ok(prePushHook.includes("npm run prepush:check"), "hook pre-push debe correr puerta liviana local");
assert.ok(releaseChecklist.includes("performance:snapshot"), "release:check debe guardar snapshot de performance");
assert.ok(releaseChecklist.includes("audit:data"), "release:check debe guardar auditoria programable de datos");
assert.ok(releaseChecklist.includes("audit:doctor"), "release:check debe generar doctor de producto");
assert.ok(releaseChecklist.includes("audit:release-artifacts"), "release:check debe auditar artefactos de release");
assert.ok(releaseChecklist.includes("audit:features"), "release:check debe auditar salud funcional");
assert.ok(releaseChecklist.includes("release:status"), "release:check debe publicar estado resumido");
assert.ok(releaseWorkflow.includes("npm ci"), "GitHub Actions debe instalar con npm ci");
assert.ok(releaseWorkflow.includes("npm run release:check"), "GitHub Actions debe correr release:check");
assert.ok(releaseWorkflow.includes("npm run validate:data"), "GitHub Actions debe correr validate:data de forma explicita");
assert.ok(releaseWorkflow.includes("npm run audit:conflicts"), "GitHub Actions debe auditar conflictos");
assert.ok(releaseWorkflow.includes("npm run check:startup-budget"), "GitHub Actions debe correr presupuesto de arranque de forma explicita");
assert.ok(releaseWorkflow.includes("npm run test:browser-visual"), "GitHub Actions debe correr smoke visual");
assert.ok(releaseWorkflow.includes("npm run audit:doctor"), "GitHub Actions debe publicar doctor de producto");
assert.ok(releaseWorkflow.includes("npm run audit:release-artifacts"), "GitHub Actions debe auditar artefactos de release");
assert.ok(releaseWorkflow.includes("npm run audit:features"), "GitHub Actions debe auditar salud funcional");
assert.ok(releaseWorkflow.includes("npm run release:status"), "GitHub Actions debe publicar estado de release");
assert.ok(releaseWorkflow.includes("schedule:"), "GitHub Actions debe incluir auditoria programada");
assert.ok(gitignore.split(/\r?\n/).some(line => line.trim() === "reports/release-status.json"), "release-status debe ignorarse porque contiene estado Git efimero");
assert.ok(cleanStorage.includes('"node_modules"'), "clean:storage debe poder liberar node_modules");
assert.ok(cleanStorage.includes("isInsideProject"), "clean:storage debe negarse a borrar fuera del proyecto");
assert.ok(performanceSnapshot.includes("performance-snapshot.json"), "snapshot debe escribirse en reports/");
assert.ok(performanceSnapshot.includes("simulated-startup-data-batch"), "snapshot debe simular long tasks del arranque por tandas");
assert.ok(dataAutomationAudit.includes("englishConflictNames"), "auditoria de datos debe listar conflictos en ingles");
assert.ok(dataAutomationAudit.includes("redundantReligions"), "auditoria de datos debe listar religiones redundantes");
assert.ok(dataAutomationAudit.includes("sameCountryDuplicateConflicts"), "auditoria de datos debe separar duplicados accionables");
assert.ok(dataAutomationAudit.includes("sharedConflictNames"), "auditoria de datos debe separar conflictos compartidos de duplicados reales");
assert.ok(dataAutomationAudit.includes("sourceTextMojibake"), "auditoria de datos debe detectar mojibake en fuentes generadoras");
assert.ok(dataAutomationAudit.includes("baseSectionProfiles"), "auditoria de datos debe separar secciones base de baja confianza real");
assert.ok(dataAutomationAudit.includes("priorityWeakDataProfiles"), "auditoria de datos debe priorizar fichas publicas debiles sobre territorios especiales");
assert.ok(projectDoctor.includes("doctor-report.json"), "doctor debe escribir reporte consolidado");
assert.ok(projectDoctor.includes("topActions"), "doctor debe sugerir acciones concretas");
assert.ok(projectDoctor.includes("APP_VERSION") && projectDoctor.includes("CACHE_VERSION"), "doctor debe revisar version/cache");
assert.ok(projectDoctor.includes("release-artifacts.json"), "doctor debe consumir auditoria de artefactos");
assert.ok(projectDoctor.includes("feature-health.json"), "doctor debe consumir auditoria de salud funcional");
assert.ok(maintenanceQuick.includes("prepush:check"), "mantenimiento rapido debe terminar con puerta local");
assert.ok(maintenanceQuick.includes("fix:conflicts"), "mantenimiento rapido debe curar conflictos antes de normalizar visibles");
assert.ok(maintenanceQuick.includes("fix:source-text"), "mantenimiento rapido debe reparar fuentes antes de auditar datos");
assert.ok(maintenanceQuick.includes("release:status"), "mantenimiento rapido debe dejar resumen de release");
assert.ok(maintenanceQuick.includes("audit:release-artifacts"), "mantenimiento rapido debe auditar artefactos de release");
assert.ok(maintenanceQuick.includes("audit:features"), "mantenimiento rapido debe auditar salud funcional");
assert.ok(releaseStatus.includes("release-status.json"), "release:status debe escribir reporte en reports/");
assert.ok(releaseStatus.includes("artifactPolicy"), "release:status debe declarar politica de artefacto efimero");
assert.ok(releaseStatus.includes("featureHealthClean"), "release:status debe incorporar salud funcional");
assert.ok(releaseStatus.includes("expectedTagAtHead"), "release:status debe revisar tag esperado");
assert.ok(releaseStatus.includes("gitStatusAvailable"), "release:status debe distinguir si pudo leer Git");
assert.ok(releaseStatus.includes("workingTreeClean"), "release:status debe revisar si hay cambios locales");
assert.ok(releaseStatus.includes("sourceTextMojibake"), "release:status debe incluir calidad de fuentes");
assert.ok(releaseArtifacts.includes("release-artifacts.json"), "audit:release-artifacts debe escribir reporte propio");
assert.ok(releaseArtifacts.includes("reports/release-status.json"), "audit:release-artifacts debe controlar que release-status sea ignorado");
assert.ok(releaseArtifacts.includes("ls-files"), "audit:release-artifacts debe intentar detectar artefactos ignorados pero trackeados");
assert.ok(releaseArtifacts.includes("actions/upload-artifact"), "audit:release-artifacts debe verificar subida de reportes en CI");
assert.ok(featureHealth.includes("feature-health.json"), "audit:features debe escribir reporte propio");
assert.ok(featureHealth.includes("country_profile"), "audit:features debe cubrir ficha pais");
assert.ok(featureHealth.includes("rankings"), "audit:features debe cubrir rankings");
assert.ok(featureHealth.includes("exports_share"), "audit:features debe cubrir exportar/compartir");
assert.ok(featureHealth.includes("app-export-share.js"), "audit:features debe verificar el modulo diferido de exportar/compartir");
assert.ok(fixSourceText.includes("scripts/buildDataset.js"), "fix:source-text debe cubrir el generador principal de datos");
assert.ok(fixSourceText.includes("caracteres de reemplazo"), "fix:source-text debe abortar si empeora el texto");
assert.ok(appShell.length <= 18, "APP_SHELL debe mantenerse chico");
assert.ok(!appShellText.includes("countries_full.json"), "countries_full no debe entrar en APP_SHELL");
assert.ok(!appShellText.includes("conflict_details.generated.json"), "conflict_details no debe entrar en APP_SHELL");
assert.ok(!appShellText.includes("reports/"), "reports no debe entrar en APP_SHELL");
assert.ok(!appShellText.includes("USER_GUIDE.md"), "docs internas no deben precachearse");
assert.ok(!appShellText.includes("TECHNICAL.md"), "docs internas no deben precachearse");
assert.ok(sw.includes("RUNTIME_CACHEABLE_PATHS"), "service worker debe separar cache runtime");
assert.ok(sw.includes("HEAVY_RUNTIME_PATHS"), "service worker debe reconocer datasets pesados");
assert.ok(/if \(isHeavyRuntimeRequest\(url\)\) \{\s*event\.respondWith\(fetch\(event\.request\)\)/.test(sw), "datasets pesados no deben guardarse en CacheStorage");
assert.ok(sw.includes("caches.match(\"./index.html\""), "offline debe poder abrir shell despues de visita inicial");

assert.ok((await bytes("script.js")) < 700000, "script.js debe quedar bajo 700 KB");
assert.ok((await bytes("data/countries_index.json")) < 240000, "countries_index debe quedar bajo 240 KB");
const startupCriticalResources = [...new Set([
  ...appShell.map(resource => resource === "./" ? "./index.html" : resource),
  ...initialLocalScripts.map(resource => resource.startsWith("./") ? resource : `./${resource}`)
])];
assert.ok(startupCriticalResources.reduce((sum, resource) => {
  const clean = resource.replace(/^\.\//, "");
  const file = clean === "" ? "index.html" : clean;
  return sum + (nativeFs.existsSync(path.join(projectRoot, file)) ? nativeFs.statSync(path.join(projectRoot, file)).size : 0);
}, 0) < 1024 * 1024, "arranque critico real debe quedar bajo 1 MiB");

assert.ok(!indexHtml.includes("countries_full.json"), "countries_full no debe cargarse desde HTML inicial");
assert.ok(!indexHtml.includes("conflict_details.generated.json"), "conflict_details no debe cargarse desde HTML inicial");
assert.ok(!indexHtml.includes("app-text.js"), "texto/formato debe usar fallback inicial y no bloquear arranque");
assert.ok(!indexHtml.includes("app-curation.js"), "curation debe ser bajo demanda");
assert.ok(!indexHtml.includes("app-country-panel.js"), "ficha pais avanzada debe cargarse bajo demanda");
assert.ok(!indexHtml.includes("app-timeline-conflicts.js"), "timeline/conflictos debe cargarse bajo demanda");
assert.ok(!indexHtml.includes("app-search.js"), "busqueda avanzada debe cargarse bajo demanda");
assert.ok(!indexHtml.includes("app-rankings.js"), "rankings debe cargarse bajo demanda");
assert.ok(!indexHtml.includes("app-ui-polish.js"), "pulido UI debe cargarse bajo demanda");
assert.ok(!indexHtml.includes("app-help-ui.js"), "guia rapida debe cargarse bajo demanda");
assert.ok(!indexHtml.includes("app-conflict-aliases.js"), "alias pesados de conflictos deben cargarse bajo demanda");
assert.ok(!indexHtml.includes("app-conflict-rules.js"), "reglas pesadas de conflictos deben cargarse bajo demanda");
assert.ok(!indexHtml.includes("style-polish.css"), "pulido visual no debe bloquear el primer mapa");
assert.ok(!indexHtml.includes("fonts.googleapis.com"), "fuentes remotas no deben bloquear el primer render");
assert.ok(!criticalStyle.includes(".performance-status-banner"), "panel de rendimiento no debe inflar style.css critico");
assert.ok(!criticalStyle.includes(".project-audit-status"), "auditoria interna no debe inflar style.css critico");
assert.ok(polishStyle.includes(".performance-status-banner"), "panel de rendimiento debe vivir en style-polish.css");
assert.ok(polishStyle.includes(".project-audit-status"), "auditoria interna debe vivir en style-polish.css");
assert.ok(!/bootHeavyDataEnhancements[\s\S]{0,500}loadRuntimeCuration/.test(script), "curaduria profunda debe esperar a una ficha");
assert.ok(!indexHtml.includes("html2canvas"), "exportacion debe cargar html2canvas bajo demanda");
assert.ok(!indexHtml.includes("jspdf"), "exportacion debe cargar jsPDF bajo demanda");
assert.ok(!indexHtml.includes("app-export-share.js"), "exportar/compartir no debe bloquear el shell inicial");
assert.ok(!script.includes("scheduleFullCountryDataLoad"), "countries_full no debe precargarse por scheduler");
assert.ok(!script.includes("startFullLoad"), "countries_full no debe tener disparador silencioso");
assert.ok(cleanLocal.includes("process.argv.includes(\"--deep\")"), "limpieza profunda debe ser explicita");
const artifactTargets = cleanLocal.match(/const artifactTargets = \[([\s\S]*?)\];/)?.[1] || "";
assert.ok(!artifactTargets.includes("node_modules"), "release:check no debe borrar dependencias");
assert.ok(!cleanLocal.includes("package-lock.json"), "la limpieza no debe borrar el lockfile reproducible");
assert.ok(!script.includes("async function loadFullCountryData()"), "countries_full no debe tener loader global sin consumidores");
assert.equal((script.match(/countries_full\.json/g) || []).length, 1, "countries_full solo debe quedar como fallback del indice");
assert.ok(script.includes("async function loadCountryDetail"), "detalle de pais debe cargarse bajo demanda");
assert.ok(script.includes("async function loadCountryConflictDetail"), "conflictos de pais deben cargarse desde shard bajo demanda");
assert.ok(script.includes("data/countries/conflicts"), "runtime debe conocer shards de conflictos por pais");
assert.ok(script.includes("maybeEnhanceOpenConflictModal"), "conflictos detallados deben cargarse al abrir modal");
assert.ok(script.includes("app-conflict-aliases.js"), "alias pesados de conflictos deben vivir fuera del runtime critico");
assert.ok(script.includes("app-conflict-rules.js"), "reglas pesadas de conflictos deben vivir fuera del runtime critico");
assert.ok(!script.includes("CONFLICT_PARENT_RULES.push("), "jerarquia pesada de conflictos no debe volver a script.js");
assert.ok(conflictRules.includes("window.GeoRiskConflictRules"), "modulo diferido debe exponer reglas pesadas de conflictos");
assert.ok(script.includes("ensureConflictAliasesLoaded"), "runtime debe poder cargar alias de conflictos bajo demanda");
assert.ok(script.includes("scheduleDetailedOverlayUpgrade"), "GeoJSON detallado debe cargarse por upgrade diferido");
assert.ok(appMap.includes("world_countries_simplified.geo.json"), "GeoJSON simplificado debe ser default inicial");
assert.ok(appMap.includes("world_countries.geo.json"), "GeoJSON detallado debe existir solo para zoom cercano");

assert.ok(timelineConflicts.includes("filterTimelineEvents"), "timeline debe tener filtro testeable");
assert.ok(timelineConflicts.includes("groupRepeatedEvents"), "timeline debe agrupar eventos repetidos");
assert.ok(script.includes("ensureExportLibraries"), "exportacion debe tener loader dedicado");
assert.ok(script.includes('exportShare: `./app-export-share.js?v=${APP_VERSION}`'), "exportar/compartir debe declararse como modulo diferido versionado");
assert.ok(script.includes('ensureDeferredUiModule("exportShare")'), "exportar/compartir debe cargar su modulo al usarlo");
assert.equal((script.match(/exportNodeAsImage = async function exportNodeAsImage/g) || []).length, 1, "exportacion de imagen no debe conservar implementaciones duplicadas");
assert.equal((script.match(/exportNodeAsPdf = async function exportNodeAsPdf/g) || []).length, 1, "exportacion PDF no debe conservar implementaciones duplicadas");
assert.equal((script.match(/shareText = async function shareText/g) || []).length, 1, "compartir no debe conservar implementaciones duplicadas");
assert.ok(exportShare.includes("GeoRiskExportShare"), "modulo diferido debe exponer API global de exportar/compartir");
assert.ok(exportShare.includes("html2canvas@1.4.1"), "html2canvas debe vivir en modulo diferido");
assert.ok(exportShare.includes("jspdf@2.5.1"), "jsPDF debe vivir en modulo diferido");
assert.equal((script.match(/setupCompareControls = function setupCompareControls/g) || []).length, 0, "setup incompleto del comparador no debe pisar controles avanzados");
assert.ok(script.includes("exportNodeAsImage"), "exportacion de imagen debe existir");
assert.ok(script.includes("exportNodeAsPdf"), "exportacion PDF debe existir");

const schedulerContext = {
  window: {},
  document: { visibilityState: "visible" },
  Date,
  setTimeout,
  PerformanceObserver: class {
    constructor(callback) {
      this.callback = callback;
    }
    observe() {
      this.callback({
        getEntries: () => [
          { name: "simulated", startTime: 12, duration: 240 },
          { name: "short", startTime: 40, duration: 80 }
        ]
      });
    }
  }
};
vm.runInNewContext(bootScheduler, schedulerContext);
schedulerContext.window.GeoRiskBootScheduler.startLongTaskObserver();
assert.equal(schedulerContext.window.GeoRiskBootScheduler.longTaskMetrics.count, 2, "long tasks simuladas deben registrarse");
assert.equal(schedulerContext.window.GeoRiskBootScheduler.longTaskMetrics.overBudgetCount, 1, "long task >200 ms debe bloquear release");
assert.equal(schedulerContext.window.GeoRiskBootScheduler.longTaskMetrics.longestDuration, 240);

const manifestPath = path.join(projectRoot, "dist", "public", "asset-manifest.json");
if (!(await fs.pathExists(manifestPath))) {
  execFileSync(process.execPath, ["scripts/buildProduction.js"], {
    cwd: projectRoot,
    stdio: "inherit"
  });
}
assert.ok(await fs.pathExists(manifestPath), "build prod debe generar asset-manifest.json");
const manifest = await fs.readJson(manifestPath);
assert.ok(manifest.assetCount > 20, "manifest debe listar assets publicos");
const manifestPaths = manifest.assets.map(asset => asset.path);
assert.ok(manifestPaths.includes("index.html"), "build debe incluir index.html");
assert.ok(manifestPaths.includes("script.js"), "build debe incluir script.js");
assert.ok(!manifestPaths.some(file => file.startsWith("reports/")), "build publico debe excluir reports/");
assert.ok(!manifestPaths.some(file => file.startsWith("scripts/")), "build publico debe excluir scripts internos");
assert.ok(!manifestPaths.includes("ARCHITECTURE.md"), "build publico debe excluir docs internas");
assert.ok(!manifestPaths.includes("CONTRIBUTING_INTERNAL.md"), "build publico debe excluir docs internas");
assert.ok(!manifestPaths.includes("data/conflict_details.generated.json"), "build publico debe excluir el monolito de conflictos");
assert.ok(!manifestPaths.includes("data/conflict_dyadic_summary.json"), "build publico debe excluir datos tecnicos diadicos");
assert.ok(manifestPaths.includes("data/conflicts/details_index.json"), "build publico debe incluir el indice granular de conflictos");
assert.ok(manifestPaths.some(file => file.startsWith("data/conflicts/details/")), "build publico debe incluir shards de conflictos");

console.log("release-gates.test.js ok");
