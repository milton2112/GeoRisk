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
const sw = await fs.readFile(path.join(projectRoot, "sw.js"), "utf8");
const bootScheduler = await fs.readFile(path.join(projectRoot, "app-boot-scheduler.js"), "utf8");
const appMap = await fs.readFile(path.join(projectRoot, "app-map.js"), "utf8");
const timelineConflicts = await fs.readFile(path.join(projectRoot, "app-timeline-conflicts.js"), "utf8");
const cleanLocal = await fs.readFile(path.join(projectRoot, "scripts/cleanLocal.js"), "utf8");

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
assert.ok(!indexHtml.includes("style-polish.css"), "pulido visual no debe bloquear el primer mapa");
assert.ok(!indexHtml.includes("fonts.googleapis.com"), "fuentes remotas no deben bloquear el primer render");
assert.ok(!/bootHeavyDataEnhancements[\s\S]{0,500}loadRuntimeCuration/.test(script), "curaduria profunda debe esperar a una ficha");
assert.ok(!indexHtml.includes("html2canvas"), "exportacion debe cargar html2canvas bajo demanda");
assert.ok(!indexHtml.includes("jspdf"), "exportacion debe cargar jsPDF bajo demanda");
assert.ok(!script.includes("scheduleFullCountryDataLoad"), "countries_full no debe precargarse por scheduler");
assert.ok(!script.includes("startFullLoad"), "countries_full no debe tener disparador silencioso");
assert.ok(cleanLocal.includes("process.argv.includes(\"--deep\")"), "limpieza profunda debe ser explicita");
const artifactTargets = cleanLocal.match(/const artifactTargets = \[([\s\S]*?)\];/)?.[1] || "";
assert.ok(!artifactTargets.includes("node_modules"), "release:check no debe borrar dependencias");
assert.ok(!cleanLocal.includes("package-lock.json"), "la limpieza no debe borrar el lockfile reproducible");
assert.ok(!script.includes("async function loadFullCountryData()"), "countries_full no debe tener loader global sin consumidores");
assert.equal((script.match(/countries_full\.json/g) || []).length, 1, "countries_full solo debe quedar como fallback del indice");
assert.ok(script.includes("async function loadCountryDetail"), "detalle de pais debe cargarse bajo demanda");
assert.ok(script.includes("maybeEnhanceOpenConflictModal"), "conflictos detallados deben cargarse al abrir modal");
assert.ok(script.includes("scheduleDetailedOverlayUpgrade"), "GeoJSON detallado debe cargarse por upgrade diferido");
assert.ok(appMap.includes("world_countries_simplified.geo.json"), "GeoJSON simplificado debe ser default inicial");
assert.ok(appMap.includes("world_countries.geo.json"), "GeoJSON detallado debe existir solo para zoom cercano");

assert.ok(timelineConflicts.includes("filterTimelineEvents"), "timeline debe tener filtro testeable");
assert.ok(timelineConflicts.includes("groupRepeatedEvents"), "timeline debe agrupar eventos repetidos");
assert.ok(script.includes("ensureExportLibraries"), "exportacion debe tener loader dedicado");
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
