import crypto from "node:crypto";
import fs from "fs-extra";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { assertPublishableTree, isSensitivePath } from "./lib/security-policy.js";
import { requireScanner, runSecretScan } from "./lib/secret-scanner.js";
import { assertBrowserSecurityPolicy, renderStaticHostingHeaders } from "./lib/browser-security-policy.js";
import { PUBLIC_FILES, PUBLIC_DIRS } from "./lib/public-assets.js";

const projectRoot = process.cwd();
const outputRoot = path.join(projectRoot, "dist", "public");
const secretScanner = await requireScanner();
assertBrowserSecurityPolicy(await fs.readFile(path.join(projectRoot, "index.html"), "utf8"));

execFileSync(process.execPath, ["scripts/buildMapEngine.js", "--check"], { stdio: "inherit" });
execFileSync(process.execPath, ["scripts/buildExportLibraries.js", "--check"], { stdio: "inherit" });

const FORBIDDEN_OUTPUT_PREFIXES = [
  "reports/",
  "scripts/",
  ".git/",
  "node_modules/",
  "dist/"
];

const FORBIDDEN_OUTPUT_FILES = new Set([
  "ARCHITECTURE.md",
  "CONTRIBUTING_INTERNAL.md",
  "DATA_SOURCES.md",
  "README.md",
  "ROADMAP.md",
  "RELEASE_NOTES_v1.4.0.md"
]);

function normalize(relativePath) {
  return relativePath.replace(/\\/g, "/");
}

async function copyFile(relativePath) {
  const source = path.join(projectRoot, relativePath);
  if (!(await fs.pathExists(source))) {
    throw new Error(`Falta archivo publico: ${relativePath}`);
  }
  if (isSensitivePath(relativePath) || !(await fs.lstat(source)).isFile()) {
    throw new Error(`Archivo publico sensible o no regular: ${relativePath}`);
  }
  await fs.copy(source, path.join(outputRoot, relativePath));
}

async function listFiles(root) {
  const result = [];
  async function walk(directory) {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        await walk(absolute);
      } else {
        result.push(normalize(path.relative(root, absolute)));
      }
    }
  }
  await walk(root);
  return result.sort((a, b) => a.localeCompare(b));
}

async function createManifest() {
  const files = await listFiles(outputRoot);
  const assets = [];
  for (const file of files) {
    const absolute = path.join(outputRoot, file);
    const buffer = await fs.readFile(absolute);
    assets.push({
      path: file,
      bytes: buffer.length,
      sha256: crypto.createHash("sha256").update(buffer).digest("hex")
    });
  }
  const manifest = {
    generatedAt: new Date().toISOString(),
    assetCount: assets.length,
    totalBytes: assets.reduce((sum, asset) => sum + asset.bytes, 0),
    excludes: {
      prefixes: FORBIDDEN_OUTPUT_PREFIXES,
      files: [...FORBIDDEN_OUTPUT_FILES].sort()
    },
    assets
  };
  await fs.writeJson(path.join(outputRoot, "asset-manifest.json"), manifest, { spaces: 2 });
  return manifest;
}

function assertPublicOutput(manifest) {
  const offenders = manifest.assets
    .map(asset => asset.path)
    .filter(file =>
      FORBIDDEN_OUTPUT_PREFIXES.some(prefix => file.startsWith(prefix)) ||
      FORBIDDEN_OUTPUT_FILES.has(file)
    );
  if (offenders.length) {
    throw new Error(`Build publico contiene archivos internos: ${offenders.join(", ")}`);
  }
}

await fs.remove(outputRoot);
await fs.ensureDir(outputRoot);

for (const file of PUBLIC_FILES) {
  await copyFile(file);
}

for (const directory of PUBLIC_DIRS) {
  const source = path.join(projectRoot, directory);
  if (await fs.pathExists(source)) {
    await assertPublishableTree(source);
    await fs.copy(source, path.join(outputRoot, directory));
  }
}

await fs.writeFile(path.join(outputRoot, "_headers"), renderStaticHostingHeaders(), "utf8");

const manifest = await createManifest();
assertPublicOutput(manifest);
await assertPublishableTree(outputRoot);
const secretFindings = await runSecretScan(secretScanner, ["dir", outputRoot]);
if (secretFindings.length) {
  console.error(JSON.stringify(secretFindings, null, 2));
  throw new Error("Posibles secretos en el build. No publicar dist/public.");
}

console.log(`Build produccion: ${path.relative(projectRoot, outputRoot)}`);
console.log(`Assets: ${manifest.assetCount}`);
console.log(`Total: ${manifest.totalBytes} bytes`);
