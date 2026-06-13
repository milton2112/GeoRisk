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
