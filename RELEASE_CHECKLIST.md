# GeoRisk Release Checklist

Use this checklist before pushing a release commit.

1. Run `npm install` if dependencies are not present.
2. Run `npm test`.
3. Run `npm run release:check`.
4. Review `reports/startup-assets.json`.
5. Review `reports/project-audit.json`.
6. Confirm `dist/public/asset-manifest.json` exists and excludes internal files.
7. Confirm `APP_VERSION` in `script.js` and `CACHE_VERSION` in `sw.js` were bumped for the release.
8. Commit with a release-oriented message.
9. Run `npm run release:tag`.
10. Push with `git push origin main --follow-tags`.

Release gates enforced by `npm test`:

- startup budget
- production build
- APP_SHELL size
- `script.js` size
- `countries_index.json` size
- long task simulation
- service worker cache policy
- lazy loading of `countries_full`, conflict details and detailed GeoJSON
- search, rankings, compare, quiz, timeline and conflict tests
- browser visual smoke
- offline shell checks
