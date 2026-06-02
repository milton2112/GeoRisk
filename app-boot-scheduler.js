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
  if (!startupFpsMetrics.active) {
    return;
  }
  startupFpsMetrics.samples += 1;
  startupFpsMetrics.min = startupFpsMetrics.min === null ? fps : Math.min(startupFpsMetrics.min, fps);
  startupFpsMetrics.max = startupFpsMetrics.max === null ? fps : Math.max(startupFpsMetrics.max, fps);
  startupFpsMetrics.avg += (fps - startupFpsMetrics.avg) / startupFpsMetrics.samples;
  if (elapsedMs >= startupFpsMetrics.windowMs) {
    startupFpsMetrics.active = false;
    startupFpsMetrics.completed = true;
  }
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
  const deadline = Date.now() + delay + timeout;

  const runTask = () => {
    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => task(), { timeout: 2500 });
      return;
    }
    setTimeout(task, 0);
  };

  const check = () => {
    if ((isQuiet() && isVisible()) || Date.now() >= deadline) {
      runTask();
      return;
    }
    setTimeout(check, Math.min(quietFor, 1500));
  };

  setTimeout(check, delay);
}

window.GeoRiskBootScheduler = {
  longTaskMetrics,
  recordStartupFps,
  scheduleWhenQuiet,
  startLongTaskObserver,
  startupFpsMetrics
};
