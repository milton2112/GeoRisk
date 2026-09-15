import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { assertPublishableTree, isInternalRequest, isSensitivePath } from "../lib/security-policy.js";
import { requireScanner, runSecretScan, scannerRelease, summarizeFindings, verifyArchive } from "../lib/secret-scanner.js";
import { checkHistory, checkWorkingTree } from "../checkSecurity.js";
import { removeCesiumEvaluationToken } from "../lib/cesium-evaluation-token.js";
import { createLocalSmokeServer } from "../localSmokeServer.js";

for (const file of [".env", ".env.local", "assets/.env.production", "data/.envrc", ".git/config", ".ssh/id_ed25519",
  "assets/server.pem", "config/private.key", "CERT.PFX", "id_rsa.pub", "credentials.json.bak", "secrets.production.json",
  "assets/service-account-prod.json", ".npmrc", ".netrc", "folder\\.env.local", "assets/.aws/credentials"]) {
  assert.equal(isSensitivePath(file), true, file);
  assert.equal(isInternalRequest(file), true, file);
}
for (const file of ["assets/flags/ARG.svg", "data/countries/ARG.json", "script.js", "scripts/lib/secret-scanner.js", ".gitleaks.toml"]) {
  assert.equal(isSensitivePath(file), false, file);
}
for (const file of ["scripts/buildProduction.js", "reports/doctor-report.json", ".gitleaks.toml", "tmp/file.txt"]) {
  assert.equal(isInternalRequest(file), true, file);
}
assert.throws(() => scannerRelease("unknown", "cpu"), /No se omite/);
assert.throws(() => verifyArchive(Buffer.from("changed"), "00".repeat(32)), /SHA-256/);
verifyArchive(Buffer.from("checked"), createHash("sha256").update("checked").digest("hex"));
assert.deepEqual(summarizeFindings([{ File: "app.js", StartLine: 2, RuleID: "test", Commit: "abc", Secret: "private", Match: "private" }]),
  [{ file: "app.js", line: 2, rule: "test", commit: "abc" }]);

const ionPath = path.resolve("node_modules/@cesium/engine/Source/Core/Ion.js");
const ion = await fs.readFile(ionPath, "utf8");
const evaluationToken = ion.match(/const defaultAccessToken\s*=\s*"([^"]+)";/)?.[1];
assert.ok(evaluationToken, "la fixture debe localizar el token de evaluacion de la dependencia");
const withoutToken = removeCesiumEvaluationToken(ion, ionPath);
assert.ok(withoutToken.includes('const defaultAccessToken = "";'));
assert.ok(!withoutToken.includes(evaluationToken));
assert.equal(removeCesiumEvaluationToken(ion, "/another/Ion.js"), ion);
assert.throws(() => removeCesiumEvaluationToken("upstream changed", ionPath), /cambio/);
assert.ok(!(await fs.readFile("vendor/cesium/engine.js", "utf8")).includes(evaluationToken), "el build no debe incluir el token de demostracion");

const binary = await requireScanner();
const temporary = await fs.mkdtemp(path.join(os.tmpdir(), "geo-risk-security-test-"));
const root = path.join(temporary, "repo");
const publicRoot = path.join(temporary, "public");
let server;
try {
  await fs.mkdir(root);
  await fs.mkdir(publicRoot);
  const git = args => execFileSync("git", args, { cwd: root, stdio: "pipe", timeout: 15000,
    env: { ...process.env, GIT_AUTHOR_NAME: "Security test", GIT_AUTHOR_EMAIL: "test@example.invalid",
      GIT_COMMITTER_NAME: "Security test", GIT_COMMITTER_EMAIL: "test@example.invalid" } });
  git(["init", "--quiet"]);
  await fs.writeFile(path.join(root, "app.js"), "const publicValue = 123;\n");
  git(["add", "app.js"]);
  git(["-c", "commit.gpgsign=false", "commit", "--quiet", "-m", "clean fixture"]);
  assert.equal((await checkWorkingTree(binary, root)).length, 0);

  // Synthetic token, generated at runtime so the test source contains no credential.
  const sample = "ghp_" + createHash("sha256").update("not-a-real-credential-security-regression").digest("base64").replace(/[^A-Za-z0-9]/g, "").slice(0, 36);
  const payload = `const token = "${sample}"; // gitleaks:allow\n`;
  await fs.writeFile(path.join(root, "untracked.js"), payload);
  assert.ok((await checkWorkingTree(binary, root)).length > 0, "debe detectar archivos nuevos y no aceptar comentarios de omision");
  git(["add", "untracked.js"]);
  assert.ok((await runSecretScan(binary, ["git", "--pre-commit", "--staged", root], root)).length > 0);
  git(["-c", "commit.gpgsign=false", "commit", "--quiet", "-m", "synthetic token fixture"]);
  await fs.unlink(path.join(root, "untracked.js"));
  git(["add", "-u"]);
  git(["-c", "commit.gpgsign=false", "commit", "--quiet", "-m", "remove fixture token"]);
  assert.equal((await checkWorkingTree(binary, root)).length, 0);
  assert.ok((await checkHistory(binary, root)).length > 0, "borrar la clave del ultimo commit no limpia el historial");
  assert.ok((await checkHistory(binary, root, true)).length > 0, "pre-push debe revisar commits intermedios");

  await fs.writeFile(path.join(root, ".env.local"), "LOCAL_VALUE=not-secret\n");
  git(["add", "-f", ".env.local"]);
  await assert.rejects(checkWorkingTree(binary, root), /Archivos sensibles/);

  await fs.mkdir(path.join(publicRoot, "reports"));
  await fs.writeFile(path.join(publicRoot, "reports/performance-snapshot.json"), JSON.stringify({ browserMeasurementKey: "a".repeat(64) }, null, 2));
  assert.equal((await runSecretScan(binary, ["dir", publicRoot])).length, 0, "el hash exacto no es una credencial");
  await fs.writeFile(path.join(publicRoot, "reports/performance-snapshot.json"), JSON.stringify({ browserMeasurementKey: sample }, null, 2));
  assert.ok((await runSecretScan(binary, ["dir", publicRoot])).length > 0, "la excepcion de hash no debe omitir claves en el mismo campo");
  await fs.writeFile(path.join(publicRoot, "reports/performance-snapshot.json"), "{}");
  await fs.writeFile(path.join(publicRoot, "app.js"), payload);
  const artifactFindings = await runSecretScan(binary, ["dir", publicRoot]);
  assert.ok(artifactFindings.length > 0, "tambien debe detectar claves en archivos publicados");
  assert.ok(!JSON.stringify(artifactFindings).includes(sample), "los resultados no deben revelar el secreto");
  await fs.writeFile(path.join(publicRoot, "app.js"), "// clean");
  await assertPublishableTree(publicRoot);
  await fs.writeFile(path.join(publicRoot, ".env.production"), "TEST=fixture");
  await assert.rejects(assertPublishableTree(publicRoot), /sensible/);
  await fs.unlink(path.join(publicRoot, ".env.production"));
  await fs.symlink(root, path.join(publicRoot, "linked"), process.platform === "win32" ? "junction" : "dir");
  await assert.rejects(assertPublishableTree(publicRoot), /enlace/);

  await fs.writeFile(path.join(publicRoot, "index.html"), "<h1>Security fixture</h1>");
  server = createLocalSmokeServer({ root: publicRoot });
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const index = await fetch(base);
  assert.equal(index.status, 200);
  assert.equal(index.headers.get("x-content-type-options"), "nosniff");
  assert.equal(index.headers.get("referrer-policy"), "strict-origin-when-cross-origin");
  const head = await fetch(base, { method: "HEAD" });
  assert.equal(await head.text(), "");
  assert.equal(Number(head.headers.get("content-length")), (await fs.stat(path.join(publicRoot, "index.html"))).size);
  for (const route of ["/.git/config", "/%2eenv.local", "/assets/.env.production", "/%2egit%5cconfig", "/scripts/buildProduction.js",
    "/reports/performance-snapshot.json", "/server.pem", "/index.html%3A%24DATA", "/linked/app.js", "/linked/.env.local"]) {
    assert.equal((await fetch(base + route)).status, 403, route);
  }
  assert.equal((await fetch(base + "/%zz")).status, 400);
  assert.equal((await fetch(base, { method: "POST", body: "fixture" })).status, 405);
  await assert.rejects(runSecretScan(process.execPath, ["--not-a-real-node-flag"]), /No se completo/);
} finally {
  if (server) await new Promise(resolve => server.close(resolve));
  await fs.rm(temporary, { recursive: true, force: true });
}

const workflow = await fs.readFile(".github/workflows/release-gate.yml", "utf8");
assert.ok(workflow.includes("contents: read") && workflow.includes("persist-credentials: false"));
assert.equal((workflow.match(/node scripts\/checkSecurity.js --history/g) || []).length, 2);
assert.equal((workflow.match(/fetch-depth: 0/g) || []).length, 2);
assert.ok((await fs.readFile("scripts/prepushCheck.js", "utf8")).includes('"check:security", "--", "--outgoing"'));
assert.ok((await fs.readFile("scripts/buildProduction.js", "utf8")).includes("runSecretScan"));
console.log("security.test.js ok");
