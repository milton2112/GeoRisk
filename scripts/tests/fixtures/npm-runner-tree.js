import { spawn } from "node:child_process";
import fs from "node:fs/promises";

const [mode, report] = process.argv.slice(2);
setTimeout(() => process.exit(8), 15_000).unref();
if (mode === "leaf") {
  process.on("SIGTERM", () => {});
  process.send?.("ready");
  setInterval(() => {}, 60_000);
} else if (mode === "parent") {
  const leaf = spawn(process.execPath, [process.argv[1], "leaf"], {
    stdio: ["ignore", "ignore", "ignore", "ipc"], windowsHide: true,
    detached: process.platform === "win32"
  });
  leaf.once("message", async () => {
    await fs.writeFile(report, JSON.stringify({ parent: process.pid, leaf: leaf.pid }));
  });
  setInterval(() => {}, 60_000);
} else {
  process.exit(7);
}
