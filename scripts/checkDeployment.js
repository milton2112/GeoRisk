import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { EXCLUDED_PUBLIC_PATHS, REQUIRED_PUBLIC_PATHS, assertPublicAssetPath } from "./lib/pages-artifact.js";

export function deploymentBase(value) {
  const url = new URL(value);
  assert.ok(url.protocol === "https:" || (url.protocol === "http:" && ["127.0.0.1", "localhost", "[::1]"].includes(url.hostname)), "Se requiere HTTPS (excepto localhost)");
  assert.ok(!url.username && !url.password && !url.search && !url.hash, "URL publica invalida");
  if (!url.pathname.endsWith("/")) url.pathname += "/";
  return url;
}

async function readBounded(response) {
  const chunks = [];
  let bytes = 0;
  for await (const chunk of response.body) {
    bytes += chunk.length;
    assert.ok(bytes <= 2 * 1024 * 1024, "Respuesta de verificacion demasiado grande");
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export async function checkDeployment(baseValue, expectedIndex, request = fetch) {
  const base = deploymentBase(baseValue);
  const expectedHtml = Buffer.from(expectedIndex).toString("utf8").replace(/\r\n/g, "\n");
  async function get(file, method = "GET") {
    const url = new URL(file, base);
    url.searchParams.set("deployment-check", createHash("sha256").update(expectedHtml).digest("hex").slice(0, 16));
    return request(url, { method, redirect: "error", cache: "no-store", signal: AbortSignal.timeout(15000) });
  }
  const index = await get("index.html");
  assert.equal(index.status, 200, "La pagina principal no responde 200");
  assert.ok((await readBounded(index)).toString("utf8").replace(/\r\n/g, "\n") === expectedHtml, "Pages todavia no sirve el HTML de este commit");
  const manifestResponse = await get("asset-manifest.json");
  assert.equal(manifestResponse.status, 200, "Falta manifest publico");
  const manifest = JSON.parse((await readBounded(manifestResponse)).toString("utf8"));
  assert.ok(Array.isArray(manifest.assets), "Manifest publico invalido");
  const paths = new Set();
  for (const asset of manifest.assets) { assertPublicAssetPath(asset.path); paths.add(asset.path); }
  assert.equal(paths.size, manifest.assetCount, "Manifest publico incompleto o duplicado");
  for (const file of REQUIRED_PUBLIC_PATHS) {
    assert.ok(paths.has(file), `Falta ${file} en el manifest publicado`);
    const response = await get(file, "HEAD");
    assert.equal(response.status, 200, `Asset publico inaccesible: ${file}`);
  }
  for (const file of EXCLUDED_PUBLIC_PATHS) {
    const response = await get(file, "HEAD");
    assert.equal(response.status, 404, `Ruta interna publicada o respuesta inesperada: ${file}`);
  }
  return { checkedAssets: REQUIRED_PUBLIC_PATHS.length, excludedPaths: EXCLUDED_PUBLIC_PATHS.length };
}

async function main() {
  const args = process.argv.slice(2);
  assert.ok(args.length === 2 && args[0] === "--url", "Uso: npm run check:deployment -- --url https://sitio/GeoRisk/");
  const base = deploymentBase(args[1]);
  const expectedIndex = await fs.readFile(new URL("../index.html", import.meta.url));
  // CDN propagation can lag behind a successful deployment; never accept an old page.
  for (let attempt = 1; attempt <= 8; attempt++) {
    try {
      const result = await checkDeployment(base, expectedIndex);
      console.log(`Despliegue verificado: ${result.checkedAssets} assets accesibles y ${result.excludedPaths} rutas internas con 404.`);
      return;
    } catch (error) {
      if (attempt === 8) throw error;
      console.log(`Verificacion ${attempt}/8 pendiente: ${error.message.split("\n")[0]}`);
      await new Promise(resolve => setTimeout(resolve, 15000));
    }
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
