# GeoRisk Data Sources

## Base principal

- `data/countries_full.json`: dataset consolidado del proyecto.
- `data/world_countries.geo.json`: geometria politica completa.
- `data/world_countries_simplified.geo.json`: geometria simplificada para vistas mas livianas.

## Fuentes locales curadas

- `data/raw/history.json`
- `data/raw/politics.json`
- `data/raw/religion.json`
- `data/raw/inflation.json`

## Integraciones y criterios

- Inflacion: prioriza serie local consolidada con base del Banco Mundial.
- Historia, politica, religion y conflictos: mezcla de base local mas curaduria manual del proyecto.
- Simbolos: assets locales en `assets/flags` y `assets/coats` con fallback visual cuando falta SVG real.

## Estado actual

- El proyecto cuenta con validacion local del dataset via `scripts/validateDataset.js`.
- El build principal del dataset se realiza con `scripts/buildDataset.js`.
- La aplicacion muestra dentro de la UI un resumen de calidad y origen de datos por pais.
