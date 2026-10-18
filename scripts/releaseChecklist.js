import { DEFAULT_STEP_TIMEOUT_MS, runNpmStep } from "./lib/npm-runner.js";
import { assertFullReleaseEnvironment, assertReleaseBudget, externalCriticalEvidence, recordNativeTestCost } from "./lib/critical-browser-evidence.js";

assertFullReleaseEnvironment();
const externalEvidence = await externalCriticalEvidence();

const steps = [
  ["tests completos", "npm", ["test"], { timeoutMs: 20 * 60_000 }],
  ["vulnerabilidades de dependencias", "npm", ["run", "audit:dependencies"]],
  ["historial de seguridad", "npm", ["run", "audit:security:history"], { timeoutMs: 11 * 60_000 }],
  ["build produccion", "npm", ["run", "build:prod"]],
  ["release gates", "npm", ["run", "test:release-gates"]],
  ["auditoria de conflictos", "npm", ["run", "audit:conflicts"]],
  ["medicion de arranque", "npm", ["run", "measure:startup"]],
  ["auditoria del proyecto", "npm", ["run", "audit:project"]],
  ["auditoria de datos programable", "npm", ["run", "audit:data"]],
  ["snapshot de performance", "npm", ["run", "performance:snapshot", "--", "--reuse-browser"]],
  ["artefactos de release", "npm", ["run", "audit:release-artifacts"]],
  ["salud funcional", "npm", ["run", "audit:features"]],
  ["doctor de producto", "npm", ["run", "audit:doctor"]],
  ["estado de release", "npm", ["run", "release:status"]],
  ["smoke server", "npm", ["run", "test:smoke-server"]],
  ["limpieza local", "npm", ["run", "clean:local"]]
];

async function runStep([label, _command, args, options]) {
  let settings = options;
  if (externalEvidence) {
    const remaining = assertReleaseBudget(externalEvidence.releaseStartedAt);
    const allowance = label === "tests completos" ? externalEvidence.testTimeoutMs : options?.timeoutMs ?? DEFAULT_STEP_TIMEOUT_MS;
    settings = { ...options, timeoutMs: Math.min(remaining, allowance) };
  }
  const started = performance.now();
  await runNpmStep(label, args, settings);
  if (externalEvidence && label === "tests completos") {
    await recordNativeTestCost("reports/critical-browser-e2e.json", externalEvidence, Math.ceil(performance.now() - started));
  }
}

if (externalEvidence) assertReleaseBudget(externalEvidence.releaseStartedAt);

for (const step of steps) {
  await runStep(step);
}

if (externalEvidence) assertReleaseBudget(externalEvidence.releaseStartedAt);

console.log("\nChecklist de release completada sin errores.");
