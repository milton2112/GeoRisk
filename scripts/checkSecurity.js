import { execFileSync } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { isSensitivePath } from "./lib/security-policy.js";
import { projectRoot, requireScanner, runSecretScan } from "./lib/secret-scanner.js";

export function gitFiles(root) {
  return [...new Set(execFileSync("git", ["ls-files", "-z", "--cached", "--others", "--exclude-standard"], {
    cwd: root, encoding: "utf8", maxBuffer: 16 * 1024 * 1024
  }).split("\0").filter(Boolean))];
}

export async function checkWorkingTree(binary, root = projectRoot) {
  const files = gitFiles(root);
  const sensitive = files.filter(isSensitivePath);
  if (sensitive.length) throw new Error(`Archivos sensibles incluidos en Git: ${sensitive.join(", ")}`);
  const temporary = await fs.mkdtemp(path.join(os.tmpdir(), "geo-risk-source-"));
  try {
    for (const file of files) {
      const source = path.resolve(root, file);
      if (path.relative(root, source).startsWith("..") || path.isAbsolute(path.relative(root, source))) throw new Error("Ruta fuera del repositorio.");
      const stat = await fs.lstat(source).catch(error => { if (error.code === "ENOENT") return null; throw error; });
      if (!stat) continue;
      if (!stat.isFile()) throw new Error(`Solo se permiten archivos regulares en el escaneo: ${file}`);
      const realRelative = path.relative(await fs.realpath(root), await fs.realpath(source));
      if (realRelative === ".." || realRelative.startsWith(`..${path.sep}`) || path.isAbsolute(realRelative)) throw new Error(`Archivo fuera del repositorio: ${file}`);
      const destination = path.join(temporary, file);
      await fs.mkdir(path.dirname(destination), { recursive: true });
      await fs.copyFile(source, destination);
    }
    const findings = await runSecretScan(binary, ["dir", temporary], temporary);
    return findings.map(item => ({ ...item, file: path.relative(temporary, item.file).replace(/\\/g, "/") }));
  } finally {
    await fs.rm(temporary, { recursive: true, force: true });
  }
}

export async function checkHistory(binary, root = projectRoot, outgoing = false) {
  const shallow = execFileSync("git", ["rev-parse", "--is-shallow-repository"], { cwd: root, encoding: "utf8" }).trim();
  if (shallow !== "false") throw new Error("El escaneo de historial requiere un clon completo (fetch-depth: 0).");
  const range = outgoing ? "--all --not --remotes" : "--all --full-history";
  return runSecretScan(binary, ["git", `--log-opts=${range}`, root], root);
}

async function main() {
  const args = process.argv.slice(2);
  if (args.some(arg => !["--history", "--outgoing"].includes(arg))) throw new Error("Opcion de seguridad desconocida.");
  const binary = await requireScanner();
  const findings = await checkWorkingTree(binary);
  console.log("Escaneo de archivos actuales completado.");
  if (args.includes("--history") || args.includes("--outgoing")) {
    findings.push(...await checkHistory(binary, projectRoot, !args.includes("--history")));
    console.log(args.includes("--history") ? "Escaneo de historial completo terminado." : "Escaneo de commits locales no publicados terminado.");
  }
  if (findings.length) {
    console.error(JSON.stringify({ findingCount: findings.length, findings }, null, 2));
    throw new Error("Posibles secretos detectados. Publicacion bloqueada; revisar y revocar credenciales reales, no solo borrarlas.");
  }
  console.log("Seguridad: sin secretos detectados por las reglas del scanner; no es una garantia de ausencia.");
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
