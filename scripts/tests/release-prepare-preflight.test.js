import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = await fs.mkdtemp(path.join(os.tmpdir(), "georisk-release-prepare-"));
const cli = fileURLToPath(new URL("../prepareRelease.js", import.meta.url));
const stamp = "2026-10-04-release-1";
const nextStamp = "2026-10-04-release-2";
const files = {
  "package.json": JSON.stringify({ name: "fixture", version: "1.2.3", type: "module", custom: true }),
  "package-lock.json": JSON.stringify({ name: "fixture", version: "1.2.3", lockfileVersion: 3, packages: { "": { version: "1.2.3", custom: true }, sibling: { version: "9.8.7" } } }),
  "script.js": `const APP_VERSION = "${stamp}";\nconst unrelated = 17;\n`,
  "sw.js": `const CACHE_VERSION = "${stamp}";\nconst unrelated = 23;\n`,
  "index.html": `<script src="script.js?v=${stamp}"></script>\n<link href="style.css?v=${stamp}">\n`,
  "CHANGELOG.md": "# Fixture\n\n## Sin publicar\n\n- Verified pending evidence.\n\n## v1.2.3 - 2026-10-03\n\n- Earlier sources and limitations.\n"
};
const oldTime = new Date("2001-01-01T00:00:00Z");
const targetArgs = ["--version", "1.2.4", "--date", "2026-10-04", "--stamp", nextStamp];
const npmCli = path.join(root, "fixture-npm.cjs");
const callsFile = path.join(root, "measurement-calls.jsonl");
const env = { ...process.env, npm_execpath: npmCli };
async function reset(overrides = {}) {
  for (const [name, value] of Object.entries({ ...files, ...overrides })) {
    const file = path.join(root, name);
    if (value === null) await fs.rm(file, { force: true });
    else {
      await fs.writeFile(file, value);
      await fs.utimes(file, oldTime, oldTime);
    }
  }
  await fs.rm(callsFile, { force: true });
}
async function snapshot() {
  const result = {};
  for (const name of Object.keys(files)) {
    try {
      const file = path.join(root, name);
      result[name] = { content: await fs.readFile(file, "utf8"), mtime: (await fs.stat(file)).mtimeMs };
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
      result[name] = null;
    }
  }
  return result;
}
function run(args = targetArgs) {
  const result = spawnSync(process.execPath, [cli, ...args], {
    cwd: root, env, encoding: "utf8", timeout: 20000, windowsHide: true
  });
  assert.ifError(result.error);
  return result;
}
async function rejectUnchanged(args, overrides = {}, pattern) {
  await reset(overrides);
  const before = await snapshot();
  const result = run(args);
  assert.notEqual(result.status, 0, "invalid preparation must fail");
  if (pattern) assert.match(result.stdout + result.stderr, pattern);
  assert.deepEqual(await snapshot(), before, "preflight rejection must not alter ANY release file or its timestamp");
  assert.equal(await fs.readFile(callsFile, "utf8").catch(error => {
    assert.equal(error.code, "ENOENT");
    return "";
  }), "", "rejected input must never launch measurements");
}
try {
  await fs.writeFile(npmCli, 'require("node:fs").appendFileSync("measurement-calls.jsonl", JSON.stringify(process.argv.slice(2)) + "\\n");\n');
  // This used to bump both package files before discovering the missing SW constant.
  await rejectUnchanged(targetArgs, { "sw.js": "const unrelated = 23;\n" }, /CACHE_VERSION/);
  await rejectUnchanged(targetArgs, { "script.js": "const unrelated = 17;\n" }, /APP_VERSION/);
  await rejectUnchanged(targetArgs, { "script.js": files["script.js"] + files["script.js"] }, /APP_VERSION/);
  await rejectUnchanged(targetArgs, { "sw.js": files["sw.js"] + files["sw.js"] }, /CACHE_VERSION/);
  for (const name of ["package.json", "script.js", "sw.js", "index.html", "CHANGELOG.md"]) await rejectUnchanged(targetArgs, { [name]: null });
  await rejectUnchanged(targetArgs, { "package-lock.json": "{malformed" });
  await rejectUnchanged(targetArgs, { "package.json": "{malformed" });
  for (const value of ["null", "[]", "17"]) {
    await rejectUnchanged(targetArgs, { "package.json": value });
    await rejectUnchanged(targetArgs, { "package-lock.json": value });
  }
  for (const packages of [null, [], { "": null }, { "": [] }]) {
    await rejectUnchanged(targetArgs, { "package-lock.json": JSON.stringify({ version: "1.2.3", packages }) });
  }
  await rejectUnchanged(targetArgs, { "index.html": "<main>no versioned assets</main>" }, /index.html/);
  await rejectUnchanged(["--version", "1.2.4", "--date", "2026-10-04", "--stamp", stamp], {}, /cache|stamp/i);
  for (const args of [
    ["--version", "1.2.4-suffix", "--skip-measure"],
    ["--version=", "--skip-measure"],
    ["--version", "1.2.04", "--skip-measure"],
    ["--date", "2026-02-30", "--skip-measure"],
    ["--date", "2100-02-29", "--skip-measure"],
    ["--date=", "--skip-measure"],
    ["--date", "2026-10-04", "--stamp", "2026-10-05-release-1", "--skip-measure"],
    ["--date", "2026-10-04", "--stamp", "2026-10-04-release-0", "--skip-measure"],
    ["--date", "2026-10-04", "--stamp", "2026-10-04-release-9007199254740992", "--skip-measure"],
    ["--stamp=", "--skip-measure"],
    ["--stamp", 'broken";alert(1)//', "--skip-measure"],
    ["--versoin", "1.2.4", "--skip-measure"],
    ["--version"],
    ["unexpected-positional"]
  ]) await rejectUnchanged(args);
  for (const version of ["1.2.3-suffix", "1.2.9007199254740991"]) {
    await rejectUnchanged(["--skip-measure"], { "package.json": JSON.stringify({ version }) });
  }

  await reset();
  const prepared = run([...targetArgs, "--skip-measure"]);
  assert.equal(prepared.status, 0, prepared.stdout + prepared.stderr);
  let data = await snapshot();
  const pkg = JSON.parse(data["package.json"].content);
  const lock = JSON.parse(data["package-lock.json"].content);
  assert.equal(pkg.version, "1.2.4");
  assert.equal(pkg.custom, true);
  assert.equal(lock.version, "1.2.4");
  assert.equal(lock.packages[""].version, "1.2.4");
  assert.equal(lock.packages[""].custom, true);
  assert.equal(lock.packages.sibling.version, "9.8.7");
  assert.match(data["script.js"].content, /2026-10-04-release-2/);
  assert.match(data["sw.js"].content, /2026-10-04-release-2/);
  assert.equal(data["index.html"].content.includes(stamp), false);
  assert.match(data["CHANGELOG.md"].content, /Verified pending evidence/);
  assert.match(data["CHANGELOG.md"].content, /Earlier sources and limitations/);
  for (const name of Object.keys(files)) await fs.utimes(path.join(root, name), oldTime, oldTime);
  data = await snapshot();
  const repeat = run([...targetArgs, "--skip-measure"]);
  assert.equal(repeat.status, 0, repeat.stdout + repeat.stderr);
  assert.deepEqual(await snapshot(), data, "same version/date/stamp must be byte and mtime idempotent");
  assert.equal((data["CHANGELOG.md"].content.match(/## v1\.2\.4 - /g) || []).length, 1);

  const measured = run(targetArgs);
  assert.equal(measured.status, 0, measured.stdout + measured.stderr);
  assert.deepEqual(await snapshot(), data, "explicit retry may rerun measurements without rewriting prepared files");
  assert.deepEqual((await fs.readFile(callsFile, "utf8")).trim().split("\n").map(line => JSON.parse(line)), [
    ["run", "measure:startup"], ["run", "audit:project"], ["run", "audit:data"], ["run", "performance:snapshot"]
  ], "keep the optional measurement pipeline; the fixture does not actually launch a browser or network");
  const preparedPackage = JSON.stringify({ ...JSON.parse(files["package.json"]), version: "1.2.4" });
  const preparedLock = JSON.parse(files["package-lock.json"]);
  preparedLock.version = "1.2.4";
  preparedLock.packages[""].version = "1.2.4";
  await reset({ "package.json": preparedPackage, "package-lock.json": JSON.stringify(preparedLock) });
  const beforeRepair = await snapshot();
  const repair = run([...targetArgs, "--skip-measure"]);
  assert.equal(repair.status, 0, repair.stdout + repair.stderr);
  data = await snapshot();
  for (const name of ["package.json", "package-lock.json"]) {
    assert.deepEqual(data[name], beforeRepair[name], "already prepared JSON must retain its original formatting and mtime");
  }
  assert.match(data["sw.js"].content, /2026-10-04-release-2/);
  await reset({ "package.json": preparedPackage, "script.js": files["script.js"].replace(stamp, nextStamp) });
  const interrupted = run([...targetArgs, "--skip-measure"]);
  assert.equal(interrupted.status, 0, interrupted.stdout + interrupted.stderr);
  data = await snapshot();
  assert.equal(JSON.parse(data["package-lock.json"].content).version, "1.2.4", "explicit retry repairs a stale lockfile");
  assert.match(data["sw.js"].content, /2026-10-04-release-2/, "explicit retry repairs a stale service-worker stamp");
  await reset({ "package-lock.json": null });
  const automatic = run(["--date=2026-10-04", "--skip-measure"]);
  assert.equal(automatic.status, 0, automatic.stdout + automatic.stderr);
  data = await snapshot();
  assert.equal(JSON.parse(data["package.json"].content).version, "1.2.4");
  assert.match(data["script.js"].content, /2026-10-04-release-2/);
  assert.equal(data["package-lock.json"], null, "an optional absent lockfile must not be fabricated");
  await reset();
  const leapDay = run(["--date=2028-02-29", "--skip-measure"]);
  assert.equal(leapDay.status, 0, leapDay.stdout + leapDay.stderr);
  assert.match((await snapshot())["script.js"].content, /2028-02-29-release-1/);
} finally {
  const target = path.resolve(root);
  assert.equal(path.dirname(target), path.resolve(os.tmpdir()));
  assert.ok(path.basename(target).startsWith("georisk-release-prepare-"));
  await fs.rm(target, { recursive: true, force: true });
}
console.log("Release preparation: zero-write preflight failures, explicit idempotent retry and optional measurements OK.");
