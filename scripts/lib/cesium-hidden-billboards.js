// Keep texture work/readiness; defer native buffer and shader work until a billboard is shown.
export function skipHiddenCesiumBillboards(source, filename) {
  if (!/[/\\]@cesium[/\\]engine[/\\]Source[/\\]Scene[/\\]BillboardCollection\.js$/.test(filename)) return source;
  const newline = source.includes("\r\n") ? "\r\n" : "\n";
  const lines = text => text.replace(/\n/g, newline);
  const readiness = "  let allBillboardsReady = true;";
  const shown = lines("    if (billboard.show) {\n      allBillboardsReady = allBillboardsReady && billboard.ready;\n    }");
  const dirty = lines("    if (billboard.textureDirty) {\n      this._updateBillboard(billboard, IMAGE_INDEX_INDEX);\n    }");
  const afterAtlas = lines("  if (!defined(textureAtlas.texture)) {\n    // Can't write billboard vertices until the texture atlas\n    // has been updated once\n    return;\n  }\n\n  updateMode(this, frameState);");
  const queue = "    return textureAtlas.update(frameState.context);";
  if (source.includes("hasShownBillboards") || [readiness, shown, dirty, afterAtlas, queue].some(text => source.split(text).length !== 2) ||
      source.indexOf(queue) > source.indexOf(afterAtlas)) {
    throw new Error("Cesium billboard lifecycle changed; review hidden collection deferral before publishing.");
  }
  return source.replace(readiness, readiness + newline + "  let hasShownBillboards = false;")
    // Keep the native queue deduplicated while vertex writes are deferred.
    .replace(dirty, dirty.replace("      this._updateBillboard(billboard, IMAGE_INDEX_INDEX);", "      this._updateBillboard(billboard, IMAGE_INDEX_INDEX);" + newline + "      billboard._dirty = true;"))
    .replace(shown, shown.replace("      allBillboardsReady", "      hasShownBillboards = true;" + newline + "      allBillboardsReady"))
    .replace(afterAtlas, afterAtlas.replace("  updateMode(this, frameState);", lines(
      "  if (billboardsLength > 0 && !hasShownBillboards) {\n    this._allBillboardsReady = allBillboardsReady;\n    return;\n  }\n\n  updateMode(this, frameState);")));
}
