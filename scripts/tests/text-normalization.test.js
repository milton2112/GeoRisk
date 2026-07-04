import assert from "node:assert/strict";
import { normalizeText, repairMojibake } from "../lib/text-normalization.js";

const cases = new Map([
  ["Espa\u00c3\u00b1ol", "Español"],
  ["\u00c3\u0081rabe", "Árabe"],
  ["Hj\u00c3\u00b6rungav\u00c3\u00a1gr", "Hjörungavágr"],
  ["L\u00c3\u00b6wendalsfejden", "Löwendalsfejden"],
  ["M\u00c3\u00b8n", "Møn"],
  ["Nis\u00c3\u00a5", "Niså"],
  ["incursi[o\u00c3\u00b3]n", "incursi[oó]n"]
]);

for (const [input, expected] of cases) {
  const actual = repairMojibake(input);
  assert.equal(actual, expected, `${input} debe repararse sin perdida`);
  assert.ok(!actual.includes("\uFFFD"), `${input} no debe introducir caracteres de reemplazo`);
}

assert.equal(normalizeText("República Federal"), "republica federal");

console.log("text-normalization.test.js ok");
