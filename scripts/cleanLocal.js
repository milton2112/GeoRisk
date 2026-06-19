import fs from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();

const artifactTargets = [
  ".parcel-cache",
  ".vite",
  "coverage",
  "dist",
  "build",
  "tmp",
  "temp"
];
const targets = process.argv.includes("--deep")
  ? [...artifactTargets, "node_modules"]
  : artifactTargets;

function isInsideProject(absolutePath) {
  const relative = path.relative(projectRoot, absolutePath);
  return relative && !relative.startsWith("..") && !path.isAbsolute(relative);
}

let removed = 0;

for (const target of targets) {
  const absolutePath = path.resolve(projectRoot, target);
  if (!isInsideProject(absolutePath)) {
    throw new Error(`Refusing to clean outside project: ${absolutePath}`);
  }

  try {
    await fs.rm(absolutePath, { recursive: true, force: true });
    removed += 1;
    console.log(`cleaned ${target}`);
  } catch (error) {
    console.warn(`skipped ${target}: ${error.message}`);
  }
}

console.log(`clean:local completed (${removed} paths checked).`);
