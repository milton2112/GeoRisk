import { runNpmStep } from "./lib/npm-runner.js";

const steps = [
  ["tests completos", "npm", ["test"]],
  ["build produccion", "npm", ["run", "build:prod"]],
  ["release gates", "npm", ["run", "test:release-gates"]],
  ["auditoria de conflictos", "npm", ["run", "audit:conflicts"]],
  ["medicion de arranque", "npm", ["run", "measure:startup"]],
  ["auditoria del proyecto", "npm", ["run", "audit:project"]],
  ["auditoria de datos programable", "npm", ["run", "audit:data"]],
  ["snapshot de performance", "npm", ["run", "performance:snapshot"]],
  ["artefactos de release", "npm", ["run", "audit:release-artifacts"]],
  ["salud funcional", "npm", ["run", "audit:features"]],
  ["doctor de producto", "npm", ["run", "audit:doctor"]],
  ["estado de release", "npm", ["run", "release:status"]],
  ["smoke server", "npm", ["run", "test:smoke-server"]],
  ["limpieza local", "npm", ["run", "clean:local"]]
];

function runStep([label, _command, args]) {
  return runNpmStep(label, args);
}

for (const step of steps) {
  await runStep(step);
}

console.log("\nChecklist de release completada sin errores.");
