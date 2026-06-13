import { execFileSync } from "node:child_process";
import fs from "node:fs/promises";

const packageJson = JSON.parse(await fs.readFile("package.json", "utf8"));
const tagName = `v${packageJson.version}`;

function git(args) {
  return execFileSync("git", args, { encoding: "utf8" }).trim();
}

const existingTags = git(["tag", "--list", tagName]);
if (existingTags) {
  console.log(`Tag ${tagName} ya existe.`);
  process.exit(0);
}

const status = git(["status", "--short"]);
if (status) {
  throw new Error("No se puede crear tag con working tree sucio.");
}

git(["tag", "-a", tagName, "-m", `GeoRisk ${tagName}`]);
console.log(`Tag creado: ${tagName}`);
console.log("Push sugerido: git push origin main --follow-tags");
