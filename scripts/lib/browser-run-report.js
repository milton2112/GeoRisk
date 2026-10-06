import fs from "node:fs/promises";
import path from "node:path";

export async function createBrowserRunReport({ file, flows, scope, metadata = {},
  now = Date.now, clock = () => performance.now() }) {
  if (!Array.isArray(flows) || !flows.length || flows.length > 64 ||
      flows.some(name => typeof name !== "string" || !name || name.length > 120) ||
      new Set(flows).size !== flows.length || !["full", "focused", "journeys"].includes(scope)) {
    throw new Error("Invalid browser report plan.");
  }
  const stamp = () => new Date(now()).toISOString();
  const state = { schemaVersion: 1, scope, status: "running", startedAt: stamp(),
    updatedAt: null, completedAt: null, metadata,
    flows: flows.map(name => ({ name, status: "pending", durationMs: null })) };
  let index = 0;
  let activeStarted;
  await fs.mkdir(path.dirname(file), { recursive: true });
  const save = async () => {
    state.updatedAt = stamp();
    // Replace one checkpoint; interruption leaves pending/running work, never success.
    await fs.writeFile(file + ".tmp", JSON.stringify(state, null, 2) + "\n");
    await fs.rename(file + ".tmp", file);
  };
  const fail = async error => {
    if (state.status === "failed") return;
    state.status = "failed";
    state.completedAt = stamp();
    const active = state.flows[index];
    if (active?.status === "running") {
      active.status = "failed";
      active.durationMs = Math.max(0, Math.round(clock() - activeStarted));
    }
    state.error = { name: String(error?.name || "Error").slice(0, 80),
      message: String(error?.message || error).slice(0, 1000) };
    await save();
  };
  await save();
  return {
    async setBrowser(selection) {
      if (state.status !== "running") throw new Error("Browser report is closed.");
      state.metadata.browser = selection;
      await save();
    },
    async run(name, task) {
      const flow = state.flows[index];
      if (state.status !== "running" || flow?.status !== "pending" || flow.name !== name) {
        throw new Error("Unexpected browser report flow: " + name);
      }
      flow.status = "running";
      activeStarted = clock();
      await save();
      try {
        await task();
        flow.durationMs = Math.max(0, Math.round(clock() - activeStarted));
        flow.status = "passed";
        index += 1;
        await save();
      } catch (error) {
        await fail(error);
        throw error;
      }
    },
    fail,
    async finish() {
      if (state.status !== "running" || index !== state.flows.length) {
        throw new Error("Incomplete browser report cannot pass.");
      }
      state.status = "passed";
      state.completedAt = stamp();
      await save();
    }
  };
}
