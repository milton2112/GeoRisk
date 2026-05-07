import fs from "fs-extra";
import path from "node:path";
import { buildStartupCountryIndex } from "./lib/startup-index.js";

const projectRoot = path.resolve(process.cwd());
const fullPath = path.join(projectRoot, "data", "countries_full.json");
const indexPath = path.join(projectRoot, "data", "countries_index.json");

const countries = await fs.readJson(fullPath);
const index = buildStartupCountryIndex(countries);
await fs.writeJson(indexPath, index, { spaces: 0 });

console.log(`Indice inicial compactado: ${Object.keys(index).length} entradas`);
