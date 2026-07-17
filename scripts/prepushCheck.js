import { runNpmStep } from "./lib/npm-runner.js";

const steps = [
  ["startup budget", "npm", ["run", "check:startup-budget"]],
  ["data language quality", "npm", ["run", "test:data-language"]],
  ["startup regressions", "npm", ["run", "test:startup"]],
  ["dataset validation", "npm", ["run", "validate:data"]]
];

function runStep([label, _command, args]) {
  return runNpmStep(label, args);
}

for (const step of steps) {
  await runStep(step);
}

console.log("\nPre-push local completado sin errores.");
