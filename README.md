# GeoRisk

GeoRisk es una aplicación interactiva de geopolítica y análisis comparado de países, con mapa `2D/3D`, ficha enciclopédica, rankings globales, comparador, timeline histórico, conflictos, relaciones internacionales, noticias y quiz educativo.

## Estado actual

La base del proyecto ya incluye:

- mapa `3D` sobre globo y modo `2D`
- buscador semántico
- capas temáticas
- ficha modal grande por país
- comparador entre países
- hub de noticias
- quiz educativo
- dataset curado y validado localmente

## Versionado

Este proyecto usa versionado semántico:

- `MAJOR`: cambios grandes o incompatibles
- `MINOR`: nuevas funciones importantes sin romper compatibilidad
- `PATCH`: correcciones, pulido y ajustes menores

Ejemplos:

- `v1.4.1` = fixes o pulido chico
- `v1.5.0` = nuevas funciones importantes
- `v2.0.0` = cambio mayor de arquitectura o experiencia

## Historial reciente

- `v1.4.0`
  - curaduría fuerte del dataset y validación automática
  - mejora de ficha modal, comparador y hub de noticias
  - pulido del mapa 2D/3D, capas temáticas y buscador
  - reorganización visual de paneles y hubs
  - mejora de trazabilidad, calidad y estructura del proyecto

## Scripts útiles

- `npm run build:data`
  - regenera `data/countries_full.json`

- `npm run validate:data`
  - valida consistencia del dataset curado

## Archivos clave

- [index.html](C:/Users/deren/OneDrive/Escritorio/Cursos/geo-risk/index.html)
- [script.js](C:/Users/deren/OneDrive/Escritorio/Cursos/geo-risk/script.js)
- [style.css](C:/Users/deren/OneDrive/Escritorio/Cursos/geo-risk/style.css)
- [scripts/buildDataset.js](C:/Users/deren/OneDrive/Escritorio/Cursos/geo-risk/scripts/buildDataset.js)
- [scripts/validateDataset.js](C:/Users/deren/OneDrive/Escritorio/Cursos/geo-risk/scripts/validateDataset.js)
- [CHANGELOG.md](C:/Users/deren/OneDrive/Escritorio/Cursos/geo-risk/CHANGELOG.md)

## Próximos pasos recomendados

- profundizar conflictos y timeline histórico
- seguir refinando rendimiento 2D/3D
- ampliar fuentes, símbolos y curaduría fina
- profesionalizar exportación, presentación y documentación
