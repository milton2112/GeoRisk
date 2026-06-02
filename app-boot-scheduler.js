const longTaskMetrics = {
  supported: false,
  count: 0,
  totalDuration: 0,
  longestDuration: 0,
  recent: []
};
let longTaskObserver = null;

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
  scheduleWhenQuiet,
  startLongTaskObserver
};
