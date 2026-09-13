// Cesium's release build omits these development-only validation blocks.
export function stripCesiumDebugPragmas(source, file = "Cesium source") {
  let depth = 0;
  const result = [];
  for (const line of source.split(/\r?\n/)) {
    const marker = line.match(/^\s*\/\/>>include(Start|End)\(\s*['"]debug['"](?:\s*,\s*pragmas\.debug)?\s*\);?\s*$/);
    if (marker) {
      depth += marker[1] === "Start" ? 1 : -1;
      if (depth < 0) throw new Error(`Unmatched Cesium debug end in ${file}`);
    } else {
      if (/\/\/>>include(?:Start|End)\(.*['"]debug['"]/.test(line)) {
        throw new Error(`Unsupported Cesium debug pragma in ${file}`);
      }
      if (!depth) result.push(line);
    }
  }
  if (depth) throw new Error(`Unclosed Cesium debug block in ${file}`);
  return result.join("\n");
}
