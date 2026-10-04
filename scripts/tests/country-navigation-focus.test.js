import assert from "node:assert/strict";
import fs from "node:fs/promises";
import vm from "node:vm";

const state = { window: {} };
vm.runInNewContext(await fs.readFile(new URL("../../app-country-panel.js", import.meta.url), "utf8"), state);
const replace = state.window.GeoRiskCountryPanel.replaceProfileContent;
assert.equal(typeof replace, "function");

function fixture({ section = "country-section-history", outside = false, missing = false, disabled = false } = {}) {
  const focused = { dataset: section ? { countryNav: section } : {} };
  const body = { dataset: {} };
  const document = { activeElement: focused };
  let queries = 0;
  const calls = [];
  const replacement = {
    dataset: { countryNav: section }, disabled,
    focus(options) { calls.push(options); document.activeElement = this; }
  };
  const panel = {
    ownerDocument: document,
    contains: node => !outside && node === focused,
    set innerHTML(value) { this.html = value; if (!outside) document.activeElement = body; },
    querySelectorAll(selector) {
      assert.equal(selector, "[data-country-nav]", "no interpolar valores de datos en selectores");
      queries += 1;
      return missing ? [] : [replacement];
    }
  };
  return { panel, document, focused, replacement, calls, queries: () => queries };
}

const refreshed = fixture();
replace(refreshed.panel, "<p>Profile</p>", { preserveNavigationFocus: true });
assert.equal(refreshed.panel.html, "<p>Profile</p>");
assert.equal(refreshed.document.activeElement, refreshed.replacement);
assert.equal(refreshed.calls.length, 1);
assert.equal(refreshed.calls[0].preventScroll, true);

for (const options of [{ outside: true }, { section: null }, { missing: true }, { disabled: true }]) {
  const test = fixture(options);
  replace(test.panel, "Updated", { preserveNavigationFocus: true });
  assert.equal(test.calls.length, 0, "sin foco inventado o fuera del panel");
}
for (const preserveNavigationFocus of [false, undefined]) {
  const test = fixture();
  replace(test.panel, "Other country", { preserveNavigationFocus });
  assert.equal(test.calls.length, 0, "abrir otra ficha no restaura navegacion de la anterior");
  assert.equal(test.queries(), 0, "sin buscar botones si no hay foco que conservar");
}
const unusual = fixture({ section: '\"] [data-other="x' });
replace(unusual.panel, "Updated", { preserveNavigationFocus: true });
assert.equal(unusual.calls.length, 1, "comparar identidad de seccion como texto, no selector");
console.log("country-navigation-focus.test.js ok: foco local conservado sin listeners ni selectores interpolados");
