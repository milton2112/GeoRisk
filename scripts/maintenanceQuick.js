import { spawn } from "node:child_process";

const steps = [
  ["normalizacion de fuentes", "npm", ["run", "fix:source-text"]],
  ["curaduria de conflictos", "npm", ["run", "fix:conflicts"]],
  ["correccion visible segura", "npm", ["run", "fix:data-visible"]],
  ["indices publicos", "npm", ["run", "build:indexes"]],
  ["auditoria de datos", "npm", ["run", "audit:data"]],
  ["auditoria de proyecto", "npm", ["run", "audit:project"]],
  ["snapshot de performance", "npm", ["run", "performance:snapshot"]],
  ["doctor de producto", "npm", ["run", "audit:doctor"]],
  ["estado de release", "npm", ["run", "release:status"]],
  ["puerta local", "npm", ["run", "prepush:check"]]
];

function runStep([label, command, args]) {
  return new Promise((resolve, reject) => {
    console.log(`\n== ${label} ==`);
    const child = spawn(command, args, { stdio: "inherit", shell: true });
    child.on("exit", code => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${label} fallo con codigo ${code}`));
      }
    });
  });
}

for (const step of steps) {
  await runStep(step);
}

console.log("\nMantenimiento rapido completado.");
