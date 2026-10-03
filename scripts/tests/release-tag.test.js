import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

const root = await fs.mkdtemp(path.join(os.tmpdir(), "georisk-release-tag-"));
const work = path.join(root, "work");
const remote = path.join(root, "remote.git");
const tag = "v0.0.1";
const env = { ...process.env };
for (const key of Object.keys(env)) if (key.startsWith("GIT_")) delete env[key];
Object.assign(env, { GIT_TERMINAL_PROMPT: "0", GCM_INTERACTIVE: "Never",
  GIT_CONFIG_NOSYSTEM: "1", GIT_CONFIG_GLOBAL: path.join(root, "empty-config") });
function git(args, cwd = work) {
  return execFileSync("git", args, { cwd, env, encoding: "utf8", timeout: 10000, windowsHide: true,
    stdio: ["ignore", "pipe", "pipe"] }).trim();
}
async function run(code, pattern) {
  const result = spawnSync(process.execPath, ["scripts/createReleaseTag.js"], {
    cwd: work, env, encoding: "utf8", timeout: 30000, windowsHide: true
  });
  assert.ifError(result.error);
  assert.equal(result.status, code, result.stdout + result.stderr);
  if (pattern) assert.match(result.stdout + result.stderr, pattern);
  return result;
}
function noTag() {
  assert.equal(git(["tag", "--list", tag]), "", "a rejected release must not create a tag");
}
try {
  await fs.writeFile(env.GIT_CONFIG_GLOBAL, "");
  await fs.mkdir(path.join(work, "scripts"), { recursive: true });
  await fs.writeFile(path.join(work, "package.json"), JSON.stringify({ type: "module", version: "0.0.1" }));
  await fs.copyFile(new URL("../createReleaseTag.js", import.meta.url), path.join(work, "scripts/createReleaseTag.js"));
  await fs.writeFile(path.join(work, ".gitignore"), "validation-calls.log\nvalidation-fail\nvalidation-change\nvalidation-head\n");
  await fs.writeFile(path.join(work, "note.txt"), "initial");
  await fs.writeFile(path.join(work, "scripts/releaseStatus.js"), `import fs from "node:fs";
import { execFileSync } from "node:child_process";
fs.appendFileSync("validation-calls.log", "x");
if (fs.existsSync("validation-fail")) process.exitCode = 1;
if (fs.existsSync("validation-change")) fs.writeFileSync("note.txt", "changed during validation");
if (fs.existsSync("validation-head")) execFileSync("git", ["switch", "codex/work"], { stdio: "ignore", windowsHide: true });
`);
  git(["init", "--template=", "--initial-branch=main"]);
  git(["config", "user.name", "GeoRisk fixture"]);
  git(["config", "user.email", "fixture@example.invalid"]);
  git(["init", "--bare", "--template=", "--initial-branch=main", remote]);
  git(["add", "."]);
  git(["commit", "-m", "fixture initial"]);
  const initial = git(["rev-parse", "HEAD"]);
  git(["remote", "add", "origin", remote]);
  git(["push", "origin", "main"]);
  git(["switch", "-c", "codex/work"]);
  await fs.writeFile(path.join(work, "note.txt"), "unmerged");
  git(["add", "note.txt"]);
  git(["commit", "-m", "unmerged fixture"]);
  const feature = git(["rev-parse", "HEAD"]);
  await run(1, /main remoto|origin\/main/);
  noTag();

  git(["switch", "main"]);
  await fs.writeFile(path.join(work, "note.txt"), "dirty");
  await run(1, /sucio|pendientes/);
  noTag();
  await fs.writeFile(path.join(work, "note.txt"), "initial");
  git(["tag", "-a", tag, feature, "-m", "wrong target fixture"]);
  await run(1, /otro commit|no apunta/);
  assert.equal(git(["rev-parse", tag + "^{commit}"]), feature, "a colliding tag must never move");
  git(["tag", "-d", tag]);

  await fs.writeFile(path.join(work, "validation-fail"), "fixture");
  await run(1, /validacion|release:status/);
  noTag();
  await fs.unlink(path.join(work, "validation-fail"));
  await fs.writeFile(path.join(work, "validation-change"), "fixture");
  await run(1, /sucio|pendientes/);
  noTag();
  await fs.unlink(path.join(work, "validation-change"));
  await fs.writeFile(path.join(work, "note.txt"), "initial");
  await fs.writeFile(path.join(work, "validation-head"), "fixture");
  await run(1, /HEAD cambio/);
  noTag();
  await fs.unlink(path.join(work, "validation-head"));
  git(["switch", "main"]);

  git(["remote", "set-url", "origin", path.join(root, "missing.git")]);
  await run(1, /remoto|fetch/);
  noTag();
  git(["remote", "set-url", "origin", remote]);
  git(["push", "origin", "codex/work"]);
  assert.equal(git(["rev-parse", "origin/main"]), initial);
  git(["--git-dir=" + remote, "update-ref", "refs/heads/main", feature]);
  await run(1, /main remoto|origin\/main/);
  noTag();
  assert.equal(git(["rev-parse", "origin/main"]), feature, "refresh remote main instead of trusting a stale local ref");

  git(["merge", "--ff-only", "origin/main"]);
  const success = await run(0, /Tag creado/);
  assert.equal(git(["rev-parse", tag + "^{commit}"]), feature);
  assert.equal(git(["cat-file", "-t", "refs/tags/" + tag]), "tag", "new releases use annotated tags");
  assert.match(success.stdout, /git push origin refs\/tags\/v0\.0\.1/);
  assert.doesNotMatch(success.stdout, /git push origin main|--follow-tags/);
  const calls = await fs.readFile(path.join(work, "validation-calls.log"), "utf8");
  git(["remote", "set-url", "origin", path.join(root, "missing.git")]);
  await run(0, /verificado|ya existe/);
  assert.equal(await fs.readFile(path.join(work, "validation-calls.log"), "utf8"), calls, "verified no-op must not repeat validation or fetch");
  assert.equal(git(["--git-dir=" + remote, "tag", "--list"]), "", "the command never pushes a tag or main automatically");
} finally {
  const target = path.resolve(root);
  assert.equal(path.dirname(target), path.resolve(os.tmpdir()));
  assert.ok(path.basename(target).startsWith("georisk-release-tag-"));
  await fs.rm(target, { recursive: true, force: true });
}
console.log("Release tags: clean validated remote main, immutable collisions and explicit tag-only push OK.");
