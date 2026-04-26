import assert from "node:assert/strict";
import fs from "fs-extra";
import path from "path";

const projectRoot = path.resolve(process.cwd());
const full = await fs.readJson(path.join(projectRoot, "data", "countries_full.json"));
const index = await fs.readJson(path.join(projectRoot, "data", "countries_index.json"));
const sw = await fs.readFile(path.join(projectRoot, "sw.js"), "utf8");
const indexHtml = await fs.readFile(path.join(projectRoot, "index.html"), "utf8");
const perCountryDir = path.join(projectRoot, "data", "countries");
const perCountryFiles = (await fs.readdir(perCountryDir)).filter(file => file.endsWith(".json"));

assert.equal(Object.keys(index).length, Object.keys(full).length);
assert.equal(perCountryFiles.length, Object.keys(full).length);
assert.ok(Buffer.byteLength(JSON.stringify(index)) < Buffer.byteLength(JSON.stringify(full)) * 0.45);

for (const code of ["ATA", "GRL", "GUF", "TWN", "PSE", "-99"]) {
  assert.ok(index[code], `${code} debe existir en el indice liviano`);
  assert.ok(index[code].name, `${code} debe conservar nombre en el indice`);
  assert.ok(index[code].general?.officialName, `${code} debe conservar ficha basica`);
  assert.ok(await fs.pathExists(path.join(perCountryDir, `${code}.json`)), `${code} debe tener ficha bajo demanda`);
}

assert.ok(sw.includes("./data/countries_index.json"));
assert.ok(!sw.includes("./data/countries_full.json\""), "countries_full no debe precachearse en el shell inicial");
assert.ok(!sw.includes("./data/conflict_details.generated.json\""), "conflictos pesados no deben precachearse al inicio");
assert.ok(!sw.includes("./app-curation.js\""), "app-curation debe cargarse despues del arranque inicial");
assert.ok(!indexHtml.includes("app-curation.js"), "index.html no debe bloquear el arranque con app-curation");

console.log("startup-data.test.js ok");
