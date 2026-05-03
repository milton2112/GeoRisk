import { spawn } from "node:child_process";

const steps = [
  ["tests completos", "npm", ["test"]],
  ["auditoria de conflictos", "npm", ["run", "audit:conflicts"]],
  ["medicion de arranque", "npm", ["run", "measure:startup"]],
  ["smoke server", "npm", ["run", "test:smoke-server"]]
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

console.log("\nChecklist de release completada sin errores.");
