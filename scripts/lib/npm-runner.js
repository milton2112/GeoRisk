import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

export const DEFAULT_STEP_TIMEOUT_MS = 180_000;

export function resolveNpmInvocation({
  npmExecPath = process.env.npm_execpath,
  nodePath = process.execPath,
  fileExists = fs.existsSync
} = {}) {
  const candidates = [
    npmExecPath,
    path.join(path.dirname(nodePath), "node_modules", "npm", "bin", "npm-cli.js")
  ].filter(Boolean);
  const npmCliPath = candidates.find(candidate => fileExists(candidate));

  if (!npmCliPath) {
    throw new Error("No se encontro npm-cli.js para ejecutar la automatizacion sin shell.");
  }

  return {
    command: nodePath,
    argsPrefix: [npmCliPath]
  };
}

export function runCommand(label, command, args, {
  cwd = process.cwd(),
  timeoutMs = DEFAULT_STEP_TIMEOUT_MS
} = {}) {
  return new Promise((resolve, reject) => {
    console.log(`\n== ${label} ==`);
    const startedAt = Date.now();
    const child = spawn(command, args, {
      cwd,
      stdio: "inherit",
      shell: false,
      windowsHide: true
    });
    let settled = false;
    let timer = null;

    function settle(callback, value) {
      if (settled) return;
      settled = true;
      if (timer) clearTimeout(timer);
      callback(value);
    }

    child.once("error", error => settle(reject, error));
    child.once("close", (code, signal) => {
      if (code === 0) {
        settle(resolve);
        return;
      }

      const reason = signal ? `signal ${signal}` : `code ${code}`;
      settle(reject, new Error(`${label} fallo con ${reason}.`));
    });

    if (Number.isFinite(timeoutMs) && timeoutMs > 0) {
      timer = setTimeout(() => {
        try {
          child.kill();
        } catch {
          // The process may have ended while the timeout elapsed.
        }
        const elapsedSeconds = Math.ceil((Date.now() - startedAt) / 1000);
        settle(reject, new Error(`${label} excedio ${elapsedSeconds}s sin finalizar.`));
      }, timeoutMs);
    }
  });
}

export function runNpmStep(label, args, options = {}) {
  const { command, argsPrefix } = resolveNpmInvocation(options);
  return runCommand(label, command, [...argsPrefix, ...args], options);
}
