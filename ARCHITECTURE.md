# GeoRisk Architecture

GeoRisk keeps runtime files in the repository root for now. The project is already split into small browser modules; moving everything into `src/` is deferred until a bundler/build step exists.

## Runtime Layers

- `index.html`: app shell and stable DOM anchors.
- `style.css`: shared visual system, responsive layout, modal/hub polish.
- `script.js`: legacy orchestrator. It wires modules, data loading, map lifecycle and event listeners.
- `app-store.js`: central UI store for cross-module state snapshots.
- `app-ui-polish.js`: tooltips, focus helpers, keyboard a11y and compact label metadata.
- `app-map.js`, `app-map-styles.js`, `app-map-interactions.js`: map renderer decisions, country styling and interaction tuning.
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
- `sw.js`: offline shell/runtime cache policy.

## State Direction

New code should prefer `window.GeoRiskStore.store` for shared UI state and keep local state private to a module when it does not need cross-module visibility.

Use this flow:

1. Data access loads or derives structured data.
2. Pure helpers compute display models.
3. Render helpers return markup or DOM-neutral values.
4. `script.js` only wires events, calls modules and updates the store.

## Module Dependency Rules

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

Keep the root module layout until a build pipeline exists. If a build step is added, move modules into:

- `src/core/`: store, scheduler, pure helpers.
- `src/data/`: data access and index loaders.
- `src/map/`: renderer, styles, interactions.
- `src/ui/`: country, timeline, conflicts, hubs, modals.
- `src/features/`: search, rankings, quiz, news, compare.
