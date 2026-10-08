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
- `npm run release:tag` requires a clean tree and current `release:status` evidence, then refreshes `origin/main` without fetching tags. HEAD must exactly match that remote main before an annotated tag is created on the captured SHA. It rejects offline/auth failures and existing tags on a different commit, without moving them. A matching existing tag is a verified no-op. It never pushes automatically; its suggested push names only that tag, not main or other tags. The command does not replace GitHub's required checks/protection or make the remote ref immutable after the fetch.
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

- Country style changes compare the existing signature by component. A width-only update keeps the real fill/border material objects and an already disabled constant outline; fill/border color and opacity changes update their own properties. Successful completion commits the signature; a partial exception invalidates it so a later repair can restore every entity. Run `node scripts/tests/map-style-events.test.js` for real Cesium width/color/clamping/missing-border/error coverage, also included in green-coding/startup. Existing 2D/3D browser selection flows check width-only material identity without new pages or waits. Property-event reductions do not certify fewer GPU frames or resolution of the 20-minute CI deadline.
- Critical E2E reuses the active country layer's cached `getBounds()` instead of rescanning its polygons on every click candidate/focus attempt. In 3D with a visible globe it reuses the app's label horizon check before picking; 2D never applies that horizon check. Out-of-canvas/invalid points do not request a render or GPU pick. Every remaining candidate still needs a real country pick and mouse click; retry counts, settling waits, map quality and all selected flows are unchanged. Run `node scripts/tests/browser-map-pick.test.js` for deterministic checks of the actual helper with native Cesium vector math; also included in the release gates. Navigation and readiness waits log their elapsed time at their existing boundaries, with viewport width and tile requirement, without periodic sampling. These wait durations are diagnostics, not a startup benchmark or proof that the global CI deadline is fixed.
- Internal automation closes its own active subprocess tree on timeout or SIGINT/SIGTERM. It never targets processes by executable name or closes unrelated previews. Windows cleanup is hidden and bounded to 3 seconds after the original step has already failed; this is not extra execution time for a passing step. A cleanup failure blocks the command with an explicit diagnostic. POSIX children that create independent sessions, roots that already exited on Windows, SIGKILL or permission restrictions can escape this cleanup. Run `node scripts/tests/npm-runner.test.js` for the focused regression; it also runs in the release gates.
- `release:prepare` validates its arguments and reads/plans all release files before writing. Use a stable `MAJOR.MINOR.PATCH`, a real local-calendar `YYYY-MM-DD` date and a matching `YYYY-MM-DD-release-N` stamp; a new package version cannot reuse the current app stamp. Unknown options fail instead of silently preparing a different release.
- After an interrupted preparation or failed measurement, retry with the same explicit `--version`, `--date` and `--stamp`. Unchanged files are not rewritten; measurements still run unless `--skip-measure` is given. Omitting the version/stamp prepares another patch/stamp, not a retry. This preflight is not an atomic multi-file transaction: power loss or an I/O error during writes can still leave partial files. Inspect unreadable/truncated files before retrying; do not discard verified changelog notes to repair them.
- Run `npm run release:check` before publishing. It refreshes audits and browser measurements, then checks their combined status.
- Critical E2E overwrites `reports/critical-browser-e2e.json` at run start and checkpoints each selected flow before/after execution. The existing CI report upload includes it on failure. Check its scope, timestamps, CI run/revision and effective browser, not only `status`: focused/journey success is not a full release. Abrupt timeout/power loss leaves the last running flow and pending list, not proof of its cause or success. A missing/truncated checkpoint is not approval. The report is ignored by Git and excluded from production/precache; there are no periodic writes or accumulated snapshots. Run `node scripts/tests/browser-run-report.test.js` for deterministic failure/incomplete/teardown checks, also included in the release gates.
- Checkpoint replacement reuses the filesystem retry helper: at most three rename attempts with 40/80-ms waits only for recognized transient filesystem errors. Healthy writes replace once. It never deletes the previous checkpoint, repeats browser flows or extends a test deadline; persistent/non-retryable errors still fail the gate. A final replacement failure leaves the last running checkpoint, not proof of success. OneDrive/antivirus lock recovery is bounded, not guaranteed.
- Critical E2E alone shares a run-local cache of real anonymous World_Imagery JPEG/PNG responses. It has 256-entry/8-MiB LRU limits, a provider-freshness-bounded 10-minute TTL, 256-KiB body limits and four concurrent reads. Page fault/delay routes take precedence; failed/private/no-cache/authenticated responses still use the network. It never substitutes fixtures for country data or map geometry. Real service-worker/offline and performance tools do not import it. Its routing disables context HTTP caching, so use its final hit/byte counters and equivalent CI runs to assess net benefit; do not infer faster GPU work or raise deadlines. Run `node scripts/tests/browser-tile-cache.test.js` for the focused checks.
- `npm run release:status` reads the current evidence without rebuilding or launching a browser. Exit code 1 means a release blocker; read the printed reasons and `reports/release-status.json`.
- Missing/invalid reports, package/app/cache mismatches and changes since measurement block approval. FPS/long-task observations, an uncreated tag and a dirty working tree remain warnings, not automatic approval or performance guarantees.
- `npm run performance:snapshot` refreshes the 60-second desktop/mobile-emulated measurements. `--reuse-browser` only reuses complete measurements from the same inputs, build, meter and host within six hours.
- Browser E2E, offline and performance tools share `scripts/lib/browser-launch.js`. CI requests regular Chromium's new headless mode (`channel: chromium`), installed with `npx playwright install --with-deps --no-shell chromium`. Local runs prefer installed Chrome and retain the previous finite headless-shell fallback. Logs and snapshots identify the effective channel and version; an explicit `PLAYWRIGHT_CHANNEL` or CI request fails rather than substituting a mode. Use `PLAYWRIGHT_CHANNEL=headless-shell` only for deliberate old-mode diagnostics, after installing that binary separately. Missing, mismatched or fallback browser identity prevents measurement reuse. Browser mode is not a guarantee of hardware acceleration or speed; inspect the recorded GPU and compare equivalent environments. The full test and job deadlines remain unchanged.
- The snapshot records a SHA-256 fingerprint of current public sources, the dependency lockfile and measurement/build inputs. Release status recalculates it from sources, never from an existing `dist` manifest. Editing those inputs requires remeasurement even when byte counts are unchanged.
- `scripts/lib/public-assets.js` is the shared production allowlist. Adding a file there affects both the build and measurement validity; do not publish reports or internal scripts.
- Run `node scripts/tests/release-status.test.js` to test failure/exit behavior with isolated fixtures; it is also included in `npm test` through `test:release-gates`.
