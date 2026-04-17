import assert from "node:assert/strict";
import { normalizeText, parseInflationValue, repairMojibake } from "../lib/text-normalization.js";

assert.equal(normalizeText("República Argentina"), "republica argentina");
assert.equal(repairMojibake(`Espa${"\u00C3\u00B1"}a`), "España");
assert.equal(parseInflationValue("219,9%"), 219.9);
assert.equal(parseInflationValue("~4.5%"), 4.5);
assert.equal(parseInflationValue(null), null);

console.log("normalization.test.js ok");
