import path from "node:path";
import { buildStartupCountryIndex } from "./lib/startup-index.js";
import { readJsonWithRetry, writeJsonWithRetry } from "./lib/resilient-fs.js";

const projectRoot = path.resolve(process.cwd());
const fullPath = path.join(projectRoot, "data", "countries_full.json");
const indexPath = path.join(projectRoot, "data", "countries_index.json");

const countries = await readJsonWithRetry(fullPath);
const index = buildStartupCountryIndex(countries);
await writeJsonWithRetry(indexPath, index, { spaces: 0 });

console.log(`Indice inicial compactado: ${Object.keys(index).length} entradas`);
