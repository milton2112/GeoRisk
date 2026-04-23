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

## Conflictos suplementarios

- `data/conflict_details.generated.json`
  Detalle enriquecido desde Wikipedia para conflictos con infobox compatible.

- `data/conflict_dyadic_summary.json`
  Resumen auxiliar generado desde `Dyadic_v25_1.xlsx` del UCDP.
  Se conserva como fuente complementaria segura para:
  - rangos de años,
  - lados enfrentados,
  - region,
  - localizacion agregada por `conflict_id`.

- `GEDEvent_v25_1.xlsx`
  Revisado a nivel estructural, pero no integrado todavia en el pipeline principal.
  Ese archivo trabaja a nivel evento y con mucho mas volumen, asi que necesita una ingesta dedicada para no mezclar eventos tacticos con guerras canonicas ni castigar el rendimiento.

## Integraciones y criterios

- Inflacion: prioriza serie local consolidada con base del Banco Mundial.
- Historia, politica, religion y conflictos: mezcla de base local mas curaduria manual del proyecto.
- Simbolos: assets locales en `assets/flags` y `assets/coats` con fallback visual cuando falta SVG real.

## Estado actual

- El proyecto cuenta con validacion local del dataset via `scripts/validateDataset.js`.
- El build principal del dataset se realiza con `scripts/buildDataset.js`.
- La aplicacion muestra dentro de la UI un resumen de calidad y origen de datos por pais.
