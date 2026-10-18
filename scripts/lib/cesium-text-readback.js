// The glyph measurement canvas is temporary and immediately read back to CPU.
export function enableCesiumTextReadback(source, filename) {
  if (!/[/\\]@cesium[/\\]engine[/\\]Source[/\\]Core[/\\]writeTextToCanvas\.js$/.test(filename)) return source;
  const context = 'const ctx = canvas.getContext("2d");';
  if (source.split(context).length !== 2 || !source.includes("ctx.getImageData(0, 0, width, height)")) {
    throw new Error("Cesium text measurement changed; review the readback hint before publishing.");
  }
  return source.replace(context, 'const ctx = canvas.getContext("2d", { willReadFrequently: true });');
}
