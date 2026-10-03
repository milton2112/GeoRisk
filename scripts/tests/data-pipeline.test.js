import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const { scripts } = JSON.parse(await fs.readFile(new URL("../../package.json", import.meta.url), "utf8"));
for (const name of ["build:data", "fix:conflicts"]) {
  const commands = scripts[name].split(" && ");
  const compact = commands.indexOf("node scripts/compactStartupIndex.js");
  const indexes = commands.indexOf("node scripts/buildDataIndexes.js");
  for (const command of ["node scripts/applyConflictAutofix.js", "node scripts/applyVisibleDataCorrections.js", "node scripts/buildDataIndexes.js"]) {
    assert.equal(commands.filter(step => step === command).length, 1, name + ": required stage exactly once");
  }
  assert.ok(compact >= 0, name + " must refresh light country metrics, not wait for release measurement");
  assert.equal(commands.filter(command => command === "node scripts/compactStartupIndex.js").length, 1);
  assert.ok(compact > commands.indexOf("node scripts/applyConflictAutofix.js"));
  assert.ok(compact > commands.indexOf("node scripts/applyVisibleDataCorrections.js"));
  assert.ok(indexes > compact, "public profiles and search follow the same curated input");
}
const root = await fs.mkdtemp(path.join(os.tmpdir(), "georisk-data-pipeline-"));
const dataDir = path.join(root, "data");
const inputPath = path.join(dataDir, "countries_full.json");
const outputPath = path.join(dataDir, "countries_index.json");
const fixture = { TST: { name: "Test", continent: "Asia", military: { conflicts: [{ name: "A" }] } } };
const run = () => execFileSync(process.execPath, [fileURLToPath(new URL("../compactStartupIndex.js", import.meta.url))], {
  cwd: root, encoding: "utf8", timeout: 10000, stdio: "pipe"
});
try {
  await fs.mkdir(dataDir);
  await fs.writeFile(inputPath, JSON.stringify(fixture));
  run();
  assert.equal(JSON.parse(await fs.readFile(outputPath, "utf8")).TST.military.conflictCount, 1);
  fixture.TST.military.conflicts.push({ name: "B" });
  await fs.writeFile(inputPath, JSON.stringify(fixture));
  run();
  const compactBytes = await fs.readFile(outputPath, "utf8");
  assert.equal(JSON.parse(compactBytes).TST.military.conflictCount, 2, "newly curated counts update");
  const oldTime = new Date("2000-01-01T00:00:00Z");
  await fs.utimes(outputPath, oldTime, oldTime);
  const unchangedTime = (await fs.stat(outputPath)).mtimeMs;
  run();
  assert.equal(await fs.readFile(outputPath, "utf8"), compactBytes);
  assert.equal((await fs.stat(outputPath)).mtimeMs, unchangedTime, "unchanged compact output must not be rewritten");
  await fs.writeFile(outputPath, JSON.stringify(JSON.parse(compactBytes), null, 2));
  run();
  assert.equal(await fs.readFile(outputPath, "utf8"), compactBytes, "equivalent but verbose JSON is still compacted");
} finally {
  assert.equal(path.dirname(root), path.resolve(os.tmpdir()));
  assert.ok(path.basename(root).startsWith("georisk-data-pipeline-"));
  await fs.rm(root, { recursive: true, force: true });
}
console.log("data-pipeline.test.js ok: synchronized stages, updated counts and no identical writes");
