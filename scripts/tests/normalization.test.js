import assert from "node:assert/strict";
import fs from "fs-extra";
import os from "node:os";
import path from "node:path";
import { normalizeText, parseInflationValue, repairMojibake } from "../lib/text-normalization.js";
import { areJsonValuesEquivalent, writeJsonIfChanged } from "../lib/resilient-fs.js";
import { cleanConflictLabel, normalizeConflictKey } from "../lib/conflict-cleaning.js";

assert.equal(normalizeText("República Argentina"), "republica argentina");
assert.equal(repairMojibake(`Espa${"\u00C3\u00B1"}a`), "España");
assert.equal(repairMojibake("S\u00E3o Paulo"), "S\u00E3o Paulo");
assert.equal(normalizeText("S\u00E3o Paulo"), "sao paulo");
assert.equal(parseInflationValue("219,9%"), 219.9);
assert.equal(parseInflationValue("~4.5%"), 4.5);
assert.equal(parseInflationValue(null), null);
assert.equal(cleanConflictLabel("Sitio de Nykøbing"), "Sitio de Nykobing");
assert.equal(normalizeConflictKey("Sitio de Nykøbing"), normalizeConflictKey("Sitio de Nykobing"));
assert.equal(
  areJsonValuesEquivalent(
    { country: { name: "Argentina", metrics: { risk: 42, tags: ["a", "b"] } } },
    { country: { metrics: { tags: ["a", "b"], risk: 42 }, name: "Argentina" } }
  ),
  true,
  "orden de claves no debe provocar reescrituras JSON"
);
assert.equal(
  areJsonValuesEquivalent({ tags: ["a", "b"] }, { tags: ["b", "a"] }),
  false,
  "orden de arrays debe seguir siendo significativo"
);
assert.equal(
  areJsonValuesEquivalent({ risk: 42 }, { risk: 43 }),
  false,
  "cambios de datos reales deben detectarse"
);

const tempDirectory = await fs.mkdtemp(path.join(os.tmpdir(), "georisk-json-write-"));
try {
  const tempFile = path.join(tempDirectory, "sample.json");
  assert.equal(await writeJsonIfChanged(tempFile, { b: 2, a: { value: 1 } }, { spaces: 2 }), true);
  const originalText = await fs.readFile(tempFile, "utf8");
  assert.equal(await writeJsonIfChanged(tempFile, { a: { value: 1 }, b: 2 }, { spaces: 2 }), false);
  assert.equal(await fs.readFile(tempFile, "utf8"), originalText, "orden de claves no debe tocar el archivo fisico");
  assert.equal(await writeJsonIfChanged(tempFile, { a: { value: 3 }, b: 2 }, { spaces: 2 }), true);
} finally {
  await fs.remove(tempDirectory);
}

console.log("normalization.test.js ok");
