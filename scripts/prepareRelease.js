import fs from "fs-extra";
import path from "node:path";
import { readFileWithRetry, writeFileWithRetry, writeJsonWithRetry } from "./lib/resilient-fs.js";
import { runNpmStep } from "./lib/npm-runner.js";

const projectRoot = path.resolve(process.cwd());
const args = process.argv.slice(2);

function readArg(name) {
  const direct = args.find(item => item.startsWith(`--${name}=`));
  if (direct) return direct.slice(name.length + 3);
  const index = args.indexOf(`--${name}`);
  return index >= 0 ? args[index + 1] : null;
}

function hasFlag(name) {
  return args.includes(`--${name}`);
}

function bumpPatch(version) {
  const [major, minor, patch] = String(version || "0.0.0")
    .split(".")
    .map(part => Number.parseInt(part, 10));
  if (![major, minor, patch].every(Number.isFinite)) {
    throw new Error(`Version semantica invalida: ${version}`);
  }
  return `${major}.${minor}.${patch + 1}`;
}

function today(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function nextStamp(currentStamp, date) {
  const match = String(currentStamp || "").match(new RegExp(`^${date}-release-(\\d+)$`));
  const nextRelease = match ? Number.parseInt(match[1], 10) + 1 : 1;
  return `${date}-release-${nextRelease}`;
}

function updateAppVersion(source, versionStamp) {
  const next = source.replace(/const APP_VERSION = "[^"]+";/, `const APP_VERSION = "${versionStamp}";`);
  if (next === source) {
    throw new Error("No se encontro const APP_VERSION en script.js");
  }
  return next;
}

function updateCacheVersion(source, versionStamp) {
  const next = source.replace(/const CACHE_VERSION = "[^"]+";/, `const CACHE_VERSION = "${versionStamp}";`);
  if (next === source) {
    throw new Error("No se encontro const CACHE_VERSION en sw.js");
  }
  return next;
}

function updateHtmlQueryStrings(source, versionStamp) {
  return source.replace(/\?v=[^"'\s<>]+/g, `?v=${versionStamp}`);
}

function buildDefaultReleaseNotes(versionStamp) {
  return [
    "- Prepara una nueva version de mantenimiento con mediciones y auditorias actualizadas.",
    `- Actualiza \`APP_VERSION\` y \`CACHE_VERSION\` a \`${versionStamp}\`.`
  ].join("\n");
}

function getUnpublishedNotes(source, versionStamp) {
  const match = source.match(/## Sin publicar\n\n([\s\S]*?)(?=\n## v|$)/);
  const notes = match?.[1]?.trim() || "";
  const isPlaceholder = /^- Se documentaran aca los cambios posteriores a v[\d.]+ antes de cerrar la siguiente version\.$/.test(notes);
  if (!notes || isPlaceholder) {
    return buildDefaultReleaseNotes(versionStamp);
  }

  return notes.includes("APP_VERSION") || notes.includes("CACHE_VERSION")
    ? notes
    : `${notes}\n- Actualiza \`APP_VERSION\` y \`CACHE_VERSION\` a \`${versionStamp}\`.`;
}

function updateChangelog(source, version, versionStamp, date) {
  const sectionTitle = `## v${version} - ${date}`;
  const unpublished = `## Sin publicar\n\n- Se documentaran aca los cambios posteriores a v${version} antes de cerrar la siguiente version.`;
  const releaseSection = `${sectionTitle}\n\n${getUnpublishedNotes(source, versionStamp)}`;

  const withoutCurrentRelease = source.includes(sectionTitle)
    ? source.replace(new RegExp(`\\n${sectionTitle.replace(/\./g, "\\.")}[\\s\\S]*?(?=\\n## v|$)`), "")
    : source;
  const match = withoutCurrentRelease.match(/## Sin publicar[\s\S]*?(?=\n## v|$)/);
  if (!match) {
    return `${withoutCurrentRelease.trimEnd()}\n\n${unpublished}\n\n${releaseSection}\n`;
  }
  return withoutCurrentRelease.replace(match[0], `${unpublished}\n\n${releaseSection}\n`);
}

function runStep(label, _command, stepArgs) {
  return runNpmStep(label, stepArgs, { cwd: projectRoot });
}

const packagePath = path.join(projectRoot, "package.json");
const packageLockPath = path.join(projectRoot, "package-lock.json");
const scriptPath = path.join(projectRoot, "script.js");
const swPath = path.join(projectRoot, "sw.js");
const indexPath = path.join(projectRoot, "index.html");
const changelogPath = path.join(projectRoot, "CHANGELOG.md");

const packageJson = await fs.readJson(packagePath);
const currentScript = await readFileWithRetry(scriptPath, "utf8");
const currentStamp = currentScript.match(/const APP_VERSION = "([^"]+)"/)?.[1] || "";
const releaseDate = readArg("date") || today();
const nextVersion = readArg("version") || bumpPatch(packageJson.version);
const nextVersionStamp = readArg("stamp") || nextStamp(currentStamp, releaseDate);

packageJson.version = nextVersion;
await writeJsonWithRetry(packagePath, packageJson, { spaces: 2 });

if (await fs.pathExists(packageLockPath)) {
  const packageLock = await fs.readJson(packageLockPath);
  packageLock.version = nextVersion;
  if (packageLock.packages?.[""]) {
    packageLock.packages[""].version = nextVersion;
  }
  await writeJsonWithRetry(packageLockPath, packageLock, { spaces: 2 });
}

await writeFileWithRetry(scriptPath, updateAppVersion(currentScript, nextVersionStamp));
await writeFileWithRetry(swPath, updateCacheVersion(await readFileWithRetry(swPath, "utf8"), nextVersionStamp));
await writeFileWithRetry(indexPath, updateHtmlQueryStrings(await readFileWithRetry(indexPath, "utf8"), nextVersionStamp));
await writeFileWithRetry(
  changelogPath,
  updateChangelog(await readFileWithRetry(changelogPath, "utf8"), nextVersion, nextVersionStamp, releaseDate)
);

console.log(`Version paquete: ${nextVersion}`);
console.log(`APP_VERSION/CACHE_VERSION: ${nextVersionStamp}`);

if (!hasFlag("skip-measure")) {
  await runStep("medicion de arranque", "npm", ["run", "measure:startup"]);
  await runStep("auditoria de proyecto", "npm", ["run", "audit:project"]);
  await runStep("auditoria de datos programable", "npm", ["run", "audit:data"]);
  await runStep("snapshot de performance", "npm", ["run", "performance:snapshot"]);
}

console.log("\nRelease preparada.");
