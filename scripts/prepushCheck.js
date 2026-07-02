import { spawn } from "node:child_process";

const steps = [
  ["startup budget", "npm", ["run", "check:startup-budget"]],
  ["data language quality", "npm", ["run", "test:data-language"]],
  ["startup regressions", "npm", ["run", "test:startup"]],
  ["dataset validation", "npm", ["run", "validate:data"]]
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

console.log("\nPre-push local completado sin errores.");
