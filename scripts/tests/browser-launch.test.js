import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { launchProjectBrowser, getBrowserSelection, requestedBrowserChannel } from "../lib/browser-launch.js";
import { PERFORMANCE_INPUT_FILES } from "../lib/performance-inputs.js";

function fixture(failures = 0) {
  const calls = [];
  const logs = [];
  const failure = new Error("browser unavailable");
  const browser = { version: () => "123.0.0" };
  return {
    calls, logs, failure, browser,
    browserType: { async launch(options) {
      calls.push(options);
      if (calls.length <= failures) throw failure;
      return browser;
    } },
    log: message => logs.push(message)
  };
}

for (const [env, channel, options] of [
  [{}, "chrome", { headless: true, channel: "chrome" }],
  [{ CI: "true" }, "chromium", { headless: true, channel: "chromium" }],
  [{ PLAYWRIGHT_CHANNEL: "chromium" }, "chromium", { headless: true, channel: "chromium" }],
  [{ CI: "true", PLAYWRIGHT_CHANNEL: "chrome" }, "chrome", { headless: true, channel: "chrome" }],
  [{ PLAYWRIGHT_CHANNEL: "headless-shell" }, "headless-shell", { headless: true }]
]) {
  const f = fixture();
  assert.equal(requestedBrowserChannel(env), channel);
  const browser = await launchProjectBrowser(f.browserType, { env, log: f.log });
  assert.equal(browser, f.browser);
  assert.deepEqual(f.calls, [options]);
  assert.deepEqual(getBrowserSelection(browser), { requestedChannel: channel, actualChannel: channel, browserVersion: "123.0.0" });
  assert.equal(Object.isFrozen(getBrowserSelection(browser)), true);
  assert.deepEqual(JSON.parse(f.logs[0].slice("Browser selection: ".length)), getBrowserSelection(browser));
  assert.equal(f.logs.length, 1, "una sola evidencia por lanzamiento, sin polling");
}

for (const env of [{ CI: "true" }, { PLAYWRIGHT_CHANNEL: "chrome" }, { CI: "true", PLAYWRIGHT_CHANNEL: "headless-shell" }]) {
  const f = fixture(1);
  await assert.rejects(launchProjectBrowser(f.browserType, { env, log: f.log }), error => {
    assert.equal(error.cause, f.failure);
    assert.ok(error.message.includes(requestedBrowserChannel(env)));
    return true;
  });
  assert.equal(f.calls.length, 1, "CI/canal explicito no debe caer silenciosamente en otro modo");
  assert.equal(f.logs.length, 0, "un lanzamiento fallido no es evidencia de navegador activo");
  assert.equal(getBrowserSelection(f.browser), undefined);
}

const fallback = fixture(1);
await launchProjectBrowser(fallback.browserType, { env: {}, log: fallback.log });
assert.deepEqual(fallback.calls, [{ headless: true, channel: "chrome" }, { headless: true }]);
assert.deepEqual(getBrowserSelection(fallback.browser), { requestedChannel: "chrome", actualChannel: "headless-shell", browserVersion: "123.0.0" });
assert.equal(fallback.logs.length, 1, "el fallback local debe declarar el modo efectivo");
const unavailable = fixture(2);
await assert.rejects(launchProjectBrowser(unavailable.browserType, { env: {}, log: unavailable.log }), { cause: unavailable.failure });
assert.equal(unavailable.calls.length, 2, "fallback local finito, sin descargas automaticas");
assert.equal(getBrowserSelection({}), undefined);
assert.ok(PERFORMANCE_INPUT_FILES.includes("scripts/lib/browser-launch.js"), "cambiar el launcher invalida mediciones anteriores");

for (const file of ["critical-browser-e2e.test.js", "service-worker-browser.test.js", "../lib/browser-performance.js"]) {
  const source = await fs.readFile(new URL(file, import.meta.url), "utf8");
  assert.ok(source.includes("return launchProjectBrowser(chromium)"), `${file} debe usar la misma politica de navegador`);
  assert.ok(!source.includes("chromium.launch("), `${file} no debe omitir la politica comun`);
}
console.log("browser-launch.test.js ok");
