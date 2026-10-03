# GeoRisk Architecture

GeoRisk keeps runtime files in the repository root for now. The project is split into small browser modules. Only the Cesium vendor dependency is bundled; this does not require moving the app into `src/`.

## Runtime Layers

- `index.html`: app shell and stable DOM anchors.
- `style.css`: shared visual system, responsive layout, modal/hub polish.
- `script.js`: legacy orchestrator. It wires modules, data loading, map lifecycle and event listeners.
- `app-store.js`: central UI store for cross-module state snapshots.
- `app-ui-polish.js`: tooltips, focus helpers, keyboard a11y and compact label metadata.
- `app-map.js`, `app-map-styles.js`, `app-map-interactions.js`: map renderer decisions, country styling, interaction tuning and the pure consecutive-motion FPS controller. The runtime owns Cesium/visibility listeners and quality changes; the boot scheduler owns startup metrics and completion.
- `app-map-engine.js`: single, bounded ESM import of the local Cesium subset. It inherits the loader's release query and deployment subdirectory. Cesium workers/assets still use the pinned external `CESIUM_BASE_URL`.
- `scripts/map-engine-entry.js` and `scripts/buildMapEngine.js`: explicit Cesium API surface and reproducible vendor build. Generated `vendor/cesium` files are tracked so source previews work; production verifies them against the lockfile-installed packages before copying them. Add new Cesium exports here, regenerate and run map/browser tests. Never edit the minified output manually.
- `app-country-panel.js`: country renderer helpers.
- `app-timeline-conflicts.js`: timeline and conflict rendering helpers.
- `app-search.js`, `app-search-worker.js`: search parsing, aliases and worker index work.
- `app-rankings.js`, `app-rankings-worker.js`: ranking formulas, score components and worker ranking work.
- `app-compare-ui.js`: comparison model and render helpers.
- `app-quiz-ui.js`: quiz engine helpers and render helpers.
- `app-news-ui.js`: deferred, pure news hub render helpers, including accessible status cards. The orchestrator owns the selected country/topic/language and a single cancellable request; changing selection, closing/hiding, offline or Save-Data invalidates it. Each request attempt has a 2500 ms deadline through body parsing, with timer/listener cleanup. Valid raw headlines use a page-local LRU cache: at most 16 country/topic entries, 4 bounded-field headlines each, 20-minute TTL, expiry on access. Locale changes reuse raw results; errors and cancellations are not cached. Closed/hidden hubs skip country scans, and reopening/reconnecting never resumes optional downloads automatically. JSON response bytes are not independently capped; these limits bound retained cache fields, not peak parsing memory.
- `app-export-share.js`: deferred export/share helpers and lazy third-party export libraries. PNG/PDF share a capture pipeline and a private in-flight flag, set before library loading; cross-format duplicate actions return false with the existing accessible notice. Report construction/capture/encoding/save failures return false, release the flag and remove capture DOM in finally; completed canvas dimensions are reset to zero after encoding. No speculative clones, queue, export timeout or new dependencies; unresolved captures require reload. true means download handoff, not confirmed disk storage. A separate private in-flight flag deduplicates text-sharing actions, with finally-based cleanup. Native AbortError never falls through to copying; other native failures may use the existing clipboard fallback. Clipboard failures/API absence resolve with truthful accessible feedback, not an unhandled rejection or success claim. Native resolution means handoff, not confirmed delivery. Text sharing imports the existing small asset manifest, but never loads canvas/PDF libraries, creates capture DOM or starts a monitor.
- Export capture uses a private 4000000-pixel / 8192-px-side output budget, not a browser capability guarantee. Preferred scale may decrease to 1, never lower; larger base layouts return false with an accessible size/retry notice rather than cropping or adding PDF pages. Measure before html2canvas, then update the same options.scale in onclone after font/layout preparation and before output renderer allocation (verified against the pinned library and real Chrome). Check returned canvas dimensions and nonempty PNG data URL before encoding/download. Finally removes the owned clone iframe obtained in onclone even if that callback rejects; earlier internal cloning failures cannot supply that reference. Output pixel limits do not bound total DOM/map-clone, base64 or PDF memory, and the final dimension check cannot prevent an unexpected allocation already made by the library. No capture DOM exists before a user export; text sharing is unaffected.
- `app-help-ui.js`: deferred public help/onboarding copy.
- Export orchestration captures context before the deferred-module wait and supplies an optional isCurrent guard. A small serialized key covers language/theme/app mode, country/context, comparison selection/benchmark and ranking filters/selection; disconnected targets or hidden ancestors invalidate the action. The export module checks before loading libraries and before cloning, with accessible feedback and no speculative clone or automatic retry. Once capture starts, its detached report is a coherent snapshot and may finish after the live UI changes. This does not observe every DOM mutation or freeze dataset revisions with unchanged selection; text sharing does not acquire export guards.
- The orchestrator's deferred UI loader accepts only its own registered names, shares pending imports and keeps successful promises. Recognized fetch failures remove the failed promise and allow a subsequent request to use one of two bounded retry URLs (three total attempts per module/page). There is no reconnect listener, timer or automatic retry loop. Exhaustion, unrecognized errors and code failures request a reload through the existing optional toast; code failures do not re-evaluate partial side effects. Failed transitive dependency URLs may still require a reload. The failure map is bounded by the 14 registered modules and does not persist. Startup tests cover lifecycle/limits; the critical browser `--deferred-only` flow covers an actual interrupted module download and keyboard recovery on desktop/mobile emulation.
- `app-performance-ui.js`, `app-risk-radar-ui.js`, `app-conflict-audit-ui.js`, `app-project-audit-ui.js`: deferred internal panels.
- `app-conflict-aliases.js`, `app-conflict-rules.js`, `app-curation.js`: deferred conflict aliases, hierarchy rules and deep curation used by country history/military detail.
- The classic-script loader shares in-flight DOM scripts and reuses successful globals. It removes failed nodes and both event listeners on completion, and requires the expected API before marking a script loaded. Failed deep-curation promises are discarded; reopening a history/military section can retry only the failed script, with accessible feedback and no automatic loop. A request that never emits load/error remains pending; no speculative retry or timeout can cause concurrent classic-script evaluation. Startup tests and the existing critical browser `--conflict-curation-only` flow cover partial loading, interruption and explicit keyboard recovery.
- `sw.js`: offline shell/runtime cache policy.
- `scripts/lib/public-assets.js`: production file/directory allowlist shared by the build and performance evidence. Internal tooling only; it is not shipped to browsers.
- `scripts/lib/performance-inputs.js`: deterministic source/dependency/meter fingerprint for `performanceSnapshot.js` and `releaseStatus.js`. The snapshot also keys reuse by built assets and environment; release status checks the current sources even when `dist` is missing or stale.

## Test Tooling

- `scripts/lib/browser-screenshot.js`: used only by the critical browser E2E. Live-locator capture retries once exclusively for a detached node during a deferred render, followed by caller state checks. Transient-notice capture instead checks role=status, visible state and viewport bounds in one DOM query, then crops the page with bounded transition padding and screenshot-only animation disabling; it does not wait for locator stability or change the runtime notice timer. It does not retry assertions, flows, timeouts or other browser errors. An expired notice or failed screenshot still fails the test.
- `scripts/tests/browser-screenshot.test.js`: deterministic retry-boundary and transient-notice role/visibility/viewport/capture-error checks included by the release gates. Neither file is published or loaded by the app.
- `scripts/tests/critical-browser-e2e.test.js`: retains all focused flows and desktop/mobile journeys, with bounded per-flow elapsed-time logs. The quiet-scheduler drag fixture uses native input at six endpoints rather than oversampling each segment; it retains sustained contact, both idle-API variants, pauses, deadlines, camera displacement and once-only execution checks. The global 20-minute npm-test deadline is unchanged; timing logs are diagnostic, not app telemetry or energy measurements.
- `scripts/tests/export-lifecycle.test.js`: isolated capture/context/concurrency/failure checks, including output bounds, final cloned layout, empty encoding and explicit recovery without allocating huge pixel buffers. The existing browser export flow also checks preflight rejection and a rejected real-library clone, owned iframe cleanup and real PNG/PDF dimensions/content on desktop/mobile emulation; no additional pages or successful captures.
- Release workflow concurrency separates scheduled audits from releases per ref; obsolete runs within the same group still stop. Push/manual releases share their group, and deployment remains gated by the full checks.

## Data Curation

- `scripts/lib/conflict-curation-*.js` holds source-backed correction batches, including Taraca, Pecos and Sunset Pass. `scripts/applyConflictAutofix.js` applies their aliases, country links and historical details to internal datasets; these modules are never shipped to the browser.
- `scripts/buildDataIndexes.js` derives public country profiles, light indexes and per-conflict detail shards. Full sources and curation notes stay in on-demand detail; do not copy source documents into startup assets.
- Curation regressions run through `scripts/tests/conflict-autofix.test.js` and check dates, hierarchy, source limitations, uniqueness and consistency across generated outputs.

## State Direction

New code should prefer `window.GeoRiskStore.store` for shared UI state and keep local state private to a module when it does not need cross-module visibility.

Use this flow:

1. Data access loads or derives structured data.
2. Pure helpers compute display models.
3. Render helpers return markup or DOM-neutral values.
4. `script.js` only wires events, calls modules and updates the store.

## Module Dependency Rules

- Apply `GREEN_CODING.md` to resource decisions. Geometry is prepared only for the requested mode; Save-Data keeps simplified borders. FPS polling is limited to visible camera motion within the startup window; the render-recovery watchdog is visibility-bound and disposed on terminal failure.
- The orchestrator owns one page-lifetime reduced-motion media query/listener. It disables animated camera focus/morphs and suppresses persisted auto-rotation on startup without overwriting the stored choice; explicit rotation remains opt-in. A live change completes pending flights/morphs and stops rotation without polling.
- Pure modules should not fetch data or touch global DOM.
- UI modules may accept escaped strings and return markup, but should not attach global listeners.
- Workers should own expensive indexing/ranking work.
- Deferred modules must stay out of `index.html` and `APP_SHELL` unless they are required before first interaction.
- Service worker config should keep heavy datasets, flags, coats and reports out of initial precache.
- Country profile shards should keep heavy conflict lists in `data/countries/conflicts/*.json` and load them only when the military section opens.

## Naming Conventions

- `build*`: pure model or markup builder.
- `render*`: writes visible UI.
- `setup*`: attaches event listeners.
- `get*`: reads derived data without mutation.
- `ensure*`: lazy-loads or initializes once.
- `apply*`: mutates user-visible state.

## Migration Plan

Keep the root module layout for now. If the app itself is bundled later, consider moving modules into:

- `src/core/`: store, scheduler, pure helpers.
- `src/data/`: data access and index loaders.
- `src/map/`: renderer, styles, interactions.
- `src/ui/`: country, timeline, conflicts, hubs, modals.
- `src/features/`: search, rankings, quiz, news, compare.
