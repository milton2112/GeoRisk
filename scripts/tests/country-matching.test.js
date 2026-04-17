import assert from "node:assert/strict";
import fs from "fs-extra";
import path from "path";
import { loadAliasConfig, createCountryAliasIndex, resolveCountryNameToCode } from "../lib/country-matching.js";

const projectRoot = path.resolve(process.cwd());
const countries = await fs.readJson(path.join(projectRoot, "data", "countries_full.json"));
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

assert.equal(resolveCountryNameToCode("France", countries, indexes), "FRA");
assert.equal(resolveCountryNameToCode("Russia", countries, indexes), "RUS");
assert.equal(resolveCountryNameToCode("French Guiana", countries, indexes), "GUF");
assert.equal(resolveCountryNameToCode("The Bahamas", countries, indexes), "BHS");
assert.equal(resolveCountryNameToCode("Republic of Serbia", countries, indexes), "SRB");
assert.equal(resolveCountryNameToCode("Macedonia", countries, indexes), "MKD");
assert.equal(resolveCountryNameToCode("Northern Cyprus", countries, indexes), "CYP");
assert.equal(resolveCountryNameToCode("United Republic of Tanzania", countries, indexes), "TZA");
assert.equal(resolveCountryNameToCode("West Bank", countries, indexes), "PSE");
assert.equal(resolveCountryNameToCode("Taiwan", countries, indexes), "TWN");
assert.equal(resolveCountryNameToCode("Somaliland", countries, indexes), "-99");
assert.equal(resolveCountryNameToCode("Antarctica", countries, indexes), "ATA");
assert.equal(resolveCountryNameToCode("Greenland", countries, indexes), "GRL");

console.log("country-matching.test.js ok");
