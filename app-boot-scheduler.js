(() => {
const longTaskMetrics = {
  supported: false,
  budgetMs: 200,
  count: 0,
  overBudgetCount: 0,
  totalDuration: 0,
  longestDuration: 0,
  recent: []
};
const startupFpsMetrics = {
  active: true,
  windowMs: 60000,
  samples: 0,
  min: null,
  max: null,
  avg: 0,
  completed: false
};
let longTaskObserver = null;

function recordStartupFps(fps, elapsedMs) {
  if (!startupFpsMetrics.active || !Number.isFinite(fps) || fps < 0) {
    return;
  }
  startupFpsMetrics.samples += 1;
  startupFpsMetrics.min = startupFpsMetrics.min === null ? fps : Math.min(startupFpsMetrics.min, fps);
  startupFpsMetrics.max = startupFpsMetrics.max === null ? fps : Math.max(startupFpsMetrics.max, fps);
  startupFpsMetrics.avg += (fps - startupFpsMetrics.avg) / startupFpsMetrics.samples;
  if (elapsedMs >= startupFpsMetrics.windowMs) {
    finishStartupFps();
  }
}

function finishStartupFps() {
  startupFpsMetrics.active = false;
  startupFpsMetrics.completed = true;
}

function startLongTaskObserver() {
  if (longTaskObserver || typeof PerformanceObserver === "undefined") {
    return;
  }

  try {
    longTaskObserver = new PerformanceObserver(list => {
      list.getEntries().forEach(entry => {
        const duration = Math.round(entry.duration || 0);
        longTaskMetrics.supported = true;
        longTaskMetrics.count += 1;
        if (duration > longTaskMetrics.budgetMs) {
          longTaskMetrics.overBudgetCount += 1;
        }
        longTaskMetrics.totalDuration += duration;
        longTaskMetrics.longestDuration = Math.max(longTaskMetrics.longestDuration, duration);
        longTaskMetrics.recent.unshift({
          name: entry.name || "longtask",
          startTime: Math.round(entry.startTime || 0),
          duration
        });
        longTaskMetrics.recent = longTaskMetrics.recent.slice(0, 8);
      });
    });
    longTaskObserver.observe({ type: "longtask", buffered: true });
    longTaskMetrics.supported = true;
  } catch {
    longTaskObserver = null;
    longTaskMetrics.supported = false;
  }
}

function scheduleWhenQuiet(task, {
  delay = 0,
  quietFor = 4500,
  timeout = 60000,
  isQuiet = () => true,
  isVisible = () => document.visibilityState !== "hidden"
} = {}) {
  let readyAfter = Date.now() + delay;
  const deadline = readyAfter + timeout;
  const checkInterval = Math.max(50, Math.min(quietFor, 1500));
  let timer = null;
  let idle = null;
  let generation = 0;
  let finished = false;

  const clearPending = () => {
    generation += 1;
    clearTimeout(timer);
    timer = null;
    if (idle !== null) window.cancelIdleCallback?.(idle);
    idle = null;
  };

  const cancel = () => {
    finished = true;
    clearPending();
    document.removeEventListener("visibilitychange", wake);
  };

  const queueCheck = wait => {
    if (!finished && isVisible()) timer = setTimeout(check, wait);
  };

  const runTask = ticket => {
    if (finished || ticket !== generation) return;
    idle = null;
    // Idle callbacks can arrive after a drag starts, even when their timeout fires.
    if (!isVisible() || !isQuiet()) {
      queueCheck(checkInterval);
      return;
    }
    cancel();
    try {
      Promise.resolve(task()).catch(error => console.warn("GeoRisk deferred task:", error));
    } catch (error) {
      console.warn("GeoRisk deferred task:", error);
    }
  };

  function check() {
    timer = null;
    if (finished || !isVisible()) return;
    const remainingDelay = readyAfter - Date.now();
    if (remainingDelay > 0) { queueCheck(remainingDelay); return; }
    if (!isQuiet()) { queueCheck(checkInterval); return; }
    const ticket = ++generation;
    if (window.requestIdleCallback) {
      // A deadline limits idle waiting, never the visibility or interaction guards.
      idle = window.requestIdleCallback(() => runTask(ticket), {
        timeout: Math.max(1, Math.min(2500, deadline - Date.now()))
      });
    } else {
      timer = setTimeout(() => { timer = null; runTask(ticket); }, 0);
    }
  }

  function wake(event) {
    if (finished) return;
    clearPending();
    if (event && isVisible()) readyAfter = Math.max(readyAfter, Date.now() + quietFor);
    queueCheck(Math.max(0, readyAfter - Date.now()));
  }

  document.addEventListener("visibilitychange", wake);
  wake();
  return cancel;
}

window.GeoRiskBootScheduler = {
  finishStartupFps,
  longTaskMetrics,
  recordStartupFps,
  scheduleWhenQuiet,
  startLongTaskObserver,
  startupFpsMetrics
};
})();
