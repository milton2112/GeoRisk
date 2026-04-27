import assert from "node:assert/strict";
import fs from "fs-extra";
import path from "path";

const projectRoot = path.resolve(process.cwd());
const full = await fs.readJson(path.join(projectRoot, "data", "countries_full.json"));
const index = await fs.readJson(path.join(projectRoot, "data", "countries_index.json"));
const sw = await fs.readFile(path.join(projectRoot, "sw.js"), "utf8");
const indexHtml = await fs.readFile(path.join(projectRoot, "index.html"), "utf8");
const script = await fs.readFile(path.join(projectRoot, "script.js"), "utf8");
const perCountryDir = path.join(projectRoot, "data", "countries");
const perCountryFiles = (await fs.readdir(perCountryDir)).filter(file => file.endsWith(".json"));

assert.equal(Object.keys(index).length, Object.keys(full).length);
assert.equal(perCountryFiles.length, Object.keys(full).length);
assert.ok(Buffer.byteLength(JSON.stringify(index)) < Buffer.byteLength(JSON.stringify(full)) * 0.34);

for (const code of ["ATA", "GRL", "GUF", "TWN", "PSE", "-99"]) {
  assert.ok(index[code], `${code} debe existir en el indice liviano`);
  assert.ok(index[code].name, `${code} debe conservar nombre en el indice`);
  assert.ok(index[code].general?.officialName, `${code} debe conservar ficha basica`);
  assert.ok(await fs.pathExists(path.join(perCountryDir, `${code}.json`)), `${code} debe tener ficha bajo demanda`);
}

assert.ok(sw.includes("./data/countries_index.json"));
assert.ok(!sw.includes("./data/countries_full.json\""), "countries_full no debe precachearse en el shell inicial");
assert.ok(!sw.includes("./data/conflict_details.generated.json\""), "conflictos pesados no deben precachearse al inicio");
assert.ok(!sw.includes("./data/raw/history.json\""), "raw history debe cargarse bajo demanda");
assert.ok(!sw.includes("./data/raw/politics.json\""), "raw politics debe cargarse bajo demanda");
assert.ok(!sw.includes("./data/raw/inflation.json\""), "raw inflation debe cargarse bajo demanda");
assert.ok(!sw.includes("./data/raw/religion.json\""), "raw religion debe cargarse bajo demanda");
assert.ok(!sw.includes("./app-curation.js\""), "app-curation debe cargarse despues del arranque inicial");
assert.ok(sw.includes("Promise.allSettled"), "service worker debe tolerar fallas parciales de precache");
assert.ok(!indexHtml.includes("app-curation.js"), "index.html no debe bloquear el arranque con app-curation");
assert.ok(Buffer.byteLength(indexHtml) < 35000, "index.html debe mantenerse liviano");
assert.ok(Buffer.byteLength(sw) < 7000, "service worker debe mantenerse liviano");
assert.ok(indexHtml.includes("intro-runtime-grid"), "portada debe mostrar estado runtime");
assert.ok(indexHtml.includes("intro-data-grid"), "portada debe mostrar cobertura del dataset");
for (const id of ["intro-country-count", "intro-conflict-count", "intro-layer-count", "intro-special-count"]) {
  assert.ok(indexHtml.includes(id), `portada debe exponer ${id}`);
}
assert.ok(indexHtml.includes("clear-local-cache-button"), "UI debe permitir limpiar cache local");
assert.ok(!indexHtml.includes("Ã—"), "botones de cierre no deben tener mojibake visible");
for (const token of ["AÃ", "Ãƒ", "Ã‚", "Â¿", "Â¡", "Ã—"]) {
  assert.ok(!indexHtml.includes(token), `index.html no debe exponer mojibake visible: ${token}`);
}
assert.ok(!script.includes(".then(() => loadFullCountryData())"), "countries_full no debe encadenarse al arranque inmediato");
assert.ok(script.includes("function scheduleFullCountryDataLoad()"), "countries_full debe agendarse en una funcion aislada");
assert.ok(/isMobileLayout\(\)\s*\?\s*90000\s*:\s*45000/.test(script), "countries_full debe quedar muy diferido despues del arranque visible");
assert.ok(script.includes("requestIdleCallback(startFullLoad"), "countries_full debe esperar un momento ocioso cuando el navegador lo soporte");
assert.ok(script.includes("MAX_RESOURCE_CACHE_ENTRIES = 36"), "cache en memoria debe tener limite");
assert.ok(script.includes("resourceCache.delete(cacheKey)"), "descargas fallidas deben poder reintentarse");
assert.ok(script.includes("async function clearLocalGeoRiskCache()"), "runtime debe exponer limpieza segura de cache local");

for (const country of Object.values(index)) {
  const relations = country.politics?.relations || {};
  for (const [key, value] of Object.entries(relations)) {
    if (Array.isArray(value)) {
      assert.ok(value.length <= 4, `relacion ${key} debe venir resumida en el indice`);
    }
  }
  assert.ok((country.conflicts || []).length <= 5, "conflictos del indice deben venir resumidos");
  assert.ok((country.religion?.composition || []).length <= 4, "religion del indice debe venir resumida");
}

console.log("startup-data.test.js ok");
