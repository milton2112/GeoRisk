// Isolated experiment. Never writes the production engine or changes its quality.
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { patchPresentationScene, patchPresentationWidget } from './presentation-transform.js';
const enabledByDefault = process.argv[2] === '--compatibility';
if (process.argv.length !== (enabledByDefault ? 3 : 2)) throw new Error('Only --compatibility is accepted');
const root = process.cwd();
const out = path.join(root, 'reports/presentation-prototype');
await fs.mkdir(out, { recursive: true });
const fromRoot = name => import(pathToFileURL(path.join(root, name)));
const { build } = await fromRoot('node_modules/esbuild/lib/main.js');
const transforms = await Promise.all([
  ['cesium-release-pragmas', 'stripCesiumDebugPragmas'], ['cesium-evaluation-token', 'removeCesiumEvaluationToken'],
  ['cesium-csp', 'replaceKnockoutGlobalLookup'], ['cesium-text-readback', 'enableCesiumTextReadback'],
  ['cesium-hidden-billboards', 'skipHiddenCesiumBillboards'], ['cesium-resolution-resize', 'deferCesiumResolutionResize']
].map(async ([file, name]) => (await fromRoot(`scripts/lib/${file}.js`))[name]));
const result = await build({
  absWorkingDir: root, entryPoints: ['scripts/map-engine-entry.js'], outfile: path.join(out, 'engine-prototype.js'),
  bundle: true, minify: true, format: 'esm', target: 'es2020', write: false, legalComments: 'eof',
  define: { CESIUM_VERSION: '"1.127"' },
  banner: { js: '/*! Isolated GeoRisk deferred-presentation prototype. CesiumJS 1.127, Apache-2.0; original LICENSES.txt applies. NOT a production build. */' },
  plugins: [{ name: 'isolated-presentation', setup(builder) {
    builder.onLoad({ filter: /[\\/]@cesium[\\/].*\.js$/ }, async ({ path: file }) => {
      let s = await fs.readFile(file, 'utf8');
      for (const transform of transforms) s = transform(s, file);
      s = s.replace(/\r\n/g, '\n');
      if (/[/\\]engine[/\\]Source[/\\]Scene[/\\]Scene\.js$/.test(file)) s = patchPresentationScene(s, { enabledByDefault });
      if (/[/\\]engine[/\\]Source[/\\]Widget[/\\]CesiumWidget\.js$/.test(file)) s = patchPresentationWidget(s);
      return { contents: s, loader: 'js' };
    });
  }}]
});
const engine = result.outputFiles[0].contents;
await fs.writeFile(path.join(out, 'engine-prototype.js'), engine);
const metadata = { prototype: true, enabledByDefault, head: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  bytes: engine.length, sha256: createHash('sha256').update(engine).digest('hex'),
  extraTarget: 'RGBA8 + depth-stencil, one pixel-sized target; estimated attachment storage 8 bytes/pixel, not measured GPU RAM',
  optIn: 'scene._geoRiskPresentationEnabled; positively identified SwiftShader only, stopped-clock native loop, WebGL2, visible 2D, after first frame',
  rendererIdentity: 'One optional WEBGL_debug_renderer_info query per context; retain only context/boolean, unknown/error/hardware use native rendering',
  bounds: { maximumFences: 1, maximumQueries: 64, timeoutMs: 1500 },
  limitations: ['Experiment only; this revision requires its own Linux proof and production gate', 'One additional target and final textured quad per eligible frame',
    'Source-scoped lifecycle tests cover failure/stop/cleanup; full native API and context recovery coverage incomplete, not safe for shipping'] };
await fs.writeFile(path.join(out, 'build.json'), JSON.stringify(metadata, null, 2) + '\n');
console.log(JSON.stringify(metadata));
