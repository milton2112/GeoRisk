import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { createHash } from "node:crypto";
import { stripCesiumDebugPragmas } from "../lib/cesium-release-pragmas.js";

const source = [
  "const keep = 1;", "//>>includeStart('debug', pragmas.debug);",
  "throw new Error('development');", '//>>includeStart("debug", pragmas.debug)',
  "nested();", '//>>includeEnd("debug")', "//>>includeEnd('debug');", "use(keep);"
];
for (const newline of ["\n", "\r\n"]) {
  assert.equal(stripCesiumDebugPragmas(source.join(newline)), "const keep = 1;\nuse(keep);");
}
assert.equal(stripCesiumDebugPragmas("//>>includeStart('other', pragmas.other);\nkeep();"), "//>>includeStart('other', pragmas.other);\nkeep();");
assert.throws(() => stripCesiumDebugPragmas("//>>includeEnd('debug');"), /Unmatched/);
assert.throws(() => stripCesiumDebugPragmas("//>>includeStart('debug', pragmas.debug);"), /Unclosed/);
assert.throws(() => stripCesiumDebugPragmas("//>>includeStart('debug', somethingElse);"), /Unsupported/);

const manifest = JSON.parse(await fs.readFile("vendor/cesium/manifest.json", "utf8"));
const dependency = name => manifest.packages.find(pkg => pkg.name === name)?.version;
assert.equal(manifest.cesiumVersion, "1.127");
assert.equal(dependency("@cesium/engine"), "15.0.0");
assert.equal(dependency("@cesium/widgets"), "11.0.0");
assert.equal(dependency("@zip.js/zip.js"), "2.7.57", "keep Cesium 1.127's supported zip export paths");
for (const artifact of manifest.artifacts) {
  const data = await fs.readFile(artifact.path);
  assert.equal(data.length, artifact.bytes, artifact.path);
  assert.equal(createHash("sha256").update(data).digest("hex"), artifact.sha256, artifact.path);
}
assert.ok(manifest.artifacts[0].bytes < 3500000, "map engine must have its own explicit 3.5 MB budget");
const licenses = await fs.readFile("vendor/cesium/LICENSES.txt", "utf8");
for (const pkg of manifest.packages) assert.ok(licenses.includes(`${pkg.name}@${pkg.version}`), pkg.name);
assert.ok(licenses.includes("Copyright 2011-2024 CesiumJS Contributors"));

const files = (await fs.readdir(".")).filter(file => file === "script.js" || /^app-.*\.js$/.test(file));
const exports = new Set(manifest.exports);
const usedExports = new Set();
for (const file of files) {
  const code = await fs.readFile(file, "utf8");
  for (const match of code.matchAll(/\bCesium(?:\?\.|\.)([A-Z]\w*)|\bCesium\[['"]([A-Z]\w*)['"]\]/g)) {
    const api = match[1] || match[2];
    assert.ok(exports.has(api), `${file} uses Cesium.${api}, missing from scripts/map-engine-entry.js`);
    usedExports.add(api);
  }
}
assert.ok(usedExports.size >= 20, "export coverage scan must inspect real map call sites");
const sw = await fs.readFile("sw.js", "utf8");
assert.ok(!sw.match(/const APP_SHELL = \[([\s\S]*?)\];/)?.[1].includes("vendor/"), "do not precache the engine");
const publicManifest = JSON.parse(await fs.readFile("dist/public/asset-manifest.json", "utf8"));
for (const file of [...manifest.artifacts.map(item => item.path), "vendor/cesium/manifest.json"]) {
  assert.ok(publicManifest.assets.some(asset => asset.path === file), `missing public vendor file ${file}`);
}
console.log("map-engine-bundle.test.js ok");
