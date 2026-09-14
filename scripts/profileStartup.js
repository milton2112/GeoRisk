import fs from "node:fs/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { createLocalSmokeServer } from "./localSmokeServer.js";
import { launchPerformanceBrowser, PERFORMANCE_PROFILES } from "./lib/browser-performance.js";

const root = path.resolve("dist/public");
await fs.access(path.join(root, "index.html"));
const profile = PERFORMANCE_PROFILES.find(item => item.name === (process.argv.includes("--desktop") ? "desktop" : "mobile-emulated"));
const sampleCpu = !process.argv.includes("--trace-only");
const inspectDom = process.argv.includes("--dom-details");
const activeMap = process.argv.includes("--active-map");
const inspectWebgl = process.argv.includes("--webgl-details");
const nativeAaArg = process.argv.find(arg => arg.startsWith("--native-aa="));
const nativeAa = nativeAaArg ? nativeAaArg.slice("--native-aa=".length) : null;
if (nativeAa !== null && !["on", "off"].includes(nativeAa)) throw new Error("--native-aa must be on or off.");
const engineBundleArg = process.argv.find(arg => arg.startsWith("--engine-bundle="));
const engineBundlePath = engineBundleArg ? path.resolve(engineBundleArg.slice("--engine-bundle=".length)) : null;
const engineBundle = engineBundlePath ? await fs.readFile(engineBundlePath) : null;
const engineOverride = engineBundle ? {
  path: path.relative(process.cwd(), engineBundlePath).replace(/\\/g, "/"),
  bytes: engineBundle.length,
  sha256: createHash("sha256").update(engineBundle).digest("hex")
} : null;
const baselineStyleArg = process.argv.find(arg => arg.startsWith("--baseline-style="));
const baselineStyleRef = baselineStyleArg ? execFileSync("git", ["rev-parse", "--verify", "--end-of-options", `${baselineStyleArg.slice("--baseline-style=".length)}^{commit}`], { encoding: "utf8" }).trim() : null;
const baselineStyle = baselineStyleRef ? execFileSync("git", ["show", `${baselineStyleRef}:style.css`], { encoding: "utf8" }) : null;
const observeArg = process.argv.find(arg => arg.startsWith("--observe-ms="));
const observeMs = observeArg ? Number(observeArg.slice("--observe-ms=".length)) : activeMap ? 8000 : 5000;
if (!Number.isInteger(observeMs) || observeMs < 1000 || observeMs > 60000) {
  throw new Error("--observe-ms debe ser un entero entre 1000 y 60000.");
}
if (activeMap && observeMs < 6500) throw new Error("--active-map requiere --observe-ms de al menos 6500.");
const server = createLocalSmokeServer({ root });
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
let browser;
try {
  browser = await launchPerformanceBrowser();
  const context = await browser.newContext({ viewport: profile.viewport, isMobile: profile.isMobile, hasTouch: profile.isMobile, serviceWorkers: "block" });
  const page = await context.newPage();
  let engineRequests = 0;
  let styleRequests = 0;
  if (engineBundle) {
    await page.route(/\/vendor\/cesium\/engine\.js\?/, route => {
      engineRequests += 1;
      return route.fulfill({ status: 200, contentType: "text/javascript", body: engineBundle });
    });
  }
  if (baselineStyle !== null) {
    await page.route(/\/style\.css\?/, route => {
      styleRequests += 1;
      return route.fulfill({ status: 200, contentType: "text/css", body: baselineStyle });
    });
  }
  const cdp = await context.newCDPSession(page);
  const events = [];
  cdp.on("Tracing.dataCollected", ({ value }) => events.push(...value));
  await cdp.send("Network.enable");
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: profile.cpuSlowdown });
  if (sampleCpu) {
    await cdp.send("Profiler.enable");
    await cdp.send("Profiler.start");
  }
  await cdp.send("Tracing.start", { categories: "devtools.timeline,v8,blink.user_timing,disabled-by-default-devtools.timeline" + (inspectDom ? ",blink,renderer.scheduler,loading,disabled-by-default-devtools.timeline.invalidationTracking" : ""), transferMode: "ReportEvents" });
  await page.addInitScript(() => localStorage.setItem("geo-risk-intro-seen", "true"));
  if (nativeAa !== null) await page.addInitScript(enabled => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, options) {
      return original.call(this, type, /^(webgl2?|experimental-webgl)$/.test(type) ? { ...options, antialias: enabled } : options);
    };
  }, nativeAa === "on");
  if (inspectWebgl) await page.addInitScript(() => {
    window.__geoRiskWebglTrace = [];
    const shaderSources = new WeakMap();
    const programs = new WeakMap();
    const prototypes = [window.WebGLRenderingContext?.prototype, window.WebGL2RenderingContext?.prototype].filter(Boolean);
    for (const proto of prototypes) {
      for (const name of ["shaderSource", "attachShader", "compileShader", "linkProgram", "getProgramParameter", "texImage2D", "renderbufferStorageMultisample"]) {
        const original = proto[name];
        if (typeof original !== "function") continue;
        proto[name] = function (...args) {
          const at = performance.now();
          const value = original.apply(this, args);
          const durationMs = performance.now() - at;
          if (args[0] !== null && typeof args[0] === "object") {
            if (name === "shaderSource") shaderSources.set(args[0], String(args[1]));
            if (name === "attachShader") programs.set(args[0], [...(programs.get(args[0]) || []), args[1]]);
          }
          if (durationMs >= 5 && window.__geoRiskWebglTrace.length < 500) {
            const sources = programs.has(args[0]) ? programs.get(args[0]).map(shader => shaderSources.get(shader) || "") : [shaderSources.get(args[0]) || ""];
            window.__geoRiskWebglTrace.push({ name, at, durationMs,
              defines: [...new Set(sources.flatMap(source => source.match(/^#define .+/gm) || []))],
              sourceBytes: sources.map(source => source.length) });
          }
          return value;
        };
      }
    }
  });
  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  await page.goto(baseUrl + "/index.html", { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForFunction(() => typeof countryLayers !== "undefined" && countryLayers.has("ARG") && !document.body.classList.contains("globe-loading"), undefined, { timeout: 45000 });
  if (inspectDom) await page.evaluate(() => {
    window.__geoRiskDomTrace = [];
    const record = value => {
      window.__geoRiskDomTrace.push({ at: performance.now(), ...value });
      if (window.__geoRiskDomTrace.length > 2000) window.__geoRiskDomTrace.shift();
    };
    window.__geoRiskDomObserver = new MutationObserver(records => records.forEach(item => record({
      kind: "mutation", target: item.target.id || item.target.nodeName,
      attribute: item.attributeName, added: item.addedNodes.length, removed: item.removedNodes.length
    })));
    window.__geoRiskDomObserver.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["hidden", "open", "class", "style"] });
    for (const name of ["loadDeferredDataEnhancements", "setupSearchIndex", "loadSupplementalData", "refreshGlobalStats", "rerenderCurrentPanel", "renderEmpty", "renderNewsHub"]) {
      const original = window[name];
      window[name] = function (...args) {
        record({ kind: "call", name });
        try { return original.apply(this, args); }
        finally { record({ kind: "return", name }); }
      };
    }
  });
  await page.evaluate(({ ms, activeMap }) => {
    performance.mark("georisk-profile-ready");
    if (activeMap) {
      const start = performance.now();
      const frames = [];
      const removeListener = viewer.scene.postRender.addEventListener(() => frames.push(performance.now()));
      const move = () => {
        if (performance.now() - start >= 6000) {
          removeListener();
          window.__geoRiskActiveTrace = { start, end: performance.now(), frames: frames.length };
          return;
        }
        if (viewer.scene.mode === Cesium.SceneMode.SCENE2D) viewer.camera.moveRight(60000);
        else viewer.camera.rotateRight(0.003);
        viewer.scene.requestRender();
        requestAnimationFrame(move);
      };
      requestAnimationFrame(move);
    }
    return new Promise(resolve => setTimeout(resolve, ms));
  }, { ms: observeMs, activeMap });
  const cpu = sampleCpu ? (await cdp.send("Profiler.stop")).profile : null;
  const tracingComplete = new Promise(resolve => cdp.once("Tracing.tracingComplete", resolve));
  await cdp.send("Tracing.end");
  await tracingComplete;
  const localUrl = url => (url || "").replace(baseUrl, "");
  const readyTimestamp = events.find(event => event.name === "georisk-profile-ready")?.ts;
  const thread = events.find(event => event.name === "thread_name" && event.args?.name === "CrRendererMain" && events.some(item => item.pid === event.pid && item.name === "EvaluateScript"));
  if (!thread || !Number.isFinite(readyTimestamp)) throw new Error("Traza incompleta: falta el hilo principal o la marca de disponibilidad.");
  if (engineBundle && engineRequests !== 1) throw new Error(`Engine override matched ${engineRequests} requests; expected exactly one.`);
  if (baselineStyle !== null && styleRequests !== 1) throw new Error(`Style override matched ${styleRequests} requests; expected exactly one.`);
  const moduleEvaluations = events.filter(event => event.ph === "X" && event.name === "v8.evaluateModule" && event.pid === thread.pid && event.tid === thread.tid)
    .map(event => ({ durationMs: event.dur / 1000, afterReadyMs: (event.ts - readyTimestamp) / 1000 }));
  const layoutEvents = events.filter(event => event.ph === "X" && event.name === "Layout" && (!thread || (event.pid === thread.pid && event.tid === thread.tid)));
  const summarizeLayout = items => ({ count: items.length, totalMs: items.reduce((sum, event) => sum + event.dur / 1000, 0), maximumMs: Math.max(0, ...items.map(event => event.dur / 1000)) });
  const layout = {
    beforeReady: summarizeLayout(layoutEvents.filter(event => event.ts < readyTimestamp)),
    afterReady: summarizeLayout(layoutEvents.filter(event => event.ts >= readyTimestamp))
  };
  const domDetails = inspectDom ? {
    mutations: await page.evaluate(() => { window.__geoRiskDomObserver.disconnect(); return window.__geoRiskDomTrace; }),
    layouts: layoutEvents.filter(event => event.ts >= readyTimestamp).map(event => ({
      afterReadyMs: (event.ts - readyTimestamp) / 1000, durationMs: event.dur / 1000, args: event.args,
      enclosing: events.filter(parent => parent.ph === "X" && parent.pid === event.pid && parent.tid === event.tid && parent.ts <= event.ts && parent.ts + parent.dur >= event.ts + event.dur && parent !== event)
        .map(parent => ({ name: parent.name, durationMs: parent.dur / 1000, args: parent.args }))
    })),
    resources: await page.evaluate(() => performance.getEntriesByType("resource").map(entry => ({ name: entry.name, startTime: entry.startTime, duration: entry.duration })))
  } : null;
  const work = events.filter(event => event.ph === "X" && event.dur >= 50000 && (!thread || (event.pid === thread.pid && event.tid === thread.tid)))
    .sort((a, b) => b.dur - a.dur).slice(0, 35)
    .map(event => ({ name: event.name, durationMs: event.dur / 1000, afterReadyMs: readyTimestamp === undefined ? null : (event.ts - readyTimestamp) / 1000, url: localUrl(event.args?.data?.url), line: event.args?.data?.lineNumber ?? null, functionName: event.args?.data?.functionName || null }));
  const nodes = new Map((cpu?.nodes || []).map(node => [node.id, node]));
  const sampled = new Map();
  (cpu?.samples || []).forEach((id, index) => sampled.set(id, (sampled.get(id) || 0) + (cpu.timeDeltas[index] || 0) / 1000));
  const functions = [...sampled].sort((a, b) => b[1] - a[1]).slice(0, 35).map(([id, selfMs]) => ({
    name: nodes.get(id)?.callFrame.functionName || "(anonymous)", url: localUrl(nodes.get(id)?.callFrame.url), line: (nodes.get(id)?.callFrame.lineNumber ?? -1) + 1, selfMs
  }));
  const runtime = await page.evaluate(() => ({ declaredMode: currentMapMode, actualMode: viewer.scene.mode, mode2d: Cesium.SceneMode.SCENE2D, mode3d: Cesium.SceneMode.SCENE3D }));
  const webglDetails = inspectWebgl ? await page.evaluate(() => window.__geoRiskWebglTrace) : null;
  const activeRender = activeMap ? await page.evaluate(() => window.__geoRiskActiveTrace) : null;
  if (activeMap && !activeRender) throw new Error("La muestra de movimiento no termino; aumentar --observe-ms.");
  const contextAntialias = await page.evaluate(() => {
    const canvas = viewer.scene.canvas;
    return (canvas.getContext("webgl2") || canvas.getContext("webgl"))?.getContextAttributes()?.antialias ?? null;
  });
  const report = { generatedAt: new Date().toISOString(), browserVersion: browser.version(), profile, runtime, baselineStyleRef, engineOverride, moduleEvaluations, layout, domDetails, webglDetails, activeMap, activeRender, nativeAaOverride: nativeAa, contextAntialias, observeAfterReadyMs: observeMs, cpuSampling: sampleCpu, methodology: `Diagnostic trace${sampleCpu ? " and CPU sampling" : " without CPU sampling"}; timings include instrumentation overhead, not the release benchmark. afterReadyMs is relative to the map-ready mark. Overrides replace only their selected resource or the explicitly requested native canvas AA setting. DOM/WebGL details add observation and wrappers only when requested; active-map repeats the release camera movement for up to six seconds.`, work, functions };
  await fs.mkdir("reports", { recursive: true });
  await fs.writeFile("reports/startup-profile.json", JSON.stringify(report, null, 2) + "\n");
  console.log("Diagnostico: reports/startup-profile.json");
  console.log(JSON.stringify({ profile: profile.name, runtime, baselineStyleRef, layout, work: work.slice(0, 10), functions: functions.slice(0, 10) }, null, 2));
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
