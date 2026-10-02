import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";

const source = await fs.readFile(new URL("../../script.js", import.meta.url), "utf8");
const loader = source.slice(source.indexOf("async function ensureDeferredUiModule("), source.indexOf("const QUALITY_PRESET_OVERRIDES"));

function fixture() {
  const requests = [];
  const messages = [];
  const warnings = [];
  const pending = [];
  let refreshes = 0;
  const context = vm.createContext({
    DEFERRED_UI_MODULES: { exportShare: "./app-export-share.js?v=fixture", news: "./app-news-ui.js?v=fixture" },
    deferredUiModulePromises: new Map(), deferredUiModuleFailures: new Map(), currentLanguage: "es",
    uiPolish: { showToast: message => messages.push(message) },
    console: { warn: (...args) => warnings.push(args) },
    refreshDeferredUiGlobals() { refreshes += 1; },
    importModule(url) {
      requests.push(url);
      return new Promise((resolve, reject) => pending.push({ resolve, reject }));
    }
  });
  vm.runInContext(loader.replace("import(loadUrl)", "importModule(loadUrl)"), context);
  return { context, requests, messages, warnings, pending, refreshes: () => refreshes,
    load: name => context.ensureDeferredUiModule(name) };
}

const test = fixture();
assert.equal(await test.load("unknown"), undefined);
for (const name of ["__proto__", "constructor", "toString"]) assert.equal(await test.load(name), undefined);
assert.equal(test.requests.length, 0, "unknown modules cannot trigger downloads");
const first = test.load("exportShare");
const concurrent = test.load("exportShare");
assert.equal(test.requests.length, 1, "simultaneous consumers share a single download");
test.pending[0].reject(new TypeError("Failed to fetch dynamically imported module"));
assert.equal(await first, false);
assert.equal(await concurrent, false);
assert.equal(test.context.deferredUiModulePromises.has("exportShare"), false,
  "failed downloads must not remain cached for the entire session");
assert.equal(test.warnings.length, 1);
assert.equal(test.messages.length, 1, "one failure must not duplicate its feedback across consumers");
assert.match(test.messages[0], /Revisa tu conexion/);
assert.equal(test.requests.length, 1, "failure must not trigger speculative retries");

const retry = test.load("exportShare");
const retryConcurrent = test.load("exportShare");
assert.equal(test.requests.length, 2, "another request after failure can retry");
assert.equal(test.requests[1], test.requests[0] + "&retry=1", "one bounded URL variant bypasses the browser's failed import cache");
test.pending[1].resolve({});
assert.equal(await retry, true);
assert.equal(await retryConcurrent, true);
assert.equal(await test.load("exportShare"), true);
assert.equal(test.requests.length, 2, "successful modules are reused without further downloads");
assert.equal(test.refreshes(), 2);

test.context.currentLanguage = "en";
const news = test.load("news");
test.pending[2].reject(new TypeError("error loading dynamically imported module"));
assert.equal(await news, false);
assert.match(test.messages[1], /Check your connection/);
assert.equal(await test.load("exportShare"), true, "one failed module must not evict another successful module");
test.context.uiPolish = {};
const noToast = test.load("news");
test.pending[3].reject(new TypeError("Importing a module script failed"));
assert.equal(await noToast, false, "early startup remains safe without the optional toast module");
assert.equal(test.requests.length, 4);
assert.equal(test.context.deferredUiModulePromises.size, 1);

const exhausted = fixture();
for (let attempt = 0; attempt < 3; attempt += 1) {
  const result = exhausted.load("news");
  exhausted.pending[attempt].reject(new TypeError("Failed to fetch dynamically imported module"));
  assert.equal(await result, false);
}
assert.match(exhausted.messages.at(-1), /Recarga la pagina/);
for (let attempt = 0; attempt < 10; attempt += 1) assert.equal(await exhausted.load("news"), false);
assert.equal(exhausted.requests.length, 3, "failed modules cannot grow an unbounded browser module cache");
assert.deepEqual(exhausted.requests, ["./app-news-ui.js?v=fixture", "./app-news-ui.js?v=fixture&retry=1", "./app-news-ui.js?v=fixture&retry=2"]);
assert.equal(exhausted.context.deferredUiModuleFailures.size, 1);
assert.equal(exhausted.context.deferredUiModulePromises.size, 0);

for (const error of [new SyntaxError("Broken module"), new TypeError("Invalid runtime state")]) {
  const evaluation = fixture();
  const result = evaluation.load("news");
  evaluation.pending[0].reject(error);
  assert.equal(await result, false);
  assert.match(evaluation.messages[0], /Recarga la pagina/);
  assert.equal(await evaluation.load("news"), false);
  assert.equal(evaluation.requests.length, 1, "code failures must not re-evaluate possibly partial module side effects");
}
console.log("Deferred UI recovery: OK");
