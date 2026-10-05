const browserSelections = new WeakMap();

export function requestedBrowserChannel(env = process.env) {
  return env.PLAYWRIGHT_CHANNEL || (env.CI ? "chromium" : "chrome");
}

export async function launchProjectBrowser(browserType, { env = process.env, log = console.log } = {}) {
  const requestedChannel = requestedBrowserChannel(env);
  // CI and explicit channels must not silently substitute a different browser mode.
  const channels = env.CI || env.PLAYWRIGHT_CHANNEL ? [requestedChannel] : ["chrome", "headless-shell"];
  let lastError;
  for (const actualChannel of channels) {
    const options = actualChannel === "headless-shell" ? { headless: true } : { headless: true, channel: actualChannel };
    let browser;
    try {
      browser = await browserType.launch(options);
    } catch (error) {
      lastError = error;
      continue;
    }
    const selection = Object.freeze({ requestedChannel, actualChannel, browserVersion: browser.version() });
    browserSelections.set(browser, selection);
    log("Browser selection: " + JSON.stringify(selection));
    return browser;
  }
  throw new Error(`No se pudo iniciar el navegador solicitado (${requestedChannel}). Instala ese canal con Playwright o revisa PLAYWRIGHT_CHANNEL.`, { cause: lastError });
}

export function getBrowserSelection(browser) {
  return browserSelections.get(browser);
}
