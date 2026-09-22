import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const SCANNER_VERSION = "8.30.1";
export const SCANNER_RELEASES = {
  "win32-x64": { file: "windows_x64.zip", sha256: "d29144deff3a68aa93ced33dddf84b7fdc26070add4aa0f4513094c8332afc4e", binary: "gitleaks.exe" },
  "linux-x64": { file: "linux_x64.tar.gz", sha256: "551f6fc83ea457d62a0d98237cbad105af8d557003051f41f3e7ca7b3f2470eb", binary: "gitleaks" }
};
export const projectRoot = fileURLToPath(new URL("../../", import.meta.url));

export function scannerRelease(platform = process.platform, arch = process.arch) {
  const release = SCANNER_RELEASES[`${platform}-${arch}`];
  if (!release) throw new Error(`Scanner no configurado para ${platform}-${arch}. No se omite la comprobacion.`);
  return release;
}

export function scannerPath() {
  return path.join(projectRoot, ".cache", "security", SCANNER_VERSION, scannerRelease().binary);
}

export function verifyArchive(buffer, expected) {
  if (createHash("sha256").update(buffer).digest("hex") !== expected) {
    throw new Error("La descarga de Gitleaks no coincide con el SHA-256 fijado; no se ejecutara.");
  }
}

export async function installScanner() {
  const release = scannerRelease();
  const name = `gitleaks_${SCANNER_VERSION}_${release.file}`;
  const response = await fetch(`https://github.com/gitleaks/gitleaks/releases/download/v${SCANNER_VERSION}/${name}`, {
    signal: AbortSignal.timeout(60000)
  });
  if (!response.ok) throw new Error(`No se pudo descargar Gitleaks: HTTP ${response.status}`);
  const chunks = [];
  let bytes = 0;
  for await (const chunk of response.body) {
    bytes += chunk.length;
    if (bytes > 25 * 1024 * 1024) throw new Error("Descarga de scanner demasiado grande.");
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);
  verifyArchive(buffer, release.sha256);
  const temporary = await fs.mkdtemp(path.join(os.tmpdir(), "geo-risk-scanner-"));
  try {
    const archive = path.join(temporary, name);
    await fs.writeFile(archive, buffer);
    execFileSync("tar", ["-xf", archive, "-C", temporary, release.binary], { timeout: 30000, stdio: "pipe" });
    const binary = await fs.readFile(path.join(temporary, release.binary));
    await fs.mkdir(path.dirname(scannerPath()), { recursive: true });
    await fs.writeFile(scannerPath(), binary, { mode: 0o755 });
    await fs.chmod(scannerPath(), 0o755);
    await fs.writeFile(scannerPath() + ".sha256", createHash("sha256").update(binary).digest("hex"));
  } finally {
    await fs.rm(temporary, { recursive: true, force: true });
  }
  console.log(`Gitleaks ${SCANNER_VERSION} instalado; SHA-256 de descarga verificado.`);
}

export async function requireScanner() {
  const binary = scannerPath();
  try {
    const bytes = await fs.readFile(binary);
    const expected = await fs.readFile(binary + ".sha256", "utf8");
    verifyArchive(bytes, expected);
    if (execFileSync(binary, ["version"], { encoding: "utf8", timeout: 5000 }).trim() !== SCANNER_VERSION) throw new Error();
  } catch {
    throw new Error("Scanner ausente o alterado. Ejecutar npm run security:setup. El control no se omite.");
  }
  return binary;
}

export function summarizeFindings(findings) {
  return findings.map(item => ({ file: item.File, line: item.StartLine, rule: item.RuleID, commit: item.Commit || null }));
}

export function scanTimeoutSeconds(args) {
  return args[0] === "git" ? 600 : 150;
}

export async function runSecretScan(binary, args, cwd = projectRoot) {
  const temporary = await fs.mkdtemp(path.join(os.tmpdir(), "geo-risk-scan-"));
  const report = path.join(temporary, "findings.json");
  const timeoutSeconds = scanTimeoutSeconds(args);
  try {
    let status = 0;
    try {
      execFileSync(binary, [...args, "--redact=100", "--no-banner", "--no-color", "--log-level=fatal",
        "--ignore-gitleaks-allow", "--exit-code=10", "--max-decode-depth=2", `--timeout=${timeoutSeconds}`,
        `--gitleaks-ignore-path=${path.join(projectRoot, ".gitleaksignore")}`,
        "--report-format=json", `--report-path=${report}`, `--config=${path.join(projectRoot, ".gitleaks.toml")}`], {
        cwd, stdio: "pipe", timeout: (timeoutSeconds + 10) * 1000, maxBuffer: 8 * 1024 * 1024,
        env: { ...process.env, GITLEAKS_CONFIG: "", GITLEAKS_CONFIG_TOML: "" }
      });
    } catch (error) {
      status = error.status;
      if (status !== 10) throw new Error(`No se completo el escaneo de secretos (codigo ${status ?? "timeout/error"}; limite ${timeoutSeconds}s). La publicacion sigue bloqueada.`);
    }
    const findings = summarizeFindings(JSON.parse(await fs.readFile(report, "utf8")));
    if (status === 10 && !findings.length) throw new Error("El scanner fallo sin un reporte de hallazgos valido.");
    return findings;
  } finally {
    await fs.rm(temporary, { recursive: true, force: true });
  }
}
