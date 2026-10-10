import assert from "node:assert/strict";
import { retainProfileTraceEvent, summarizeCpuWindow } from "../lib/profile-cpu.js";
for (const event of [{ name: "thread_name", ph: "M" }, { name: "georisk-profile-ready", ph: "R" },
  { name: "Layout", ph: "X", dur: 1 }, { name: "EvaluateScript", ph: "X", dur: 1 },
  { name: "v8.evaluateModule", ph: "X", dur: 1 }, { name: "FunctionCall", ph: "X", dur: 50000 }]) {
  assert.equal(retainProfileTraceEvent(event), true);
}
for (const event of [{ name: "RunTask", ph: "X", dur: 49999 },
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
console.log("profile-cpu.test.js ok: clipped phases, native frames, current windows and bounded malformed evidence");
