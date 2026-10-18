export const NATIVE_TRACE_CATEGORIES = "cc,gpu,viz,toplevel";
const nativeCategories = new Set(NATIVE_TRACE_CATEGORIES.split(","));
const isNativeEvent = event => typeof event.cat === "string" &&
  event.cat.split(",").some(category => nativeCategories.has(category));

export function retainProfileTraceEvent(event) {
  // Native begin/end, async and flow events cannot be duration-filtered without
  // losing their counterpart. Keep their original fields and delivery order.
  return event.ph === "M" || event.name === "georisk-profile-ready" ||
    (isNativeEvent(event) && (event.ph !== "X" || event.dur >= 1000)) ||
    (event.ph === "X" && (event.dur >= 50000 ||
      ["Layout", "EvaluateScript", "v8.evaluateModule"].includes(event.name)));
}

export function summarizeTraceThreads(events, startUs, endUs) {
  if (!Array.isArray(events) || events.length > 50000 || !Number.isFinite(startUs) ||
      !Number.isFinite(endUs) || endUs <= startUs) throw new Error("Invalid trace window.");
  const threads = new Map();
  const processes = new Map();
  const threadNames = new Map();
  for (const event of events) {
    if (event.ph === "M" && event.name === "process_name") processes.set(event.pid, event.args?.name);
    if (event.ph === "M" && event.name === "thread_name") threadNames.set(`${event.pid}:${event.tid}`, event.args?.name);
  }
  events.forEach((event, eventIndex) => {
    if (!isNativeEvent(event) || event.ph !== "X" || !Number.isFinite(event.ts) ||
        !Number.isFinite(event.dur) || event.dur < 0) return;
    const overlapUs = Math.max(0, Math.min(endUs, event.ts + event.dur) - Math.max(startUs, event.ts));
    if (!overlapUs) return;
    const key = `${event.pid}:${event.tid}`;
    if (!threads.has(key)) threads.set(key, { pid: event.pid, tid: event.tid,
      processName: processes.get(event.pid) || null, threadName: threadNames.get(key) || null,
      completeEventCount: 0, longest: [] });
    const thread = threads.get(key);
    thread.completeEventCount++;
    thread.longest.push({ eventIndex, name: event.name, category: event.cat,
      afterReadyMs: (event.ts - startUs) / 1000, durationMs: event.dur / 1000, overlapMs: overlapUs / 1000 });
    thread.longest.sort((a, b) => b.overlapMs - a.overlapMs || a.eventIndex - b.eventIndex);
    thread.longest.length = Math.min(thread.longest.length, 8);
  });
  return { startUs, endUs, threadCount: threads.size,
    threads: [...threads.values()].sort((a, b) => b.longest[0].overlapMs - a.longest[0].overlapMs).slice(0, 20),
    methodology: "Up to 20 threads and eight longest selected complete X events per thread, clipped to the ready/CPU-end window. Native X spans below 1 ms are omitted at collection. Inclusive elapsed spans can nest or overlap; never sum them as CPU/GPU busy time or infer causality. Original B/E, async and flow events remain in the separate selected trace without pairing or interpretation." };
}

// Statistical CPU samples, clipped to explicit monotonic microsecond windows.
export function summarizeCpuWindow(cpu, startUs, endUs, localUrl = value => value || "") {
  if (!cpu || !Array.isArray(cpu.nodes) || cpu.nodes.length > 4096 ||
      !Array.isArray(cpu.samples) || cpu.samples.length > 16000 ||
      !Array.isArray(cpu.timeDeltas) || cpu.timeDeltas.length !== cpu.samples.length ||
      !Number.isFinite(cpu.startTime) || !Number.isFinite(cpu.endTime) ||
      !Number.isFinite(startUs) || !Number.isFinite(endUs) ||
      startUs < cpu.startTime || endUs > cpu.endTime || endUs <= startUs) {
    throw new Error("CPU diagnostic requires a bounded, complete time window.");
  }
  const nodes = new Map(cpu.nodes.map(node => [node.id, node]));
  if (nodes.size !== cpu.nodes.length) throw new Error("Duplicate CPU node.");
  const points = [];
  let at = cpu.startTime;
  for (let index = 0; index < cpu.samples.length; index++) {
    const delta = cpu.timeDeltas[index];
    const node = nodes.get(cpu.samples[index]);
    if (!Number.isFinite(delta) || !node?.callFrame) throw new Error("Invalid CPU sample.");
    at += delta;
    if (at < cpu.startTime || at > cpu.endTime) throw new Error("CPU timestamp outside profile.");
    points.push({ at, id: node.id });
  }
  // CDP can deliver samples out of order. Preserve raw deltas; sort derived
  // timestamps as ChromeDevTools CPUProfileDataModel.sortSamples does.
  points.sort((a, b) => a.at - b.at);
  const times = new Map();
  for (let index = 0; index < points.length; index++) {
    const point = points[index];
    const next = points[index + 1]?.at ?? cpu.endTime;
    const overlap = Math.max(0, Math.min(endUs, next) - Math.max(startUs, point.at));
    if (overlap) times.set(point.id, (times.get(point.id) || 0) + overlap);
  }
  return [...times].sort((a, b) => b[1] - a[1]).slice(0, 35).map(([id, us]) => {
    const frame = nodes.get(id).callFrame;
    return { name: frame.functionName || "(anonymous)", url: localUrl(frame.url),
      line: (frame.lineNumber ?? -1) + 1, column: (frame.columnNumber ?? -1) + 1, selfMs: us / 1000 };
  });
}
