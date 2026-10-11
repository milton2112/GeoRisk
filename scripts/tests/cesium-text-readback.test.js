import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";
import { enableCesiumTextReadback } from "../lib/cesium-text-readback.js";

const sourceUrl = new URL("../../node_modules/@cesium/engine/Source/Core/writeTextToCanvas.js", import.meta.url);
const filename = sourceUrl.pathname;
const upstream = await fs.readFile(sourceUrl, "utf8");
const patched = enableCesiumTextReadback(upstream, filename);
assert.equal(enableCesiumTextReadback(upstream, filename.replaceAll("/", "\\")), patched);
assert.equal(enableCesiumTextReadback(upstream, "unrelated/writeTextToCanvas.js"), upstream);
for (const drift of [upstream.replace('const ctx = canvas.getContext("2d");', ""),
  upstream + '\nconst ctx = canvas.getContext("2d");', upstream.replace("ctx.getImageData(0, 0, width, height)", "readOtherPixels()")]) {
  assert.throws(() => enableCesiumTextReadback(drift, filename), /text measurement changed/);
}

function measure(source, text, stroke, fill) {
  const calls = [];
  const state = { document: {
    defaultView: { getComputedStyle: () => ({ getPropertyValue: () => "14px" }) },
    createElement: () => ({ getContext(type, options) {
      calls.push({ type, options });
      return { fillRect() {}, strokeText() {}, fillText() {}, getImageData(_x, _y, width, height) {
        const data = new Uint8ClampedArray(width * height * 4).fill(255);
        data[(width * 12 + 51) * 4] = 0;
        data[(width * 27 + 62) * 4] = 0;
        return { data };
      } };
    } })
  } };
  const from = source.indexOf("function measureText(");
  const to = source.indexOf("let imageSmoothingEnabledName;", from);
  assert.ok(from >= 0 && to > from);
  vm.createContext(state);
  vm.runInContext(source.slice(from, to), state);
  const dimensions = state.measureText({ measureText: () => ({ width: 18.5 }), canvas: {}, lineWidth: 2 },
    text, "14px sans-serif", stroke, fill);
  return { dimensions: JSON.parse(JSON.stringify(dimensions)), calls };
}
for (const text of ["j", "España", " "]) for (const [stroke, fill] of [[false, true], [true, false], [true, true]]) {
  const before = measure(upstream, text, stroke, fill);
  const after = measure(patched, text, stroke, fill);
  assert.deepEqual(after.dimensions, before.dimensions, "pixel scan and spacing metrics stay unchanged");
  assert.equal(after.calls.length, before.calls.length, "no additional canvas/context allocation");
  for (const call of before.calls) assert.equal(call.options, undefined, "upstream measurement originally lacks the readback hint");
  for (const call of after.calls) {
    assert.equal(call.type, "2d");
    assert.equal(call.options.willReadFrequently, true);
  }
}
console.log("cesium-text-readback.test.js ok: actual upstream measurement, scoped hint, unchanged metrics and fail-closed drift");
