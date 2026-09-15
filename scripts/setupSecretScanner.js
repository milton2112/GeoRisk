import { installScanner } from "./lib/secret-scanner.js";

try {
  await installScanner();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
