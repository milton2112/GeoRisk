import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { EventEmitter } from "node:events";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runCommand } from "../lib/npm-runner.js";
import vm from "node:vm";
import { setTimeout as delay } from "node:timers/promises";

const source = (await fs.readFile(new URL("../lib/npm-runner.js", import.meta.url), "utf8"))
  .replace(/^import .*;\r?\n/gm, "").replace(/^export /gm, "");
function isolated(platform, killError) {
  const spawned = [], killed = [], jobs = new Map();
  const mockProcess = Object.assign(new EventEmitter(), {
    platform, pid: 7777, env: { SystemRoot: "C:\\Windows" }, cwd: () => ".",
    kill(pid, signal) { killed.push([pid, signal]); if (killError) throw killError; }
  });
  let id = 0;
  const api = vm.runInNewContext(source + ";({runCommand, stopProcessTree});", {
    spawn(command, args, options) {
      const child = new EventEmitter();
      Object.assign(child, { pid: 9000 + spawned.length, exitCode: null, signalCode: null,
        kill(signal) { killed.push([child.pid, signal]); } });
      spawned.push({ command, args: Array.from(args), options, child });
      return child;
    },
    path, fs: {}, console: { log() {} }, Error, Date,
    process: mockProcess,
    setTimeout(fn, ms) { jobs.set(++id, { fn, ms }); return id; },
    clearTimeout(timer) { jobs.delete(timer); }
  });
  return { ...api, spawned, killed, jobs, process: mockProcess,
    fire(ms) { const entry = [...jobs].find(([, job]) => job.ms === ms); assert.ok(entry); entry[1].fn(); } };
}
for (const outcome of ["success", "nonzero", "error", "timeout"]) {
  const test = isolated("win32");
  let state = "pending";
  const pending = test.runCommand("fixture", "node", [], { timeoutMs: 20 });
  pending.then(() => { state = "resolved"; }, () => { state = "rejected"; });
  test.fire(20);
  const root = test.spawned[0], killer = test.spawned[1];
  assert.equal(root.options.detached, false, "Windows must not detach the root or open a console");
  assert.equal(killer.command, "C:\\Windows\\System32\\taskkill.exe");
  assert.deepEqual(killer.args, ["/pid", "9000", "/t", "/f"]);
  assert.equal(killer.options.shell, false);
  assert.equal(killer.options.windowsHide, true);
  assert.equal(killer.options.stdio, "ignore");
  root.child.exitCode = 0;
  root.child.emit("close", 0, null);
  await Promise.resolve();
  assert.equal(state, "pending", "a late root success cannot approve the timed-out step or bypass cleanup");
  if (outcome === "success") killer.child.emit("close", 0, null);
  if (outcome === "nonzero") killer.child.emit("close", 5, null);
  if (outcome === "error") killer.child.emit("error", new Error("helper unavailable"));
  if (outcome === "timeout") test.fire(3000);
  await assert.rejects(pending, outcome === "success" ? /excedio .* sin finalizar\.$/ : /excedio .*No se pudo confirmar la limpieza/);
  assert.equal(test.jobs.size, 0, "step and cleanup deadlines are cleared");
  assert.equal(test.process.listenerCount("SIGINT"), 0);
  assert.equal(test.process.listenerCount("SIGTERM"), 0);
  assert.equal(test.spawned.length, 2, "exactly one bounded helper, no cleanup retries");
  if (outcome === "success") assert.deepEqual(test.killed, []);
  else assert.ok(test.killed.some(([pid, signal]) => pid === 9000 && signal === "SIGKILL"));
  if (outcome === "timeout") assert.ok(test.killed.some(([pid]) => pid === 9001));
}
for (const code of [null, "ESRCH", "EPERM"]) {
  const error = code ? Object.assign(new Error(code), { code }) : null;
  const test = isolated("linux", error);
  const pending = test.runCommand("fixture", "node", [], { timeoutMs: 20 });
  test.fire(20);
  await assert.rejects(pending, code === "EPERM" ? /No se pudo confirmar la limpieza/ : /excedio .* sin finalizar\.$/);
  assert.equal(test.spawned[0].options.detached, true, "POSIX root owns its process group");
  assert.deepEqual(test.killed[0], [-9000, "SIGKILL"]);
  assert.equal(test.spawned.length, 1);
  assert.equal(test.jobs.size, 0);
}
for (const platform of ["win32", "linux"]) {
  for (const signal of ["SIGINT", "SIGTERM"]) {
    const test = isolated(platform);
    const pending = test.runCommand("fixture", "node", [], { timeoutMs: 20 });
    test.process.emit(signal);
    test.process.emit(signal);
    if (platform === "win32") test.spawned[1].child.emit("close", 0, null);
    await assert.rejects(pending, new RegExp("interrumpido por " + signal));
    assert.equal(test.spawned.length, platform === "win32" ? 2 : 1, "repeated interruption cannot start duplicate cleanup");
    assert.equal(test.jobs.size, 0);
    assert.equal(test.process.listenerCount("SIGINT"), 0);
    assert.equal(test.process.listenerCount("SIGTERM"), 0);
  }
}
for (const outcome of [0, 7, "error"]) {
  const test = isolated("win32");
  const pending = test.runCommand("fixture", "node", [], { timeoutMs: 20 });
  if (outcome === "error") test.spawned[0].child.emit("error", new Error("spawn failed"));
  else test.spawned[0].child.emit("close", outcome, null);
  if (outcome === 0) await pending;
  else await assert.rejects(pending, outcome === "error" ? /spawn failed/ : /code 7/);
  assert.equal(test.spawned.length, 1, "normal completion and failures never launch cleanup speculatively");
  assert.equal(test.jobs.size, 0);
  assert.equal(test.process.listenerCount("SIGINT"), 0);
  assert.equal(test.process.listenerCount("SIGTERM"), 0);
}
for (const pid of [0, -1, NaN, undefined, 7777]) {
  const test = isolated("win32");
  await assert.rejects(test.stopProcessTree({ pid, exitCode: null, signalCode: null }), /raiz propia activa/);
  assert.equal(test.spawned.length, 0);
  assert.equal(test.killed.length, 0);
}
const exited = isolated("win32");
await assert.rejects(exited.stopProcessTree({ pid: 9000, exitCode: 0, signalCode: null }), /raiz propia activa/);
assert.equal(exited.spawned.length, 0, "do not target a PID after its owned root exited");
const existing = isolated("linux");
let unrelatedSignals = 0;
existing.process.on("SIGINT", () => { unrelatedSignals++; });
const normal = existing.runCommand("fixture", "node", [], { timeoutMs: 0 });
assert.equal(existing.jobs.size, 0, "disabled deadline preserves the existing caller contract");
existing.spawned[0].child.emit("close", 0, null);
await normal;
existing.process.emit("SIGINT");
assert.equal(unrelatedSignals, 1, "runner must preserve other signal listeners");
assert.equal(existing.process.listenerCount("SIGINT"), 1);
assert.equal(existing.killed.length, 0, "no runner handler survives completion");

const base = os.tmpdir();
const root = await fs.mkdtemp(path.join(base, "georisk-npm-runner-"));
const report = path.join(root, "owned process ids.json");
const fixture = fileURLToPath(new URL("./fixtures/npm-runner-tree.js", import.meta.url));
const sentinel = spawn(process.execPath, [fixture, "leaf"], {
  stdio: ["ignore", "ignore", "ignore", "ipc"], windowsHide: true
});
const sentinelClosed = once(sentinel, "close");
function alive(pid) {
  try { process.kill(pid, 0); return true; }
  catch (error) { if (error.code === "ESRCH") return false; throw error; }
}
let ids;
try {
  await once(sentinel, "message");
  await assert.rejects(runCommand("owned tree timeout fixture", process.execPath, [fixture, "parent", report], {
    cwd: root, timeoutMs: 3000
  }), /excedio .* sin finalizar\.$/);
  ids = JSON.parse(await fs.readFile(report, "utf8"));
  for (const pid of Object.values(ids)) {
    assert.ok(Number.isSafeInteger(pid) && pid > 0 && pid !== process.pid && pid !== sentinel.pid);
  }
  for (const pid of [ids.leaf, ids.parent]) {
    for (let attempt = 0; attempt < 50 && alive(pid); attempt++) await delay(20);
    assert.equal(alive(pid), false, "timeout must stop the owned root and descendant");
  }
  assert.equal(alive(sentinel.pid), true, "an unrelated process is not part of timeout cleanup");
  await runCommand("success fixture", process.execPath, ["-e", "process.exit(0)"], { timeoutMs: 3000 });
  await assert.rejects(runCommand("failure fixture", process.execPath, [fixture, "fail"], { timeoutMs: 3000 }), /code 7/);
  await assert.rejects(runCommand("spawn failure fixture", path.join(root, "missing executable"), [], { timeoutMs: 3000 }), /ENOENT/);
  console.log("npm-runner.test.js ok: timeout closes owned descendants, preserves unrelated process and normal exit semantics");
} finally {
  ids ??= await fs.readFile(report, "utf8").then(JSON.parse).catch(() => null);
  for (const pid of Object.values(ids || {})) {
    if (Number.isSafeInteger(pid) && pid > 0 && pid !== process.pid && pid !== sentinel.pid && alive(pid)) process.kill(pid, "SIGKILL");
  }
  sentinel.kill("SIGKILL");
  await sentinelClosed;
  assert.equal(path.dirname(root), base);
  await fs.rm(root, { recursive: true, force: true });
}
