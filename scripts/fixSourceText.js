import fs from "node:fs/promises";
import path from "node:path";
import { repairMojibake } from "./lib/text-normalization.js";

const projectRoot = path.resolve(process.cwd());
const sourceFiles = [
  "scripts/buildDataset.js"
];

function countReplacementCharacters(value) {
  return (String(value || "").match(/\uFFFD/g) || []).length;
}

async function normalizeSourceFile(relativePath) {
  const absolutePath = path.join(projectRoot, relativePath);
  const current = await fs.readFile(absolutePath, "utf8");
  const repaired = repairMojibake(current);
  if (repaired === current) {
    return { path: relativePath, changed: false };
  }
  if (countReplacementCharacters(repaired) > countReplacementCharacters(current)) {
    throw new Error(`La reparacion de ${relativePath} introdujo caracteres de reemplazo.`);
  }
  await fs.writeFile(absolutePath, repaired);
  return { path: relativePath, changed: true };
}

const results = [];
for (const sourceFile of sourceFiles) {
  results.push(await normalizeSourceFile(sourceFile));
}

const changed = results.filter(result => result.changed);
console.log(`Fuentes normalizadas: ${changed.length}/${results.length}`);
for (const result of changed) {
  console.log(`- ${result.path}`);
}
