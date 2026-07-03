import { spawn } from "node:child_process";

const steps = [
  ["tests completos", "npm", ["test"]],
  ["build produccion", "npm", ["run", "build:prod"]],
  ["release gates", "npm", ["run", "test:release-gates"]],
  ["auditoria de conflictos", "npm", ["run", "audit:conflicts"]],
  ["medicion de arranque", "npm", ["run", "measure:startup"]],
  ["auditoria del proyecto", "npm", ["run", "audit:project"]],
  ["auditoria de datos programable", "npm", ["run", "audit:data"]],
  ["snapshot de performance", "npm", ["run", "performance:snapshot"]],
  ["doctor de producto", "npm", ["run", "audit:doctor"]],
  ["smoke server", "npm", ["run", "test:smoke-server"]],
  ["limpieza local", "npm", ["run", "clean:local"]]
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
