import path from "node:path";
import { validatePagesArtifact } from "./lib/pages-artifact.js";

try {
  const result = await validatePagesArtifact(path.resolve("dist/public"));
  console.log(`Pages: ${result.assetCount} assets verificados, ${result.totalBytes} bytes; sin archivos internos.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
