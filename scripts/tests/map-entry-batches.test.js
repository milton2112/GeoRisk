import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";

const source = await fs.readFile(new URL("../../app-map.js", import.meta.url), "utf8");
function harness(cost = 0, budgetMs = 8) {
  let now = 0, current = true;
  const visited = [], batches = [];
  let count = 0, batchStart = 0;
  const state = { window: {}, performance: { now: () => now } };
  vm.runInNewContext(source, state);
  const options = {
    budgetMs, isCurrent: () => current,
    visit(item) { visited.push(item); now += cost; count++; },
    async yieldTask() {
      batches.push({ count, elapsed: now - batchStart });
      count = 0;
      batchStart = now;
    }
  };
  return { run: items => state.window.GeoRiskMap.visitMapEntries({ ...options, items }),
    options, visited, batches, cancel: () => { current = false; } };
}

for (const budget of [8, 12]) {
  const test = harness(4, budget);
  const items = Array.from({ length: 120 }, (_, i) => i);
  assert.equal(await test.run(items), true);
  assert.deepEqual(test.visited, items, "procesar exactamente una vez y en orden");
  assert.ok(test.batches.length > 1);
  assert.ok(test.batches.every(batch => batch.elapsed <= budget && batch.count <= 24),
    "el trabajo simulado cede dentro del presupuesto, sin prometer preempcion de callbacks");
}
{
  const test = harness(25);
  assert.equal(await test.run([1, 2]), true);
  assert.ok(test.batches.every(batch => batch.count === 1 && batch.elapsed === 25),
    "ceder inmediatamente despues de una operacion pesada, sin fingir que puede interrumpirla");
}
{
  const test = harness();
  assert.equal(await test.run(new Map(Array.from({ length: 100 }, (_, i) => [i, i * 2]))), true);
  assert.equal(test.visited.length, 100, "iterar Map sin crear otra lista de paises");
  assert.deepEqual(test.visited[50], [50, 100]);
  assert.equal(test.batches.length, 4);
  assert.ok(test.batches.every(batch => batch.count === 24), "reloj grueso no permite una tanda sin limite");
}
{
  const test = harness();
  assert.equal(await test.run([]), true);
  assert.equal(test.batches.length, 0, "sin planificacion ni trabajo para una lista vacia");
  test.cancel();
  assert.equal(await test.run([1, 2, 3]), false);
  assert.equal(test.visited.length, 0, "una carga obsoleta no empieza a preparar entidades");
}
{
  const test = harness(4);
  let resume;
  test.options.yieldTask = () => new Promise(resolve => { resume = resolve; });
  const pending = test.run([1, 2, 3, 4]);
  assert.deepEqual(test.visited, [1, 2]);
  test.cancel();
  resume();
  assert.equal(await pending, false);
  assert.deepEqual(test.visited, [1, 2], "revalidar despues de ceder y no aplicar trabajo obsoleto");
}
for (const phase of ["visit", "yield"]) {
  const test = harness(8);
  const error = new Error(phase);
  test.options[phase === "visit" ? "visit" : "yieldTask"] = () => { throw error; };
  await assert.rejects(test.run([1, 2]), error);
}
{
  const test = harness();
  const visit = test.options.visit;
  test.options.visit = item => { visit(item); test.cancel(); };
  assert.equal(await test.run([1]), false, "la ultima entidad tampoco aprueba una carga invalidada");
}
console.log("map-entry-batches.test.js ok: elapsed/item bounds, ordering, cancellation and failures");
