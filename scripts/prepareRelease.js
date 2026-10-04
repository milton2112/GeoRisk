import path from "node:path";
import { parseArgs } from "node:util";
import { readFileWithRetry, writeFileWithRetry } from "./lib/resilient-fs.js";
import { runNpmStep } from "./lib/npm-runner.js";

const projectRoot = path.resolve(process.cwd());
const { values: args } = parseArgs({
  options: {
    version: { type: "string" },
    date: { type: "string" },
    stamp: { type: "string" },
    "skip-measure": { type: "boolean" }
  },
  strict: true,
  allowPositionals: false
});

function validateVersion(version) {
  if (typeof version !== "string" || !/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(version)
    || !version.split(".").every(part => Number.isSafeInteger(Number(part)))) {
    throw new Error(`Version semantica estable invalida: ${version}`);
  }
  return version;
}

function bumpPatch(version) {
  const [major, minor, patch] = validateVersion(version).split(".").map(Number);
  return validateVersion(`${major}.${minor}.${patch + 1}`);
}

function validateDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`Fecha de release invalida: ${value}`);
  }
  const [year, month, day] = value.split("-").map(Number);
  const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const days = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (year < 1 || month < 1 || month > 12 || day < 1 || day > days[month - 1]) {
    throw new Error(`Fecha de release invalida: ${value}`);
  }
  return value;
}

function validateStamp(stamp, date) {
  const match = typeof stamp === "string" && stamp.match(/^(\d{4}-\d{2}-\d{2})-release-([1-9]\d*)$/);
  if (!match || match[1] !== date || !Number.isSafeInteger(Number(match[2]))) {
    throw new Error(`Stamp de cache invalido para ${date}: ${stamp}`);
  }
  return stamp;
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

function versionConstant(source, name) {
  const matches = [...source.matchAll(new RegExp(`\\bconst ${name} = "([^"\\r\\n]+)";`, "g"))];
  if (matches.length !== 1) throw new Error(`Se requiere una unica constante ${name}; encontradas: ${matches.length}`);
  return matches[0];
}

function updateVersionConstant(source, name, versionStamp) {
  const match = versionConstant(source, name);
  return source.replace(match[0], `const ${name} = "${versionStamp}";`);
}

function updateHtmlQueryStrings(source, versionStamp) {
  if (!/\?v=[^"'\s<>]+/.test(source)) throw new Error("index.html no contiene referencias versionadas");
  return source.replace(/\?v=[^"'\s<>]+/g, `?v=${versionStamp}`);
}

function requireJsonObject(value, name) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`${name} debe contener un objeto JSON`);
  return value;
}

function parseJsonObject(source, name) {
  return requireJsonObject(JSON.parse(source), name);
}

async function readOptionalSource(file) {
  try {
    return await readFileWithRetry(file, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

function buildDefaultReleaseNotes(versionStamp) {
  return [
    "- Prepara una nueva version de mantenimiento con mediciones y auditorias actualizadas.",
    `- Actualiza \`APP_VERSION\` y \`CACHE_VERSION\` a \`${versionStamp}\`.`
  ].join("\n");
}

function getUnpublishedNotes(source) {
  const match = source.match(/## Sin publicar\n\n([\s\S]*?)(?=\n## v|$)/);
  const notes = (match?.[1] || "")
    .replace(/^- Se documentaran aca los cambios posteriores a v[\d.]+ antes de cerrar la siguiente version\.$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return notes;
}

function updateChangelog(source, version, versionStamp, date) {
  source = source.replace(/\r\n?/g, "\n");
  const sectionTitle = `## v${version} - ${date}`;
  const unpublished = `## Sin publicar\n\n- Se documentaran aca los cambios posteriores a v${version} antes de cerrar la siguiente version.`;
  const currentPattern = new RegExp(`(?:^|\\n)## v${version.replace(/\./g, "\\.")} - [^\\n]+\\n([\\s\\S]*?)(?=\\n## |$)`);
  const current = source.match(currentPattern);
  const notes = [current?.[1]?.trim(), getUnpublishedNotes(source)].filter(Boolean).join("\n")
    .replace(/^- Actualiza `APP_VERSION` y `CACHE_VERSION` a `[^`]+`\.$/gm, "").trim();
  const versionNote = `- Actualiza \`APP_VERSION\` y \`CACHE_VERSION\` a \`${versionStamp}\`.`;
  const releaseNotes = notes ? `${notes}\n${versionNote}` : buildDefaultReleaseNotes(versionStamp);
  const releaseSection = `${sectionTitle}\n\n${releaseNotes}`;
  const withoutCurrentRelease = current ? source.replace(currentPattern, "") : source;
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

// Resolve the complete bounded plan before the first write. This is not a multi-file transaction.
const packageSource = await readFileWithRetry(packagePath, "utf8");
const packageJson = parseJsonObject(packageSource, "package.json");
const currentScript = await readFileWithRetry(scriptPath, "utf8");
const currentStamp = versionConstant(currentScript, "APP_VERSION")[1];
const releaseDate = validateDate(args.date ?? today());
const nextVersion = validateVersion(args.version ?? bumpPatch(packageJson.version));
const nextVersionStamp = validateStamp(args.stamp ?? nextStamp(currentStamp, releaseDate), releaseDate);
if (nextVersionStamp === currentStamp && nextVersion !== packageJson.version) {
  throw new Error("Una version de paquete nueva requiere un stamp de cache nuevo");
}
const lockSource = await readOptionalSource(packageLockPath);
const swSource = await readFileWithRetry(swPath, "utf8");
const indexSource = await readFileWithRetry(indexPath, "utf8");
const changelogSource = await readFileWithRetry(changelogPath, "utf8");
const plan = [];
const planFile = (file, previous, next) => plan.push({ file, previous, next });
if (packageJson.version !== nextVersion) {
  packageJson.version = nextVersion;
  planFile(packagePath, packageSource, `${JSON.stringify(packageJson, null, 2)}\n`);
}
if (lockSource !== null) {
  const packageLock = parseJsonObject(lockSource, "package-lock.json");
  if (packageLock.packages !== undefined) {
    requireJsonObject(packageLock.packages, "package-lock.json packages");
    if (Object.hasOwn(packageLock.packages, "")) {
      requireJsonObject(packageLock.packages[""], "package-lock.json packages[\"\"]");
    }
  }
  const changed = packageLock.version !== nextVersion
    || (packageLock.packages?.[""] && packageLock.packages[""].version !== nextVersion);
  packageLock.version = nextVersion;
  if (packageLock.packages?.[""]) packageLock.packages[""].version = nextVersion;
  if (changed) planFile(packageLockPath, lockSource, `${JSON.stringify(packageLock, null, 2)}\n`);
}
planFile(scriptPath, currentScript, updateVersionConstant(currentScript, "APP_VERSION", nextVersionStamp));
planFile(swPath, swSource, updateVersionConstant(swSource, "CACHE_VERSION", nextVersionStamp));
planFile(indexPath, indexSource, updateHtmlQueryStrings(indexSource, nextVersionStamp));
planFile(changelogPath, changelogSource, updateChangelog(changelogSource, nextVersion, nextVersionStamp, releaseDate));
const changes = plan.filter(item => item.next !== item.previous);
for (const { file, next } of changes) await writeFileWithRetry(file, next);

console.log(`Version paquete: ${nextVersion}`);
console.log(`APP_VERSION/CACHE_VERSION: ${nextVersionStamp}`);
console.log(`Archivos actualizados: ${changes.length}`);

if (!args["skip-measure"]) {
  await runStep("medicion de arranque", "npm", ["run", "measure:startup"]);
  await runStep("auditoria de proyecto", "npm", ["run", "audit:project"]);
  await runStep("auditoria de datos programable", "npm", ["run", "audit:data"]);
  await runStep("snapshot de performance", "npm", ["run", "performance:snapshot"]);
}

console.log("\nRelease preparada.");
