import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { build } from "esbuild";
import { stripCesiumDebugPragmas } from "./lib/cesium-release-pragmas.js";
import { removeCesiumEvaluationToken } from "./lib/cesium-evaluation-token.js";

const root = process.cwd();
const outputDirectory = "vendor/cesium";
const outputPath = `${outputDirectory}/engine.js`;
const check = process.argv.includes("--check");
const hash = value => createHash("sha256").update(value).digest("hex");
const result = await build({
  entryPoints: ["scripts/map-engine-entry.js"], outfile: outputPath,
  bundle: true, minify: true, format: "esm", target: "es2020",
  write: false, metafile: true, legalComments: "eof",
  define: { CESIUM_VERSION: '"1.127"' },
  banner: { js: "/*! GeoRisk subset of CesiumJS 1.127. Copyright 2011-2024 CesiumJS Contributors.\n * Modified distribution: selected exports, tree shaking, release debug and evaluation token removal.\n * Apache-2.0 and third-party notices: see LICENSES.txt in this directory. */" },
  plugins: [{
    name: "cesium-release-pragmas",
    setup(builder) {
      builder.onLoad({ filter: /[\\/]@cesium[\\/].*\.js$/ }, async ({ path: file }) => ({
        contents: removeCesiumEvaluationToken(stripCesiumDebugPragmas(await fs.readFile(file, "utf8"), file), file), loader: "js"
      }));
    }
  }]
});

// Preserve the full licenses/notices of every package contributing to the bundle.
const packageRoots = new Set();
for (const input of Object.keys(result.metafile.inputs)) {
  if (!input.startsWith("node_modules/")) continue;
  let directory = path.dirname(path.resolve(root, input));
  while (directory !== root) {
    if (await fs.access(path.join(directory, "package.json")).then(() => true, () => false)) {
      packageRoots.add(directory);
      break;
    }
    directory = path.dirname(directory);
  }
  if (directory === root) throw new Error(`Missing package metadata for ${input}`);
}
const packages = [];
for (const directory of packageRoots) {
  const metadata = JSON.parse(await fs.readFile(path.join(directory, "package.json"), "utf8"));
  const names = (await fs.readdir(directory)).filter(name => /^(license|licence|copying|notice)(\.|$)/i.test(name)).sort();
  const notices = [];
  for (const name of names) {
    notices.push(`${name}\n${(await fs.readFile(path.join(directory, name), "utf8")).replace(/\r\n/g, "\n").trim()}`);
  }
  const inlineLicense = {
    "mersenne-twister": ["src/mersenne-twister.js", "Copyright (C) 1997 - 2002", "THIS SOFTWARE IS PROVIDED"],
    lerc: ["LercDecode.js", "Copyright 2015-2018 Esri", "Contributors:"]
  }[metadata.name];
  if (inlineLicense) {
    const [file, copyright, end] = inlineLicense;
    const source = await fs.readFile(path.join(directory, file), "utf8");
    const license = [...source.matchAll(/\/\*[\s\S]*?\*\//g)].find(([block]) => block.includes(copyright))?.[0];
    if (!license?.includes(end)) throw new Error(`Missing ${metadata.name} inline license`);
    notices.push(`${file} license header\n${license.replace(/\r\n/g, "\n")}`);
  }
  if (metadata.name === "bitmap-sdf") {
    const readme = await fs.readFile(path.join(directory, "readme.md"), "utf8");
    const notice = readme.split("## License")[1]?.trim();
    if (!notice?.includes("(c) 2017 Dima Yv. MIT License")) throw new Error("Missing bitmap-sdf notice");
    notices.push(`readme.md license notice\n${notice.replace(/\r\n/g, "\n")}`);
  }
  if (!notices.length) throw new Error(`Missing license/notice for ${metadata.name}`);
  packages.push({ name: metadata.name, version: metadata.version, license: metadata.license, notices });
}
packages.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
const licenses = packages.map(pkg => `===== ${pkg.name}@${pkg.version} (${pkg.license}) =====\n\n${pkg.notices.join("\n\n")}`).join("\n\n") + "\n";
const engine = result.outputFiles.find(file => file.path.endsWith("engine.js"))?.contents;
if (!engine) throw new Error("Map engine build did not produce engine.js");
const manifest = {
  cesiumVersion: "1.127", enginePath: outputPath,
  exports: result.metafile.outputs[outputPath].exports.slice().sort(),
  packages: packages.map(({ name, version, license }) => ({ name, version, license })),
  artifacts: [
    { path: outputPath, bytes: engine.length, sha256: hash(engine) },
    { path: `${outputDirectory}/LICENSES.txt`, bytes: Buffer.byteLength(licenses), sha256: hash(licenses) }
  ]
};
const files = [
  [outputPath, engine], [`${outputDirectory}/LICENSES.txt`, Buffer.from(licenses)],
  [`${outputDirectory}/manifest.json`, Buffer.from(JSON.stringify(manifest, null, 2) + "\n")]
];
for (const [file, contents] of files) {
  const existing = await fs.readFile(file).catch(() => null);
  if (existing?.equals(contents)) continue;
  if (check) throw new Error(`${file} is stale or missing. Run npm run build:map-engine.`);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, contents);
}
console.log(`Map engine ${check ? "verified" : "built"}: ${engine.length} bytes, ${manifest.exports.length} exports; licenses included.`);
