import fs from "fs-extra";
import path from "node:path";

const projectRoot = path.resolve(process.cwd());

const targets = [
  "node_modules",
  ".parcel-cache",
  ".vite",
  ".cache",
  "coverage",
  "dist",
  "build",
  "tmp",
  "temp",
  ".tmp",
  ".nyc_output"
];

const filePatterns = [
  /^npm-debug\.log$/i,
  /^yarn-error\.log$/i,
  /^pnpm-debug\.log$/i,
  /^.*\.local\.log$/i,
  /^.*\.tmp\.json$/i,
  /^.*\.local\.json$/i
];

const reportPatterns = [
  /^.*\.tmp\.json$/i,
  /^.*\.local\.json$/i,
  /^.*-local\.json$/i
];

function isInsideProject(absolutePath) {
  const relative = path.relative(projectRoot, absolutePath);
  return relative && !relative.startsWith("..") && !path.isAbsolute(relative);
}

async function getSize(absolutePath) {
  if (!(await fs.pathExists(absolutePath))) return 0;
  const stat = await fs.stat(absolutePath);
  if (!stat.isDirectory()) return stat.size;
  let total = 0;
  const entries = await fs.readdir(absolutePath, { withFileTypes: true });
  for (const entry of entries) {
    total += await getSize(path.join(absolutePath, entry.name));
  }
  return total;
}

function formatBytes(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}

async function removePath(relativePath) {
  const absolutePath = path.resolve(projectRoot, relativePath);
  if (!isInsideProject(absolutePath)) {
    throw new Error(`Refusing to clean outside project: ${absolutePath}`);
  }
  if (!(await fs.pathExists(absolutePath))) return 0;
  const size = await getSize(absolutePath);
  await fs.remove(absolutePath);
  console.log(`removed ${relativePath} (${formatBytes(size)})`);
  return size;
}

async function cleanMatchingFiles(directory, patterns) {
  const absoluteDirectory = path.join(projectRoot, directory);
  if (!(await fs.pathExists(absoluteDirectory))) return 0;
  let freed = 0;
  const entries = await fs.readdir(absoluteDirectory, { withFileTypes: true });
  for (const entry of entries) {
    const relativePath = path.join(directory, entry.name);
    const absolutePath = path.join(projectRoot, relativePath);
    if (entry.isDirectory()) continue;
    if (!patterns.some(pattern => pattern.test(entry.name))) continue;
    const size = await getSize(absolutePath);
    await fs.remove(absolutePath);
    freed += size;
    console.log(`removed ${relativePath} (${formatBytes(size)})`);
  }
  return freed;
}

let freedBytes = 0;

for (const target of targets) {
  freedBytes += await removePath(target);
}

freedBytes += await cleanMatchingFiles(".", filePatterns);
freedBytes += await cleanMatchingFiles("reports", reportPatterns);

console.log(`clean:storage completed. Freed approximately ${formatBytes(freedBytes)}.`);
