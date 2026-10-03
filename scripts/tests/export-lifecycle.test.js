import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";

const source = (await fs.readFile(new URL("../../app-export-share.js", import.meta.url), "utf8"))
  .replace('import { exportAssets } from "./vendor/exports/manifest.js";', "")
  .replaceAll("import.meta.url", '"https://example.org/GeoRisk/app-export-share.js"')
  .replace(/export \{[\s\S]*?\};\s*$/, "");

function deferred() {
  let resolve;
  const promise = new Promise(done => { resolve = done; });
  return { promise, resolve };
}

function fixture() {
  const captures = [], canvases = [], renders = [], downloads = [], messages = [], loads = [], warnings = [];
  const config = { ready: true, libraryWait: null, renderWait: null, libraryError: false, buildError: false, renderError: false, encodeError: false, pdfError: false };
  const context = vm.createContext({
    console: { warn: (...args) => warnings.push(args) },
    document: { createElement(tag) {
      assert.equal(tag, "a");
      return { click() { downloads.push({ format: "image", filename: this.download }); } };
    } },
    devicePixelRatio: 1,
    html2canvas: async (node, options) => {
      renders.push({ node, options });
      if (config.renderWait) await config.renderWait.promise;
      if (config.renderError) throw new Error("Canvas capture failed");
      const canvas = { width: 960, height: 600, toDataURL(type) {
        assert.equal(type, "image/png");
        if (config.encodeError) throw new Error("Canvas encoding failed");
        return "data:image/png;base64,fixture";
      } };
      canvases.push(canvas);
      return canvas;
    },
    jspdf: { jsPDF: function(options) {
      this.addImage = () => {};
      this.save = filename => {
        if (config.pdfError) throw new Error("PDF save failed");
        downloads.push({ format: "pdf", filename, options });
      };
    } }
  });
  context.window = context;
  vm.runInContext(source, context);
  context.ensureExportLibraries = async format => {
    loads.push(format);
    if (config.libraryWait) await config.libraryWait.promise;
    if (config.libraryError) throw new Error("Library verification failed");
    return config.ready;
  };
  context.buildReportCaptureNode = () => {
    if (config.buildError) throw new Error("Could not clone report");
    const capture = { removed: false, remove() { this.removed = true; } };
    captures.push(capture);
    return capture;
  };
  const options = { language: "es", showToast: message => messages.push(message) };
  const tools = context.GeoRiskExportShare;
  return { captures, canvases, renders, downloads, messages, loads, warnings, config, options,
    image: node => tools.exportNodeAsImage(node, "fixture.png", options),
    pdf: node => tools.exportNodeAsPdf(node, "fixture.pdf", options) };
}

const test = fixture();
const node = { id: "left-panel" };
test.config.libraryWait = deferred();
const first = test.image(node);
const duplicate = test.pdf(node);
assert.equal(test.loads.length, 1, "a pending export must not start another format/library request");
assert.equal(await duplicate, false);
assert.match(test.messages[0], /exportacion en curso/i);
assert.equal(test.captures.length, 0, "do not clone before libraries are ready");
test.config.libraryWait.resolve();
assert.equal(await first, true);
assert.equal(test.captures.length, 1);
assert.equal(test.captures[0].removed, true);
assert.equal(test.downloads.length, 1);
assert.equal(await test.pdf(node), true, "a later explicit export can use the other format");
assert.deepEqual(test.loads, ["image", "pdf"]);
assert.equal(test.downloads.length, 2);
assert.equal(test.downloads[1].options.orientation, "landscape");
assert.equal(test.renders[0].options.scale, 1.8);
assert.equal(test.renders[1].options.scale, 2);
assert.ok(test.captures.every(capture => capture.removed));
assert.ok(test.canvases.every(canvas => canvas.width === 0 && canvas.height === 0), "finished exports discard their pixel buffer dimensions");

const rendering = fixture();
rendering.config.renderWait = deferred();
const running = rendering.image(node);
await new Promise(setImmediate);
assert.equal(rendering.renders.length, 1);
assert.equal(await rendering.image(node), false);
assert.equal(await rendering.pdf(node), false);
assert.equal(rendering.captures.length, 1, "one capture DOM/canvas while rendering is pending");
rendering.config.renderWait.resolve();
assert.equal(await running, true);
assert.equal(rendering.downloads.length, 1);
assert.ok(rendering.canvases.every(canvas => canvas.width === 0 && canvas.height === 0));

for (const failure of ["ready", "libraryError", "buildError", "renderError", "encodeError", "pdfError"]) {
  const failed = fixture();
  failed.config[failure] = failure !== "ready";
  assert.equal(await failed.pdf(node), false, "export failure settles without an unhandled rejection: " + failure);
  assert.equal(failed.downloads.length, 0);
  assert.ok(failed.captures.every(capture => capture.removed));
  assert.ok(failed.canvases.every(canvas => canvas.width === 0 && canvas.height === 0));
  assert.equal(failed.messages.length, 1);
  failed.config[failure] = failure === "ready";
  assert.equal(await failed.image(node), true, "failure releases the lock: " + failure);
  assert.equal(failed.downloads.length, 1);
  assert.ok(failed.captures.every(capture => capture.removed));
}

const empty = fixture();
assert.equal(await empty.image(null), false);
assert.equal(empty.loads.length, 0);
empty.options.language = "en";
empty.config.libraryWait = deferred();
const english = empty.pdf(node);
assert.equal(await empty.image(node), false);
assert.match(empty.messages[0], /export is already in progress/i);
empty.config.libraryWait.resolve();
assert.equal(await english, true);

for (const format of ["image", "pdf"]) {
  const changed = fixture();
  let current = true;
  changed.options.isCurrent = () => current;
  changed.config.libraryWait = deferred();
  const originalView = { id: "left-panel", country: "ARG" };
  const exportPending = changed[format](originalView);
  current = false;
  originalView.country = "BRA";
  changed.config.libraryWait.resolve();
  assert.equal(await exportPending, false, "a changed view must not be exported with the original context: " + format);
  assert.equal(changed.captures.length, 0, "do not allocate a stale report or canvas");
  assert.equal(changed.downloads.length, 0);
  assert.match(changed.messages[0], /vista cambio/i);
  current = true;
  assert.equal(await changed[format](originalView), true, "a new explicit action can export the current view");
  assert.equal(changed.downloads.length, 1);
}

const stale = fixture();
stale.options.language = "en";
stale.options.isCurrent = () => false;
assert.equal(await stale.pdf(node), false);
assert.equal(stale.loads.length, 0, "changes while the feature module was loading must not start library downloads");
assert.equal(stale.captures.length, 0);
assert.match(stale.messages[0], /view changed/i);

const captured = fixture();
let sameView = true;
captured.options.isCurrent = () => sameView;
captured.config.renderWait = deferred();
const snapshot = captured.image(node);
await new Promise(setImmediate);
assert.equal(captured.captures.length, 1);
sameView = false;
captured.config.renderWait.resolve();
assert.equal(await snapshot, true, "after capture starts, the detached report snapshot is already consistent");
assert.equal(captured.downloads.length, 1);
assert.ok(captured.canvases.every(canvas => canvas.width === 0 && canvas.height === 0));
console.log("export-lifecycle.test.js ok: bounded capture, duplicate actions, failures and recovery");
