import fs from "fs-extra";
import path from "node:path";
import { normalizeVisibleValue } from "./lib/visible-data-corrections.js";

const projectRoot = path.resolve(process.cwd());
const fullPath = path.join(projectRoot, "data", "countries_full.json");
const countriesDir = path.join(projectRoot, "data", "countries");
const rawPaths = [
  path.join(projectRoot, "data", "raw", "history.json"),
  path.join(projectRoot, "data", "raw", "politics_details.json"),
  path.join(projectRoot, "data", "raw", "city_details.json")
];

async function updateJson(filePath) {
  const current = await fs.readJson(filePath);
  const updated = normalizeVisibleValue(current);
  if (JSON.stringify(current) === JSON.stringify(updated)) return false;
  await fs.writeJson(filePath, updated, { spaces: 0 });
  return true;
}

let updatedFiles = Number(await updateJson(fullPath));
for (const fileName of (await fs.readdir(countriesDir)).filter(file => file.endsWith(".json"))) {
  updatedFiles += Number(await updateJson(path.join(countriesDir, fileName)));
}
for (const rawPath of rawPaths) {
  if (await fs.pathExists(rawPath)) {
    updatedFiles += Number(await updateJson(rawPath));
  }
}

console.log(`Correcciones visibles aplicadas: ${updatedFiles} archivos`);
