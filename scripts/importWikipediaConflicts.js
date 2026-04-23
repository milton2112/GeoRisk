import fs from "fs-extra";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { importWikipediaConflictDetails } from "./lib/wikipedia-conflicts.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const countriesPath = path.join(projectRoot, "data", "countries_full.json");
const outputPath = path.join(projectRoot, "data", "conflict_details.generated.json");

function getCliArg(name, fallback = null) {
  const match = process.argv.find(arg => arg.startsWith(`--${name}=`));
  if (!match) {
    return fallback;
  }
  return match.slice(name.length + 3);
}

function collectConflictNames(countriesData) {
  const counts = new Map();

  Object.values(countriesData || {}).forEach(country => {
    (country?.military?.conflicts || []).forEach(conflict => {
      if (conflict?.name) {
        counts.set(conflict.name, (counts.get(conflict.name) || 0) + 1);
      }
    });
  });

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "es"))
    .map(([name]) => name);
}

function prioritizeConflictNames(conflictNames) {
  const majorPriority = [
    "Primera Guerra Mundial",
    "Segunda Guerra Mundial",
    "Guerra de Corea",
    "Guerra de Vietnam",
    "Guerra del Golfo",
    "Guerra de Irak",
    "Guerra de Afganistan",
    "Guerra de los Seis Dias",
    "Guerra del Yom Kippur",
    "Guerra rusoucraniana",
    "Guerra de Argelia",
    "Guerra del Chaco",
    "Guerra del Pacifico",
    "Guerra de las Malvinas",
    "Guerra de Kosovo",
    "Primera Guerra del Congo",
    "Segunda guerra del Congo"
  ];

  const seen = new Set();
  const prioritized = [];

  majorPriority.forEach(name => {
    if (conflictNames.includes(name) && !seen.has(name)) {
      seen.add(name);
      prioritized.push(name);
    }
  });

  conflictNames.forEach(name => {
    if (!seen.has(name)) {
      seen.add(name);
      prioritized.push(name);
    }
  });

  return prioritized;
}

async function main() {
  const countriesData = await fs.readJson(countriesPath);
  const conflictNames = prioritizeConflictNames(collectConflictNames(countriesData));
  const limitValue = Number(getCliArg("limit", "0"));
  const offsetValue = Number(getCliArg("offset", "0"));
  const delayValue = Number(getCliArg("delay", "50"));
  const force = process.argv.includes("--force");

  const limit = Number.isFinite(limitValue) && limitValue > 0 ? limitValue : Infinity;
  const offset = Number.isFinite(offsetValue) && offsetValue > 0 ? offsetValue : 0;
  const delayMs = Number.isFinite(delayValue) && delayValue >= 0 ? delayValue : 50;
  const requestedNames = conflictNames.slice(offset, Number.isFinite(limit) ? offset + limit : undefined);

  console.log(`Conflictos detectados: ${conflictNames.length}`);
  console.log(`Lote solicitado: ${requestedNames.length} (offset ${offset})`);
  console.log(`Salida: ${outputPath}`);

  const result = await importWikipediaConflictDetails(requestedNames, {
    cachePath: outputPath,
    delayMs,
    force,
    limit: requestedNames.length
  });

  console.log(`Detalles importados con infobox: ${result.importedCount}`);
  console.log(`Entradas sin infobox util o sin pagina compatible: ${result.missingCount}`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
