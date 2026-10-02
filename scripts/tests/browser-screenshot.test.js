import assert from "node:assert/strict";
import vm from "node:vm";
import { captureLiveElement, captureTransientNotice } from "../lib/browser-screenshot.js";

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

function noticeFixture() {
  const state = { role: "status", visible: true, display: "block", visibility: "visible", x: 20, y: 780, width: 350, height: 44 };
  const calls = [];
  const viewport = { width: 390, height: 844 };
  const locator = {
    screenshot() { throw new Error("Do not wait for stability of a transient notice"); },
    async evaluate(read) {
      return vm.runInNewContext("(" + read.toString() + ")(element)", {
        element: {
          getBoundingClientRect: () => state,
          getAttribute: () => state.role,
          classList: { contains: () => state.visible }
        },
        getComputedStyle: () => state
      });
    }
  };
  const page = { viewportSize: () => viewport, async screenshot(actualOptions) { calls.push(actualOptions); return image; } };
  return { state, viewport, locator, page, calls };
}
const notice = noticeFixture();
assert.equal(await captureTransientNotice(notice.page, notice.locator, options), image);
assert.deepEqual(notice.calls, [{ ...options, clip: { x: 12, y: 764, width: 366, height: 76 }, animations: "disabled" }]);
const edge = noticeFixture();
Object.assign(edge.state, { x: 0, y: 0, width: 390, height: 844 });
await captureTransientNotice(edge.page, edge.locator, options);
assert.deepEqual(edge.calls[0].clip, { x: 0, y: 0, width: 390, height: 844 }, "padding is clamped to the viewport");
for (const change of [
  { role: "alert" }, { visible: false }, { display: "none" }, { visibility: "hidden" },
  { width: 0 }, { height: 0 }, { x: -1 }, { y: -1 }, { width: 400 }, { height: 100 }
]) {
  const invalid = noticeFixture();
  Object.assign(invalid.state, change);
  await assert.rejects(captureTransientNotice(invalid.page, invalid.locator, options), /notice must/);
  assert.equal(invalid.calls.length, 0, "expired/inaccessible/overflowing notices cannot silently produce accepted screenshots");
}
const failedNotice = noticeFixture();
const protocolError = new Error("Screenshot failed");
let failures = 0;
failedNotice.page.screenshot = async () => { failures += 1; throw protocolError; };
await assert.rejects(captureTransientNotice(failedNotice.page, failedNotice.locator, options), error => error === protocolError);
assert.equal(failures, 1, "capture errors propagate without retries or longer timeouts");
console.log("browser-screenshot.test.js OK");
