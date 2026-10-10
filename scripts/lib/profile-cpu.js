// Statistical CPU samples, clipped to explicit monotonic microsecond windows.
export function retainProfileTraceEvent(event) {
  return event.name === "thread_name" || event.name === "georisk-profile-ready" ||
    (event.ph === "X" && (event.dur >= 50000 ||
      ["Layout", "EvaluateScript", "v8.evaluateModule"].includes(event.name)));
}

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
