import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { parse } from "yaml";

const pinnedAction = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(?:\/[A-Za-z0-9_.-]+)*@[a-f0-9]{40}$/;

function assertPinnedActions(workflow, file) {
  assert.ok(workflow?.jobs && typeof workflow.jobs === "object", `${file}: jobs requeridos`);
  for (const [name, job] of Object.entries(workflow.jobs)) {
    for (const entry of [job, ...(job.steps || [])]) {
      if (!Object.hasOwn(entry, "uses")) continue;
      assert.equal(typeof entry.uses, "string", `${file}/${name}: uses debe ser texto`);
      assert.match(entry.uses, pinnedAction, `${file}/${name}: usar una accion remota fijada por SHA completo`);
    }
  }
}

const directory = new URL("../../.github/workflows/", import.meta.url);
const files = (await fs.readdir(directory)).filter(file => /\.ya?ml$/.test(file));
assert.ok(files.includes("release-gate.yml"));
for (const file of files) {
  assertPinnedActions(parse(await fs.readFile(new URL(file, directory), "utf8")), file);
}

const pinned = "actions/checkout@" + "a".repeat(40);
const fixture = uses => ({ jobs: { test: { steps: [{ uses }, { run: "npm test" }] } } });
assertPinnedActions(fixture(pinned), "fixture");
assertPinnedActions({ jobs: { call: { uses: "owner/repo/.github/workflows/check.yml@" + "b".repeat(40) } } }, "fixture");
for (const uses of ["actions/checkout@v4", "actions/checkout@main", "actions/checkout@abcdef0", pinned + "extra", "./local-action", "docker://image:latest", null]) {
  assert.throws(() => assertPinnedActions(fixture(uses), "fixture"));
}
assert.throws(() => assertPinnedActions({ jobs: { call: { uses: "owner/repo/.github/workflows/check.yml@main" } } }, "fixture"));
assert.throws(() => assertPinnedActions({}, "fixture"));

const dependabot = parse(await fs.readFile(new URL("../../.github/dependabot.yml", import.meta.url), "utf8"));
assert.equal(dependabot.version, 2);
const actions = dependabot.updates.filter(update => update["package-ecosystem"] === "github-actions");
assert.equal(actions.length, 1);
assert.equal(actions[0].directory, "/");
assert.equal(actions[0].schedule.interval, "weekly");
assert.ok(actions[0]["open-pull-requests-limit"] > 0 && actions[0]["open-pull-requests-limit"] <= 2);
assert.deepEqual(actions[0].groups["github-actions"].patterns, ["*"]);
console.log("actions-pinning.test.js ok: all workflows, full SHA, bounded update proposals");
