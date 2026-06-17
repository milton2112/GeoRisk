import assert from "node:assert/strict";
import { createLocalSmokeServer } from "../localSmokeServer.js";

const server = createLocalSmokeServer();
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));

try {
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;
  const indexResponse = await fetch(`${baseUrl}/?visual-smoke=1`, {
    headers: { "User-Agent": "GeoRiskVisualSmoke Mobile Safari" }
  });
  assert.equal(indexResponse.status, 200);
  const html = await indexResponse.text();
  assert.ok(html.includes('id="map"'), "pantalla debe incluir canvas/mapa");
  assert.ok(html.includes('id="mobile-panel-controls"'), "mobile debe tener navegacion compacta");
  assert.ok(html.includes('id="country-modal"'), "modales deben estar en shell");
  assert.ok(html.includes('id="compare-hub-panel"'), "hubs deben estar en shell");
  assert.ok(html.includes('id="news-hub-panel"'), "hub noticias debe estar en shell");
  assert.ok(html.includes('class="hub-summary-label"'), "hubs deben mostrar etiquetas comprensibles");
  assert.ok(html.includes('id="intro-start-button"'), "portada debe ofrecer una accion primaria visible");
  assert.ok(html.includes("app-store.js"), "store debe cargarse en shell visual");
  assert.ok(!html.includes("app-ui-polish.js"), "polish UI debe quedar diferido en shell visual");

  const cssResponse = await fetch(`${baseUrl}/style.css?v=visual-smoke`);
  assert.equal(cssResponse.status, 200);
  const css = await cssResponse.text();
  assert.ok(css.includes("@media (max-width: 820px)"), "CSS debe tener breakpoint mobile");
  assert.ok(css.includes("grid-template-columns: repeat(3, minmax(0, 1fr))"), "mobile debe mostrar navegacion inferior de tres acciones");
  assert.ok(css.includes("#news-hub-panel[open]"), "CSS debe dimensionar hubs abiertos");
  assert.ok(css.includes(":focus-visible"), "CSS debe mostrar foco accesible");
  assert.ok(css.includes(".loading-state"), "CSS debe exponer estado loading");
  assert.ok(css.includes(".offline-state"), "CSS debe exponer estado offline");
  assert.ok(css.includes("overflow-wrap: anywhere"), "CSS debe evitar desbordes de texto");

  const swResponse = await fetch(`${baseUrl}/sw.js?v=visual-smoke`);
  assert.equal(swResponse.status, 200);
  const sw = await swResponse.text();
  assert.ok(sw.includes("APP_SHELL"), "service worker debe entregar shell offline");
} finally {
  await new Promise(resolve => server.close(resolve));
}

console.log("browser-visual-smoke.test.js ok");
