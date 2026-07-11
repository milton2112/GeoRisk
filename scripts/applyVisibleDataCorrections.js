import fs from "fs-extra";
import path from "node:path";
import { normalizeVisibleValue } from "./lib/visible-data-corrections.js";
import { areJsonValuesEquivalent } from "./lib/resilient-fs.js";

const projectRoot = path.resolve(process.cwd());
const fullPath = path.join(projectRoot, "data", "countries_full.json");
const countriesDir = path.join(projectRoot, "data", "countries");
const rawPaths = [
  path.join(projectRoot, "data", "raw", "conflicts.json"),
  path.join(projectRoot, "data", "raw", "history.json"),
  path.join(projectRoot, "data", "raw", "politics_details.json"),
  path.join(projectRoot, "data", "raw", "city_details.json"),
  path.join(projectRoot, "data", "raw", "religion.json"),
  path.join(projectRoot, "data", "raw", "religion_details.json")
];
const conflictDetailsPath = path.join(projectRoot, "data", "conflict_details.generated.json");
const conflictDetailsDir = path.join(projectRoot, "data", "conflicts", "details");

const retryableFileErrorCodes = new Set(["UNKNOWN", "EBUSY", "EPERM", "EACCES"]);

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function withFileRetry(action) {
  let lastError;
  for (let attempt = 0; attempt < 8; attempt += 1) {
    try {
      return await action();
    } catch (error) {
      lastError = error;
      if (!retryableFileErrorCodes.has(error?.code) || attempt === 7) {
        throw error;
      }
      await wait(80 * (attempt + 1));
    }
  }
  throw lastError;
}

async function readJsonStable(filePath) {
  return withFileRetry(() => fs.readJson(filePath));
}

async function writeJsonAtomic(filePath, data, options = {}) {
  const tempPath = `${filePath}.${process.pid}.tmp`;
  await withFileRetry(() => fs.writeJson(tempPath, data, options));
  await withFileRetry(() => fs.move(tempPath, filePath, { overwrite: true }));
}

async function updateJson(filePath, { spaces = 0 } = {}) {
  const current = await readJsonStable(filePath);
  const updated = normalizeVisibleValue(current);
  if (areJsonValuesEquivalent(current, updated)) return false;
  await writeJsonAtomic(filePath, updated, { spaces });
  return true;
}

let updatedFiles = Number(await updateJson(fullPath));
for (const fileName of (await fs.readdir(countriesDir)).filter(file => file.endsWith(".json"))) {
  updatedFiles += Number(await updateJson(path.join(countriesDir, fileName)));
}
for (const rawPath of rawPaths) {
  if (await fs.pathExists(rawPath)) {
    updatedFiles += Number(await updateJson(rawPath, { spaces: 2 }));
  }
}
if (await fs.pathExists(conflictDetailsPath)) {
  updatedFiles += Number(await updateJson(conflictDetailsPath, { spaces: 0 }));
}
if (await fs.pathExists(conflictDetailsDir)) {
  for (const fileName of (await fs.readdir(conflictDetailsDir)).filter(file => file.endsWith(".json"))) {
    updatedFiles += Number(await updateJson(path.join(conflictDetailsDir, fileName), { spaces: 0 }));
  }
}

console.log(`Correcciones visibles aplicadas: ${updatedFiles} archivos`);
