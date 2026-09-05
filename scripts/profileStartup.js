import fs from "node:fs/promises";
import path from "node:path";
import { createLocalSmokeServer } from "./localSmokeServer.js";
import { launchPerformanceBrowser, PERFORMANCE_PROFILES } from "./lib/browser-performance.js";

const root = path.resolve("dist/public");
await fs.access(path.join(root, "index.html"));
const profile = PERFORMANCE_PROFILES.find(item => item.name === (process.argv.includes("--desktop") ? "desktop" : "mobile-emulated"));
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
  await cdp.send("Profiler.enable");
  await cdp.send("Profiler.start");
  await cdp.send("Tracing.start", { categories: "devtools.timeline,v8,disabled-by-default-devtools.timeline", transferMode: "ReportEvents" });
  await page.addInitScript(() => localStorage.setItem("geo-risk-intro-seen", "true"));
  const baseUrl = `http://127.0.0.1:${server.address().port}`;
  await page.goto(baseUrl + "/index.html", { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForFunction(() => typeof countryLayers !== "undefined" && countryLayers.has("ARG") && !document.body.classList.contains("globe-loading"), undefined, { timeout: 45000 });
  await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 5000)));
  const cpu = (await cdp.send("Profiler.stop")).profile;
  const tracingComplete = new Promise(resolve => cdp.once("Tracing.tracingComplete", resolve));
  await cdp.send("Tracing.end");
  await tracingComplete;
  const localUrl = url => (url || "").replace(baseUrl, "");
  const thread = events.find(event => event.name === "thread_name" && event.args?.name === "CrRendererMain" && events.some(item => item.pid === event.pid && item.name === "EvaluateScript"));
  const work = events.filter(event => event.ph === "X" && event.dur >= 50000 && (!thread || (event.pid === thread.pid && event.tid === thread.tid)))
    .sort((a, b) => b.dur - a.dur).slice(0, 35)
    .map(event => ({ name: event.name, durationMs: event.dur / 1000, url: localUrl(event.args?.data?.url), functionName: event.args?.data?.functionName || null }));
  const nodes = new Map(cpu.nodes.map(node => [node.id, node]));
  const sampled = new Map();
  (cpu.samples || []).forEach((id, index) => sampled.set(id, (sampled.get(id) || 0) + (cpu.timeDeltas[index] || 0) / 1000));
  const functions = [...sampled].sort((a, b) => b[1] - a[1]).slice(0, 35).map(([id, selfMs]) => ({
    name: nodes.get(id)?.callFrame.functionName || "(anonymous)", url: localUrl(nodes.get(id)?.callFrame.url), line: (nodes.get(id)?.callFrame.lineNumber ?? -1) + 1, selfMs
  }));
  const runtime = await page.evaluate(() => ({ declaredMode: currentMapMode, actualMode: viewer.scene.mode, mode2d: Cesium.SceneMode.SCENE2D, mode3d: Cesium.SceneMode.SCENE3D }));
  const report = { generatedAt: new Date().toISOString(), profile, runtime, methodology: "Diagnostic trace and CPU sampling; timings include profiler overhead, not the release benchmark.", work, functions };
  await fs.mkdir("reports", { recursive: true });
  await fs.writeFile("reports/startup-profile.json", JSON.stringify(report, null, 2) + "\n");
  console.log("Diagnostico: reports/startup-profile.json");
  console.log(JSON.stringify({ profile: profile.name, runtime, work: work.slice(0, 10), functions: functions.slice(0, 10) }, null, 2));
} finally {
  await browser?.close();
  await new Promise(resolve => server.close(resolve));
}
