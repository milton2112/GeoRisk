import assert from "node:assert/strict";
import { captureLiveElement } from "../lib/browser-screenshot.js";

const detached = new Error("locator.screenshot: Element is not attached to the DOM\nCall log:");
const options = { path: "fixture.png", timeout: 10000 };
const image = Buffer.from("captured");

async function runCapture(results, { closed = false } = {}) {
  let attempts = 0;
  const locator = {
    async screenshot(actualOptions) {
      assert.equal(actualOptions, options, "recapture must preserve the original options");
      const result = results[attempts++];
      if (result instanceof Error) throw result;
      return result;
    }
  };
  try {
    return { value: await captureLiveElement({ isClosed: () => closed }, locator, options), attempts };
  } catch (error) {
    return { error, attempts };
  }
}

assert.deepEqual(await runCapture([image]), { value: image, attempts: 1 });
assert.deepEqual(await runCapture([detached, image]), { value: image, attempts: 2 });
assert.deepEqual(await runCapture([detached, detached, image]), { error: detached, attempts: 2 }, "repeated replacements must fail, not loop");
assert.deepEqual(await runCapture([detached, image], { closed: true }), { error: detached, attempts: 1 });

for (const message of [
  "locator.screenshot: Timeout 10000ms exceeded.\nCall log: Element is not attached to the DOM",
  "locator.screenshot: Protocol error (Page.captureScreenshot): Unable to capture screenshot",
  "locator.screenshot: Target page, context or browser has been closed",
  "ENOSPC: no space left on device"
]) {
  const error = new Error(message);
  assert.deepEqual(await runCapture([error, image]), { error, attempts: 1 }, "unrelated failures must not be retried");
  assert.deepEqual(await runCapture([detached, error, image]), { error, attempts: 2 }, "a recapture failure must propagate unchanged");
}

console.log("browser-screenshot.test.js OK");
