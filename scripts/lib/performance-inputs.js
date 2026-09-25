import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { PUBLIC_FILES, PUBLIC_DIRS } from "./public-assets.js";

export const PERFORMANCE_INPUT_FILES = [
  "package.json", "package-lock.json", "scripts/buildProduction.js",
  "scripts/lib/public-assets.js", "scripts/lib/browser-security-policy.js",
  "scripts/lib/browser-performance.js", "scripts/lib/performance-metrics.js",
  "scripts/lib/performance-evidence.js", "scripts/lib/performance-inputs.js",
  "scripts/localSmokeServer.js", "scripts/performanceSnapshot.js"
];

// Hash current sources, not a possibly stale dist manifest; no browser or build is needed.
export async function getPerformanceInputHash(root) {
  const files = new Set([...PUBLIC_FILES, ...PERFORMANCE_INPUT_FILES]);
  async function visit(relative) {
    const absolute = path.join(root, relative);
    const stat = await fs.lstat(absolute);
    if (stat.isDirectory()) {
      for (const entry of await fs.readdir(absolute)) await visit(`${relative}/${entry}`);
    } else if (stat.isFile()) {
      files.add(relative);
    } else {
      throw new Error(`Entrada de rendimiento no regular: ${relative}`);
    }
  }
  for (const directory of PUBLIC_DIRS) {
    try {
      await fs.lstat(path.join(root, directory));
    } catch (error) {
      if (error.code === "ENOENT") continue;
      throw error;
    }
    await visit(directory);
  }
  const hash = createHash("sha256");
  for (const file of [...files].sort()) {
    if (!(await fs.lstat(path.join(root, file))).isFile()) {
      throw new Error(`Entrada de rendimiento no regular: ${file}`);
    }
    const contents = await fs.readFile(path.join(root, file));
    hash.update(JSON.stringify([file, contents.length, createHash("sha256").update(contents).digest("hex")]));
  }
  return hash.digest("hex");
}
