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
