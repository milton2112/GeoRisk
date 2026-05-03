import assert from "node:assert/strict";
import { createLocalSmokeServer } from "../localSmokeServer.js";

const server = createLocalSmokeServer();

await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));

try {
  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  const indexResponse = await fetch(`${baseUrl}/`);
  assert.equal(indexResponse.status, 200);
  assert.ok(indexResponse.headers.get("content-type").includes("text/html"));
  assert.ok((await indexResponse.text()).includes("GeoRisk"));

  const scriptResponse = await fetch(`${baseUrl}/script.js?v=smoke-test`);
  assert.equal(scriptResponse.status, 200);
  assert.ok(scriptResponse.headers.get("content-type").includes("text/javascript"));
  assert.ok((await scriptResponse.text()).includes("function renderCountry"));

  const countryIndexResponse = await fetch(`${baseUrl}/data/countries_index.json`);
  assert.equal(countryIndexResponse.status, 200);
  assert.ok(countryIndexResponse.headers.get("content-type").includes("application/json"));
  const countries = await countryIndexResponse.json();
  assert.ok(countries.ARG);
  assert.ok(countries.FRA);

  const missingResponse = await fetch(`${baseUrl}/no-existe.js`);
  assert.equal(missingResponse.status, 404);
} finally {
  await new Promise(resolve => server.close(resolve));
}

console.log("local-smoke-server.test.js ok");
