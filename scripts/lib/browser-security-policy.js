export const CONTENT_SECURITY_POLICY = [
  "default-src 'none'",
  "base-uri 'none'",
  "object-src 'none'",
  "form-action 'none'",
  "script-src 'self' 'wasm-unsafe-eval' https://cesium.com/downloads/cesiumjs/releases/1.127/Build/Cesium/Workers/",
  "script-src-attr 'none'",
  "style-src 'self' 'unsafe-inline' https://cesium.com/downloads/cesiumjs/releases/1.127/Build/Cesium/Widgets/",
  "img-src 'self' data: blob: https://cesium.com/downloads/cesiumjs/releases/1.127/Build/Cesium/Assets/ https://services.arcgisonline.com https://tile.openstreetmap.org",
  "connect-src 'self' https://cesium.com/downloads/cesiumjs/releases/1.127/Build/Cesium/ https://services.arcgisonline.com https://tile.openstreetmap.org https://api.gdeltproject.org",
  "worker-src 'self' blob: https://cesium.com/downloads/cesiumjs/releases/1.127/Build/Cesium/Workers/",
  "frame-src 'self'",
  "font-src 'self' data:",
  "manifest-src 'self'"
].join("; ");

export const BROWSER_SECURITY_HEADERS = Object.freeze({
  "Content-Security-Policy": `${CONTENT_SECURITY_POLICY}; frame-ancestors 'self'`,
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Frame-Options": "SAMEORIGIN",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()"
});

export function renderStaticHostingHeaders() {
  return ["/*", ...Object.entries(BROWSER_SECURITY_HEADERS).map(([name, value]) => `  ${name}: ${value}`), ""].join("\n");
}

export function assertBrowserSecurityPolicy(html) {
  const tag = `<meta http-equiv="Content-Security-Policy" content="${CONTENT_SECURITY_POLICY}">`;
  const position = html.indexOf(tag);
  if (position < 0 || position > html.search(/<(?:script|link)\b/i)) {
    throw new Error("index.html CSP is missing, stale or placed after resource loading.");
  }
}
