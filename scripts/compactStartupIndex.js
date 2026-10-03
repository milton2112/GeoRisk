import path from "node:path";
import { buildStartupCountryIndex } from "./lib/startup-index.js";
import { readJsonWithRetry, readFileWithRetry, writeFileWithRetry } from "./lib/resilient-fs.js";

const projectRoot = path.resolve(process.cwd());
const fullPath = path.join(projectRoot, "data", "countries_full.json");
const indexPath = path.join(projectRoot, "data", "countries_index.json");

const countries = await readJsonWithRetry(fullPath);
const index = buildStartupCountryIndex(countries);
const compact = `${JSON.stringify(index)}\n`;
let current = null;
try {
  current = await readFileWithRetry(indexPath, "utf8");
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
if (current !== compact) await writeFileWithRetry(indexPath, compact);

console.log(`Indice inicial compactado: ${Object.keys(index).length} entradas`);
