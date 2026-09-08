import fs from "node:fs/promises";
import path from "node:path";
import { createLocalSmokeServer } from "./localSmokeServer.js";
import { launchPerformanceBrowser, PERFORMANCE_PROFILES } from "./lib/browser-performance.js";

const root = path.resolve("dist/public");
await fs.access(path.join(root, "index.html"));
const profile = PERFORMANCE_PROFILES.find(item => item.name === (process.argv.includes("--desktop") ? "desktop" : "mobile-emulated"));
const sampleCpu = !process.argv.includes("--trace-only");
const observeArg = process.argv.find(arg => arg.startsWith("--observe-ms="));
const observeMs = observeArg ? Number(observeArg.slice("--observe-ms=".length)) : 5000;
if (!Number.isInteger(observeMs) || observeMs < 1000 || observeMs > 60000) {
  throw new Error("--observe-ms debe ser un entero entre 1000 y 60000.");
}
const server = createLocalSmokeServer({ root });
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
let browser;
try {
  browser = await launchPerformanceBrowser();
  const context = await browser.newContext({ viewport: profile.viewport, isMobile: profile.isMobile, hasTouch: profile.isMobile, serviceWorkers: "block" });
  const page = await context.newPage();
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
  await cdp.send("Tracing.start", { categories: "devtools.timeline,v8,blink.user_timing,disabled-by-default-devtools.timeline", transferMode: "ReportEvents" });
  await page.addInitScript(() => localStorage.setItem("geo-risk-intro-seen", "true"));
  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  await page.goto(baseUrl + "/index.html", { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForFunction(() => typeof countryLayers !== "undefined" && countryLayers.has("ARG") && !document.body.classList.contains("globe-loading"), undefined, { timeout: 45000 });
  await page.evaluate(ms => {
    performance.mark("georisk-profile-ready");
    return new Promise(resolve => setTimeout(resolve, ms));
  }, observeMs);
  const cpu = sampleCpu ? (await cdp.send("Profiler.stop")).profile : null;
  const tracingComplete = new Promise(resolve => cdp.once("Tracing.tracingComplete", resolve));
  await cdp.send("Tracing.end");
  await tracingComplete;
  const localUrl = url => (url || "").replace(baseUrl, "");
  const readyTimestamp = events.find(event => event.name === "georisk-profile-ready")?.ts;
  const thread = events.find(event => event.name === "thread_name" && event.args?.name === "CrRendererMain" && events.some(item => item.pid === event.pid && item.name === "EvaluateScript"));
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
  const report = { generatedAt: new Date().toISOString(), profile, runtime, observeAfterReadyMs: observeMs, cpuSampling: sampleCpu, methodology: `Diagnostic trace${sampleCpu ? " and CPU sampling" : " without CPU sampling"}; timings include instrumentation overhead, not the release benchmark. afterReadyMs is relative to the map-ready mark.`, work, functions };
  await fs.mkdir("reports", { recursive: true });
  await fs.writeFile("reports/startup-profile.json", JSON.stringify(report, null, 2) + "\n");
  console.log("Diagnostico: reports/startup-profile.json");
  console.log(JSON.stringify({ profile: profile.name, runtime, work: work.slice(0, 10), functions: functions.slice(0, 10) }, null, 2));
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
