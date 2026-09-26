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
- `app-news-ui.js`: news hub render helpers.
- `app-export-share.js`: deferred export/share helpers and lazy third-party export libraries.
- `app-help-ui.js`: deferred public help/onboarding copy.
- `app-performance-ui.js`, `app-risk-radar-ui.js`, `app-conflict-audit-ui.js`, `app-project-audit-ui.js`: deferred internal panels.
- `app-conflict-aliases.js`, `app-conflict-rules.js`, `app-curation.js`: deferred conflict aliases, hierarchy rules and deep curation used by country history/military detail.
- `sw.js`: offline shell/runtime cache policy.
- `scripts/lib/public-assets.js`: production file/directory allowlist shared by the build and performance evidence. Internal tooling only; it is not shipped to browsers.
- `scripts/lib/performance-inputs.js`: deterministic source/dependency/meter fingerprint for `performanceSnapshot.js` and `releaseStatus.js`. The snapshot also keys reuse by built assets and environment; release status checks the current sources even when `dist` is missing or stale.

## State Direction

New code should prefer `window.GeoRiskStore.store` for shared UI state and keep local state private to a module when it does not need cross-module visibility.

Use this flow:

1. Data access loads or derives structured data.
2. Pure helpers compute display models.
3. Render helpers return markup or DOM-neutral values.
4. `script.js` only wires events, calls modules and updates the store.

## Module Dependency Rules

- Apply `GREEN_CODING.md` to resource decisions. Geometry is prepared only for the requested mode; Save-Data keeps simplified borders. FPS polling is limited to visible camera motion within the startup window; the render-recovery watchdog is visibility-bound and disposed on terminal failure.
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
