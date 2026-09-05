import os from "node:os";
import { createHash } from "node:crypto";
import { chromium } from "@playwright/test";
import { createLocalSmokeServer } from "../localSmokeServer.js";
import { summarizeLongTasks, summarizeRenderFrames } from "./performance-metrics.js";
import { BROWSER_MEASUREMENT_SOURCE } from "./performance-evidence.js";

export const PERFORMANCE_PROFILES = [
  { name: "desktop", viewport: { width: 1440, height: 920 }, isMobile: false, cpuSlowdown: 1 },
  { name: "mobile-emulated", viewport: { width: 390, height: 844 }, isMobile: true, cpuSlowdown: 4 }
];
export const PERFORMANCE_WINDOW_MS = 60000;
const ACTIVE_RENDER_MS = 6000;

export function performanceEnvironment() {
  return {
    platform: process.platform,
    arch: process.arch,
    node: process.version,
    logicalCpus: os.cpus().length,
    cpuModel: os.cpus()[0]?.model || null,
    hostFingerprint: createHash("sha256").update(os.hostname()).digest("hex").slice(0, 16),
    totalMemoryGiB: Math.round(os.totalmem() / 1024 ** 3),
    ci: Boolean(process.env.CI),
    requestedChannel: process.env.PLAYWRIGHT_CHANNEL || (process.env.CI ? "chromium" : "chrome")
  };
}

export async function launchPerformanceBrowser() {
  const channel = process.env.PLAYWRIGHT_CHANNEL || (process.env.CI ? "" : "chrome");
  let lastError;
  for (const option of channel ? [{ channel }, {}] : [{}, { channel: "chrome" }]) {
    try {
      return await chromium.launch({ headless: true, ...option });
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

async function measureProfile(browser, baseUrl, profile) {
  const context = await browser.newContext({
    viewport: profile.viewport,
    deviceScaleFactor: 1,
    isMobile: profile.isMobile,
    hasTouch: profile.isMobile,
    serviceWorkers: "block"
  });
  const pageErrors = [];
  const resourceErrors = [];
  const heavyRequests = [];
  const resourceUrl = url => url.startsWith(baseUrl + "/") ? url.slice(baseUrl.length) : url;
  let progress;
  try {
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    await cdp.send("Network.enable");
    await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: profile.cpuSlowdown });
    page.on("pageerror", error => pageErrors.push(error.message));
    page.on("response", response => {
      if (response.status() >= 400 && resourceErrors.length < 30) {
        resourceErrors.push({ url: resourceUrl(response.url()), status: response.status() });
      }
    });
    page.on("requestfailed", request => {
      if (resourceErrors.length < 30) resourceErrors.push({ url: resourceUrl(request.url()), error: request.failure()?.errorText });
    });
    page.on("request", request => {
      if (/\/(countries_full|conflict_details\.generated)\.json(?:\?|$)/.test(request.url())) {
        heavyRequests.push(new URL(request.url()).pathname);
      }
    });
    await page.addInitScript(({ windowMs }) => {
      localStorage.setItem("geo-risk-intro-seen", "true");
      const probe = window.__geoRiskPerformanceProbe = {
        longTasks: [],
        droppedEntries: 0,
        supported: PerformanceObserver.supportedEntryTypes.includes("longtask"),
        frameTimes: [],
        pixelSignatures: [],
        nonblankCanvas: false,
        endedAt: null
      };
      const collect = entries => {
        for (const entry of entries) {
          if (entry.startTime >= windowMs) continue;
          if (probe.longTasks.length >= 1000) { probe.droppedEntries += 1; continue; }
          probe.longTasks.push({ startTime: entry.startTime, duration: entry.duration, name: entry.name });
        }
      };
      if (probe.supported) {
        probe.observer = new PerformanceObserver(list => collect(list.getEntries()));
        probe.observer.observe({ type: "longtask", buffered: true });
      }
      const finish = () => {
        const remaining = windowMs - performance.now();
        if (remaining > 0) {
          setTimeout(finish, Math.ceil(remaining));
          return;
        }
        if (probe.observer) {
          collect(probe.observer.takeRecords());
          probe.observer.disconnect();
        }
        probe.endedAt = performance.now();
      };
      setTimeout(finish, Math.max(0, Math.ceil(windowMs - performance.now())));
    }, { windowMs: PERFORMANCE_WINDOW_MS });

    console.log(`Midiendo ${profile.name}: 60 s, CPU x${profile.cpuSlowdown}, cache HTTP vacia.`);
    progress = setInterval(() => console.log(`Medicion ${profile.name} en curso...`), 20000);
    await page.goto(baseUrl + "/index.html?performance-measurement=1", { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForFunction(() => {
      return typeof viewer !== "undefined" && viewer?.scene?.canvas &&
        typeof countryLayers !== "undefined" && countryLayers.has("ARG") && countryLayers.has("ESP") &&
        typeof countriesData !== "undefined" && Object.keys(countriesData).length >= 180 &&
        !document.body.classList.contains("globe-loading");
    }, undefined, { timeout: 45000 });

    await page.evaluate(activeMs => {
      const probe = window.__geoRiskPerformanceProbe;
      probe.readyAt = performance.now();
      probe.mode = currentMapMode;
      probe.sceneMode = viewer.scene.mode === Cesium.SceneMode.SCENE2D ? "2d" : viewer.scene.mode === Cesium.SceneMode.SCENE3D ? "3d" : "transition";
      probe.targetFrameRate = viewer.targetFrameRate;
      probe.activeStart = performance.now();
      const scene = viewer.scene;
      const canvas = scene.canvas;
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      const removeListener = scene.postRender.addEventListener(() => {
        probe.frameTimes.push(performance.now());
        if (!gl || probe.frameTimes.length % 30 !== 1) return;
        const colors = [];
        const pixel = new Uint8Array(4);
        for (const x of [0.25, 0.4, 0.5, 0.6, 0.75]) {
          for (const y of [0.3, 0.5, 0.7]) {
            gl.readPixels(Math.floor(canvas.width * x), Math.floor(canvas.height * y), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
            colors.push(Array.from(pixel).join(","));
          }
        }
        if (new Set(colors).size > 1) probe.nonblankCanvas = true;
        const signature = colors.join(";");
        if (probe.pixelSignatures.length < 2 && !probe.pixelSignatures.includes(signature)) probe.pixelSignatures.push(signature);
      });
      const move = () => {
        if (performance.now() - probe.activeStart >= activeMs) {
          probe.activeEnd = performance.now();
          removeListener();
          return;
        }
        if (scene.mode === Cesium.SceneMode.SCENE2D) viewer.camera.moveRight(60000);
        else viewer.camera.rotateRight(0.003);
        scene.requestRender();
        requestAnimationFrame(move);
      };
      requestAnimationFrame(move);
    }, ACTIVE_RENDER_MS);
    await page.waitForFunction(() => {
      const probe = window.__geoRiskPerformanceProbe;
      return probe.endedAt !== null && Boolean(probe.activeEnd);
    }, undefined, { timeout: PERFORMANCE_WINDOW_MS + 15000 });

    const raw = await page.evaluate(() => {
      const probe = window.__geoRiskPerformanceProbe;
      return {
        supported: probe.supported,
        endedAt: probe.endedAt,
        readyAt: probe.readyAt,
        mode: probe.mode,
        sceneMode: probe.sceneMode,
        targetFrameRate: probe.targetFrameRate,
        longTasks: probe.longTasks,
        droppedEntries: probe.droppedEntries,
        frameTimes: probe.frameTimes,
        activeStart: probe.activeStart,
        activeEnd: probe.activeEnd,
        nonblankCanvas: probe.nonblankCanvas,
        changingCanvas: probe.pixelSignatures.length > 1,
        bootSteps: typeof bootMetrics === "undefined" ? {} : Object.fromEntries(Object.entries(bootMetrics.steps).map(([name, step]) => [name, step.duration ?? null]))
      };
    });
    const longTasks = summarizeLongTasks(raw.longTasks);
    const activeRender = summarizeRenderFrames(raw.frameTimes, raw.activeStart, raw.activeEnd);
    activeRender.targetFps = raw.targetFrameRate;
    const checks = {
      longTasksSupported: raw.supported,
      fullWindowObserved: raw.endedAt >= PERFORMANCE_WINDOW_MS,
      noDroppedEntries: raw.droppedEntries === 0,
      activeSampleWithinWindow: raw.activeEnd <= raw.endedAt,
      canvasRendered: activeRender.frames > 0 && raw.nonblankCanvas,
      canvasChanged: raw.changingCanvas,
      sceneModeMatches: raw.mode === raw.sceneMode,
      noPageErrors: pageErrors.length === 0,
      noMissingLocalResources: !resourceErrors.some(item => item.url.startsWith("/")),
      noHeavyStartupRequests: heavyRequests.length === 0
    };
    console.log(`${profile.name}: listo ${Math.round(raw.readyAt)} ms; ${longTasks.count} long tasks, max ${Math.round(longTasks.longestDurationMs)} ms; render activo ${activeRender.averageFps.toFixed(1)} FPS.`);
    return {
      ...profile,
      observedWindowMs: raw.endedAt,
      appReadyMs: raw.readyAt,
      initialMapMode: raw.mode,
      initialSceneMode: raw.sceneMode,
      longTasks,
      activeRender,
      bootSteps: raw.bootSteps,
      resourceErrors,
      pageErrors,
      heavyRequests,
      checks,
      status: Object.values(checks).every(Boolean) ? "measured" : "failed"
    };
  } catch (error) {
    return { ...profile, status: "failed", error: error.message, resourceErrors, pageErrors, heavyRequests };
  } finally {
    clearInterval(progress);
    await context.close();
  }
}

export async function measureBrowserPerformance(root) {
  const server = createLocalSmokeServer({ root });
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  let browser;
  try {
    browser = await launchPerformanceBrowser();
    const profiles = [];
    const baseUrl = "http://127.0.0.1:" + server.address().port;
    for (const profile of PERFORMANCE_PROFILES) profiles.push(await measureProfile(browser, baseUrl, profile));
    return {
      source: BROWSER_MEASUREMENT_SOURCE,
      measuredAt: new Date().toISOString(),
      browserVersion: browser.version(),
      environment: performanceEnvironment(),
      methodology: {
        servedFrom: "dist/public",
        windowMs: PERFORMANCE_WINDOW_MS,
        activeRenderMs: ACTIVE_RENDER_MS,
        interaction: "programmatic camera rotation in 3D or pan in 2D after map ready",
        intro: "dismissed",
        cache: "fresh context, HTTP cache disabled, service worker blocked",
        network: "online, third-party CDN and imagery",
        mobile: "viewport/touch emulation and CPU slowdown, not a physical phone",
        budgetPolicy: "200 ms long tasks are reported for diagnosis; hardware-dependent timings are not a portable release threshold"
      },
      profiles,
      complete: profiles.every(profile => profile.status === "measured")
    };
  } finally {
    await browser?.close();
    await new Promise(resolve => server.close(resolve));
  }
}
