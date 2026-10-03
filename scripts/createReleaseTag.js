import { execFileSync } from "node:child_process";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";

const packageJson = JSON.parse(await fs.readFile("package.json", "utf8"));
const tagName = `v${packageJson.version}`;

function git(args) {
  return execFileSync("git", args, {
    encoding: "utf8", timeout: 60000, windowsHide: true, stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, GIT_TERMINAL_PROMPT: "0", GCM_INTERACTIVE: "Never" }
  }).trim();
}

function assertCleanHead(expected) {
  if (git(["status", "--short"])) throw new Error("No se puede crear tag con working tree sucio.");
  if (git(["rev-parse", "HEAD"]) !== expected) throw new Error("HEAD cambio durante la validacion. Reintentar desde el commit integrado.");
}

const head = git(["rev-parse", "HEAD"]);
assertCleanHead(head);
const tagRef = `refs/tags/${tagName}`;
let existingCommit = null;
try {
  existingCommit = git(["rev-parse", "--verify", "--quiet", `${tagRef}^{commit}`]);
} catch (error) {
  if (error.status !== 1) throw error;
}
if (existingCommit) {
  if (existingCommit !== head) throw new Error(`Tag ${tagName} ya existe en otro commit. No se modifica.`);
  console.log(`Tag ${tagName} existente verificado en ${head}.`);
  process.exit(0);
}

try {
  execFileSync(process.execPath, [fileURLToPath(new URL("./releaseStatus.js", import.meta.url))], {
    timeout: 60000, windowsHide: true, stdio: "inherit"
  });
} catch {
  throw new Error("release:status rechazo la validacion. No se crea ninguna etiqueta.");
}
assertCleanHead(head);

try {
  git(["fetch", "--no-tags", "origin", "refs/heads/main:refs/remotes/origin/main"]);
} catch {
  throw new Error("No se pudo comprobar main remoto. Revisar conexion/permisos y reintentar; no se crea ninguna etiqueta.");
}
assertCleanHead(head);
if (git(["rev-parse", "refs/remotes/origin/main"]) !== head) {
  throw new Error("HEAD no coincide con main remoto. Integrar el PR validado y actualizar la rama antes de etiquetar.");
}

git(["tag", "-a", tagName, head, "-m", `GeoRisk ${tagName}`]);
console.log(`Tag creado: ${tagName} en ${head}.`);
console.log(`Push sugerido: git push origin ${tagRef}`);
