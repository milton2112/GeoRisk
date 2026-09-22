import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { assertPublishableTree, isInternalRequest } from "./security-policy.js";

export const EXCLUDED_PUBLIC_PATHS = [
  "scripts/buildProduction.js", "reports/doctor-report.json", "package.json",
  "data/countries_full.json", "data/conflict_details.generated.json",
  "data/raw/politics.json", "ARCHITECTURE.md", "CONTRIBUTING_INTERNAL.md"
];
export const REQUIRED_PUBLIC_PATHS = [
  "index.html", "script.js", "sw.js", "app-bootstrap.js", "app-country-panel.js",
  "app-rankings.js", "app-search.js", "style.css", "vendor/cesium/engine.js",
  "data/countries_index.json", "data/countries/ARG.json", "data/conflicts/details_index.json"
];

export function assertPublicAssetPath(file) {
  assert.equal(typeof file, "string", "Ruta de asset invalida");
  assert.ok(file && !file.includes("\\") && !file.includes(":") && !file.startsWith("/"), `Ruta no relativa: ${file}`);
  assert.ok(!file.split("/").some(part => !part || part === "." || part === ".."), `Ruta no canonica: ${file}`);
  assert.ok(!isInternalRequest(file) && !EXCLUDED_PUBLIC_PATHS.includes(file)
    && !file.startsWith("data/raw/"), `Archivo interno en Pages: ${file}`);
}

export async function validatePagesArtifact(root) {
  await assertPublishableTree(root);
  const manifest = JSON.parse(await fs.readFile(path.join(root, "asset-manifest.json"), "utf8"));
  assert.ok(Array.isArray(manifest.assets), "Manifest de assets invalido");
  const listed = new Set();
  let totalBytes = 0;
  for (const asset of manifest.assets) {
    assertPublicAssetPath(asset.path);
    assert.ok(!listed.has(asset.path), `Asset duplicado: ${asset.path}`);
    listed.add(asset.path);
    const stat = await fs.lstat(path.join(root, asset.path));
    assert.ok(stat.isFile() && stat.nlink === 1, `Asset no regular o hardlink: ${asset.path}`);
    const bytes = await fs.readFile(path.join(root, asset.path));
    assert.equal(bytes.length, asset.bytes, `Tamano incorrecto: ${asset.path}`);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), asset.sha256, `Hash incorrecto: ${asset.path}`);
    totalBytes += bytes.length;
  }
  assert.equal(listed.size, manifest.assetCount, "Cantidad de assets incorrecta");
  assert.equal(totalBytes, manifest.totalBytes, "Peso total incorrecto");
  for (const file of REQUIRED_PUBLIC_PATHS) assert.ok(listed.has(file), `Falta asset publico: ${file}`);

  async function visit(directory) {
    for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
      const absolute = path.join(directory, entry.name);
      const relative = path.relative(root, absolute).split(path.sep).join("/");
      assertPublicAssetPath(relative);
      if (entry.isDirectory()) await visit(absolute);
      else {
        const stat = await fs.lstat(absolute);
        assert.ok(stat.isFile() && stat.nlink === 1, `Archivo no regular: ${relative}`);
        assert.ok(relative === "asset-manifest.json" || listed.has(relative), `Archivo fuera del manifest: ${relative}`);
      }
    }
  }
  await visit(root);
  return { assetCount: listed.size, totalBytes };
}
