import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";

const source = (await fs.readFile(new URL("../../app-export-share.js", import.meta.url), "utf8"))
  .replace('import { exportAssets } from "./vendor/exports/manifest.js";', "")
  .replaceAll("import.meta.url", '"https://example.com/GeoRisk/app-export-share.js"')
  .replace(/export \{[\s\S]*?\};\s*$/, "");

function fixture(navigator = {}, language = "es") {
  const messages = [];
  const diagnostics = [];
  const context = vm.createContext({
    window: {}, navigator,
    console: { error: (...args) => diagnostics.push(args), warn: (...args) => diagnostics.push(args) },
    document: new Proxy({}, { get() { throw new Error("Sharing must not load export tools or create DOM"); } })
  });
  vm.runInContext(source, context);
  return {
    share: (title = "GeoRisk", text = "Contenido") => context.window.GeoRiskExportShare.shareText(title, text, {
      language, showToast: message => messages.push(message)
    }),
    messages, diagnostics
  };
}

{
  const copies = [];
  const test = fixture({
    share: async () => { throw new DOMException("User cancelled", "AbortError"); },
    clipboard: { writeText: async text => copies.push(text) }
  });
  await test.share();
  assert.equal(copies.length, 0, "cancelling native share must not overwrite the clipboard");
  assert.deepEqual(test.messages, [], "cancellation is not a successful copy or an error toast");
  assert.deepEqual(test.diagnostics, [], "cancellation is an expected user action");
}

{
  let copies = 0;
  const test = fixture({ share: async () => {}, clipboard: { writeText: async () => { copies++; } } });
  assert.equal(await test.share(), true);
  assert.equal(copies, 0, "native handoff does not also copy or claim delivery");
  assert.deepEqual(test.messages, []);
}

for (const language of ["es", "en"]) {
  const copies = [];
  const test = fixture({ clipboard: { writeText: async text => copies.push(text) } }, language);
  assert.equal(await test.share("Comparacion", "Argentina y Brasil"), true);
  assert.equal(copies.length, 1);
  assert.match(copies[0], /^Comparacion\n\nArgentina y Brasil\n\nGeoRisk - /);
  assert.deepEqual(test.messages, [language === "en" ? "Copied to clipboard." : "Copiado al portapapeles."]);
}

for (const native of [false, true]) {
  const copies = [];
  const test = fixture({
    ...(native ? { share: async () => { throw new DOMException("Permission denied", "NotAllowedError"); } } : {}),
    clipboard: { writeText: async text => { copies.push(text); throw new DOMException("Copy denied", "NotAllowedError"); } }
  });
  assert.equal(await test.share(), false, "denied clipboard settles without an unhandled rejection");
  assert.equal(copies.length, 1);
  assert.equal(test.messages.length, 1);
  assert.match(test.messages[0], /No se pudo compartir ni copiar/);
  assert.ok(!test.messages[0].includes("Copiado"), "failed persistence must not claim success");
}

{
  const test = fixture({}, "en");
  assert.equal(await test.share(), false);
  assert.deepEqual(test.messages, ["Could not share or copy in this browser."]);
}

{
  const copies = [];
  const test = fixture({
    share: async () => { throw new DOMException("Share blocked", "NotAllowedError"); },
    clipboard: { writeText: async text => copies.push(text) }
  });
  assert.equal(await test.share(), true, "a non-cancellation failure can still use the existing clipboard fallback");
  assert.equal(copies.length, 1);
  assert.deepEqual(test.messages, ["Copiado al portapapeles."]);
}

for (const destination of ["native", "clipboard"]) {
  let release;
  const pending = new Promise(resolve => { release = resolve; });
  let calls = 0;
  let held = true;
  const operation = async () => { calls++; if (held) await pending; };
  const test = fixture(destination === "native" ? { share: operation } : { clipboard: { writeText: operation } });
  const first = test.share();
  assert.equal(await test.share(), false, "repeated taps do not start concurrent sharing operations");
  assert.equal(calls, 1);
  release();
  assert.equal(await first, true);
  held = false;
  assert.equal(await test.share(), true, "settled sharing permits a later explicit action");
  assert.equal(calls, 2);
}

{
  let fail = true;
  const test = fixture({ clipboard: { writeText: () => {
    if (fail) throw new DOMException("Copy denied", "NotAllowedError");
  } } });
  assert.equal(await test.share(), false, "synchronous permission errors are handled too");
  fail = false;
  assert.equal(await test.share(), true, "failure does not leave sharing locked");
}

console.log("share-lifecycle.test.js ok");
