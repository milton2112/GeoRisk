export function summarizeLongTasks(entries, budgetMs = 200) {
  const tasks = entries.filter(entry => Number.isFinite(entry.duration) && entry.duration >= 0);
  return {
    budgetMs,
    count: tasks.length,
    overBudgetCount: tasks.filter(entry => entry.duration > budgetMs).length,
    totalDurationMs: tasks.reduce((sum, entry) => sum + entry.duration, 0),
    totalBlockingTimeMs: tasks.reduce((sum, entry) => sum + Math.max(0, entry.duration - 50), 0),
    longestDurationMs: tasks.length ? Math.max(...tasks.map(entry => entry.duration)) : 0,
    worst: [...tasks].sort((a, b) => b.duration - a.duration).slice(0, 10)
  };
}

export function summarizeRenderFrames(frameTimes, startTime, endTime) {
  const durationMs = Math.max(0, endTime - startTime);
  const times = frameTimes.filter(time => Number.isFinite(time) && time >= startTime && time <= endTime).sort((a, b) => a - b);
  const boundaries = [startTime, ...times, endTime];
  const gaps = boundaries.slice(1).map((time, index) => Math.max(0, time - boundaries[index]));
  return {
    durationMs,
    frames: times.length,
    averageFps: durationMs > 0 ? times.length * 1000 / durationMs : null,
    longestFrameGapMs: gaps.length ? Math.max(...gaps) : null
  };
}
