# GeoRisk Internal Contribution Guide

## Before Editing

- Run `git status --short` and do not overwrite unrelated work.
- Keep startup assets under the budgets enforced by `npm run check:startup-budget`.
- Prefer existing modules and helpers before adding new globals to `script.js`.

## UI / UX Rules

- Hubs and modals need clear loading, empty and offline states.
- Every clickable icon or compact control needs a `title` or `aria-label`.
- Text must wrap inside cards, buttons and chips on mobile.
- Keyboard users should be able to reach search, hubs, modals and saved views.
- Presentation mode should reduce chrome, not remove core controls.
- Teacher/docente mode should simplify language and avoid dense technical panels.

## Architecture Rules

- Put pure builders in `app-*.js` modules.
- Keep expensive work in workers or deferred modules.
- Update `ARCHITECTURE.md` when adding a new module or changing dependencies.
- Update `scripts/tests/startup-data.test.js` when changing startup/cache policy.
- Do not precache heavy datasets, reports, flags, coats, Cesium, html2canvas or jsPDF.

## Validation Checklist

Run:

```bash
npm test
```

For UI-heavy changes, also open the local smoke server and verify:

- desktop layout
- mobile viewport
- modal focus/close behavior
- offline/cache labels
- exported image/PDF button visibility

## Release Evidence

- Run `npm run release:check` before publishing. It refreshes audits and browser measurements, then checks their combined status.
- `npm run release:status` reads the current evidence without rebuilding or launching a browser. Exit code 1 means a release blocker; read the printed reasons and `reports/release-status.json`.
- Missing/invalid reports, package/app/cache mismatches and changes since measurement block approval. FPS/long-task observations, an uncreated tag and a dirty working tree remain warnings, not automatic approval or performance guarantees.
- `npm run performance:snapshot` refreshes the 60-second desktop/mobile-emulated measurements. `--reuse-browser` only reuses complete measurements from the same inputs, build, meter and host within six hours.
- The snapshot records a SHA-256 fingerprint of current public sources, the dependency lockfile and measurement/build inputs. Release status recalculates it from sources, never from an existing `dist` manifest. Editing those inputs requires remeasurement even when byte counts are unchanged.
- `scripts/lib/public-assets.js` is the shared production allowlist. Adding a file there affects both the build and measurement validity; do not publish reports or internal scripts.
- Run `node scripts/tests/release-status.test.js` to test failure/exit behavior with isolated fixtures; it is also included in `npm test` through `test:release-gates`.
