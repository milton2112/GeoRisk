import { runNpmStep } from "./lib/npm-runner.js";

const steps = [
  ["normalizacion de fuentes", "npm", ["run", "fix:source-text"]],
  ["curaduria de conflictos", "npm", ["run", "fix:conflicts"]],
  ["auditoria de datos", "npm", ["run", "audit:data"]],
  ["auditoria de proyecto", "npm", ["run", "audit:project"]],
  ["snapshot de performance", "npm", ["run", "performance:snapshot"]],
  ["artefactos de release", "npm", ["run", "audit:release-artifacts"]],
  ["salud funcional", "npm", ["run", "audit:features"]],
  ["doctor de producto", "npm", ["run", "audit:doctor"]],
  ["estado de release", "npm", ["run", "release:status"]],
  ["puerta local", "npm", ["run", "prepush:check"]]
];

function runStep([label, _command, args]) {
  return runNpmStep(label, args, { timeoutMs: 300_000 });
}

for (const step of steps) {
  await runStep(step);
}

console.log("\nMantenimiento rapido completado.");
