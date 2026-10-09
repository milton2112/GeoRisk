import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";
import NativeBillboardCollection from "../../node_modules/@cesium/engine/Source/Scene/BillboardCollection.js";
import { skipHiddenCesiumBillboards } from "../lib/cesium-hidden-billboards.js";

const filename = "node_modules/@cesium/engine/Source/Scene/BillboardCollection.js";
const native = await fs.readFile(filename, "utf8");
assert.equal(skipHiddenCesiumBillboards(native, "elsewhere/BillboardCollection.js"), native);
for (const text of ["  let allBillboardsReady = true;", "    if (billboard.show) {", "    if (billboard.textureDirty) {", "  updateMode(this, frameState);", "    return textureAtlas.update(frameState.context);"]) {
  assert.throws(() => skipHiddenCesiumBillboards(native.replace(text, "changed"), filename), /lifecycle changed/);
}
assert.throws(() => skipHiddenCesiumBillboards(skipHiddenCesiumBillboards(native, filename), filename), /lifecycle changed/);
function updateFrom(source) {
  const start = source.indexOf("BillboardCollection.prototype.update =");
  const end = source.indexOf("\n/**", start);
  function BillboardCollection() {}
  const scope = { BillboardCollection, removeBillboards() {}, defined: value => value !== undefined && value !== null,
    attributeLocationsInstanced: {}, attributeLocationsBatched: {}, getIndexBufferInstanced() {}, getIndexBufferBatched() {},
    IMAGE_INDEX_INDEX: 0, updateMode() { throw new Error("visible native path reached"); } };
  vm.runInNewContext(source.slice(start, end), scope);
  return BillboardCollection.prototype.update;
}
function fixture(billboards, texture = {}) {
  let atlasUpdates = 0;
  let dirtyUpdates = 0;
  const frame = { context: { instancedArrays: true }, afterRender: [] };
  const collection = { show: true, _billboards: billboards, _allBillboardsReady: false,
    _textureAtlas: { texture, update(context) { assert.equal(context, frame.context); atlasUpdates++; } },
    _updateBillboard() { dirtyUpdates++; }, isDestroyed: () => false };
  return { frame, collection, counts: () => ({ atlasUpdates, dirtyUpdates }) };
}
const update = updateFrom(skipHiddenCesiumBillboards(native, filename));
const pendingImage = new NativeBillboardCollection();
const pendingBillboard = pendingImage.add({ show: false });
pendingBillboard.textureDirty = true; // Native async image completion can set this without _dirty.
pendingImage._textureAtlas = { texture: {} };
const pendingFrame = { context: { instancedArrays: true }, afterRender: [] };
for (let i = 0; i < 3; i++) update.call(pendingImage, pendingFrame);
assert.equal(pendingImage._billboardsToUpdateIndex, 1, "deferred image must enter the real native queue only once");
assert.equal(pendingImage._billboardsToUpdate.length, 1, "hidden frames must not accumulate duplicate queue entries");
assert.equal(pendingBillboard._dirty, true, "retain the pending native write until visible");
assert.equal(pendingBillboard.textureDirty, true, "do not discard image changes before vertex writes");
pendingBillboard.show = true;
assert.throws(() => update.call(pendingImage, pendingFrame), /visible native path reached/);
assert.equal(pendingImage._billboardsToUpdateIndex, 1, "reactivation reuses the same pending native write");
for (const newline of ["\n", "\r\n"]) {
  const source = native.replace(/\r?\n/g, newline);
  const test = fixture([{ show: false, ready: true }]);
  updateFrom(skipHiddenCesiumBillboards(source, filename)).call(test.collection, test.frame);
  assert.equal(test.collection._allBillboardsReady, true);
}
const hidden = fixture([{ show: false, ready: false, textureDirty: true }]);
assert.doesNotThrow(() => update.call(hidden.collection, hidden.frame), "all-hidden glyphs must stop before native buffer/shader work");
assert.equal(hidden.collection._allBillboardsReady, true, "readiness considers visible billboards");
assert.equal(hidden.frame.afterRender.length, 1, "keep the native texture update queued");
hidden.frame.afterRender[0]();
assert.deepEqual(hidden.counts(), { atlasUpdates: 1, dirtyUpdates: 1 });
hidden.collection._billboards[0].show = true;
assert.throws(() => update.call(hidden.collection, hidden.frame), /visible native path reached/, "a later show resumes the native path, including unready images");

for (const billboards of [[], [{ show: true, ready: true }], [{ show: false }, { show: true, ready: false }]]) {
  const test = fixture(billboards);
  assert.throws(() => update.call(test.collection, test.frame), /visible native path reached/);
}
const noTexture = fixture([{ show: false }], undefined);
noTexture.collection._textureAtlas.texture = undefined;
update.call(noTexture.collection, noTexture.frame);
assert.equal(noTexture.collection._allBillboardsReady, false, "preserve missing-atlas readiness and native update callback");
assert.equal(noTexture.frame.afterRender.length, 1);
const destroyed = fixture([{ show: false }]);
destroyed.collection.isDestroyed = () => true;
update.call(destroyed.collection, destroyed.frame);
destroyed.frame.afterRender[0]();
assert.equal(destroyed.counts().atlasUpdates, 0);
const disabled = fixture([{ show: false }]);
disabled.collection.show = false;
update.call(disabled.collection, disabled.frame);
assert.equal(disabled.frame.afterRender.length, 0, "preserve native disabled-collection behavior");
console.log("cesium-hidden-billboards.test.js ok: native hidden/visible/reactivation/atlas/readiness/teardown paths");
