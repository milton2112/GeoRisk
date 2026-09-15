export function removeCesiumEvaluationToken(source, filename) {
  if (!/[/\\]@cesium[/\\]engine[/\\]Source[/\\]Core[/\\]Ion\.js$/.test(filename)) return source;
  const declaration = /const defaultAccessToken\s*=\s*"[^"\r\n]+";/g;
  if ([...source.matchAll(declaration)].length !== 1) {
    throw new Error("La declaracion del token de evaluacion de Cesium cambio; revisar antes de publicar.");
  }
  return source.replace(declaration, 'const defaultAccessToken = "";');
}
