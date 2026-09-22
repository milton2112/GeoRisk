export function replaceKnockoutGlobalLookup(source, filename) {
  if (!/[/\\]@cesium[/\\]widgets[/\\]Source[/\\]ThirdParty[/\\]knockout-3\.5\.1\.js$/.test(filename)) return source;
  const lookup = '(0,eval)("this")';
  if (source.split(lookup).length !== 2) {
    throw new Error("Knockout global lookup changed; review CSP compatibility before publishing.");
  }
  return source.replace(lookup, "globalThis");
}
