import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";

const source = await fs.readFile("script.js", "utf8");
const lifecycle = source.slice(source.indexOf("let offlineRegistrationEpoch ="), source.indexOf("async function init()"));
const clearCache = source.slice(source.indexOf("async function clearLocalGeoRiskCache()"), source.indexOf("function getIntroCoverageStats()"));
class Target extends EventTarget {
  emit(name) { this.dispatchEvent(new Event(name)); }
}
function worker(version = "current", pathname = "/GeoRisk/sw.js") {
  return Object.assign(new Target(), {
    scriptURL: "https://example.test" + pathname + "?v=" + version,
    state: "activated", messages: [],
    postMessage(message) { this.messages.push(message); }
  });
}
function fixture() {
  const elements = new Map();
  for (const id of ["offline-status", "offline-update-notice", "offline-update-title", "offline-update-apply", "offline-update-dismiss"]) {
    elements.set(id, Object.assign(new Target(), { hidden: true, textContent: "", disabled: false }));
  }
  const registration = Object.assign(new Target(), {
    scope: "https://example.test/GeoRisk/", active: null, waiting: null, installing: null,
    unregisters: 0, async unregister() { this.unregisters += 1; return true; }
  });
  const serviceWorker = Object.assign(new Target(), {
    controller: null, calls: [],
    async register(...args) { this.calls.push(args); return registration; },
    async getRegistration(scope) { assert.equal(scope, registration.scope); return registration; }
  });
  let reloads = 0;
  const timers = new Map();
  const context = vm.createContext({
    URL, APP_VERSION: "current", currentLanguage: "es", console,
    navigator: { serviceWorker }, document: { getElementById: id => elements.get(id) },
    window: { location: { href: "https://example.test/GeoRisk/index.html", reload() { reloads += 1; } } },
    setTimeout(callback) { const id = {}; timers.set(id, callback); return id; },
    clearTimeout(id) { timers.delete(id); }, updateOfflineCacheSizeLabel: async () => {},
    updateAppStatusPanel() {}, resourceCache: new Map(), geoJsonCache: new Map(), openProductModal() {}
  });
  vm.runInContext(lifecycle + clearCache, context);
  return { context, serviceWorker, registration, elements, timers, reloads: () => reloads };
}

const first = fixture();
await first.context.registerServiceWorker();
assert.equal(first.registration.unregisters, 0);
assert.equal(first.serviceWorker.calls.length, 1, "register ya comprueba actualizaciones");
assert.equal(first.serviceWorker.calls[0][1].updateViaCache, "none");
first.registration.active = first.serviceWorker.controller = worker();
first.serviceWorker.emit("controllerchange");
assert.equal(first.reloads(), 0, "la primera activacion no debe recargar");
assert.equal(first.elements.get("offline-update-notice").hidden, true);

const update = fixture();
update.registration.active = update.serviceWorker.controller = worker();
update.registration.waiting = worker("next");
await update.context.registerServiceWorker();
assert.equal(update.elements.get("offline-update-notice").hidden, false);
assert.equal(update.registration.waiting.messages.length, 0, "no activar sin consentimiento");
update.elements.get("offline-update-dismiss").emit("click");
assert.equal(update.elements.get("offline-update-notice").hidden, true);
assert.equal(update.reloads(), 0);
await update.context.registerServiceWorker();
update.elements.get("offline-update-apply").emit("click");
update.elements.get("offline-update-apply").emit("click");
assert.equal(update.registration.waiting.messages.length, 1, "doble click no duplica la activacion");
update.serviceWorker.controller = update.registration.waiting;
update.registration.waiting = null;
update.serviceWorker.emit("controllerchange");
update.serviceWorker.emit("controllerchange");
assert.equal(update.reloads(), 1);
assert.equal(update.timers.size, 0);

const failed = fixture();
failed.registration.active = failed.serviceWorker.controller = worker("old");
failed.serviceWorker.register = async () => { throw new Error("offline"); };
await failed.context.registerServiceWorker();
assert.equal(failed.registration.unregisters, 0, "el fallo conserva el worker anterior");
assert.match(failed.elements.get("offline-status").textContent, /conserva/);
assert.equal(failed.elements.get("offline-update-notice").hidden, true, "un controller viejo no es una actualizacion lista");

const otherTab = fixture();
otherTab.registration.active = otherTab.serviceWorker.controller = worker();
await otherTab.context.registerServiceWorker();
otherTab.registration.active = otherTab.serviceWorker.controller = worker("next");
otherTab.serviceWorker.emit("controllerchange");
assert.equal(otherTab.reloads(), 0, "la confirmacion de otra pestaña no debe recargar esta");
assert.equal(otherTab.elements.get("offline-update-notice").hidden, false);
otherTab.elements.get("offline-update-apply").emit("click");
assert.equal(otherTab.reloads(), 1);

const stalled = fixture();
stalled.registration.active = stalled.serviceWorker.controller = worker();
stalled.registration.waiting = worker("next");
await stalled.context.registerServiceWorker();
stalled.elements.get("offline-update-apply").emit("click");
[...stalled.timers.values()][0]();
assert.equal(stalled.reloads(), 0);
assert.equal(stalled.elements.get("offline-update-apply").disabled, false);
assert.match(stalled.elements.get("offline-status").textContent, /reintentar/);
await stalled.context.clearLocalGeoRiskCache();
assert.equal(stalled.registration.unregisters, 1);
assert.equal(stalled.elements.get("offline-update-notice").hidden, true);
stalled.serviceWorker.controller = worker("next");
stalled.serviceWorker.emit("controllerchange");
assert.equal(stalled.reloads(), 0, "limpiar debe quitar listeners y reintentos");

const unrelated = fixture();
unrelated.registration.active = worker("old", "/other/sw.js");
await unrelated.context.clearLocalGeoRiskCache();
assert.equal(unrelated.registration.unregisters, 0, "no tocar registros de otras apps");
unrelated.serviceWorker.getRegistration = async () => ({ scope: "https://example.test/", active: worker() });
assert.equal(await unrelated.context.getLocalServiceWorkerRegistration(), null, "no confundir un scope padre");

console.log("service-worker-lifecycle.test.js ok");
