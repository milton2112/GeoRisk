import assert from "node:assert/strict";
import fs from "fs-extra";
import path from "node:path";

const projectRoot = path.resolve(process.cwd());
const visibleFiles = [
  "index.html",
  "style.css",
  "app-risk-radar-ui.js",
  "app-conflict-audit-ui.js",
  "app-project-audit-ui.js",
  "app-news-ui.js",
  "app-compare-ui.js",
  "app-quiz-ui.js",
  "app-performance-ui.js"
];

const forbiddenVisibleTokens = [
  "boot-floating-chip",
  "boot-profile-chip",
  "Arranque: pendiente",
  "Boot: pending",
  "Ãƒ",
  "Ã‚",
  "Â¿",
  "Â¡",
  "â–",
  "�"
];

for (const file of visibleFiles) {
  const text = await fs.readFile(path.join(projectRoot, file), "utf8");
  for (const token of forbiddenVisibleTokens) {
    assert.ok(!text.includes(token), `${file} no debe exponer token visual roto: ${token}`);
  }
}

const css = await fs.readFile(path.join(projectRoot, "style.css"), "utf8");
assert.ok(css.includes("#map-toolbar .toolbar-content") || css.includes(".toolbar-content"));
assert.ok(css.includes("overflow-y: auto"), "panel de capas debe tener scroll vertical propio");
assert.ok(css.includes("overscroll-behavior: contain"), "panel de capas debe contener el scroll");
assert.ok(css.includes("position: sticky"), "cabecera del panel de capas debe quedar fija al scrollear");

console.log("visual-hygiene.test.js ok");
