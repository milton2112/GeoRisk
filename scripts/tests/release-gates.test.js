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
const appSearch = await fs.readFile(path.join(projectRoot, "app-search.js"), "utf8");
const appQuiz = await fs.readFile(path.join(projectRoot, "app-quiz-ui.js"), "utf8");
const appCountryPanel = await fs.readFile(path.join(projectRoot, "app-country-panel.js"), "utf8");
const appText = await fs.readFile(path.join(projectRoot, "app-text.js"), "utf8");
const timelineConflicts = await fs.readFile(path.join(projectRoot, "app-timeline-conflicts.js"), "utf8");
const cleanLocal = await fs.readFile(path.join(projectRoot, "scripts/cleanLocal.js"), "utf8");
const cleanStorage = await fs.readFile(path.join(projectRoot, "scripts/cleanStorage.js"), "utf8");
const releaseChecklist = await fs.readFile(path.join(projectRoot, "scripts/releaseChecklist.js"), "utf8");
const prepareRelease = await fs.readFile(path.join(projectRoot, "scripts/prepareRelease.js"), "utf8");
const performanceSnapshot = await fs.readFile(path.join(projectRoot, "scripts/performanceSnapshot.js"), "utf8");
const dataAutomationAudit = await fs.readFile(path.join(projectRoot, "scripts/dataAutomationAudit.js"), "utf8");
const projectDoctor = await fs.readFile(path.join(projectRoot, "scripts/projectDoctor.js"), "utf8");
const maintenanceQuick = await fs.readFile(path.join(projectRoot, "scripts/maintenanceQuick.js"), "utf8");
const releaseStatus = await fs.readFile(path.join(projectRoot, "scripts/releaseStatus.js"), "utf8");
const releaseArtifacts = await fs.readFile(path.join(projectRoot, "scripts/auditReleaseArtifacts.js"), "utf8");
const featureHealth = await fs.readFile(path.join(projectRoot, "scripts/auditFeatureHealth.js"), "utf8");
const buildDataIndexes = await fs.readFile(path.join(projectRoot, "scripts/buildDataIndexes.js"), "utf8");
const buildDataset = await fs.readFile(path.join(projectRoot, "scripts/buildDataset.js"), "utf8");
const conflictAutofix = await fs.readFile(path.join(projectRoot, "scripts/applyConflictAutofix.js"), "utf8");
const visibleModernCuration = await fs.readFile(path.join(projectRoot, "scripts/lib/conflict-curation-visible-modern.js"), "utf8");
const visibleFollowupCuration = await fs.readFile(path.join(projectRoot, "scripts/lib/conflict-curation-visible-followup.js"), "utf8");
const koreaModernCuration = await fs.readFile(path.join(projectRoot, "scripts/lib/conflict-curation-korea-modern.js"), "utf8");
const historicalVietnamCuration = await fs.readFile(path.join(projectRoot, "scripts/lib/conflict-curation-historical-vietnam.js"), "utf8");
const postwar1970Curation = await fs.readFile(path.join(projectRoot, "scripts/lib/conflict-curation-1970-1991.js"), "utf8");
const modern1992Curation = await fs.readFile(path.join(projectRoot, "scripts/lib/conflict-curation-1992-2021.js"), "utf8");
const undatedAmericasCuration = await fs.readFile(path.join(projectRoot, "scripts/lib/conflict-curation-undated-americas.js"), "utf8");
const revolutionFollowupCuration = await fs.readFile(path.join(projectRoot, "scripts/lib/conflict-curation-revolution-followup.js"), "utf8");
const transition1846Curation = await fs.readFile(path.join(projectRoot, "scripts/lib/conflict-curation-1846-1902.js"), "utf8");
const war1812FollowupCuration = await fs.readFile(path.join(projectRoot, "scripts/lib/conflict-curation-war-1812-followup.js"), "utf8");
const usCivilWarFollowupCuration = await fs.readFile(path.join(projectRoot, "scripts/lib/conflict-curation-us-civil-war-followup.js"), "utf8");
const usWwiiFollowupCuration = await fs.readFile(path.join(projectRoot, "scripts/lib/conflict-curation-us-wwii-followup.js"), "utf8");
const usIndianWarsFollowupCuration = await fs.readFile(path.join(projectRoot, "scripts/lib/conflict-curation-us-indian-wars-followup.js"), "utf8");
const usFrontierFollowupCuration = await fs.readFile(path.join(projectRoot, "scripts/lib/conflict-curation-us-frontier-followup.js"), "utf8");
const usFrontierSecondFollowupCuration = await fs.readFile(path.join(projectRoot, "scripts/lib/conflict-curation-us-frontier-second-followup.js"), "utf8");
const usCaribbeanFollowupCuration = await fs.readFile(path.join(projectRoot, "scripts/lib/conflict-curation-us-caribbean-followup.js"), "utf8");
const australiaDenmarkFollowupCuration = await fs.readFile(path.join(projectRoot, "scripts/lib/conflict-curation-australia-denmark-followup.js"), "utf8");
const usIndigenousFollowupCuration = await fs.readFile(path.join(projectRoot, "scripts/lib/conflict-curation-us-indigenous-followup.js"), "utf8");
const usRevolutionThirdFollowupCuration = await fs.readFile(path.join(projectRoot, "scripts/lib/conflict-curation-us-revolution-third-followup.js"), "utf8");
const britishWwiiFollowupCuration = await fs.readFile(path.join(projectRoot, "scripts/lib/conflict-curation-british-wwii-followup.js"), "utf8");
const usOverseasFollowupCuration = await fs.readFile(path.join(projectRoot, "scripts/lib/conflict-curation-us-overseas-followup.js"), "utf8");
const activeAfricaFollowupCuration = await fs.readFile(path.join(projectRoot, "scripts/lib/conflict-curation-active-africa-followup.js"), "utf8");
const wikipediaConflicts = await fs.readFile(path.join(projectRoot, "scripts/lib/wikipedia-conflicts.js"), "utf8");
const conflictBatchCuration = await fs.readFile(path.join(projectRoot, "scripts/lib/conflict-batch-curation.js"), "utf8");
const visibleDataCorrections = await fs.readFile(path.join(projectRoot, "scripts/lib/visible-data-corrections.js"), "utf8");
const resilientFs = await fs.readFile(path.join(projectRoot, "scripts/lib/resilient-fs.js"), "utf8");
const exportShare = await fs.readFile(path.join(projectRoot, "app-export-share.js"), "utf8");
const conflictRules = await fs.readFile(path.join(projectRoot, "app-conflict-rules.js"), "utf8");
const riskRadarUi = await fs.readFile(path.join(projectRoot, "app-risk-radar-ui.js"), "utf8");
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
const setupSearchEventsBlock = script.slice(
  script.indexOf("function setupSearchEvents"),
  script.indexOf("function setupThemeControls")
);
assert.ok(deferredModulesBlock.includes("APP_VERSION"), "modulos diferidos deben usar APP_VERSION");
assert.ok(!/release-\d/.test(deferredModulesBlock), "modulos diferidos no deben fijar stamps viejos de release");
assert.ok(uiPolish.includes("window.GeoRiskAppVersion"), "app-ui-polish debe leer el stamp de version activo");
assert.ok(uiPolish.includes("style-polish.css?v=${POLISH_VERSION}"), "style-polish.css diferido debe usar el stamp de version activo");
assert.ok(uiPolish.includes("function showToast"), "polish UI debe centralizar avisos de acciones");
assert.ok(polishStyle.includes(".app-toast.is-visible"), "aviso de acciones debe tener estado visible diferido");
assert.ok(!/(^|[^\w.])showToast\?\./m.test(script), "runtime no debe llamar un notifier global inexistente");
assert.ok(changelog.includes(`## v${packageJson.version}`), "CHANGELOG.md debe documentar la version del paquete");
assert.ok(packageJson.scripts["build:data"].includes("applyConflictAutofix.js"), "build:data debe reaplicar curaduria de conflictos tras regenerar el dataset");
assert.ok(packageJson.scripts["build:data"].includes("applyVisibleDataCorrections.js"), "build:data debe reaplicar limpieza visible tras regenerar el dataset");
assert.ok(packageJson.scripts["build:data"].includes("buildDataIndexes.js"), "build:data debe dejar indices publicos sincronizados");
const conflictFixScript = packageJson.scripts["fix:conflicts"];
assert.ok(
  conflictFixScript.indexOf("applyConflictAutofix.js") < conflictFixScript.indexOf("applyVisibleDataCorrections.js")
    && conflictFixScript.indexOf("applyVisibleDataCorrections.js") < conflictFixScript.indexOf("buildDataIndexes.js")
    && conflictFixScript.indexOf("buildDataIndexes.js") < conflictFixScript.indexOf("auditConflicts.js"),
  "fix:conflicts debe curar, normalizar, regenerar artefactos y auditar en ese orden"
);
assert.ok(resilientFs.includes("function areJsonValuesEquivalent"), "escrituras generadas deben comparar JSON semanticamente");
assert.ok(resilientFs.includes("function writeJsonIfChanged"), "generadores deben poder omitir escrituras identicas");
assert.ok(buildDataIndexes.includes("writeJsonIfChanged"), "indices deben evitar reescribir shards sin cambios");
assert.ok(buildDataIndexes.includes("removeStaleJsonFiles"), "indices deben retirar solo shards obsoletos");
assert.ok(!buildDataIndexes.includes("emptyDir("), "indices no deben vaciar directorios publicos completos");
assert.ok(conflictAutofix.includes("regenerated-by-buildDataIndexes"), "autofix debe dejar shards compactos al generador publico");
assert.ok(!conflictAutofix.includes("fs.readdir(countriesDir)"), "autofix no debe enriquecer fichas compactas que luego se regeneran");
assert.ok(conflictAutofix.includes("VISIBLE_MODERN_CONFLICT_DETAIL_FIXES"), "autofix debe incorporar la tanda visible fuente-respaldada");
assert.ok(conflictAutofix.includes("VISIBLE_FOLLOWUP_CONFLICT_DETAIL_FIXES"), "autofix debe incorporar la segunda tanda visible fuente-respaldada");
assert.ok(conflictAutofix.includes("KOREA_MODERN_CONFLICT_DETAIL_FIXES"), "autofix debe incorporar la tanda de Corea y conflictos modernos");
assert.ok(conflictAutofix.includes("HISTORICAL_VIETNAM_CONFLICT_DETAIL_FIXES"), "autofix debe incorporar la tanda histórica y de Vietnam");
assert.ok(visibleModernCuration.includes("hierarchySources"), "curaduria visible debe conservar trazabilidad por conflicto");
assert.ok(visibleFollowupCuration.includes("hierarchySources"), "segunda curaduria visible debe conservar trazabilidad por conflicto");
assert.ok(koreaModernCuration.includes("hierarchySources"), "curaduria de Corea y conflictos modernos debe conservar trazabilidad");
assert.ok(historicalVietnamCuration.includes("hierarchySources"), "curaduria histórica y de Vietnam debe conservar trazabilidad");
assert.ok(koreaModernCuration.includes('"Batalla de Khaz Oruzgan"') && koreaModernCuration.includes("startYear: 2008"), "Khaz Oruzgan no debe volver al ano 2010 incorrecto");
assert.ok(koreaModernCuration.includes('"Batalla de la borne 233"') && koreaModernCuration.includes("startYear: 1961"), "la borne 233 no debe volver al ano 1973 incorrecto");
assert.ok(buildDataset.includes('"Batalla de la cota 233": { startYear: 1961, endYear: 1961 }'), "el generador base debe conservar 1961 para la borne 233");
assert.ok(historicalVietnamCuration.includes('"Combate naval de la Junon contra la Fox (1778)"') && historicalVietnamCuration.includes("startYear: 1778"), "Junon-Fox debe conservar su fecha histórica de 1778");
assert.ok(buildDataset.includes('"Combate de la Junon contra el Fox": { startYear: 1778, endYear: 1778 }'), "el generador base no debe restaurar 1809 para Junon-Fox");
assert.ok(historicalVietnamCuration.includes('"Sitio de Khe Sanh"') && historicalVietnamCuration.includes('"Campaña de Khe Sanh"'), "Khe Sanh debe conservar su jerarquía verificada");
assert.ok(historicalVietnamCuration.includes('"Batalla de Lima Site 85"') && historicalVietnamCuration.includes('parent: "Guerra civil de Laos"'), "Lima Site 85 no debe clasificarse como una batalla genérica de Vietnam");
assert.ok(koreaModernCuration.includes('"Batalla de Battle Mountain"') && koreaModernCuration.includes('"Guerra de Corea"'), "las batallas coreanas deben conservar su guerra padre");
assert.ok(appSearch.includes("normalized.length >= 4"), "busqueda diferida de conflictos debe aceptar nombres sin prefijo de guerra o batalla");
assert.ok(appSearch.includes("hasCountryCollectionIntent"), "busqueda natural debe aceptar consultas simples por continente o religion");
assert.ok(visibleFollowupCuration.includes('"Batalla de Brandywine"') && visibleFollowupCuration.includes("startYear: 1777"), "Brandywine no debe volver a quedar sin fecha");
assert.ok(visibleFollowupCuration.includes('"Batalla de Garmsir"') && visibleFollowupCuration.includes("startYear: 2008"), "Garmsir no debe volver a quedar sin fecha");
assert.ok(visibleFollowupCuration.includes('"Batalla de la isla de las Serpientes"') && visibleFollowupCuration.includes("startYear: 2022"), "isla de las Serpientes no debe volver a quedar sin fecha");
assert.ok(visibleModernCuration.includes('"Batalla de Joybar"') && visibleModernCuration.includes("startYear: 2011"), "Joybar no debe regresar al ano 2001 incorrecto");
assert.ok(visibleDataCorrections.includes('"pakistan\\u00ed"'), "normalizacion visible debe distinguir el adjetivo pakistani del nombre del pais");
assert.equal(packageJson.scripts["prepush:check"], "node scripts/prepushCheck.js", "debe existir puerta local pre-push");
assert.equal(packageJson.scripts["clean:storage"], "node scripts/cleanStorage.js", "debe existir limpieza local de almacenamiento");
assert.equal(packageJson.scripts["release:prepare"], "node scripts/prepareRelease.js", "debe existir preparacion automatica de release");
assert.ok(!prepareRelease.includes("toISOString().slice(0, 10)"), "release:prepare no debe fechar releases visibles en UTC");
assert.ok(prepareRelease.includes("date.getFullYear()") && prepareRelease.includes("date.getMonth()") && prepareRelease.includes("date.getDate()"), "release:prepare debe calcular la fecha calendario local");
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
assert.ok(dataAutomationAudit.includes("normalizeConflictKey"), "auditoria y autofix deben compartir normalizacion de nombres de conflicto");
assert.ok(dataAutomationAudit.includes("sharedConflictNames"), "auditoria de datos debe separar conflictos compartidos de duplicados reales");
assert.ok(dataAutomationAudit.includes("sourceTextMojibake"), "auditoria de datos debe detectar mojibake en fuentes generadoras");
assert.ok(dataAutomationAudit.includes('fieldName !== "url"'), "auditoria de idioma no debe interpretar URLs de fuentes como texto visible");
assert.ok(dataAutomationAudit.includes("baseSectionProfiles"), "auditoria de datos debe separar secciones base de baja confianza real");
assert.ok(dataAutomationAudit.includes("provisionalConflictHierarchies"), "auditoria debe distinguir padres regionales provisionales de jerarquias verificadas");
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
assert.ok(!appShellText.includes("app-text.js"), "textos completos no deben precachearse en APP_SHELL");
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
assert.ok(riskRadarUi.includes("function buildScenarioCards"), "escenarios del radar deben vivir fuera del runtime critico");
assert.ok(!script.includes("function getRiskMainDriverLabel"), "helper visual del radar no debe volver a script.js");
assert.ok(!/function buildQuizQuestion\(category\)[\s\S]{0,2400}category === "language"/.test(script), "fallback pesado del quiz no debe volver al runtime critico");
assert.ok(!script.includes("function parseSemanticQuery"), "parser semantico pesado no debe volver al runtime critico");
assert.ok(appSearch.includes("parseSemanticFilters"), "parser semantico debe vivir en app-search diferido");
assert.ok(appSearch.includes("resolveAliasResult"), "resolucion de aliases debe vivir en app-search diferido");
assert.ok(appSearch.includes("return index >= 0 ? index : TYPE_ORDER.length"), "tipos de sugerencia desconocidos no deben adelantarse a paises");
assert.ok(script.includes("searchCore.resolveAliasResult"), "runtime debe delegar la resolucion exacta de busqueda");
assert.ok(script.includes('types: ["country"]'), "busqueda debe priorizar coincidencias exactas de pais antes de filtros semanticos");
assert.ok(!script.includes("const religionDenomination = religionDenominationAliases.get(query)"), "cadena repetitiva de aliases no debe volver al runtime critico");
assert.ok(!script.includes("if (/con mas conflictos|with more conflicts/.test(query))"), "rankings naturales no deben tener un fallback duplicado");
assert.ok(!script.includes("let activeIndex = 0;\n  let currentSuggestions"), "sugerencias no deben secuestrar Enter sin navegacion explicita");
assert.ok(script.includes("Jerarquia pendiente"), "ficha de conflicto debe avisar cuando la guerra padre es solo provisional");
assert.ok(script.includes("Jerarquia verificada"), "ficha de conflicto debe distinguir jerarquias con fuente explicita");
assert.ok(!script.includes("item?.text || item ||"), "modal de conflicto no debe convertir objetos de cronologia en texto implicito");
assert.ok(appQuiz.includes("function renderPanel"), "render completo del quiz debe vivir en app-quiz-ui diferido");
assert.ok(appQuiz.includes("function renderFeedback"), "feedback del quiz debe vivir en app-quiz-ui diferido");
assert.ok(!script.includes("<span class=\"quiz-meta-pill\">"), "markup de meta del quiz no debe volver al runtime critico");
assert.ok(appCountryPanel.includes("renderDataQuality"), "fuentes y calidad deben renderizarse desde app-country-panel diferido");
assert.ok(appCountryPanel.includes("formatProvenanceValue"), "procedencia anidada debe tener formateador legible");
assert.ok(appCountryPanel.includes("async function handleInteraction"), "interacciones de ficha deben vivir en app-country-panel diferido");
assert.ok(appCountryPanel.includes("function renderProfile"), "composicion completa de ficha debe vivir en app-country-panel diferido");
assert.ok(script.includes("countryPanelUi.renderProfile"), "runtime debe delegar la ficha al modulo diferido");
assert.ok(!script.includes('<div class="country-profile country-profile-mode-'), "markup completo de ficha no debe volver al runtime critico");
assert.ok(!script.includes("function renderCountryOverview"), "render estatico de ficha no debe volver a script.js");
assert.ok(script.includes("async function handleCountryPanelInteraction"), "runtime debe conservar un puente de interaccion bajo demanda");
assert.ok(setupSearchEventsBlock.includes("handleCountryPanelInteraction(event)"), "panel debe delegar clics al controlador diferido");
assert.ok(!setupSearchEventsBlock.includes("[data-timeline-filter]"), "filtros de ficha no deben volver al cableado de busqueda");
assert.ok(!setupSearchEventsBlock.includes("[data-conflict-load-more]"), "paginacion de conflictos no debe volver al runtime critico");
assert.ok(!script.includes("const DATA_SOURCE_SUMMARY"), "resumen de fuentes no debe volver al runtime critico");
assert.ok(!script.includes("function renderDataQuality(country)"), "render de calidad no debe duplicarse en el runtime critico");
assert.ok(deferredModulesBlock.includes('text: `./app-text.js?v=${APP_VERSION}`'), "textos deben declararse como modulo diferido versionado");
assert.ok(/await Promise\.all\(\[\s*ensureDeferredUiModule\("text"\),\s*ensureDeferredUiModule\("uiPolish"\)/.test(script), "controles no deben activarse antes del modulo de avisos visuales");
assert.ok(appText.includes("function applyStaticText"), "app-text debe renderizar textos estaticos");
assert.ok(appText.includes("function applyExtendedStaticText"), "app-text debe renderizar textos extendidos");
assert.ok(!script.includes("const themeOptionLabels"), "catalogo largo de capas no debe volver al runtime critico");
assert.ok(/function updateStaticText\(\)[\s\S]{0,260}textUi\.applyStaticText/.test(script), "runtime debe delegar traduccion estatica");
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

assert.ok(conflictAutofix.includes("POSTWAR_1970_1991_CONFLICT_DETAIL_FIXES"), "autofix debe incorporar la tanda fuente-respaldada de 1970-1991");
assert.ok(postwar1970Curation.includes("hierarchySources"), "curaduria de 1970-1991 debe conservar trazabilidad");
assert.ok(
  postwar1970Curation.includes('"Sitio de Alepo (1980-1981)"')
    && postwar1970Curation.includes('parent: "Insurrección islamista en Siria (1976-1982)"'),
  "Alepo 1980 no debe mezclarse con la guerra civil siria de 2011"
);
assert.ok(
  postwar1970Curation.includes('"Batalla de Guelta Zemmur (1989)"')
    && postwar1970Curation.includes('parent: "Guerra del Sahara Occidental"'),
  "las batallas saharauis deben conservar su guerra padre"
);
assert.ok(conflictAutofix.includes("MODERN_1992_2021_CONFLICT_DETAIL_FIXES"), "autofix debe incorporar la tanda fuente-respaldada de 1992-2021");
assert.ok(modern1992Curation.includes("hierarchySources"), "curaduria de 1992-2021 debe conservar trazabilidad");
assert.ok(
  modern1992Curation.includes('"Batalla de los puentes": "Batalla de los puentes de Nasiriya"'),
  "Nasiriya no debe volver a exponer dos nombres para la misma batalla de 2004"
);
assert.ok(
  modern1992Curation.includes('"Batalla de Mosul (2016-2017)"')
    && modern1992Curation.includes('parent: "Guerra contra el Estado Islámico"'),
  "Mosul 2016-2017 debe conservar su guerra padre"
);
assert.ok(conflictAutofix.includes("UNDATED_AMERICAS_CONFLICT_DETAIL_FIXES"), "autofix debe incorporar la tanda americana sin fecha");
assert.ok(undatedAmericasCuration.includes("hierarchySources"), "curaduria americana sin fecha debe conservar trazabilidad");
assert.ok(
  undatedAmericasCuration.includes('"Batalla de Ch-teauguay": "Batalla de Châteauguay"'),
  "Chateauguay no debe volver a mostrar el nombre mutilado"
);
assert.ok(
  undatedAmericasCuration.includes('"Batalla de Nueva Orleans"')
    && undatedAmericasCuration.includes('parent: "Guerra de 1812"'),
  "Nueva Orleans debe conservar su guerra padre y fecha historica"
);
assert.ok(conflictAutofix.includes("REVOLUTION_FOLLOWUP_CONFLICT_DETAIL_FIXES"), "autofix debe incorporar la segunda tanda revolucionaria");
assert.ok(revolutionFollowupCuration.includes("hierarchySources"), "segunda tanda revolucionaria debe conservar trazabilidad");
assert.ok(
  revolutionFollowupCuration.includes('"Batalla de Delaware Bay": "Batalla de la bahía de Delaware"')
    && revolutionFollowupCuration.includes('"Batalla de Delaware Capes": "Batalla de la bahía de Delaware"'),
  "las variantes de la batalla de Delaware deben converger a un solo nombre en espanol"
);
assert.ok(
  revolutionFollowupCuration.includes('"Inteligencia en la batalla de Princeton": "Batalla de Princeton"'),
  "el registro tecnico de inteligencia debe integrarse en la batalla de Princeton"
);
assert.ok(
  revolutionFollowupCuration.includes('"Batalla de White Plains"')
    && revolutionFollowupCuration.includes('"Batalla de Lindley\'s Mill"'),
  "la segunda tanda debe conservar sus extremos cronologicos verificados"
);
assert.ok(conflictAutofix.includes("TRANSITION_1846_1902_CONFLICT_DETAIL_FIXES"), "autofix debe incorporar la tanda 1846-1902");
assert.ok(transition1846Curation.includes("hierarchySources"), "la tanda 1846-1902 debe conservar trazabilidad");
assert.ok(
  transition1846Curation.includes('"Batalla de Monterey": "Batalla de Monterrey"')
    && transition1846Curation.includes('"Batalla de Marilao River": "Batalla del río Marilao"'),
  "los nombres mixtos de la tanda deben converger a español"
);
assert.ok(
  transition1846Curation.includes('"Batalla de Manila (1899)"')
    && transition1846Curation.includes('"Batalla de Manila (1945)"'),
  "Manila debe conservar registros separados para 1899 y 1945"
);
assert.ok(
  wikipediaConflicts.includes('"Batalla de Manila (1899)": "Batalla_de_Manila_(1899)"')
    && wikipediaConflicts.includes('"Batalla de Manila (1945)": "Batalla_de_Manila_(1945)"')
    && !wikipediaConflicts.includes('"Batalla de Manila": "Batalla_de_Manila_(1945)"'),
  "la importacion no debe volver a mezclar las dos batallas de Manila"
);
assert.ok(conflictAutofix.includes("WAR_1812_FOLLOWUP_CONFLICT_DETAIL_FIXES"), "autofix debe incorporar la tanda final de 1812");
assert.ok(war1812FollowupCuration.includes("hierarchySources"), "la tanda de 1812 debe conservar trazabilidad");
assert.ok(
  war1812FollowupCuration.includes('"Guerra de 1812": "Guerra anglo-estadounidense de 1812"')
    && war1812FollowupCuration.includes('"Batalla de Fort Wayne": "Sitio de Fort Wayne"')
    && war1812FollowupCuration.includes('"Batalla de River Canard": "Batalla del río Canard"'),
  "la tanda de 1812 debe unificar guerra padre y nombres visibles"
);
assert.ok(
  wikipediaConflicts.includes('"Sitio de Fort Wayne": "Siege_of_Fort_Wayne"')
    && wikipediaConflicts.includes('"Batalla de las alturas de Queenston": "Battle_of_Queenston_Heights"')
    && wikipediaConflicts.includes('"Combate naval entre el HMS Shannon y el USS Chesapeake": "Capture_of_USS_Chesapeake"'),
  "los nombres traducidos de 1812 deben conservar su pagina de importacion"
);
assert.ok(conflictAutofix.includes("US_CIVIL_WAR_FOLLOWUP_CONFLICT_DETAIL_FIXES"), "autofix debe incorporar la tanda de la Guerra Civil estadounidense");
assert.ok(usCivilWarFollowupCuration.includes("hierarchySources"), "la tanda de la Guerra Civil debe conservar trazabilidad");
assert.ok(
  usCivilWarFollowupCuration.includes('"Batalla de Fort McAllister": "Segunda batalla de Fort McAllister"')
    && usCivilWarFollowupCuration.includes('"Batalla de Galveston Harbor": "Batalla del puerto de Galveston de 1862"')
    && usCivilWarFollowupCuration.includes('"Batalla de Head de Passes": "Batalla de Head of Passes"'),
  "la tanda de la Guerra Civil debe desambiguar y normalizar sus nombres visibles"
);
assert.ok(
  wikipediaConflicts.includes('"Segunda batalla de Fort McAllister": "Second_Battle_of_Fort_McAllister"')
    && wikipediaConflicts.includes('"Batalla naval de Memphis": "First_Battle_of_Memphis"')
    && wikipediaConflicts.includes('"Batalla de Spotsylvania Court House": "Battle_of_Spotsylvania_Court_House"'),
  "los nombres normalizados de la Guerra Civil deben conservar su pagina de importacion"
);
assert.ok(
  wikipediaConflicts.includes('language === "en" ? WIKIPEDIA_API_EN : WIKIPEDIA_API_ES'),
  "los overrides ingleses deben usar la API inglesa en vez de consultar una pagina inexistente en espanol"
);
assert.ok(conflictAutofix.includes("US_WWII_FOLLOWUP_CONFLICT_DETAIL_FIXES"), "autofix debe incorporar la tanda estadounidense de la Segunda Guerra Mundial");
assert.ok(usWwiiFollowupCuration.includes("hierarchySources"), "la tanda de la Segunda Guerra Mundial debe conservar trazabilidad");
assert.ok(
  usWwiiFollowupCuration.includes('"Batalla del Mar de Sibuyan": "Batalla del mar de Sibuyán"')
    && usWwiiFollowupCuration.includes('"Batalla de SS Stephen Hopkins": "Combate naval del SS Stephen Hopkins"')
    && usWwiiFollowupCuration.includes('"Batalla de St. Vith": "Batalla de Saint-Vith"'),
  "la tanda de la Segunda Guerra Mundial debe normalizar sus nombres visibles"
);
assert.ok(
  wikipediaConflicts.includes('"Batalla del mar de Sibuyán": "Battle_of_the_Sibuyan_Sea"')
    && wikipediaConflicts.includes('"Combate naval del SS Stephen Hopkins": "SS_Stephen_Hopkins"')
    && wikipediaConflicts.includes('"Batalla de Saint-Vith": "Battle_of_St._Vith"'),
  "los nombres normalizados de la Segunda Guerra Mundial deben conservar su pagina de importacion"
);
assert.ok(conflictAutofix.includes("US_INDIAN_WARS_FOLLOWUP_CONFLICT_DETAIL_FIXES"), "autofix debe incorporar la tanda estadounidense de guerras indígenas");
assert.ok(usIndianWarsFollowupCuration.includes("hierarchySources"), "la tanda de guerras indígenas debe conservar trazabilidad");
assert.ok(usIndianWarsFollowupCuration.includes('curationBatch: "source-backed-us-indian-wars-followup-2026-07"'), "la tanda de guerras indígenas debe quedar identificada");
assert.ok(
  usIndianWarsFollowupCuration.includes('"Batalla de Little Big Horn": "Batalla de Little Bighorn"')
    && usIndianWarsFollowupCuration.includes('"Batalla de Ouithlacoochie": "Batalla de Withlacoochee"')
    && usIndianWarsFollowupCuration.includes('"Batalla de Lake Okeechobee": "Batalla del lago Okeechobee"'),
  "la tanda de guerras indígenas debe corregir ortografía y nombres visibles mixtos"
);
assert.ok(
  wikipediaConflicts.includes('"Batalla de Little Bighorn": "Battle_of_the_Little_Bighorn"')
    && wikipediaConflicts.includes('"Batalla de Withlacoochee": "Battle_of_Withlacoochee"')
    && wikipediaConflicts.includes('"Batalla del cañón de Palo Duro": "Battle_of_Palo_Duro_Canyon"'),
  "los nombres normalizados de guerras indígenas deben conservar su pagina de importacion"
);
assert.ok(
  usIndianWarsFollowupCuration.includes("history.army.mil")
    && usIndianWarsFollowupCuration.includes("nps.gov")
    && usIndianWarsFollowupCuration.includes("thc.texas.gov"),
  "la tanda de guerras indígenas debe apoyarse en fuentes institucionales"
);
assert.ok(conflictAutofix.includes("US_FRONTIER_FOLLOWUP_CONFLICT_DETAIL_FIXES"), "autofix debe incorporar la segunda tanda fronteriza estadounidense");
assert.ok(usFrontierFollowupCuration.includes("hierarchySources"), "la segunda tanda fronteriza debe conservar trazabilidad");
assert.ok(usFrontierFollowupCuration.includes('curationBatch: "source-backed-us-frontier-followup-2026-07"'), "la segunda tanda fronteriza debe quedar identificada");
assert.ok(
  usFrontierFollowupCuration.includes('"Batalla de Apache Pass": "Batalla del paso Apache"')
    && usFrontierFollowupCuration.includes('"Battle of the Tongue River": "Batalla del río Tongue"')
    && usFrontierFollowupCuration.includes('"Batalla de Salt River Canyon": "Masacre de Skeleton Cave"'),
  "la segunda tanda fronteriza debe traducir topónimos y reclasificar Skeleton Cave"
);
assert.ok(
  wikipediaConflicts.includes('"Batalla del paso Apache": "Battle_of_Apache_Pass"')
    && wikipediaConflicts.includes('"Masacre de Skeleton Cave": "Skeleton_Cave_(Arizona)"')
    && wikipediaConflicts.includes('"Batalla de los Árboles Caídos": "Battle_of_Fallen_Timbers"'),
  "los nombres fronterizos normalizados deben conservar su página de importación"
);
assert.ok(
  usFrontierFollowupCuration.includes("nps.gov")
    && usFrontierFollowupCuration.includes("armyupress.army.mil")
    && usFrontierFollowupCuration.includes("thc.texas.gov")
    && usFrontierFollowupCuration.includes("ohiohistory.org")
    && usFrontierFollowupCuration.includes("virginia.gov"),
  "la segunda tanda fronteriza debe apoyarse en fuentes institucionales diversas"
);
assert.ok(
  usFrontierFollowupCuration.includes("El Ejército identificó entonces a las víctimas como tonto apache")
    && usFrontierFollowupCuration.includes("Se omite la afirmación tradicional de que Peta Nocona murió allí"),
  "la segunda tanda fronteriza debe conservar las cautelas historiográficas"
);
assert.ok(
  conflictAutofix.includes("US_FRONTIER_SECOND_FOLLOWUP_CONFLICT_DETAIL_FIXES")
    && conflictAutofix.includes("US_FRONTIER_SECOND_FOLLOWUP_SAFE_CONFLICT_RENAMES"),
  "autofix debe incorporar la nueva tanda fronteriza estadounidense"
);
assert.ok(
  usFrontierSecondFollowupCuration.includes("hierarchySources")
    && usFrontierSecondFollowupCuration.includes('curationBatch: "source-backed-us-frontier-second-followup-2026-07"'),
  "la nueva tanda fronteriza debe declarar trazabilidad y lote"
);
assert.ok(
  usFrontierSecondFollowupCuration.includes('"Batalla de Claremore Mound": "Masacre de Claremore Mound (1817)"')
    && usFrontierSecondFollowupCuration.includes('"Batalla de Devil\'s River": "Combate del río Devils (1857)"')
    && usFrontierSecondFollowupCuration.includes('"Batalla de Owyhee River": "Batalla del río Owyhee (1866)"'),
  "la nueva tanda fronteriza debe reclasificar acciones y normalizar topónimos"
);
assert.ok(
  wikipediaConflicts.includes('"Ataque a Kenapacomaqua (1791)": "Battle_of_Kenapacomaqua"')
    && wikipediaConflicts.includes('"Batalla de Pima Butte (1857)": "Battle_of_Pima_Butte"')
    && wikipediaConflicts.includes('"Combate de Honsinger Bluff (1873)": "Battle_of_Honsinger_Bluff"'),
  "los nombres normalizados de la nueva tanda deben conservar su página de importación"
);
assert.ok(
  usFrontierSecondFollowupCuration.includes("in.gov")
    && usFrontierSecondFollowupCuration.includes("okhistory.org")
    && usFrontierSecondFollowupCuration.includes("uapress.arizona.edu")
    && usFrontierSecondFollowupCuration.includes("nps.gov")
    && usFrontierSecondFollowupCuration.includes("thc.state.tx.us")
    && usFrontierSecondFollowupCuration.includes("history.idaho.gov"),
  "la nueva tanda fronteriza debe apoyarse en fuentes institucionales y académicas diversas"
);
assert.ok(
  usFrontierSecondFollowupCuration.includes("no encontró informe militar, memoria contemporánea ni noticia de prensa")
    && usFrontierSecondFollowupCuration.includes("La asociación con Estados Unidos es únicamente geográfica")
    && usFrontierSecondFollowupCuration.includes("difieren de forma importante sobre las bajas indígenas"),
  "la nueva tanda fronteriza debe publicar dudas documentales y evitar falsa precisión"
);
assert.ok(conflictAutofix.includes("US_CARIBBEAN_FOLLOWUP_CONFLICT_DETAIL_FIXES"), "autofix debe incorporar la tanda de Nicaragua y Caribe");
assert.ok(conflictAutofix.includes("US_CARIBBEAN_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS"), "autofix debe vincular las acciones con sus paises anfitriones");
assert.ok(usCaribbeanFollowupCuration.includes("hierarchySources"), "la tanda de Nicaragua y Caribe debe conservar trazabilidad");
assert.ok(usCaribbeanFollowupCuration.includes('curationBatch: "source-backed-us-caribbean-followup-2026-07"'), "la tanda de Nicaragua y Caribe debe quedar identificada");
assert.ok(
  usCaribbeanFollowupCuration.includes('"Haití": ["Batalla de Fort Rivière"]')
    && usCaribbeanFollowupCuration.includes('"República Dominicana"')
    && usCaribbeanFollowupCuration.includes("US_CARIBBEAN_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS"),
  "las acciones del Caribe deben quedar vinculadas con el pais donde ocurrieron"
);
assert.ok(
  usCaribbeanFollowupCuration.includes('"Batalla de Fort Riviere": "Batalla de Fort Rivière"')
    && usCaribbeanFollowupCuration.includes('"Batalla de Las Cruces": "Segunda batalla de Las Cruces (1928)"')
    && usCaribbeanFollowupCuration.includes('"Batalla del puerto de Puerto Plata": "Incursión naval de Puerto Plata (1800)"'),
  "la tanda de Nicaragua y Caribe debe corregir acentos y desambiguar acciones homonimas"
);
assert.ok(
  wikipediaConflicts.includes('"Segunda batalla de Las Cruces (1928)": "Battle_of_Las_Cruces_(1928)"')
    && wikipediaConflicts.includes('"Batalla de Fort Rivière": "Battle_of_Fort_Rivière"')
    && wikipediaConflicts.includes('"Incursión naval de Puerto Plata (1800)": "Battle_of_Puerto_Plata_Harbor"'),
  "los nombres caribenos normalizados deben conservar su pagina de importacion"
);
assert.ok(
  usCaribbeanFollowupCuration.includes("usmcu.edu")
    && usCaribbeanFollowupCuration.includes("marines.mil")
    && usCaribbeanFollowupCuration.includes("history.navy.mil")
    && usCaribbeanFollowupCuration.includes("history.state.gov"),
  "la tanda de Nicaragua y Caribe debe apoyarse en fuentes institucionales diversas"
);
assert.ok(conflictAutofix.includes("AUSTRALIA_DENMARK_FOLLOWUP_CONFLICT_DETAIL_FIXES"), "autofix debe incorporar la tanda de Australia y Dinamarca");
assert.ok(conflictAutofix.includes("AUSTRALIA_DENMARK_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS"), "autofix debe vincular las acciones con los paises donde ocurrieron");
assert.ok(australiaDenmarkFollowupCuration.includes('curationBatch: "source-backed-australia-denmark-followup-2026-07"'), "la nueva tanda debe quedar identificada");
assert.ok(
  australiaDenmarkFollowupCuration.includes('"Timor Oriental": ["Batalla de Aidabasalala"]')
    && australiaDenmarkFollowupCuration.includes('"Bélgica": ["Batalla de Broodseinde"]')
    && australiaDenmarkFollowupCuration.includes('Francia: ["Primera batalla de Dernancourt"]')
    && australiaDenmarkFollowupCuration.includes('Alemania: ["Batalla de Schleswig (1848)", "Batalla de Isted"]'),
  "las acciones deben quedar asociadas con sus paises anfitriones"
);
assert.ok(
  australiaDenmarkFollowupCuration.includes('"Batalla de Schleswig": "Batalla de Schleswig (1848)"')
    && australiaDenmarkFollowupCuration.includes('"Invasion indonesia de Timor Oriental": "Invasion indonesia de Timor Oriental (1975)"')
    && australiaDenmarkFollowupCuration.includes('"Crisis de Timor Oriental": "Crisis de Timor Oriental de 2006"')
    && australiaDenmarkFollowupCuration.includes("elimina la relación automática e históricamente imposible con la Segunda Guerra Mundial")
    && australiaDenmarkFollowupCuration.includes("sustituye la campaña del Pacífico de 1941-1945"),
  "la tanda debe desambiguar nombres y reparar las jerarquias imposibles de Timor Oriental"
);
assert.ok(
  wikipediaConflicts.includes('"Batalla de Aidabasalala": "Battle_of_Aidabasalala"')
    && wikipediaConflicts.includes('"Combate naval entre el HMAS Sydney y el Kormoran (1941)"')
    && wikipediaConflicts.includes('"Batalla de Schleswig (1848)": "Battle_of_Schleswig"')
    && wikipediaConflicts.includes('"Crisis de Timor Oriental de 2006": "2006_East_Timorese_crisis"'),
  "los nombres normalizados deben conservar paginas de importacion profunda"
);
assert.ok(
  australiaDenmarkFollowupCuration.includes("awm.gov.au")
    && australiaDenmarkFollowupCuration.includes("army.gov.au")
    && australiaDenmarkFollowupCuration.includes("danmarkshistorien.dk")
    && australiaDenmarkFollowupCuration.includes("natmus.dk")
    && australiaDenmarkFollowupCuration.includes("peacekeeping.un.org"),
  "la tanda debe apoyarse en fuentes institucionales australianas, danesas y de Naciones Unidas"
);
assert.ok(conflictAutofix.includes("US_INDIGENOUS_FOLLOWUP_CONFLICT_DETAIL_FIXES"), "autofix debe incorporar la tanda indígena estadounidense");
assert.ok(conflictAutofix.includes("US_INDIGENOUS_FOLLOWUP_SAFE_CONFLICT_RENAMES"), "autofix debe aplicar nombres curados y fusionar alias de la tanda indígena");
assert.ok(usIndigenousFollowupCuration.includes('curationBatch: "source-backed-us-indigenous-followup-2026-07"'), "la tanda indígena debe quedar identificada");
assert.ok(
  usIndigenousFollowupCuration.includes('"Batalla de Dry Lake": "Batalla de Dry Lake (1873)"')
    && usIndigenousFollowupCuration.includes('"Batalla de Sand Butte": "Batalla de Dry Lake (1873)"')
    && usIndigenousFollowupCuration.includes('"Batalla de Turner\'s Falls": "Masacre de Peskeompskut (1676)"')
    && usIndigenousFollowupCuration.includes('"Batalla de Kelley Creek": "Masacre de Kelley Creek (1911)"'),
  "la tanda debe fusionar Dry Lake, recuperar Peskeompskut y reclasificar Kelley Creek"
);
assert.ok(
  wikipediaConflicts.includes('"Masacre de Peskeompskut (1676)": "Battle_of_Turner\'s_Falls"')
    && wikipediaConflicts.includes('"Batalla del cañón de Ojo Caliente (1854)"')
    && wikipediaConflicts.includes('"Masacre de Kelley Creek (1911)"')
    && wikipediaConflicts.includes('"Combate de Bear Valley (1918)"'),
  "los nombres curados de la tanda indígena deben conservar páginas de importación profunda"
);
assert.ok(
  usIndigenousFollowupCuration.includes("nps.gov")
    && usIndigenousFollowupCuration.includes("army.mil")
    && usIndigenousFollowupCuration.includes("mnhs.org")
    && usIndigenousFollowupCuration.includes("loc.gov")
    && usIndigenousFollowupCuration.includes("sudbury.ma.us"),
  "la tanda indígena debe apoyarse en fuentes federales, estatales y municipales diversas"
);
assert.ok(
  conflictAutofix.includes("US_REVOLUTION_THIRD_FOLLOWUP_CONFLICT_DETAIL_FIXES")
    && conflictAutofix.includes("US_REVOLUTION_THIRD_FOLLOWUP_SAFE_CONFLICT_RENAMES"),
  "autofix debe incorporar la tercera tanda de la Revolución estadounidense"
);
assert.ok(
  usRevolutionThirdFollowupCuration.includes('curationBatch: "source-backed-us-revolution-third-followup-2026-07"'),
  "la tercera tanda revolucionaria debe quedar identificada"
);
assert.ok(
  usRevolutionThirdFollowupCuration.includes('"Batalla de Norwalk": "Incursión de Norwalk (1779)"')
    && usRevolutionThirdFollowupCuration.includes('"Batalla de Wetzell\'s Mill": "Escaramuza de Wetzell\'s Mill (1781)"')
    && usRevolutionThirdFollowupCuration.includes('"Batalla de Fort Slongo": "Asalto a Fort Slongo (1781)"'),
  "la tanda debe reclasificar incursiones, escaramuzas y asaltos con su fecha"
);
assert.ok(
  wikipediaConflicts.includes('"Batalla de Kemp\'s Landing (1775)": "Battle_of_Kemp\'s_Landing"')
    && wikipediaConflicts.includes('"Batalla de Saint-Pierre (1776)": "Battle_of_Saint-Pierre"')
    && wikipediaConflicts.includes('"Batalla de San Luis (1780)": "Battle_of_St._Louis"')
    && wikipediaConflicts.includes('"Asalto a Fort Slongo (1781)": "Battle_of_Fort_Slongo"'),
  "los nombres de la tercera tanda revolucionaria deben conservar páginas de importación profunda"
);
assert.ok(
  usRevolutionThirdFollowupCuration.includes("dhr.es.virginia.gov")
    && usRevolutionThirdFollowupCuration.includes("nationalregister.sc.gov")
    && usRevolutionThirdFollowupCuration.includes("canada.ca")
    && usRevolutionThirdFollowupCuration.includes("america250.nc.gov")
    && usRevolutionThirdFollowupCuration.includes("founders.archives.gov"),
  "la tercera tanda revolucionaria debe apoyarse en archivos y organismos institucionales"
);
assert.ok(conflictAutofix.includes("BRITISH_WWII_FOLLOWUP_CONFLICT_DETAIL_FIXES"), "autofix debe incorporar la tanda británica de la Segunda Guerra Mundial");
assert.ok(britishWwiiFollowupCuration.includes("hierarchySources"), "la tanda británica debe conservar trazabilidad");
assert.ok(britishWwiiFollowupCuration.includes('curationBatch: "source-backed-british-wwii-followup-2026-07"'), "la tanda británica debe quedar identificada");
assert.ok(
  britishWwiiFollowupCuration.includes('"Batalla de Britain Day": "Día de la Batalla de Inglaterra"')
    && britishWwiiFollowupCuration.includes('"Batalla de Bay de Biscay": "Batalla del golfo de Vizcaya"')
    && britishWwiiFollowupCuration.includes('"Batalla de Merville Gun Battery": "Batalla de la batería de Merville"'),
  "la tanda británica debe traducir y normalizar sus nombres visibles"
);
assert.ok(
  wikipediaConflicts.includes('"Batalla del mar de Barents": "Battle_of_the_Barents_Sea"')
    && wikipediaConflicts.includes('"Batalla de la estación de radar de Douvres": "Battle_of_Douvres_Radar_Station"')
    && wikipediaConflicts.includes('"Batalla del convoy Tarigo": "Battle_of_the_Tarigo_Convoy"'),
  "los nombres británicos normalizados deben conservar su pagina de importacion"
);
assert.ok(
  britishWwiiFollowupCuration.includes("royalnavy.mod.uk")
    && britishWwiiFollowupCuration.includes("raf.mod.uk")
    && britishWwiiFollowupCuration.includes("awm.gov.au")
    && britishWwiiFollowupCuration.includes("iwm.org.uk"),
  "la tanda británica debe apoyarse en fuentes institucionales por teatro"
);
assert.ok(conflictAutofix.includes("US_OVERSEAS_FOLLOWUP_CONFLICT_DETAIL_FIXES"), "autofix debe incorporar la tanda ultramarina estadounidense");
assert.ok(usOverseasFollowupCuration.includes("hierarchySources"), "la tanda ultramarina debe conservar trazabilidad");
assert.ok(usOverseasFollowupCuration.includes('curationBatch: "source-backed-us-overseas-followup-2026-07"'), "la tanda ultramarina debe quedar identificada");
assert.ok(
  usOverseasFollowupCuration.includes('"Batalla de Ch-teau-Thierry": "Batalla de Château-Thierry"')
    && usOverseasFollowupCuration.includes('"Batalla de BIAP": "Batalla del Aeropuerto Internacional de Bagdad"')
    && usOverseasFollowupCuration.includes('"Batalla de Shok Valley": "Batalla del valle de Shok"'),
  "la tanda ultramarina debe corregir nombres dañados, siglas opacas y topónimos mixtos"
);
assert.ok(
  usOverseasFollowupCuration.includes('startYear: 2004')
    && usOverseasFollowupCuration.includes('campaign: "Levantamiento del Ejército del Mahdi de 2004"')
    && usOverseasFollowupCuration.includes("transportation.army.mil/history/studies/april_uprising.html"),
  "BIAP debe conservar el combate de 2004 y no mezclarse con la toma del aeropuerto de 2003"
);
assert.ok(
  wikipediaConflicts.includes('"Ataque al campamento de Hiep Hoa": "Battle_of_Hiep_Hoa"')
    && wikipediaConflicts.includes('"Batalla del Aeropuerto Internacional de Bagdad": "Battle_of_Baghdad_International_Airport"')
    && wikipediaConflicts.includes('"Batalla de Do Ab": "Battle_of_Do_Ab"'),
  "los nombres ultramarinos normalizados deben conservar su pagina de importacion"
);
assert.ok(
  usOverseasFollowupCuration.includes("history.army.mil")
    && usOverseasFollowupCuration.includes("dafhistory.af.mil")
    && usOverseasFollowupCuration.includes("transportation.army.mil")
    && usOverseasFollowupCuration.includes("marines.mil")
    && usOverseasFollowupCuration.includes("army.mil"),
  "la tanda ultramarina debe apoyarse en fuentes institucionales para cada teatro"
);
assert.ok(conflictAutofix.includes("ACTIVE_AFRICA_FOLLOWUP_CONFLICT_DETAIL_FIXES"), "autofix debe incorporar la tanda africana reciente");
assert.ok(activeAfricaFollowupCuration.includes("hierarchySources"), "la tanda africana reciente debe conservar trazabilidad múltiple");
assert.ok(activeAfricaFollowupCuration.includes('curationBatch: "source-backed-active-africa-followup-2026-07"'), "la tanda africana reciente debe quedar identificada");
assert.ok(
  activeAfricaFollowupCuration.includes('"Ofensiva de Amhara de 2024": "Ofensiva de Fano en Amhara de 2024"')
    && activeAfricaFollowupCuration.includes('parent: "Crisis de Jubalandia de 2024"')
    && activeAfricaFollowupCuration.includes('parent: "Guerra de Malí"'),
  "la tanda africana reciente debe normalizar el actor de Amhara y usar padres específicos"
);
assert.ok(
  activeAfricaFollowupCuration.includes("digitallibrary.un.org")
    && activeAfricaFollowupCuration.includes("criticalthreats.org")
    && activeAfricaFollowupCuration.includes("gov.uk")
    && activeAfricaFollowupCuration.includes("apnews.com")
    && activeAfricaFollowupCuration.includes("pism.pl"),
  "la tanda africana reciente debe triangular fuentes institucionales e independientes"
);
assert.ok(
  activeAfricaFollowupCuration.includes("Las cifras de bajas disputadas se mantienen sin consolidar")
    && activeAfricaFollowupCuration.includes("algo disputado por el CSP-DPA"),
  "la tanda africana reciente debe conservar cautelas sobre bajas y actores discutidos"
);
assert.ok(
  wikipediaConflicts.includes('"Batalla de Ras Kamboni (2024)": "Battle_of_Ras_Kamboni_(2024)"')
    && wikipediaConflicts.includes('"Ofensiva de Fano en Amhara de 2024": "Amhara_offensive"')
    && wikipediaConflicts.includes('"Batalla de Boulikessi (2025)": "Battle_of_Boulikessi_(2025)"')
    && wikipediaConflicts.includes('ENGLISH_WIKIPEDIA_TITLE_EXCEPTIONS.has(direct)'),
  "los nombres africanos recientes deben conservar su importación profunda y el idioma correcto"
);
assert.ok(
  conflictBatchCuration.includes("if (Array.isArray(entry.treaties)) return entry.treaties;"),
  "la curaduria debe respetar listas de tratados explicitamente vacias"
);

console.log("release-gates.test.js ok");
