import assert from "node:assert/strict";

export async function captureTransientNotice(page, locator, options) {
  const snapshot = await locator.evaluate(element => {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return {
      role: element.getAttribute("role"),
      visible: element.classList.contains("is-visible") && style.display !== "none" && style.visibility !== "hidden",
      x: rect.x, y: rect.y, width: rect.width, height: rect.height
    };
  });
  const viewport = page.viewportSize();
  assert.equal(snapshot.role, "status", "notice must retain its accessible status role");
  assert.ok(snapshot.visible && snapshot.width > 0 && snapshot.height > 0, "notice must still be visible before capture");
  assert.ok(viewport && snapshot.x >= 0 && snapshot.y >= 0 &&
    snapshot.x + snapshot.width <= viewport.width + 1 && snapshot.y + snapshot.height <= viewport.height + 1,
    "notice must fit the viewport before capture");
  // Cover the toast's 8px entry translation without waiting out its auto-dismiss timer.
  const x = Math.max(0, Math.floor(snapshot.x) - 8);
  const y = Math.max(0, Math.floor(snapshot.y) - 16);
  const right = Math.min(viewport.width, Math.ceil(snapshot.x + snapshot.width) + 8);
  const bottom = Math.min(viewport.height, Math.ceil(snapshot.y + snapshot.height) + 16);
  return page.screenshot({ ...options, clip: { x, y, width: right - x, height: bottom - y }, animations: "disabled" });
}

export async function captureLiveElement(page, locator, options) {
  try {
    return await locator.screenshot(options);
  } catch (error) {
    // A deferred render can replace the node after Playwright resolves the locator.
    if (page.isClosed() || !/^locator\.screenshot: Element is not attached to the DOM(?:\r?\n|$)/.test(error?.message)) {
      throw error;
    }
    console.warn("Elemento reemplazado durante la captura; una unica recaptura: " + options.path);
    return locator.screenshot(options);
  }
}
