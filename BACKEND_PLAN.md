# GeoRisk Backend Plan

## Objetivo

Preparar una evolucion ordenada desde una app frontend modular hacia una arquitectura con una API simple, sin saltar prematuramente a microservicios.

## Etapa actual

- Frontend rico con dataset local curado.
- Render 2D/3D, comparador, quiz, noticias, timeline y ficha pais corriendo en cliente.
- Validacion local del dataset y soporte offline via service worker.

## Siguiente etapa recomendada

Crear una sola API backend, sencilla, con estos dominios:

1. `GET /countries`
   Devuelve dataset curado versionado.

2. `GET /countries/:code`
   Devuelve una ficha pais lista para consumo.

3. `GET /search`
   Resuelve busqueda semantica, aliases y filtros complejos.

4. `GET /news`
   Devuelve titulares y fuentes cacheadas por pais y tema.

5. `POST /exports/report`
   Genera reportes mas pesados si en el futuro se quieren PDFs de alta calidad.

6. `POST /favorites` y `GET /favorites`
   Sincroniza vistas guardadas y favoritos entre dispositivos.

## Beneficios

- Noticias reales mas estables con cache server-side.
- Busqueda semantica mas potente.
- Menor dependencia del navegador para trabajo pesado.
- Mejor trazabilidad, versionado y auditoria del dataset.
- Base limpia para usuarios/autenticacion si alguna vez se necesita.

## Arquitectura sugerida

- `frontend web`: GeoRisk actual
- `backend api`: una sola API HTTP
- `data pipeline`: scripts de build/validacion del dataset como jobs separados

## Tecnologia sugerida

- Node.js + Fastify o Express
- cache simple en memoria o Redis solo si hiciera falta
- SQLite/PostgreSQL para favoritos, historial y metadatos
- jobs programados para refresco de noticias y rebuild del dataset

## Criterio para NO separar mas

No pasar a microservicios mientras:

- el equipo siga siendo chico,
- el trafico no justifique escalado por dominio,
- y busqueda/noticias/datos todavia puedan convivir bien en una sola API.

## Cuando recien tendria sentido separar servicios

- Si noticias necesita su propio cache/ritmo de refresh.
- Si busqueda semantica o IA consume mucho.
- Si el pipeline del dataset crece demasiado.
- Si usuarios, exportaciones y contenidos empiezan a escalar por separado.

## Orden de implementacion

1. crear API unica minima
2. mover noticias y busqueda al backend
3. dejar dataset versionado desde backend
4. sincronizar favoritos y configuraciones
5. recien despues evaluar separar dominios
