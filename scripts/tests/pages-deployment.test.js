import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { parse } from "yaml";
import { checkDeployment, deploymentBase } from "../checkDeployment.js";
import { EXCLUDED_PUBLIC_PATHS, REQUIRED_PUBLIC_PATHS, assertPublicAssetPath, validatePagesArtifact } from "../lib/pages-artifact.js";

const workflow = parse(await fs.readFile(".github/workflows/release-gate.yml", "utf8"));
assert.deepEqual(workflow.permissions, { contents: "read" });
assert.deepEqual(workflow.on.push.branches, ["main"]);
assert.ok(!Object.hasOwn(workflow.on, "pull_request_target"));
const gate = workflow.jobs["release-gate"];
const deploy = workflow.jobs["deploy-pages"];
const upload = gate.steps.find(step => step.uses?.startsWith("actions/upload-pages-artifact@"));
const allowedDeploy = "github.repository == 'milton2112/GeoRisk' && github.ref == 'refs/heads/main' && (github.event_name == 'push' || github.event_name == 'workflow_dispatch')";
assert.equal(deploy.needs, "release-gate");
assert.equal(deploy.if, allowedDeploy);
assert.equal(upload.if, allowedDeploy);
assert.deepEqual(upload.with, { path: "dist/public" });
assert.equal(deploy.environment.name, "github-pages");
assert.deepEqual(deploy.permissions, { contents: "read", pages: "write", "id-token": "write" });
assert.equal(deploy.concurrency["cancel-in-progress"], false);
assert.ok(deploy.steps.some(step => step.run === 'node scripts/checkDeployment.js --url "$PAGES_URL"'));
const positions = ["npm run release:check", "npm run build:prod", "npm run check:pages-artifact"]
  .map(command => gate.steps.findIndex(step => step.run === command));
assert.ok(positions[0] >= 0 && positions[0] < positions[1] && positions[1] < positions[2] && positions[2] < gate.steps.indexOf(upload));
for (const [name, job] of Object.entries(workflow.jobs)) {
  assert.ok(!job["continue-on-error"]);
  if (name !== "deploy-pages") assert.ok(!job.permissions || !Object.values(job.permissions).includes("write"));
  for (const step of job.steps) {
    assert.ok(!step["continue-on-error"]);
    if (step.uses?.startsWith("actions/checkout@")) assert.equal(step.with["persist-credentials"], false);
    if (/actions\/(?:upload-pages-artifact|deploy-pages)@/.test(step.uses || "")) assert.match(step.uses, /@[a-f0-9]{40}$/);
    if (step.uses?.startsWith("actions/upload-artifact@")) {
      assert.equal(step.if, "always() && steps.security-scan.outcome == 'success'", "No publicar reportes cuando falla el escaneo de secretos");
      const scan = job.steps.find(candidate => candidate.id === "security-scan");
      assert.equal(scan?.run, "node scripts/checkSecurity.js --history");
      assert.ok(job.steps.indexOf(scan) < job.steps.indexOf(step));
    }
  }
}
for (const position of positions) assert.ok(!gate.steps[position].if, "Los controles no deben poder saltarse");

await validatePagesArtifact(path.resolve("dist/public"));
for (const invalid of ["../file", "/file", "C:/file", "a/../file", "a\\file", "a//file", ".env", "scripts", "reports/x.json", ...EXCLUDED_PUBLIC_PATHS]) {
  assert.throws(() => assertPublicAssetPath(invalid), undefined, invalid);
}
assert.equal(deploymentBase("https://example.invalid/GeoRisk").pathname, "/GeoRisk/");
for (const invalid of ["http://example.invalid/", "https://user:password@example.invalid/", "https://example.invalid/?key=x", "file:///etc/"]) {
  assert.throws(() => deploymentBase(invalid));
}

const root = await fs.mkdtemp(path.join(os.tmpdir(), "geo-risk-pages-test-"));
try {
  const assets = [];
  for (const file of REQUIRED_PUBLIC_PATHS) {
    const content = Buffer.from(`fixture ${file}`);
    await fs.mkdir(path.dirname(path.join(root, file)), { recursive: true });
    await fs.writeFile(path.join(root, file), content);
    assets.push({ path: file, bytes: content.length, sha256: createHash("sha256").update(content).digest("hex") });
  }
  const manifest = { assets, assetCount: assets.length, totalBytes: assets.reduce((sum, item) => sum + item.bytes, 0) };
  const manifestText = JSON.stringify(manifest);
  await fs.writeFile(path.join(root, "asset-manifest.json"), manifestText);
  await validatePagesArtifact(root);
  await fs.writeFile(path.join(root, "unexpected.txt"), "not listed");
  await assert.rejects(validatePagesArtifact(root), /fuera del manifest/);
  await fs.unlink(path.join(root, "unexpected.txt"));
  await fs.mkdir(path.join(root, "reports"));
  await assert.rejects(validatePagesArtifact(root), /interno/);
  await fs.rmdir(path.join(root, "reports"));
  await fs.link(path.join(root, "index.html"), path.join(root, "linked.html"));
  await assert.rejects(validatePagesArtifact(root), /hardlink/);
  await fs.unlink(path.join(root, "linked.html"));
  await fs.writeFile(path.join(root, "index.html"), "tampered");
  await assert.rejects(validatePagesArtifact(root), /incorrecto/);

  const expectedIndex = Buffer.from("fixture index.html");
  const requested = [];
  const request = async (url, options) => {
    assert.ok(url.pathname.startsWith("/GeoRisk/"), "Debe conservar el subdirectorio de Pages");
    assert.equal(options.redirect, "error");
    const file = url.pathname.slice("/GeoRisk/".length);
    requested.push(file);
    const status = EXCLUDED_PUBLIC_PATHS.includes(file) ? 404 : 200;
    return new Response(options.method === "HEAD" ? null : file === "asset-manifest.json" ? manifestText : expectedIndex, { status });
  };
  await checkDeployment("https://example.invalid/GeoRisk/", expectedIndex, request);
  await checkDeployment("https://example.invalid/GeoRisk/", Buffer.from("fixture index.html\r\n"), (url, options) =>
    url.pathname.endsWith("index.html") && options.method === "GET" ? new Response("fixture index.html\n") : request(url, options));
  for (const file of [...EXCLUDED_PUBLIC_PATHS, ...REQUIRED_PUBLIC_PATHS]) assert.ok(requested.includes(file));
  await assert.rejects(checkDeployment("https://example.invalid/GeoRisk/", Buffer.from("new release"), request), /este commit/);
  await assert.rejects(checkDeployment("https://example.invalid/GeoRisk/", expectedIndex, (url, options) =>
    url.pathname.endsWith("reports/doctor-report.json") ? new Response(null, { status: 200 }) : request(url, options)), /Ruta interna publicada/);
  await assert.rejects(checkDeployment("https://example.invalid/GeoRisk/", expectedIndex, (url, options) =>
    url.pathname.endsWith("app-country-panel.js") ? new Response(null, { status: 404 }) : request(url, options)), /Asset publico inaccesible/);
} finally {
  await fs.rm(root, { recursive: true, force: true });
}
console.log("pages-deployment.test.js ok");
