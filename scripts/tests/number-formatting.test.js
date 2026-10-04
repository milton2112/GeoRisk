import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";

const read = file => fs.readFile(new URL("../../" + file, import.meta.url), "utf8");
const runtimeSource = await read("app-runtime.js");
const script = await read("script.js");
const textSource = await read("app-text.js");
const names = ["formatNumber", "formatPercentage", "parseInflationValue", "formatInflation", "compactNumber", "isValidInflationValue"];
const functions = names.map(name => {
  const match = script.match(new RegExp("function " + name + "\\([^]*?\\n\\}"));
  assert.ok(match, "helper real presente: " + name);
  return match[0];
}).join("\n");

let constructions = 0;
const state = vm.createContext({
  window: {},
  Intl: {
    NumberFormat: class extends Intl.NumberFormat {
      constructor(...args) { super(...args); constructions += 1; }
    }
  },
  t: () => "No data"
});
vm.runInContext(runtimeSource, state);
const formats = state.window.GeoRiskRuntime.numberFormats;
assert.ok(formats, "runtime comparte los formatos numericos sin otro asset inicial");
assert.equal(constructions, 0, "sin crear formatos antes de usarlos");

const calls = new Map();
for (const name of ["number", "percentage", "decimal", "compact"]) {
  const original = formats[name];
  assert.equal(typeof original, "function");
  formats[name] = value => {
    calls.set(name, (calls.get(name) || 0) + 1);
    return original(value);
  };
}
vm.runInContext(script.slice(0, script.indexOf("let {")) + functions, state);
vm.runInContext(textSource, state);
assert.equal(constructions, 0, "cargar texto y orquestador tampoco precalcula formatos");
const text = state.window.GeoRiskText;
for (const value of [null, undefined]) {
  assert.equal(state.formatNumber(value), "Sin datos");
  assert.equal(text.formatNumber(value), "Sin datos");
  assert.equal(state.formatPercentage(value), "0%");
  assert.equal(text.formatPercentage(value), "0%");
  assert.equal(state.formatInflation(value), "No data");
  assert.equal(text.formatInflation(value), "Sin datos");
  assert.equal(state.compactNumber(value), "Sin datos");
}
assert.equal(constructions, 0, "valores ausentes no crean formatos");

const numbers = [0, -0, 1, -1, 1234567.89123, NaN, Infinity, -Infinity, 1e22,
  "1234.56", " 7 ", "abc", false, true, [], [42], new Number(7), { valueOf: () => 12.345 }, 9007199254740993n];
for (const value of numbers) {
  const expected = Number(value).toLocaleString("es-AR");
  assert.equal(state.formatNumber(value), expected);
  assert.equal(text.formatNumber(value), expected);
}
assert.equal(constructions, 1, "formato estandar unico, sin cache por valor");
for (const value of [null, undefined, ""]) {
  assert.equal(state.formatNumber(value), "Sin datos");
  assert.equal(text.formatNumber(value), "Sin datos");
}
assert.throws(() => state.formatNumber(Symbol("invalid")), { name: "TypeError" });
assert.throws(() => text.formatNumber(Symbol("invalid")), { name: "TypeError" });

const percentage = value => `${value.toLocaleString("es-AR", {
  minimumFractionDigits: value >= 10 ? 1 : 2,
  maximumFractionDigits: value >= 10 ? 1 : 2
})}%`;
for (const value of [10, 99.99, Infinity, 10n]) {
  assert.equal(state.formatPercentage(value), percentage(value));
  assert.equal(text.formatPercentage(value), percentage(value));
}
assert.equal(constructions, 2, "un decimal se crea solo al requerirlo");
assert.equal(state.formatInflation("12,35%"), percentage(12.35));
assert.equal(text.formatInflation("12,35%"), state.formatInflation("12,35%"));
assert.equal(constructions, 2, "inflacion comparte un decimal con porcentajes");

for (const value of [0, -0, -15, 0.005, 9.995, -Infinity, 3n, "12.35", "", false, [1, 2], new Number(12)]) {
  assert.equal(state.formatPercentage(value), percentage(value));
  assert.equal(text.formatPercentage(value), percentage(value));
}
for (const value of [null, undefined, NaN]) {
  assert.equal(state.formatPercentage(value), "0%");
  assert.equal(text.formatPercentage(value), "0%");
}
assert.equal(constructions, 3, "solo dos formatos decimales fijos");
assert.equal(state.formatInflation(-1), "No data");
assert.equal(state.formatInflation(301), "No data");
assert.equal(text.formatInflation(-1), `${(-1).toLocaleString("es-AR", {
  minimumFractionDigits: 1, maximumFractionDigits: 1
})}%`);
assert.equal(text.formatInflation(null, { noDataLabel: "Missing" }), "Missing");

const compact = new Intl.NumberFormat("es-AR", { notation: "compact", maximumFractionDigits: 1 });
for (const value of [0, -0, "", false, 1234567, 1e22, -2000, Infinity, "12000", 1234567890123456789n]) {
  assert.equal(state.compactNumber(value), compact.format(Number(value)));
}
for (const value of [null, undefined, NaN, "invalid"]) assert.equal(state.compactNumber(value), "Sin datos");
assert.equal(constructions, 4, "compacto es el cuarto y ultimo formato");
for (let index = 0; index < 1000; index += 1) {
  state.formatNumber(index * 321.123);
  text.formatNumber(index);
  state.formatPercentage(index / 20);
  text.formatPercentage(index / 30);
  state.formatInflation(index % 301);
  text.formatInflation(index / 7);
  state.compactNumber(index * 10000);
}
assert.equal(constructions, 4, "miles de valores y ambos consumidores reutilizan cuatro instancias");
for (const name of calls.keys()) assert.ok(calls.get(name) > 1000, "consumer usa runtime: " + name);

for (const runtime of [{}, { numberFormats: {} }]) {
  const fallback = vm.createContext({ window: { GeoRiskRuntime: runtime }, t: () => "No data" });
  vm.runInContext(script.slice(0, script.indexOf("let {")) + functions, fallback);
  vm.runInContext(textSource, fallback);
  assert.equal(fallback.formatNumber(123456.789), Number(123456.789).toLocaleString("es-AR"));
  assert.equal(fallback.formatPercentage(9.995), percentage(9.995));
  assert.equal(fallback.compactNumber(1234567), compact.format(1234567));
  assert.equal(fallback.formatInflation(12.35), percentage(12.35));
  assert.equal(fallback.window.GeoRiskText.formatNumber(123456.789), fallback.formatNumber(123456.789));
  assert.equal(fallback.window.GeoRiskText.formatPercentage(9.995), fallback.formatPercentage(9.995));
  assert.equal(fallback.window.GeoRiskText.formatInflation(12.35), fallback.formatInflation(12.35));
}

console.log("number-formatting.test.js ok: cuatro formatos lazy compartidos, salida y fallbacks conservados");
