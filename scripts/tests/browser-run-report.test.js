import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createBrowserRunReport } from "../lib/browser-run-report.js";

const root = await fs.mkdtemp(path.join(os.tmpdir(), "geo-risk-browser-report-"));
const file = path.join(root, "reports", "e2e.json");
const read = async () => JSON.parse(await fs.readFile(file, "utf8"));
let elapsed = 0;
const options = { file, flows: ["first", "second"], scope: "full",
  now: () => 1_700_000_000_000 + elapsed, clock: () => elapsed };
try {
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, JSON.stringify({ status: "passed", stale: true }));
  const report = await createBrowserRunReport(options);
  assert.equal((await read()).status, "running", "new execution must replace old success");
  assert.equal((await read()).stale, undefined);
  assert.deepEqual((await read()).flows.map(flow => flow.status), ["pending", "pending"]);
  await assert.rejects(report.finish(), /Incomplete/);
  await assert.rejects(report.run("second", () => assert.fail()), /Unexpected/);
  await report.setBrowser({ requestedChannel: "chromium", actualChannel: "chromium", browserVersion: "151" });
  await report.run("first", async () => {
    const checkpoint = await read();
    assert.equal(checkpoint.status, "running");
    assert.deepEqual(checkpoint.flows.map(flow => flow.status), ["running", "pending"]);
    elapsed += 23;
  });
  assert.equal((await read()).flows[0].durationMs, 23);
  await report.run("second", async () => { elapsed += 42; });
  assert.equal((await read()).status, "running", "passing flows alone cannot approve teardown");
  await report.finish();
  const passed = await read();
  assert.equal(passed.status, "passed");
  assert.equal(passed.completedAt, passed.updatedAt);
  assert.equal(passed.metadata.browser.actualChannel, "chromium");
  assert.deepEqual(passed.flows.map(flow => flow.durationMs), [23, 42]);
  assert.equal(passed.elapsedMs, 65, "elapsed time includes the whole sequential run");
  await assert.rejects(report.run("first", () => {}), /Unexpected/);
  await assert.rejects(report.setBrowser({}), /closed/);

  const shard = await createBrowserRunReport({ ...options, flows: ["first"], scope: "shard" });
  await shard.run("first", async () => { elapsed += 7; });
  elapsed += 13;
  await shard.finish();
  assert.equal((await read()).scope, "shard", "one runner cannot claim full-suite evidence");
  assert.equal((await read()).elapsedMs, 20, "teardown also counts toward the shard budget");

  const failed = await createBrowserRunReport({ ...options, scope: "focused" });
  const cause = new Error("failure ".repeat(500));
  await assert.rejects(failed.run("first", async () => { elapsed += 11; throw cause; }), error => error === cause);
  const failure = await read();
  assert.equal(failure.scope, "focused");
  assert.equal(failure.status, "failed");
  assert.deepEqual(failure.flows.map(flow => flow.status), ["failed", "pending"]);
  assert.equal(failure.flows[0].durationMs, 11);
  assert.equal(failure.error.message.length, 1000, "diagnostics must stay bounded");
  await failed.fail(new Error("cleanup must not replace the original failure"));
  assert.deepEqual(await read(), failure);
  await assert.rejects(failed.finish(), /Incomplete/);

  const cleanup = await createBrowserRunReport({ ...options, flows: ["first"], scope: "journeys" });
  await cleanup.run("first", async () => {});
  await cleanup.fail(new Error("browser close failed"));
  assert.equal((await read()).status, "failed");
  assert.equal((await read()).flows[0].status, "passed");
  await assert.rejects(cleanup.finish(), /Incomplete/);

  const interrupted = await createBrowserRunReport(options);
  let release;
  const held = new Promise(resolve => { release = resolve; });
  let entered;
  const started = new Promise(resolve => { entered = resolve; });
  const task = interrupted.run("first", async () => { entered(); await held; });
  await started;
  assert.deepEqual((await read()).flows.map(flow => flow.status), ["running", "pending"], "last checkpoint exposes interrupted work");
  await assert.rejects(interrupted.finish(), /Incomplete/);
  release();
  await task;
  for (const invalid of [[], ["first", "first"], ["x".repeat(121)], Array.from({ length: 65 }, (_, i) => String(i))]) {
    await assert.rejects(createBrowserRunReport({ ...options, flows: invalid }), /Invalid/);
  }
  await assert.rejects(createBrowserRunReport({ ...options, scope: "unknown" }), /Invalid/);
  assert.deepEqual(await fs.readdir(path.dirname(file)), ["e2e.json"], "one checkpoint, no accumulating snapshots");

  for (const code of ["EPERM", "EBUSY"]) {
    const previous = await fs.readFile(file, "utf8");
    let attempts = 0;
    const locked = Object.assign(new Error("transient " + code), { code });
    const recovered = await createBrowserRunReport({ ...options, flows: ["first"], rename: async (from, to) => {
      attempts += 1;
      if (attempts < 3) {
        assert.equal(await fs.readFile(to, "utf8"), previous, "locked checkpoint must not be deleted or overwritten in place");
        assert.equal(JSON.parse(await fs.readFile(from, "utf8")).status, "running");
        throw locked;
      }
      await fs.rename(from, to);
    } });
    assert.equal(attempts, 3, "only the atomic replacement is retried");
    let taskCalls = 0;
    await recovered.run("first", async () => { taskCalls += 1; });
    await recovered.finish();
    assert.equal(taskCalls, 1, "file recovery never reruns a browser flow");
    assert.equal(attempts, 6, "healthy checkpoints replace once without retry");
    assert.equal((await read()).status, "passed");
    assert.deepEqual(await fs.readdir(path.dirname(file)), ["e2e.json"]);
  }

  for (const [code, limit] of [["EPERM", 3], ["EBUSY", 3], ["EIO", 1], ["ENOENT", 1]]) {
    const previous = await fs.readFile(file, "utf8");
    let attempts = 0;
    const cause = Object.assign(new Error("persistent " + code), { code });
    await assert.rejects(createBrowserRunReport({ ...options, rename: async () => {
      attempts += 1;
      throw cause;
    } }), error => error === cause, "persistent/non-retryable replacement errors must block approval");
    assert.equal(attempts, limit);
    assert.equal(await fs.readFile(file, "utf8"), previous);
    assert.deepEqual(await fs.readdir(path.dirname(file)), ["e2e.json", "e2e.json.tmp"], "failure retains only one temporary checkpoint");
  }

  let locked = false;
  const finalError = Object.assign(new Error("final checkpoint locked"), { code: "EPERM" });
  const incomplete = await createBrowserRunReport({ ...options, flows: ["first"], rename: async (from, to) => {
    if (locked) throw finalError;
    await fs.rename(from, to);
  } });
  await incomplete.run("first", async () => {});
  locked = true;
  await assert.rejects(incomplete.finish(), error => error === finalError);
  assert.equal((await read()).status, "running", "failure to persist completion cannot publish passed status");
} finally {
  await fs.rm(root, { recursive: true, force: true });
}
console.log("browser-run-report.test.js ok");
