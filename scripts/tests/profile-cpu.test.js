import assert from "node:assert/strict";
import { retainProfileTraceEvent, summarizeCpuWindow, summarizeTraceThreads } from "../lib/profile-cpu.js";
for (const event of [{ name: "thread_name", ph: "M" }, { name: "georisk-profile-ready", ph: "R" },
  { name: "process_name", ph: "M" }, { name: "native boundary", cat: "cc,benchmark", ph: "X", dur: 1000 },
  ...["B", "E", "b", "e", "s", "t", "f", "I"].map(ph => ({ name: "native", cat: "gpu,viz", ph })),
  { name: "Layout", ph: "X", dur: 1 }, { name: "EvaluateScript", ph: "X", dur: 1 },
  { name: "v8.evaluateModule", ph: "X", dur: 1 }, { name: "FunctionCall", ph: "X", dur: 50000 }]) {
  assert.equal(retainProfileTraceEvent(event), true);
}
for (const event of [{ name: "RunTask", ph: "X", dur: 49999 },
  { name: "irrelevant", cat: "notcc,gpu.disabled", ph: "B" },
  { name: "short native", cat: "cc", ph: "X", dur: 999 },
  { name: "FunctionCall", ph: "B", dur: 50000 }, { name: "unused", ph: "I" }]) {
  assert.equal(retainProfileTraceEvent(event), false);
}
const cpu = { startTime: 1000, endTime: 5000, nodes: [
  { id: 1, callFrame: { functionName: "startup", url: "https://local/app.js", lineNumber: 2, columnNumber: 4 } },
  { id: 2, callFrame: { functionName: "draw" } }
], samples: [1, 2, 1, 2], timeDeltas: [0, 1000, 1000, 1000] };
assert.deepEqual(summarizeCpuWindow(cpu, 2500, 4400, url => (url || "").replace("https://local", "")), [
  { name: "startup", url: "/app.js", line: 3, column: 5, selfMs: 1 },
  { name: "draw", url: "", line: 0, column: 0, selfMs: 0.9 }
]);
assert.equal(summarizeCpuWindow(cpu, 1000, 2000)[0].name, "startup");
assert.equal(summarizeCpuWindow(cpu, 4000, 5000)[0].name, "draw");
const reordered = { ...cpu, timeDeltas: [0, 2000, -1000, 2000] };
const original = JSON.stringify(reordered);
assert.deepEqual(summarizeCpuWindow(reordered, 1000, 5000).map(row => [row.name, row.selfMs]), [["startup", 2], ["draw", 2]]);
assert.equal(JSON.stringify(reordered), original, "raw sample order/deltas must remain unchanged");
for (const [input, start, end] of [
  [cpu, 999, 2000], [cpu, 1000, 5001], [cpu, 2000, 2000], [cpu, NaN, 3000],
  [{ ...cpu, nodes: [...cpu.nodes, cpu.nodes[0]] }, 1000, 2000],
  [{ ...cpu, nodes: Array(4097).fill(cpu.nodes[0]) }, 1000, 2000],
  [{ ...cpu, samples: Array(16001).fill(1) }, 1000, 2000],
  [{ ...cpu, samples: [999, 2, 1, 2] }, 1000, 2000],
  [{ ...cpu, timeDeltas: [1000] }, 1000, 2000],
  [{ ...cpu, timeDeltas: [-1, 1000, 1000, 1000] }, 1000, 2000],
  [{ ...cpu, timeDeltas: [0, Infinity, 1000, 1000] }, 1000, 2000]
]) assert.throws(() => summarizeCpuWindow(input, start, end));
const trace = [
  { name: "nested", cat: "cc", ph: "X", pid: 1, tid: 2, ts: 1500, dur: 500 },
  { name: "outer", cat: "cc,benchmark", ph: "X", pid: 1, tid: 2, ts: 500, dur: 2500, args: { original: true } },
  { name: "GPU wait", cat: "gpu", ph: "X", pid: 3, tid: 4, ts: 1000, dur: 5000 },
  { name: "process_name", ph: "M", pid: 1, args: { name: "Renderer" } },
  { name: "thread_name", ph: "M", pid: 1, tid: 2, args: { name: "CrRendererMain" } },
  { name: "begin", cat: "cc", ph: "B", pid: 1, tid: 2, ts: 1000 },
  { cat: "cc", ph: "E", pid: 1, tid: 2, ts: 3000 },
  { name: "outside", cat: "gpu", ph: "X", pid: 3, tid: 4, ts: 6000, dur: 1 }
];
const traceOriginal = JSON.stringify(trace);
const native = summarizeTraceThreads(trace, 1000, 4000);
assert.equal(native.threadCount, 2);
assert.deepEqual(native.threads[0].longest, [{ eventIndex: 2, name: "GPU wait", category: "gpu",
  afterReadyMs: 0, durationMs: 5, overlapMs: 3 }]);
assert.equal(native.threads[1].threadName, "CrRendererMain");
assert.equal(native.threads[1].processName, "Renderer");
assert.equal(native.threads[1].completeEventCount, 2);
assert.deepEqual(native.threads[1].longest.map(row => [row.eventIndex, row.overlapMs]), [[1, 2], [0, 0.5]]);
assert.equal(JSON.stringify(trace), traceOriginal, "original native events, args and ordering must survive summaries");
const manyThreads = Array.from({ length: 25 }, (_, tid) => Array.from({ length: 10 }, (_, index) =>
  ({ cat: "viz", ph: "X", name: "bounded", pid: 1, tid, ts: 1000, dur: index + 1 }))).flat();
assert.equal(summarizeTraceThreads(manyThreads, 1000, 4000).threads.length, 20);
assert.ok(summarizeTraceThreads(manyThreads, 1000, 4000).threads.every(thread => thread.longest.length === 8));
for (const args of [[trace, NaN, 4000], [trace, 1000, 1000], [Array(50001), 1000, 4000]]) {
  assert.throws(() => summarizeTraceThreads(...args));
}
console.log("profile-cpu.test.js ok: clipped phases, native frames, current windows and bounded malformed evidence");
