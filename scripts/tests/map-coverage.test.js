import assert from "node:assert/strict";
import fs from "fs-extra";
import path from "path";
import { loadAliasConfig, createCountryAliasIndex, resolveCountryNameToCode } from "../lib/country-matching.js";

const projectRoot = path.resolve(process.cwd());
const countries = await fs.readJson(path.join(projectRoot, "data", "countries_full.json"));
const geoJson = await fs.readJson(path.join(projectRoot, "data", "world_countries.geo.json"));
const countryNames = await fs.readJson(path.join(projectRoot, "data", "raw", "country_names.json"));
const populationCsv = await fs.readFile(path.join(projectRoot, "data", "raw", "population.csv"), "utf8");
const lines = populationCsv.split(/\r?\n/).filter(Boolean);
const headerIndex = lines.findIndex(line => line.startsWith("\"Country Name\""));
const populationNames = {};
for (const line of lines.slice(headerIndex + 1)) {
  if (!line.startsWith("\"")) continue;
  const parts = line.trim().replace(/^"/, "").replace(/",?$/, "").split('","');
  if (parts.length < 2) continue;
  populationNames[parts[0]] = parts[1];
}

const aliasConfig = await loadAliasConfig();
const indexes = createCountryAliasIndex(countries, aliasConfig, { countryNames, populationNames });
const unmatched = geoJson.features
  .map(feature => feature?.properties?.name)
  .filter(Boolean)
  .filter(name => !resolveCountryNameToCode(name, countries, indexes));

assert.deepEqual(unmatched, []);

console.log("map-coverage.test.js ok");
