# GeoRisk Internal Contribution Guide

## Before Editing

- Read `AGENTS.md` and `GREEN_CODING.md`. Resource efficiency, sufficiency and transparent measurement apply to every change, without compromising accessibility, security or data quality.
- Run `git status --short` and do not overwrite unrelated work.
- Keep startup assets under the budgets enforced by `npm run check:startup-budget`.
- Prefer existing modules and helpers before adding new globals to `script.js`.

## Protected Main

- Work on a `codex/` or other task branch and open a PR into `main`; do not push changes directly to `main`.
- `main` requires the `release-gate` check from GitHub Actions (app ID 15368), an up-to-date branch and resolved review conversations. Protection also applies to administrators; force pushes and branch deletion are blocked.
- A PR is required, but zero approving reviewers are required so a solo maintainer can merge after the checks pass. Do not bypass or disable protection to publish a failing change.
- Create release tags on the integrated commit after successful validation. CI changes can remain under `Sin publicar` without invalidating the app cache just to change repository policy.
- Every workflow action must use a full upstream commit SHA. Verify the commit in the official action repository; the nearby version comment is informational. New local/Docker action types require an explicit policy and test review.
- Dependabot proposes grouped GitHub Actions updates weekly, with at most two open update PRs. Review permissions, runtime compatibility and upstream changes; do not automatically merge them. The normal gate still applies.
- Focused check: `node scripts/tests/actions-pinning.test.js`. It also runs through `test:release-gates` and `npm test`.

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

For map lifecycle/resource changes, run `npm run test:green-coding` first. It is also included in startup tests and the release gate. Record resource benefits, evidence and tradeoffs in the changelog/PR; do not infer energy or CO2 savings from timing or payload alone.

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
