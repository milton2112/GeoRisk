import fs from "node:fs/promises";
import path from "node:path";

const projectRoot = process.cwd();
const budgets = {
  "index.html": 35000,
  "style.css": 90000,
  "script.js": 700000,
  "sw.js": 7000,
  "data/countries_index.json": 240000,
  "data/geo_aliases.json": 5000,
  "data/world_countries_simplified.geo.json": 190000
};

const forbiddenStartupTokens = [
  "./data/countries_full.json\"",
  "./data/conflict_details.generated.json\"",
  "./data/raw/history.json\"",
  "./data/raw/politics.json\"",
  "./app-curation.js\"",
  "html2canvas",
  "jspdf"
];

let failed = false;

for (const [file, maxBytes] of Object.entries(budgets)) {
  const absolutePath = path.join(projectRoot, file);
  const stat = await fs.stat(absolutePath);
  if (stat.size > maxBytes) {
    failed = true;
    console.error(`${file} exceeds startup budget: ${stat.size} > ${maxBytes}`);
  } else {
    console.log(`${file}: ${stat.size}/${maxBytes} bytes`);
  }
}

const sw = await fs.readFile(path.join(projectRoot, "sw.js"), "utf8");
const indexHtml = await fs.readFile(path.join(projectRoot, "index.html"), "utf8");

for (const token of forbiddenStartupTokens) {
  if (sw.includes(token) || indexHtml.includes(token)) {
    failed = true;
    console.error(`startup-critical files include forbidden heavy token: ${token}`);
  }
}

if (failed) {
  process.exitCode = 1;
} else {
  console.log("startup budget ok");
}
