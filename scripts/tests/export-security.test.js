import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import vm from "node:vm";
import { buildExportLibraries } from "../buildExportLibraries.js";
import { summarizeDependencyAudit } from "../lib/dependency-audit.js";
import { exportAssets } from "../../vendor/exports/manifest.js";

await buildExportLibraries({ check: true });
const temporary = await fs.mkdtemp(path.join(os.tmpdir(), "georisk-export-security-"));
try {
  for (const file of ["package.json", "package-lock.json"]) await fs.copyFile(file, path.join(temporary, file));
  for (const name of Object.keys(exportAssets)) {
    const target = path.join(temporary, "node_modules", name);
    await fs.mkdir(path.join(target, "dist"), { recursive: true });
    const source = name === "jspdf" ? "dist/jspdf.umd.min.js" : "dist/html2canvas.min.js";
    for (const file of ["package.json", "LICENSE", source]) await fs.copyFile(path.join("node_modules", name, file), path.join(target, file));
  }
  await buildExportLibraries({ root: temporary });
  const modifiedFile = path.join(temporary, exportAssets.jspdf.path);
  await fs.appendFile(modifiedFile, "\n// modified fixture");
  await assert.rejects(buildExportLibraries({ root: temporary, check: true }), /stale or modified/);
} finally {
  await fs.rm(temporary, { recursive: true, force: true });
}

const cleanAudit = {
  auditReportVersion: 2, vulnerabilities: {},
  metadata: { vulnerabilities: { info: 0, low: 0, moderate: 0, high: 0, critical: 0, total: 0 } }
};
const audit = (report, status = 0) => summarizeDependencyAudit({ stdout: JSON.stringify(report), status });
assert.equal(audit(cleanAudit).status, "passed");
const vulnerable = structuredClone(cleanAudit);
vulnerable.metadata.vulnerabilities.high = vulnerable.metadata.vulnerabilities.total = 1;
vulnerable.vulnerabilities.fixture = { severity: "high", range: "<2", via: [{ title: "Fixture", url: "https://example.org/advisory" }] };
assert.equal(audit(vulnerable, 1).status, "failed");
assert.throws(() => audit(cleanAudit, 1), /inconsistente/);
assert.throws(() => audit({ ...cleanAudit, error: { code: "ENOTFOUND" } }), /completo/);
assert.throws(() => audit({ vulnerabilities: {} }), /completo/);
assert.throws(() => summarizeDependencyAudit({ stdout: "network failed", status: 1 }), /invalida/);
assert.throws(() => summarizeDependencyAudit({ status: null, signal: "SIGTERM" }), /completarse/);

const source = (await fs.readFile("app-export-share.js", "utf8"))
  .replace('import { exportAssets } from "./vendor/exports/manifest.js";', "")
  .replaceAll("import.meta.url", '"https://example.org/GeoRisk/app-export-share.js?v=fixture"')
  .replace(/export \{[\s\S]*?\};\s*$/, "");
function createLoaderFixture() {
  const scripts = [];
  const timers = new Map();
  let timerId = 0;
  const context = {
    exportAssets, URL,
    setTimeout(callback, delay) { assert.equal(delay, 15000); timers.set(++timerId, callback); return timerId; },
    clearTimeout(id) { timers.delete(id); },
    document: {
      head: { appendChild(script) { scripts.push(script); } },
      createElement(tag) {
        assert.equal(tag, "script");
        const listeners = new Map();
        return {
          dataset: {}, removed: false,
          addEventListener(name, fn) { listeners.set(name, fn); },
          removeEventListener(name) { listeners.delete(name); },
          emit(name) { listeners.get(name)?.(); },
          remove() { this.removed = true; }
        };
      }
    }
  };
  context.window = context;
  vm.runInNewContext(source, context);
  return { context, scripts, timers, ensure: context.GeoRiskExportShare.ensureExportLibraries };
}

const fixture = createLoaderFixture();
fixture.context.html2canvas = () => {};
const bypass = { loadScriptOnce() { throw new Error("Unverified loader must not run"); } };
const first = fixture.ensure("image", bypass);
const concurrent = fixture.ensure("image", bypass);
assert.equal(fixture.scripts.length, 1, "concurrent requests reuse the verified loader, even with a preexisting global");
assert.equal(fixture.scripts[0].src, "https://example.org/GeoRisk/" + exportAssets.html2canvas.path);
assert.equal(fixture.scripts[0].integrity, exportAssets.html2canvas.integrity);
assert.equal(fixture.scripts[0].crossOrigin, "anonymous");
fixture.scripts[0].emit("load");
assert.equal(await first, true);
assert.equal(await concurrent, true);
assert.equal(fixture.timers.size, 0);

const invalidPdf = fixture.ensure("pdf").catch(error => error);
await Promise.resolve();
fixture.context.jspdf = { jsPDF: Object.assign(() => {}, { version: "2.5.1" }) };
fixture.scripts[1].emit("load");
assert.match((await invalidPdf).message, /verificar/);
assert.equal(fixture.scripts[1].removed, true);
const retryPdf = fixture.ensure("pdf");
await Promise.resolve();
fixture.context.jspdf.jsPDF.version = exportAssets.jspdf.version;
fixture.scripts[2].emit("load");
assert.equal(await retryPdf, true);
assert.equal(fixture.timers.size, 0);

for (const failure of ["error", "timeout"]) {
  const failed = createLoaderFixture();
  const attempt = failed.ensure().catch(error => error);
  if (failure === "error") failed.scripts[0].emit("error");
  else [...failed.timers.values()][0]();
  assert.match((await attempt).message, /Reintenta/);
  assert.equal(failed.scripts[0].removed, true);
  assert.equal(failed.timers.size, 0);
  const retry = failed.ensure();
  failed.context.html2canvas = () => {};
  failed.scripts[1].emit("load");
  assert.equal(await retry, true);
}

const workflow = await fs.readFile(".github/workflows/release-gate.yml", "utf8");
assert.equal((workflow.match(/run: npm run audit:dependencies/g) || []).length, 2);
assert.ok((await fs.readFile("scripts/releaseChecklist.js", "utf8")).includes('"audit:dependencies"'));
assert.ok((await fs.readFile("scripts/buildProduction.js", "utf8")).includes('"scripts/buildExportLibraries.js", "--check"'));
assert.ok(!(await fs.readFile("sw.js", "utf8")).includes("vendor/exports"), "export libraries remain outside offline precache");
console.log("export-security.test.js ok");
